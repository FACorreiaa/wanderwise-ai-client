import * as grpcWeb from 'grpc-web';

import * as poi_pb from './poi_pb'; // proto import: "poi.proto"


export class POIServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getPOIsByCity(
    request: poi_pb.GetPOIsByCityRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GetPOIsByCityResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GetPOIsByCityResponse>;

  searchPOIs(
    request: poi_pb.SearchPOIsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.SearchPOIsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.SearchPOIsResponse>;

  searchPOIsSemantic(
    request: poi_pb.SearchPOIsSemanticRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.SearchPOIsSemanticResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.SearchPOIsSemanticResponse>;

  searchPOIsSemanticByCity(
    request: poi_pb.SearchPOIsSemanticByCityRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.SearchPOIsSemanticResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.SearchPOIsSemanticResponse>;

  searchPOIsHybrid(
    request: poi_pb.SearchPOIsHybridRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.SearchPOIsHybridResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.SearchPOIsHybridResponse>;

  getNearbyRecommendations(
    request: poi_pb.GetNearbyRecommendationsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GetNearbyRecommendationsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GetNearbyRecommendationsResponse>;

  discoverRestaurants(
    request: poi_pb.DiscoverRestaurantsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.DiscoverRestaurantsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.DiscoverRestaurantsResponse>;

  discoverActivities(
    request: poi_pb.DiscoverActivitiesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.DiscoverActivitiesResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.DiscoverActivitiesResponse>;

  discoverHotels(
    request: poi_pb.DiscoverHotelsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.DiscoverHotelsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.DiscoverHotelsResponse>;

  discoverAttractions(
    request: poi_pb.DiscoverAttractionsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.DiscoverAttractionsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.DiscoverAttractionsResponse>;

  addToFavorites(
    request: poi_pb.AddToFavoritesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.AddToFavoritesResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.AddToFavoritesResponse>;

  removeFromFavorites(
    request: poi_pb.RemoveFromFavoritesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.RemoveFromFavoritesResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.RemoveFromFavoritesResponse>;

  getFavorites(
    request: poi_pb.GetFavoritesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GetFavoritesResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GetFavoritesResponse>;

  getItineraries(
    request: poi_pb.GetItinerariesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GetItinerariesResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GetItinerariesResponse>;

  getItinerary(
    request: poi_pb.GetItineraryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GetItineraryResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GetItineraryResponse>;

  updateItinerary(
    request: poi_pb.UpdateItineraryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.UpdateItineraryResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.UpdateItineraryResponse>;

  generateEmbeddings(
    request: poi_pb.GenerateEmbeddingsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: poi_pb.GenerateEmbeddingsResponse) => void
  ): grpcWeb.ClientReadableStream<poi_pb.GenerateEmbeddingsResponse>;

}

export class POIServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getPOIsByCity(
    request: poi_pb.GetPOIsByCityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GetPOIsByCityResponse>;

  searchPOIs(
    request: poi_pb.SearchPOIsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.SearchPOIsResponse>;

  searchPOIsSemantic(
    request: poi_pb.SearchPOIsSemanticRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.SearchPOIsSemanticResponse>;

  searchPOIsSemanticByCity(
    request: poi_pb.SearchPOIsSemanticByCityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.SearchPOIsSemanticResponse>;

  searchPOIsHybrid(
    request: poi_pb.SearchPOIsHybridRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.SearchPOIsHybridResponse>;

  getNearbyRecommendations(
    request: poi_pb.GetNearbyRecommendationsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GetNearbyRecommendationsResponse>;

  discoverRestaurants(
    request: poi_pb.DiscoverRestaurantsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.DiscoverRestaurantsResponse>;

  discoverActivities(
    request: poi_pb.DiscoverActivitiesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.DiscoverActivitiesResponse>;

  discoverHotels(
    request: poi_pb.DiscoverHotelsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.DiscoverHotelsResponse>;

  discoverAttractions(
    request: poi_pb.DiscoverAttractionsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.DiscoverAttractionsResponse>;

  addToFavorites(
    request: poi_pb.AddToFavoritesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.AddToFavoritesResponse>;

  removeFromFavorites(
    request: poi_pb.RemoveFromFavoritesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.RemoveFromFavoritesResponse>;

  getFavorites(
    request: poi_pb.GetFavoritesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GetFavoritesResponse>;

  getItineraries(
    request: poi_pb.GetItinerariesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GetItinerariesResponse>;

  getItinerary(
    request: poi_pb.GetItineraryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GetItineraryResponse>;

  updateItinerary(
    request: poi_pb.UpdateItineraryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.UpdateItineraryResponse>;

  generateEmbeddings(
    request: poi_pb.GenerateEmbeddingsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<poi_pb.GenerateEmbeddingsResponse>;

}

