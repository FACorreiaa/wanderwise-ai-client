import * as grpcWeb from 'grpc-web';

import * as city_pb from './city_pb'; // proto import: "city.proto"


export class CityServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getCities(
    request: city_pb.GetCitiesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: city_pb.GetCitiesResponse) => void
  ): grpcWeb.ClientReadableStream<city_pb.GetCitiesResponse>;

  getCity(
    request: city_pb.GetCityRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: city_pb.GetCityResponse) => void
  ): grpcWeb.ClientReadableStream<city_pb.GetCityResponse>;

  searchCities(
    request: city_pb.SearchCitiesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: city_pb.SearchCitiesResponse) => void
  ): grpcWeb.ClientReadableStream<city_pb.SearchCitiesResponse>;

  getCityStatistics(
    request: city_pb.GetCityStatisticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: city_pb.GetCityStatisticsResponse) => void
  ): grpcWeb.ClientReadableStream<city_pb.GetCityStatisticsResponse>;

}

export class CityServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getCities(
    request: city_pb.GetCitiesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<city_pb.GetCitiesResponse>;

  getCity(
    request: city_pb.GetCityRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<city_pb.GetCityResponse>;

  searchCities(
    request: city_pb.SearchCitiesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<city_pb.SearchCitiesResponse>;

  getCityStatistics(
    request: city_pb.GetCityStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<city_pb.GetCityStatisticsResponse>;

}

