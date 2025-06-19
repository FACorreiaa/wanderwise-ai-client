// Streaming service for handling Server-Sent Events from the unified chat API

import type { 
  StreamEvent, 
  StreamingSession, 
  DomainType, 
  UnifiedChatResponse, 
  AiCityResponse,
  AccommodationResponse,
  DiningResponse,
  ActivitiesResponse,
  GeneralCityData,
  POIDetailedInfo,
  POIDetail,
  AIItineraryResponse,
  HotelDetailedInfo,
  RestaurantDetailedInfo,
  StreamChunkData,
  StreamCompleteData
} from './api/types';

export interface StreamingSessionManager {
  session: StreamingSession;
  onProgress: (session: StreamingSession) => void;
  onComplete: (session: StreamingSession) => void;
  onError: (error: string) => void;
  onRedirect?: (domain: DomainType, data: UnifiedChatResponse) => void;
}

export class StreamingChatService {
  private eventSource: EventSource | null = null;
  private manager: StreamingSessionManager | null = null;
  private chunkBuffer: {
    general_pois: string;
    itinerary: string;
    city_data: string;
    hotels: string;
    restaurants: string;
    activities: string;
  } = {
    general_pois: '',
    itinerary: '',
    city_data: '',
    hotels: '',
    restaurants: '',
    activities: ''
  };

  constructor() {}

  // Start streaming session
  public startStream(
    response: Response, 
    manager: StreamingSessionManager
  ): void {
    this.manager = manager;
    
    if (!response.body) {
      this.manager.onError('No response body received');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    this.processStream(reader, decoder);
  }

  private async processStream(
    reader: ReadableStreamDefaultReader<Uint8Array>,
    decoder: TextDecoder
  ): Promise<void> {
    if (!this.manager) return;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          this.handleStreamComplete();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data.trim() === '') continue;
            
            try {
              const event: StreamEvent = JSON.parse(data);
              this.processStreamEvent(event);
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError, data);
            }
          } else if (line.startsWith('event: ')) {
            // Handle event type if needed
            const eventType = line.slice(7);
            console.log('Event type:', eventType);
          }
        }
      }
    } catch (error) {
      console.error('Stream processing error:', error);
      this.manager?.onError(`Stream error: ${error}`);
    }
  }

  private processStreamEvent(event: StreamEvent): void {
    if (!this.manager) return;

    const { session } = this.manager;

    switch (event.type) {
      case 'start':
        this.handleStartEvent(event);
        break;
        
      case 'chunk':
        this.handleChunkEvent(event);
        break;
        
      case 'city_data':
        this.handleCityDataEvent(event);
        break;
        
      case 'general_pois':
        this.handleGeneralPOIsEvent(event);
        break;
        
      case 'itinerary':
        this.handleItineraryEvent(event);
        break;
        
      case 'hotels':
        this.handleHotelsEvent(event);
        break;
        
      case 'restaurants':
        this.handleRestaurantsEvent(event);
        break;
        
      case 'activities':
        this.handleActivitiesEvent(event);
        break;
        
      case 'complete':
        this.handleCompleteEvent();
        break;
        
      case 'error':
        this.handleErrorEvent(event);
        break;
        
      default:
        console.log('Unknown event type:', event.type, event);
    }
  }

  private handleStartEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    const data = event.data as StreamCompleteData;
    const { domain, city, session_id } = data;
    
    if (session_id) this.manager.session.sessionId = session_id;
    if (domain) this.manager.session.domain = domain;
    if (city) this.manager.session.city = city;
    
    // Reset chunk buffer for new session
    this.chunkBuffer = {
      general_pois: '',
      itinerary: '',
      city_data: '',
      hotels: '',
      restaurants: '',
      activities: ''
    };
    
    this.manager.onProgress(this.manager.session);
  }

  private handleChunkEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    const data = event.data as StreamChunkData;
    const { chunk, part } = data;
    
    if (part && (part === 'general_pois' || part === 'itinerary' || part === 'city_data' || part === 'hotels' || part === 'restaurants' || part === 'activities')) {
      // Accumulate chunks for the specific part
      this.chunkBuffer[part] += chunk;
      
      // Try to parse complete JSON objects from the buffer
      this.tryParseBufferedData(part);
    }
    
    this.manager.onProgress(this.manager.session);
  }

  private tryParseBufferedData(part: string): void {
    if (!this.manager) return;
    
    let buffer = this.chunkBuffer[part];
    
    // Remove markdown code blocks
    buffer = buffer.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to find complete JSON objects
    let braceCount = 0;
    let jsonStart = -1;
    
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === '{') {
        if (braceCount === 0) {
          jsonStart = i;
        }
        braceCount++;
      } else if (buffer[i] === '}') {
        braceCount--;
        if (braceCount === 0 && jsonStart !== -1) {
          // Found complete JSON object
          const jsonStr = buffer.substring(jsonStart, i + 1);
          try {
            const jsonData = JSON.parse(jsonStr);
            
            // Process the complete JSON based on part type
            console.log(`=== PARSED JSON FOR ${part.toUpperCase()} ===`);
            console.log('JSON data:', jsonData);
            
            switch (part) {
              case 'city_data':
                this.handleParsedCityData(jsonData);
                break;
              case 'general_pois':
                this.handleParsedGeneralPOIs(jsonData);
                break;
              case 'itinerary':
                this.handleParsedItinerary(jsonData);
                break;
              case 'hotels':
                this.handleParsedHotels(jsonData);
                break;
              case 'restaurants':
                this.handleParsedRestaurants(jsonData);
                break;
              case 'activities':
                this.handleParsedActivities(jsonData);
                break;
            }
            
            // Remove processed data from buffer
            this.chunkBuffer[part] = buffer.substring(i + 1);
            return;
          } catch (parseError) {
            // JSON not complete yet, continue accumulating
            console.log(`Partial JSON for ${part}, continuing...`);
          }
        }
      }
    }
  }

  private handleParsedCityData(cityData: GeneralCityData): void {
    if (!this.manager) return;
    
    try {
      // Initialize data structure based on domain
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        this.manager.session.data = {
          ...this.manager.session.data,
          general_city_data: cityData,
          session_id: this.manager.session.sessionId
        } as Partial<AiCityResponse>;
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed city data:', error);
    }
  }

  private handleParsedGeneralPOIs(poisData: { points_of_interest: POIDetailedInfo[] }): void {
    if (!this.manager) return;
    
    try {
      const pois = poisData.points_of_interest || [];
      
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        const currentData = this.manager.session.data as Partial<AiCityResponse>;
        currentData.points_of_interest = pois;
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed POIs data:', error);
    }
  }

  private handleParsedItinerary(itineraryData: AIItineraryResponse): void {
    if (!this.manager) return;
    
    try {
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        const currentData = this.manager.session.data as Partial<AiCityResponse>;
        currentData.itinerary_response = itineraryData;
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed itinerary data:', error);
    }
  }

  private handleParsedHotels(hotelsData: any): void {
    if (!this.manager) return;
    
    try {
      const hotels = hotelsData.hotels || [];
      
      this.manager.session.data = {
        hotels,
        domain: 'accommodation',
        session_id: this.manager.session.sessionId
      } as AccommodationResponse;
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed hotels data:', error);
    }
  }

  private handleParsedRestaurants(restaurantsData: any): void {
    if (!this.manager) return;
    
    try {
      const restaurants = restaurantsData.restaurants || [];
      console.log('=== STREAMING SERVICE: handleParsedRestaurants ===');
      console.log('Raw restaurantsData:', restaurantsData);
      console.log('Extracted restaurants:', restaurants);
      console.log('Restaurants count:', restaurants.length);
      
      this.manager.session.data = {
        restaurants,
        domain: 'dining',
        session_id: this.manager.session.sessionId
      } as DiningResponse;
      
      console.log('Set session data:', this.manager.session.data);
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed restaurants data:', error);
    }
  }

  private handleParsedActivities(activitiesData: any): void {
    if (!this.manager) return;
    
    try {
      const activities = activitiesData.activities || [];
      
      this.manager.session.data = {
        activities,
        domain: 'activities',
        session_id: this.manager.session.sessionId
      } as ActivitiesResponse;
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing parsed activities data:', error);
    }
  }

  private handleCityDataEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const cityData: GeneralCityData = this.parseStreamData(event.data);
      
      // Initialize data structure based on domain
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        const currentData = this.manager.session.data as Partial<AiCityResponse>;
        if (!currentData.general_city_data) {
          this.manager.session.data = {
            ...this.manager.session.data,
            general_city_data: cityData,
            points_of_interest: [],
            itinerary_response: { itinerary_name: '', overall_description: '', points_of_interest: [] },
            session_id: this.manager.session.sessionId
          } as Partial<AiCityResponse>;
        } else {
          (this.manager.session.data as Partial<AiCityResponse>).general_city_data = cityData;
        }
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing city data:', error);
    }
  }

  private handleGeneralPOIsEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const pois: POIDetailedInfo[] = this.parseStreamData(event.data);
      
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        (this.manager.session.data as Partial<AiCityResponse>).points_of_interest = pois;
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing POIs data:', error);
    }
  }

  private handleItineraryEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const itinerary: AIItineraryResponse = this.parseStreamData(event.data);
      
      if (this.manager.session.domain === 'general' || this.manager.session.domain === 'itinerary') {
        (this.manager.session.data as Partial<AiCityResponse>).itinerary_response = itinerary;
      }
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing itinerary data:', error);
    }
  }

  private handleHotelsEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const hotels: HotelDetailedInfo[] = this.parseStreamData(event.data);
      
      this.manager.session.data = {
        hotels,
        domain: 'accommodation',
        session_id: this.manager.session.sessionId
      } as AccommodationResponse;
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing hotels data:', error);
    }
  }

  private handleRestaurantsEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const restaurants: RestaurantDetailedInfo[] = this.parseStreamData(event.data);
      
      this.manager.session.data = {
        restaurants,
        domain: 'dining',
        session_id: this.manager.session.sessionId
      } as DiningResponse;
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing restaurants data:', error);
    }
  }

  private handleActivitiesEvent(event: StreamEvent): void {
    if (!this.manager || !event.data) return;
    
    try {
      const activities: POIDetailedInfo[] = this.parseStreamData(event.data);
      
      this.manager.session.data = {
        activities,
        domain: 'activities',
        session_id: this.manager.session.sessionId
      } as ActivitiesResponse;
      
      this.manager.onProgress(this.manager.session);
    } catch (error) {
      console.error('Error processing activities data:', error);
    }
  }

  private handleCompleteEvent(): void {
    if (!this.manager) return;
    
    this.manager.session.isComplete = true;
    this.manager.onComplete(this.manager.session);
    
    // Trigger redirect based on domain
    if (this.manager.onRedirect && this.manager.session.data) {
      this.manager.onRedirect(
        this.manager.session.domain, 
        this.manager.session.data as UnifiedChatResponse
      );
    }
  }

  private handleErrorEvent(event: StreamEvent): void {
    if (!this.manager) return;
    
    const errorMessage = event.error || 'Unknown streaming error';
    this.manager.session.error = errorMessage;
    this.manager.onError(errorMessage);
  }

  private handleStreamComplete(): void {
    if (!this.manager) return;
    
    if (!this.manager.session.isComplete) {
      // If we didn't receive a complete event, mark as complete anyway
      this.manager.session.isComplete = true;
      this.manager.onComplete(this.manager.session);
    }
  }

  private parseStreamData(data: any): any {
    // Handle both JSON string and object data
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }
    return data;
  }

  // Clean up resources
  public cleanup(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.manager = null;
    this.chunkBuffer = {
      general_pois: '',
      itinerary: '',
      city_data: '',
      hotels: '',
      restaurants: '',
      activities: ''
    };
  }
}

// Helper function to create a streaming session
export const createStreamingSession = (domain: DomainType = 'general'): StreamingSession => {
  return {
    sessionId: '',
    domain,
    data: {},
    isComplete: false,
  };
};

// Helper function to get route path based on domain
export const getDomainRoute = (domain: DomainType): string => {
  switch (domain) {
    case 'itinerary':
    case 'general':
      return '/itinerary';
    case 'accommodation':
      return '/hotels';
    case 'dining':
      return '/restaurants';
    case 'activities':
      return '/activities';
    default:
      return '/itinerary';
  }
};

// Export singleton instance
export const streamingService = new StreamingChatService();