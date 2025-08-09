import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class ChatEvent extends jspb.Message {
  getEventType(): string;
  setEventType(value: string): ChatEvent;

  getData(): string;
  setData(value: string): ChatEvent;

  getSessionId(): string;
  setSessionId(value: string): ChatEvent;

  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): ChatEvent;
  hasTimestamp(): boolean;
  clearTimestamp(): ChatEvent;

  getMessage(): ChatMessage | undefined;
  setMessage(value?: ChatMessage): ChatEvent;
  hasMessage(): boolean;
  clearMessage(): ChatEvent;

  getThinking(): ThinkingEvent | undefined;
  setThinking(value?: ThinkingEvent): ChatEvent;
  hasThinking(): boolean;
  clearThinking(): ChatEvent;

  getError(): ErrorEvent | undefined;
  setError(value?: ErrorEvent): ChatEvent;
  hasError(): boolean;
  clearError(): ChatEvent;

  getComplete(): CompleteEvent | undefined;
  setComplete(value?: CompleteEvent): ChatEvent;
  hasComplete(): boolean;
  clearComplete(): ChatEvent;

  getCityResponse(): CityResponse | undefined;
  setCityResponse(value?: CityResponse): ChatEvent;
  hasCityResponse(): boolean;
  clearCityResponse(): ChatEvent;

  getItineraryResponse(): ItineraryResponse | undefined;
  setItineraryResponse(value?: ItineraryResponse): ChatEvent;
  hasItineraryResponse(): boolean;
  clearItineraryResponse(): ChatEvent;

  getPayloadCase(): ChatEvent.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ChatEvent): ChatEvent.AsObject;
  static serializeBinaryToWriter(message: ChatEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatEvent;
  static deserializeBinaryFromReader(message: ChatEvent, reader: jspb.BinaryReader): ChatEvent;
}

export namespace ChatEvent {
  export type AsObject = {
    eventType: string,
    data: string,
    sessionId: string,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    message?: ChatMessage.AsObject,
    thinking?: ThinkingEvent.AsObject,
    error?: ErrorEvent.AsObject,
    complete?: CompleteEvent.AsObject,
    cityResponse?: CityResponse.AsObject,
    itineraryResponse?: ItineraryResponse.AsObject,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    MESSAGE = 5,
    THINKING = 6,
    ERROR = 7,
    COMPLETE = 8,
    CITY_RESPONSE = 9,
    ITINERARY_RESPONSE = 10,
  }
}

export class ChatMessage extends jspb.Message {
  getId(): string;
  setId(value: string): ChatMessage;

  getSessionId(): string;
  setSessionId(value: string): ChatMessage;

  getContent(): string;
  setContent(value: string): ChatMessage;

  getRole(): string;
  setRole(value: string): ChatMessage;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ChatMessage;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ChatMessage;

  getContextType(): ChatContextType;
  setContextType(value: ChatContextType): ChatMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMessage): ChatMessage.AsObject;
  static serializeBinaryToWriter(message: ChatMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessage;
  static deserializeBinaryFromReader(message: ChatMessage, reader: jspb.BinaryReader): ChatMessage;
}

export namespace ChatMessage {
  export type AsObject = {
    id: string,
    sessionId: string,
    content: string,
    role: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    contextType: ChatContextType,
  }
}

export class ThinkingEvent extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): ThinkingEvent;

  getProgress(): number;
  setProgress(value: number): ThinkingEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ThinkingEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ThinkingEvent): ThinkingEvent.AsObject;
  static serializeBinaryToWriter(message: ThinkingEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ThinkingEvent;
  static deserializeBinaryFromReader(message: ThinkingEvent, reader: jspb.BinaryReader): ThinkingEvent;
}

export namespace ThinkingEvent {
  export type AsObject = {
    message: string,
    progress: number,
  }
}

export class ErrorEvent extends jspb.Message {
  getCode(): string;
  setCode(value: string): ErrorEvent;

  getMessage(): string;
  setMessage(value: string): ErrorEvent;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): ErrorEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorEvent.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorEvent): ErrorEvent.AsObject;
  static serializeBinaryToWriter(message: ErrorEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorEvent;
  static deserializeBinaryFromReader(message: ErrorEvent, reader: jspb.BinaryReader): ErrorEvent;
}

export namespace ErrorEvent {
  export type AsObject = {
    code: string,
    message: string,
    detailsMap: Array<[string, string]>,
  }
}

export class CompleteEvent extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): CompleteEvent;

  getTotalMessages(): number;
  setTotalMessages(value: number): CompleteEvent;

  getCompletedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCompletedAt(value?: google_protobuf_timestamp_pb.Timestamp): CompleteEvent;
  hasCompletedAt(): boolean;
  clearCompletedAt(): CompleteEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteEvent.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteEvent): CompleteEvent.AsObject;
  static serializeBinaryToWriter(message: CompleteEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteEvent;
  static deserializeBinaryFromReader(message: CompleteEvent, reader: jspb.BinaryReader): CompleteEvent;
}

export namespace CompleteEvent {
  export type AsObject = {
    sessionId: string,
    totalMessages: number,
    completedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CityResponse extends jspb.Message {
  getName(): string;
  setName(value: string): CityResponse;

  getCountry(): string;
  setCountry(value: string): CityResponse;

  getDescription(): string;
  setDescription(value: string): CityResponse;

  getHighlightsList(): Array<string>;
  setHighlightsList(value: Array<string>): CityResponse;
  clearHighlightsList(): CityResponse;
  addHighlights(value: string, index?: number): CityResponse;

  getPoisList(): Array<POIReference>;
  setPoisList(value: Array<POIReference>): CityResponse;
  clearPoisList(): CityResponse;
  addPois(value?: POIReference, index?: number): POIReference;

  getWeather(): WeatherInfo | undefined;
  setWeather(value?: WeatherInfo): CityResponse;
  hasWeather(): boolean;
  clearWeather(): CityResponse;

  getCulturalInfo(): CulturalInfo | undefined;
  setCulturalInfo(value?: CulturalInfo): CityResponse;
  hasCulturalInfo(): boolean;
  clearCulturalInfo(): CityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CityResponse): CityResponse.AsObject;
  static serializeBinaryToWriter(message: CityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityResponse;
  static deserializeBinaryFromReader(message: CityResponse, reader: jspb.BinaryReader): CityResponse;
}

export namespace CityResponse {
  export type AsObject = {
    name: string,
    country: string,
    description: string,
    highlightsList: Array<string>,
    poisList: Array<POIReference.AsObject>,
    weather?: WeatherInfo.AsObject,
    culturalInfo?: CulturalInfo.AsObject,
  }
}

export class ItineraryResponse extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): ItineraryResponse;

  getDescription(): string;
  setDescription(value: string): ItineraryResponse;

  getDurationDays(): number;
  setDurationDays(value: number): ItineraryResponse;

  getDaysList(): Array<ItineraryDay>;
  setDaysList(value: Array<ItineraryDay>): ItineraryResponse;
  clearDaysList(): ItineraryResponse;
  addDays(value?: ItineraryDay, index?: number): ItineraryDay;

  getFeaturedPoisList(): Array<POIReference>;
  setFeaturedPoisList(value: Array<POIReference>): ItineraryResponse;
  clearFeaturedPoisList(): ItineraryResponse;
  addFeaturedPois(value?: POIReference, index?: number): POIReference;

  getEstimatedCosts(): EstimatedCosts | undefined;
  setEstimatedCosts(value?: EstimatedCosts): ItineraryResponse;
  hasEstimatedCosts(): boolean;
  clearEstimatedCosts(): ItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ItineraryResponse): ItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: ItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ItineraryResponse;
  static deserializeBinaryFromReader(message: ItineraryResponse, reader: jspb.BinaryReader): ItineraryResponse;
}

export namespace ItineraryResponse {
  export type AsObject = {
    title: string,
    description: string,
    durationDays: number,
    daysList: Array<ItineraryDay.AsObject>,
    featuredPoisList: Array<POIReference.AsObject>,
    estimatedCosts?: EstimatedCosts.AsObject,
  }
}

export class ItineraryDay extends jspb.Message {
  getDayNumber(): number;
  setDayNumber(value: number): ItineraryDay;

  getTitle(): string;
  setTitle(value: string): ItineraryDay;

  getDescription(): string;
  setDescription(value: string): ItineraryDay;

  getActivitiesList(): Array<ItineraryActivity>;
  setActivitiesList(value: Array<ItineraryActivity>): ItineraryDay;
  clearActivitiesList(): ItineraryDay;
  addActivities(value?: ItineraryActivity, index?: number): ItineraryActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ItineraryDay.AsObject;
  static toObject(includeInstance: boolean, msg: ItineraryDay): ItineraryDay.AsObject;
  static serializeBinaryToWriter(message: ItineraryDay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ItineraryDay;
  static deserializeBinaryFromReader(message: ItineraryDay, reader: jspb.BinaryReader): ItineraryDay;
}

export namespace ItineraryDay {
  export type AsObject = {
    dayNumber: number,
    title: string,
    description: string,
    activitiesList: Array<ItineraryActivity.AsObject>,
  }
}

export class ItineraryActivity extends jspb.Message {
  getTimeSlot(): string;
  setTimeSlot(value: string): ItineraryActivity;

  getTitle(): string;
  setTitle(value: string): ItineraryActivity;

  getDescription(): string;
  setDescription(value: string): ItineraryActivity;

  getLocation(): string;
  setLocation(value: string): ItineraryActivity;

  getDurationMinutes(): number;
  setDurationMinutes(value: number): ItineraryActivity;

  getCategory(): string;
  setCategory(value: string): ItineraryActivity;

  getPoiReference(): POIReference | undefined;
  setPoiReference(value?: POIReference): ItineraryActivity;
  hasPoiReference(): boolean;
  clearPoiReference(): ItineraryActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ItineraryActivity.AsObject;
  static toObject(includeInstance: boolean, msg: ItineraryActivity): ItineraryActivity.AsObject;
  static serializeBinaryToWriter(message: ItineraryActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ItineraryActivity;
  static deserializeBinaryFromReader(message: ItineraryActivity, reader: jspb.BinaryReader): ItineraryActivity;
}

export namespace ItineraryActivity {
  export type AsObject = {
    timeSlot: string,
    title: string,
    description: string,
    location: string,
    durationMinutes: number,
    category: string,
    poiReference?: POIReference.AsObject,
  }
}

export class POIReference extends jspb.Message {
  getId(): string;
  setId(value: string): POIReference;

  getName(): string;
  setName(value: string): POIReference;

  getCategory(): string;
  setCategory(value: string): POIReference;

  getLatitude(): number;
  setLatitude(value: number): POIReference;

  getLongitude(): number;
  setLongitude(value: number): POIReference;

  getDescription(): string;
  setDescription(value: string): POIReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POIReference.AsObject;
  static toObject(includeInstance: boolean, msg: POIReference): POIReference.AsObject;
  static serializeBinaryToWriter(message: POIReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POIReference;
  static deserializeBinaryFromReader(message: POIReference, reader: jspb.BinaryReader): POIReference;
}

export namespace POIReference {
  export type AsObject = {
    id: string,
    name: string,
    category: string,
    latitude: number,
    longitude: number,
    description: string,
  }
}

export class WeatherInfo extends jspb.Message {
  getCurrentCondition(): string;
  setCurrentCondition(value: string): WeatherInfo;

  getTemperatureCelsius(): number;
  setTemperatureCelsius(value: number): WeatherInfo;

  getDescription(): string;
  setDescription(value: string): WeatherInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeatherInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WeatherInfo): WeatherInfo.AsObject;
  static serializeBinaryToWriter(message: WeatherInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeatherInfo;
  static deserializeBinaryFromReader(message: WeatherInfo, reader: jspb.BinaryReader): WeatherInfo;
}

export namespace WeatherInfo {
  export type AsObject = {
    currentCondition: string,
    temperatureCelsius: number,
    description: string,
  }
}

export class CulturalInfo extends jspb.Message {
  getLanguage(): string;
  setLanguage(value: string): CulturalInfo;

  getCurrency(): string;
  setCurrency(value: string): CulturalInfo;

  getCustomsList(): Array<string>;
  setCustomsList(value: Array<string>): CulturalInfo;
  clearCustomsList(): CulturalInfo;
  addCustoms(value: string, index?: number): CulturalInfo;

  getFestivalsList(): Array<string>;
  setFestivalsList(value: Array<string>): CulturalInfo;
  clearFestivalsList(): CulturalInfo;
  addFestivals(value: string, index?: number): CulturalInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CulturalInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CulturalInfo): CulturalInfo.AsObject;
  static serializeBinaryToWriter(message: CulturalInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CulturalInfo;
  static deserializeBinaryFromReader(message: CulturalInfo, reader: jspb.BinaryReader): CulturalInfo;
}

export namespace CulturalInfo {
  export type AsObject = {
    language: string,
    currency: string,
    customsList: Array<string>,
    festivalsList: Array<string>,
  }
}

export class EstimatedCosts extends jspb.Message {
  getCurrency(): string;
  setCurrency(value: string): EstimatedCosts;

  getBudgetLow(): number;
  setBudgetLow(value: number): EstimatedCosts;

  getBudgetMedium(): number;
  setBudgetMedium(value: number): EstimatedCosts;

  getBudgetHigh(): number;
  setBudgetHigh(value: number): EstimatedCosts;

  getBreakdownList(): Array<CostBreakdown>;
  setBreakdownList(value: Array<CostBreakdown>): EstimatedCosts;
  clearBreakdownList(): EstimatedCosts;
  addBreakdown(value?: CostBreakdown, index?: number): CostBreakdown;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EstimatedCosts.AsObject;
  static toObject(includeInstance: boolean, msg: EstimatedCosts): EstimatedCosts.AsObject;
  static serializeBinaryToWriter(message: EstimatedCosts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EstimatedCosts;
  static deserializeBinaryFromReader(message: EstimatedCosts, reader: jspb.BinaryReader): EstimatedCosts;
}

export namespace EstimatedCosts {
  export type AsObject = {
    currency: string,
    budgetLow: number,
    budgetMedium: number,
    budgetHigh: number,
    breakdownList: Array<CostBreakdown.AsObject>,
  }
}

export class CostBreakdown extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): CostBreakdown;

  getAmount(): number;
  setAmount(value: number): CostBreakdown;

  getDescription(): string;
  setDescription(value: string): CostBreakdown;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CostBreakdown.AsObject;
  static toObject(includeInstance: boolean, msg: CostBreakdown): CostBreakdown.AsObject;
  static serializeBinaryToWriter(message: CostBreakdown, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CostBreakdown;
  static deserializeBinaryFromReader(message: CostBreakdown, reader: jspb.BinaryReader): CostBreakdown;
}

export namespace CostBreakdown {
  export type AsObject = {
    category: string,
    amount: number,
    description: string,
  }
}

export class StartChatRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): StartChatRequest;

  getProfileId(): string;
  setProfileId(value: string): StartChatRequest;

  getInitialMessage(): string;
  setInitialMessage(value: string): StartChatRequest;

  getContextType(): ChatContextType;
  setContextType(value: ChatContextType): StartChatRequest;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): StartChatRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): StartChatRequest;
  hasRequest(): boolean;
  clearRequest(): StartChatRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartChatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StartChatRequest): StartChatRequest.AsObject;
  static serializeBinaryToWriter(message: StartChatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartChatRequest;
  static deserializeBinaryFromReader(message: StartChatRequest, reader: jspb.BinaryReader): StartChatRequest;
}

export namespace StartChatRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    initialMessage: string,
    contextType: ChatContextType,
    metadataMap: Array<[string, string]>,
    request?: BaseRequest.AsObject,
  }
}

export class ContinueChatRequest extends jspb.Message {
  getSessionId(): string;
  setSessionId(value: string): ContinueChatRequest;

  getUserId(): string;
  setUserId(value: string): ContinueChatRequest;

  getMessage(): string;
  setMessage(value: string): ContinueChatRequest;

  getContextType(): ChatContextType;
  setContextType(value: ChatContextType): ContinueChatRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): ContinueChatRequest;
  hasRequest(): boolean;
  clearRequest(): ContinueChatRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContinueChatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ContinueChatRequest): ContinueChatRequest.AsObject;
  static serializeBinaryToWriter(message: ContinueChatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContinueChatRequest;
  static deserializeBinaryFromReader(message: ContinueChatRequest, reader: jspb.BinaryReader): ContinueChatRequest;
}

export namespace ContinueChatRequest {
  export type AsObject = {
    sessionId: string,
    userId: string,
    message: string,
    contextType: ChatContextType,
    request?: BaseRequest.AsObject,
  }
}

export class FreeChatRequest extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): FreeChatRequest;

  getSessionToken(): string;
  setSessionToken(value: string): FreeChatRequest;

  getContextType(): ChatContextType;
  setContextType(value: ChatContextType): FreeChatRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): FreeChatRequest;
  hasRequest(): boolean;
  clearRequest(): FreeChatRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FreeChatRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FreeChatRequest): FreeChatRequest.AsObject;
  static serializeBinaryToWriter(message: FreeChatRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FreeChatRequest;
  static deserializeBinaryFromReader(message: FreeChatRequest, reader: jspb.BinaryReader): FreeChatRequest;
}

export namespace FreeChatRequest {
  export type AsObject = {
    message: string,
    sessionToken: string,
    contextType: ChatContextType,
    request?: BaseRequest.AsObject,
  }
}

export class GetChatSessionsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetChatSessionsRequest;

  getProfileId(): string;
  setProfileId(value: string): GetChatSessionsRequest;

  getLimit(): number;
  setLimit(value: number): GetChatSessionsRequest;

  getOffset(): number;
  setOffset(value: number): GetChatSessionsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetChatSessionsRequest;
  hasRequest(): boolean;
  clearRequest(): GetChatSessionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetChatSessionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetChatSessionsRequest): GetChatSessionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetChatSessionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetChatSessionsRequest;
  static deserializeBinaryFromReader(message: GetChatSessionsRequest, reader: jspb.BinaryReader): GetChatSessionsRequest;
}

export namespace GetChatSessionsRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    limit: number,
    offset: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetChatSessionsResponse extends jspb.Message {
  getSessionsList(): Array<ChatSession>;
  setSessionsList(value: Array<ChatSession>): GetChatSessionsResponse;
  clearSessionsList(): GetChatSessionsResponse;
  addSessions(value?: ChatSession, index?: number): ChatSession;

  getTotalCount(): number;
  setTotalCount(value: number): GetChatSessionsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetChatSessionsResponse;
  hasResponse(): boolean;
  clearResponse(): GetChatSessionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetChatSessionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetChatSessionsResponse): GetChatSessionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetChatSessionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetChatSessionsResponse;
  static deserializeBinaryFromReader(message: GetChatSessionsResponse, reader: jspb.BinaryReader): GetChatSessionsResponse;
}

export namespace GetChatSessionsResponse {
  export type AsObject = {
    sessionsList: Array<ChatSession.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class ChatSession extends jspb.Message {
  getId(): string;
  setId(value: string): ChatSession;

  getUserId(): string;
  setUserId(value: string): ChatSession;

  getProfileId(): string;
  setProfileId(value: string): ChatSession;

  getTitle(): string;
  setTitle(value: string): ChatSession;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ChatSession;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ChatSession;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ChatSession;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): ChatSession;

  getMessageCount(): number;
  setMessageCount(value: number): ChatSession;

  getContextType(): ChatContextType;
  setContextType(value: ChatContextType): ChatSession;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatSession.AsObject;
  static toObject(includeInstance: boolean, msg: ChatSession): ChatSession.AsObject;
  static serializeBinaryToWriter(message: ChatSession, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ChatSession;
  static deserializeBinaryFromReader(message: ChatSession, reader: jspb.BinaryReader): ChatSession;
}

export namespace ChatSession {
  export type AsObject = {
    id: string,
    userId: string,
    profileId: string,
    title: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    messageCount: number,
    contextType: ChatContextType,
  }
}

export class SaveItineraryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): SaveItineraryRequest;

  getSessionId(): string;
  setSessionId(value: string): SaveItineraryRequest;

  getTitle(): string;
  setTitle(value: string): SaveItineraryRequest;

  getDescription(): string;
  setDescription(value: string): SaveItineraryRequest;

  getItineraryData(): ItineraryResponse | undefined;
  setItineraryData(value?: ItineraryResponse): SaveItineraryRequest;
  hasItineraryData(): boolean;
  clearItineraryData(): SaveItineraryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SaveItineraryRequest;
  hasRequest(): boolean;
  clearRequest(): SaveItineraryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveItineraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SaveItineraryRequest): SaveItineraryRequest.AsObject;
  static serializeBinaryToWriter(message: SaveItineraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveItineraryRequest;
  static deserializeBinaryFromReader(message: SaveItineraryRequest, reader: jspb.BinaryReader): SaveItineraryRequest;
}

export namespace SaveItineraryRequest {
  export type AsObject = {
    userId: string,
    sessionId: string,
    title: string,
    description: string,
    itineraryData?: ItineraryResponse.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class SaveItineraryResponse extends jspb.Message {
  getItineraryId(): string;
  setItineraryId(value: string): SaveItineraryResponse;

  getSuccess(): boolean;
  setSuccess(value: boolean): SaveItineraryResponse;

  getMessage(): string;
  setMessage(value: string): SaveItineraryResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SaveItineraryResponse;
  hasResponse(): boolean;
  clearResponse(): SaveItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveItineraryResponse): SaveItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: SaveItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveItineraryResponse;
  static deserializeBinaryFromReader(message: SaveItineraryResponse, reader: jspb.BinaryReader): SaveItineraryResponse;
}

export namespace SaveItineraryResponse {
  export type AsObject = {
    itineraryId: string,
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetSavedItinerariesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetSavedItinerariesRequest;

  getLimit(): number;
  setLimit(value: number): GetSavedItinerariesRequest;

  getOffset(): number;
  setOffset(value: number): GetSavedItinerariesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetSavedItinerariesRequest;
  hasRequest(): boolean;
  clearRequest(): GetSavedItinerariesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSavedItinerariesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSavedItinerariesRequest): GetSavedItinerariesRequest.AsObject;
  static serializeBinaryToWriter(message: GetSavedItinerariesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSavedItinerariesRequest;
  static deserializeBinaryFromReader(message: GetSavedItinerariesRequest, reader: jspb.BinaryReader): GetSavedItinerariesRequest;
}

export namespace GetSavedItinerariesRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    offset: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetSavedItinerariesResponse extends jspb.Message {
  getItinerariesList(): Array<UserSavedItinerary>;
  setItinerariesList(value: Array<UserSavedItinerary>): GetSavedItinerariesResponse;
  clearItinerariesList(): GetSavedItinerariesResponse;
  addItineraries(value?: UserSavedItinerary, index?: number): UserSavedItinerary;

  getTotalCount(): number;
  setTotalCount(value: number): GetSavedItinerariesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetSavedItinerariesResponse;
  hasResponse(): boolean;
  clearResponse(): GetSavedItinerariesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSavedItinerariesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSavedItinerariesResponse): GetSavedItinerariesResponse.AsObject;
  static serializeBinaryToWriter(message: GetSavedItinerariesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSavedItinerariesResponse;
  static deserializeBinaryFromReader(message: GetSavedItinerariesResponse, reader: jspb.BinaryReader): GetSavedItinerariesResponse;
}

export namespace GetSavedItinerariesResponse {
  export type AsObject = {
    itinerariesList: Array<UserSavedItinerary.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class UserSavedItinerary extends jspb.Message {
  getId(): string;
  setId(value: string): UserSavedItinerary;

  getUserId(): string;
  setUserId(value: string): UserSavedItinerary;

  getSessionId(): string;
  setSessionId(value: string): UserSavedItinerary;

  getTitle(): string;
  setTitle(value: string): UserSavedItinerary;

  getDescription(): string;
  setDescription(value: string): UserSavedItinerary;

  getItineraryData(): string;
  setItineraryData(value: string): UserSavedItinerary;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserSavedItinerary;
  hasCreatedAt(): boolean;
  clearCreatedAt(): UserSavedItinerary;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserSavedItinerary;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserSavedItinerary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserSavedItinerary.AsObject;
  static toObject(includeInstance: boolean, msg: UserSavedItinerary): UserSavedItinerary.AsObject;
  static serializeBinaryToWriter(message: UserSavedItinerary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserSavedItinerary;
  static deserializeBinaryFromReader(message: UserSavedItinerary, reader: jspb.BinaryReader): UserSavedItinerary;
}

export namespace UserSavedItinerary {
  export type AsObject = {
    id: string,
    userId: string,
    sessionId: string,
    title: string,
    description: string,
    itineraryData: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class RemoveItineraryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): RemoveItineraryRequest;

  getItineraryId(): string;
  setItineraryId(value: string): RemoveItineraryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RemoveItineraryRequest;
  hasRequest(): boolean;
  clearRequest(): RemoveItineraryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveItineraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveItineraryRequest): RemoveItineraryRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveItineraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveItineraryRequest;
  static deserializeBinaryFromReader(message: RemoveItineraryRequest, reader: jspb.BinaryReader): RemoveItineraryRequest;
}

export namespace RemoveItineraryRequest {
  export type AsObject = {
    userId: string,
    itineraryId: string,
    request?: BaseRequest.AsObject,
  }
}

export class RemoveItineraryResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveItineraryResponse;

  getMessage(): string;
  setMessage(value: string): RemoveItineraryResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RemoveItineraryResponse;
  hasResponse(): boolean;
  clearResponse(): RemoveItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveItineraryResponse): RemoveItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveItineraryResponse;
  static deserializeBinaryFromReader(message: RemoveItineraryResponse, reader: jspb.BinaryReader): RemoveItineraryResponse;
}

export namespace RemoveItineraryResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetPOIDetailsRequest extends jspb.Message {
  getPoiId(): string;
  setPoiId(value: string): GetPOIDetailsRequest;

  getIncludeReviews(): boolean;
  setIncludeReviews(value: boolean): GetPOIDetailsRequest;

  getIncludePhotos(): boolean;
  setIncludePhotos(value: boolean): GetPOIDetailsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetPOIDetailsRequest;
  hasRequest(): boolean;
  clearRequest(): GetPOIDetailsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIDetailsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIDetailsRequest): GetPOIDetailsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPOIDetailsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIDetailsRequest;
  static deserializeBinaryFromReader(message: GetPOIDetailsRequest, reader: jspb.BinaryReader): GetPOIDetailsRequest;
}

export namespace GetPOIDetailsRequest {
  export type AsObject = {
    poiId: string,
    includeReviews: boolean,
    includePhotos: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetPOIDetailsResponse extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): GetPOIDetailsResponse;
  hasPoi(): boolean;
  clearPoi(): GetPOIDetailsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetPOIDetailsResponse;
  hasResponse(): boolean;
  clearResponse(): GetPOIDetailsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIDetailsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIDetailsResponse): GetPOIDetailsResponse.AsObject;
  static serializeBinaryToWriter(message: GetPOIDetailsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIDetailsResponse;
  static deserializeBinaryFromReader(message: GetPOIDetailsResponse, reader: jspb.BinaryReader): GetPOIDetailsResponse;
}

export namespace GetPOIDetailsResponse {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class POIDetailedInfo extends jspb.Message {
  getId(): string;
  setId(value: string): POIDetailedInfo;

  getName(): string;
  setName(value: string): POIDetailedInfo;

  getLatitude(): number;
  setLatitude(value: number): POIDetailedInfo;

  getLongitude(): number;
  setLongitude(value: number): POIDetailedInfo;

  getCategory(): string;
  setCategory(value: string): POIDetailedInfo;

  getDescription(): string;
  setDescription(value: string): POIDetailedInfo;

  getRating(): number;
  setRating(value: number): POIDetailedInfo;

  getReviewCount(): number;
  setReviewCount(value: number): POIDetailedInfo;

  getPriceRange(): string;
  setPriceRange(value: string): POIDetailedInfo;

  getAddress(): string;
  setAddress(value: string): POIDetailedInfo;

  getPhone(): string;
  setPhone(value: string): POIDetailedInfo;

  getWebsite(): string;
  setWebsite(value: string): POIDetailedInfo;

  getPhotosList(): Array<string>;
  setPhotosList(value: Array<string>): POIDetailedInfo;
  clearPhotosList(): POIDetailedInfo;
  addPhotos(value: string, index?: number): POIDetailedInfo;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): POIDetailedInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POIDetailedInfo.AsObject;
  static toObject(includeInstance: boolean, msg: POIDetailedInfo): POIDetailedInfo.AsObject;
  static serializeBinaryToWriter(message: POIDetailedInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POIDetailedInfo;
  static deserializeBinaryFromReader(message: POIDetailedInfo, reader: jspb.BinaryReader): POIDetailedInfo;
}

export namespace POIDetailedInfo {
  export type AsObject = {
    id: string,
    name: string,
    latitude: number,
    longitude: number,
    category: string,
    description: string,
    rating: number,
    reviewCount: number,
    priceRange: string,
    address: string,
    phone: string,
    website: string,
    photosList: Array<string>,
    metadataMap: Array<[string, string]>,
  }
}

export class BaseRequest extends jspb.Message {
  getDownstream(): string;
  setDownstream(value: string): BaseRequest;

  getRequestId(): string;
  setRequestId(value: string): BaseRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseRequest.AsObject;
  static toObject(includeInstance: boolean, msg: BaseRequest): BaseRequest.AsObject;
  static serializeBinaryToWriter(message: BaseRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseRequest;
  static deserializeBinaryFromReader(message: BaseRequest, reader: jspb.BinaryReader): BaseRequest;
}

export namespace BaseRequest {
  export type AsObject = {
    downstream: string,
    requestId: string,
  }
}

export class BaseResponse extends jspb.Message {
  getUpstream(): string;
  setUpstream(value: string): BaseResponse;

  getRequestId(): string;
  setRequestId(value: string): BaseResponse;

  getStatus(): string;
  setStatus(value: string): BaseResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BaseResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BaseResponse): BaseResponse.AsObject;
  static serializeBinaryToWriter(message: BaseResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BaseResponse;
  static deserializeBinaryFromReader(message: BaseResponse, reader: jspb.BinaryReader): BaseResponse;
}

export namespace BaseResponse {
  export type AsObject = {
    upstream: string,
    requestId: string,
    status: string,
  }
}

export enum ChatContextType { 
  CHAT_CONTEXT_TYPE_UNSPECIFIED = 0,
  CHAT_CONTEXT_TYPE_GENERAL = 1,
  CHAT_CONTEXT_TYPE_CITY_EXPLORATION = 2,
  CHAT_CONTEXT_TYPE_ITINERARY_PLANNING = 3,
  CHAT_CONTEXT_TYPE_RESTAURANT_RECOMMENDATION = 4,
  CHAT_CONTEXT_TYPE_ACTIVITY_SUGGESTION = 5,
}
