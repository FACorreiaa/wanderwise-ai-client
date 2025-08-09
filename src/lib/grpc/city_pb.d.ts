import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class City extends jspb.Message {
  getId(): string;
  setId(value: string): City;

  getName(): string;
  setName(value: string): City;

  getCountry(): string;
  setCountry(value: string): City;

  getCountryCode(): string;
  setCountryCode(value: string): City;

  getStateProvince(): string;
  setStateProvince(value: string): City;

  getLatitude(): number;
  setLatitude(value: number): City;

  getLongitude(): number;
  setLongitude(value: number): City;

  getTimezone(): string;
  setTimezone(value: string): City;

  getPopulation(): number;
  setPopulation(value: number): City;

  getCurrency(): string;
  setCurrency(value: string): City;

  getLanguagesList(): Array<string>;
  setLanguagesList(value: Array<string>): City;
  clearLanguagesList(): City;
  addLanguages(value: string, index?: number): City;

  getDescription(): string;
  setDescription(value: string): City;

  getHighlightsList(): Array<string>;
  setHighlightsList(value: Array<string>): City;
  clearHighlightsList(): City;
  addHighlights(value: string, index?: number): City;

  getClimate(): string;
  setClimate(value: string): City;

  getBestTimeToVisit(): string;
  setBestTimeToVisit(value: string): City;

  getTopAttractionsList(): Array<string>;
  setTopAttractionsList(value: Array<string>): City;
  clearTopAttractionsList(): City;
  addTopAttractions(value: string, index?: number): City;

  getMetadata(): CityMetadata | undefined;
  setMetadata(value?: CityMetadata): City;
  hasMetadata(): boolean;
  clearMetadata(): City;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): City;
  hasCreatedAt(): boolean;
  clearCreatedAt(): City;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): City;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): City;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): City.AsObject;
  static toObject(includeInstance: boolean, msg: City): City.AsObject;
  static serializeBinaryToWriter(message: City, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): City;
  static deserializeBinaryFromReader(message: City, reader: jspb.BinaryReader): City;
}

export namespace City {
  export type AsObject = {
    id: string,
    name: string,
    country: string,
    countryCode: string,
    stateProvince: string,
    latitude: number,
    longitude: number,
    timezone: string,
    population: number,
    currency: string,
    languagesList: Array<string>,
    description: string,
    highlightsList: Array<string>,
    climate: string,
    bestTimeToVisit: string,
    topAttractionsList: Array<string>,
    metadata?: CityMetadata.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CityMetadata extends jspb.Message {
  getImageUrl(): string;
  setImageUrl(value: string): CityMetadata;

  getImageGalleryList(): Array<string>;
  setImageGalleryList(value: Array<string>): CityMetadata;
  clearImageGalleryList(): CityMetadata;
  addImageGallery(value: string, index?: number): CityMetadata;

  getOfficialWebsite(): string;
  setOfficialWebsite(value: string): CityMetadata;

  getTourismWebsite(): string;
  setTourismWebsite(value: string): CityMetadata;

  getIsCapital(): boolean;
  setIsCapital(value: boolean): CityMetadata;

  getIsPopularDestination(): boolean;
  setIsPopularDestination(value: boolean): CityMetadata;

  getSafetyRating(): string;
  setSafetyRating(value: string): CityMetadata;

  getCostOfLivingIndex(): number;
  setCostOfLivingIndex(value: number): CityMetadata;

  getWalkabilityScore(): string;
  setWalkabilityScore(value: string): CityMetadata;

  getTransportOptionsList(): Array<string>;
  setTransportOptionsList(value: Array<string>): CityMetadata;
  clearTransportOptionsList(): CityMetadata;
  addTransportOptions(value: string, index?: number): CityMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: CityMetadata): CityMetadata.AsObject;
  static serializeBinaryToWriter(message: CityMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityMetadata;
  static deserializeBinaryFromReader(message: CityMetadata, reader: jspb.BinaryReader): CityMetadata;
}

export namespace CityMetadata {
  export type AsObject = {
    imageUrl: string,
    imageGalleryList: Array<string>,
    officialWebsite: string,
    tourismWebsite: string,
    isCapital: boolean,
    isPopularDestination: boolean,
    safetyRating: string,
    costOfLivingIndex: number,
    walkabilityScore: string,
    transportOptionsList: Array<string>,
  }
}

export class CityStatistics extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): CityStatistics;

  getTotalPois(): number;
  setTotalPois(value: number): CityStatistics;

  getTotalRestaurants(): number;
  setTotalRestaurants(value: number): CityStatistics;

  getTotalHotels(): number;
  setTotalHotels(value: number): CityStatistics;

  getTotalAttractions(): number;
  setTotalAttractions(value: number): CityStatistics;

  getUserVisits(): number;
  setUserVisits(value: number): CityStatistics;

  getSavedItineraries(): number;
  setSavedItineraries(value: number): CityStatistics;

  getAverageRating(): number;
  setAverageRating(value: number): CityStatistics;

  getPoiByCategoryList(): Array<CategoryCount>;
  setPoiByCategoryList(value: Array<CategoryCount>): CityStatistics;
  clearPoiByCategoryList(): CityStatistics;
  addPoiByCategory(value?: CategoryCount, index?: number): CategoryCount;

  getLastUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastUpdated(value?: google_protobuf_timestamp_pb.Timestamp): CityStatistics;
  hasLastUpdated(): boolean;
  clearLastUpdated(): CityStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: CityStatistics): CityStatistics.AsObject;
  static serializeBinaryToWriter(message: CityStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityStatistics;
  static deserializeBinaryFromReader(message: CityStatistics, reader: jspb.BinaryReader): CityStatistics;
}

export namespace CityStatistics {
  export type AsObject = {
    cityId: string,
    totalPois: number,
    totalRestaurants: number,
    totalHotels: number,
    totalAttractions: number,
    userVisits: number,
    savedItineraries: number,
    averageRating: number,
    poiByCategoryList: Array<CategoryCount.AsObject>,
    lastUpdated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CategoryCount extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): CategoryCount;

  getCount(): number;
  setCount(value: number): CategoryCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryCount.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryCount): CategoryCount.AsObject;
  static serializeBinaryToWriter(message: CategoryCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryCount;
  static deserializeBinaryFromReader(message: CategoryCount, reader: jspb.BinaryReader): CategoryCount;
}

export namespace CategoryCount {
  export type AsObject = {
    category: string,
    count: number,
  }
}

export class WeatherInfo extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): WeatherInfo;

  getCurrentCondition(): string;
  setCurrentCondition(value: string): WeatherInfo;

  getTemperatureCelsius(): number;
  setTemperatureCelsius(value: number): WeatherInfo;

  getHumidity(): number;
  setHumidity(value: number): WeatherInfo;

  getDescription(): string;
  setDescription(value: string): WeatherInfo;

  getForecastUrl(): string;
  setForecastUrl(value: string): WeatherInfo;

  getLastUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastUpdated(value?: google_protobuf_timestamp_pb.Timestamp): WeatherInfo;
  hasLastUpdated(): boolean;
  clearLastUpdated(): WeatherInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WeatherInfo.AsObject;
  static toObject(includeInstance: boolean, msg: WeatherInfo): WeatherInfo.AsObject;
  static serializeBinaryToWriter(message: WeatherInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WeatherInfo;
  static deserializeBinaryFromReader(message: WeatherInfo, reader: jspb.BinaryReader): WeatherInfo;
}

export namespace WeatherInfo {
  export type AsObject = {
    cityId: string,
    currentCondition: string,
    temperatureCelsius: number,
    humidity: number,
    description: string,
    forecastUrl: string,
    lastUpdated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GetCitiesRequest extends jspb.Message {
  getLimit(): number;
  setLimit(value: number): GetCitiesRequest;

  getOffset(): number;
  setOffset(value: number): GetCitiesRequest;

  getIncludeStatistics(): boolean;
  setIncludeStatistics(value: boolean): GetCitiesRequest;

  getCountryCode(): string;
  setCountryCode(value: string): GetCitiesRequest;

  getPopularOnly(): boolean;
  setPopularOnly(value: boolean): GetCitiesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetCitiesRequest;
  hasRequest(): boolean;
  clearRequest(): GetCitiesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCitiesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCitiesRequest): GetCitiesRequest.AsObject;
  static serializeBinaryToWriter(message: GetCitiesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCitiesRequest;
  static deserializeBinaryFromReader(message: GetCitiesRequest, reader: jspb.BinaryReader): GetCitiesRequest;
}

export namespace GetCitiesRequest {
  export type AsObject = {
    limit: number,
    offset: number,
    includeStatistics: boolean,
    countryCode: string,
    popularOnly: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetCitiesResponse extends jspb.Message {
  getCitiesList(): Array<City>;
  setCitiesList(value: Array<City>): GetCitiesResponse;
  clearCitiesList(): GetCitiesResponse;
  addCities(value?: City, index?: number): City;

  getTotalCount(): number;
  setTotalCount(value: number): GetCitiesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetCitiesResponse;
  hasResponse(): boolean;
  clearResponse(): GetCitiesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCitiesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCitiesResponse): GetCitiesResponse.AsObject;
  static serializeBinaryToWriter(message: GetCitiesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCitiesResponse;
  static deserializeBinaryFromReader(message: GetCitiesResponse, reader: jspb.BinaryReader): GetCitiesResponse;
}

export namespace GetCitiesResponse {
  export type AsObject = {
    citiesList: Array<City.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class GetCityRequest extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): GetCityRequest;

  getIncludeStatistics(): boolean;
  setIncludeStatistics(value: boolean): GetCityRequest;

  getIncludeWeather(): boolean;
  setIncludeWeather(value: boolean): GetCityRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetCityRequest;
  hasRequest(): boolean;
  clearRequest(): GetCityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityRequest): GetCityRequest.AsObject;
  static serializeBinaryToWriter(message: GetCityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityRequest;
  static deserializeBinaryFromReader(message: GetCityRequest, reader: jspb.BinaryReader): GetCityRequest;
}

export namespace GetCityRequest {
  export type AsObject = {
    cityId: string,
    includeStatistics: boolean,
    includeWeather: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetCityResponse extends jspb.Message {
  getCity(): City | undefined;
  setCity(value?: City): GetCityResponse;
  hasCity(): boolean;
  clearCity(): GetCityResponse;

  getStatistics(): CityStatistics | undefined;
  setStatistics(value?: CityStatistics): GetCityResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetCityResponse;

  getWeather(): WeatherInfo | undefined;
  setWeather(value?: WeatherInfo): GetCityResponse;
  hasWeather(): boolean;
  clearWeather(): GetCityResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetCityResponse;
  hasResponse(): boolean;
  clearResponse(): GetCityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityResponse): GetCityResponse.AsObject;
  static serializeBinaryToWriter(message: GetCityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityResponse;
  static deserializeBinaryFromReader(message: GetCityResponse, reader: jspb.BinaryReader): GetCityResponse;
}

export namespace GetCityResponse {
  export type AsObject = {
    city?: City.AsObject,
    statistics?: CityStatistics.AsObject,
    weather?: WeatherInfo.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class SearchCitiesRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchCitiesRequest;

  getCountryCode(): string;
  setCountryCode(value: string): SearchCitiesRequest;

  getLimit(): number;
  setLimit(value: number): SearchCitiesRequest;

  getOffset(): number;
  setOffset(value: number): SearchCitiesRequest;

  getFuzzySearch(): boolean;
  setFuzzySearch(value: boolean): SearchCitiesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchCitiesRequest;
  hasRequest(): boolean;
  clearRequest(): SearchCitiesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchCitiesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchCitiesRequest): SearchCitiesRequest.AsObject;
  static serializeBinaryToWriter(message: SearchCitiesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchCitiesRequest;
  static deserializeBinaryFromReader(message: SearchCitiesRequest, reader: jspb.BinaryReader): SearchCitiesRequest;
}

export namespace SearchCitiesRequest {
  export type AsObject = {
    query: string,
    countryCode: string,
    limit: number,
    offset: number,
    fuzzySearch: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class SearchCitiesResponse extends jspb.Message {
  getResultsList(): Array<CitySearchResult>;
  setResultsList(value: Array<CitySearchResult>): SearchCitiesResponse;
  clearResultsList(): SearchCitiesResponse;
  addResults(value?: CitySearchResult, index?: number): CitySearchResult;

  getTotalCount(): number;
  setTotalCount(value: number): SearchCitiesResponse;

  getMetadata(): SearchMetadata | undefined;
  setMetadata(value?: SearchMetadata): SearchCitiesResponse;
  hasMetadata(): boolean;
  clearMetadata(): SearchCitiesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SearchCitiesResponse;
  hasResponse(): boolean;
  clearResponse(): SearchCitiesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchCitiesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchCitiesResponse): SearchCitiesResponse.AsObject;
  static serializeBinaryToWriter(message: SearchCitiesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchCitiesResponse;
  static deserializeBinaryFromReader(message: SearchCitiesResponse, reader: jspb.BinaryReader): SearchCitiesResponse;
}

export namespace SearchCitiesResponse {
  export type AsObject = {
    resultsList: Array<CitySearchResult.AsObject>,
    totalCount: number,
    metadata?: SearchMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CitySearchResult extends jspb.Message {
  getCity(): City | undefined;
  setCity(value?: City): CitySearchResult;
  hasCity(): boolean;
  clearCity(): CitySearchResult;

  getRelevanceScore(): number;
  setRelevanceScore(value: number): CitySearchResult;

  getMatchReason(): string;
  setMatchReason(value: string): CitySearchResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CitySearchResult.AsObject;
  static toObject(includeInstance: boolean, msg: CitySearchResult): CitySearchResult.AsObject;
  static serializeBinaryToWriter(message: CitySearchResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CitySearchResult;
  static deserializeBinaryFromReader(message: CitySearchResult, reader: jspb.BinaryReader): CitySearchResult;
}

export namespace CitySearchResult {
  export type AsObject = {
    city?: City.AsObject,
    relevanceScore: number,
    matchReason: string,
  }
}

export class SearchMetadata extends jspb.Message {
  getQueryTimeMs(): number;
  setQueryTimeMs(value: number): SearchMetadata;

  getSearchMethod(): string;
  setSearchMethod(value: string): SearchMetadata;

  getFuzzyMatchingUsed(): boolean;
  setFuzzyMatchingUsed(value: boolean): SearchMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMetadata): SearchMetadata.AsObject;
  static serializeBinaryToWriter(message: SearchMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMetadata;
  static deserializeBinaryFromReader(message: SearchMetadata, reader: jspb.BinaryReader): SearchMetadata;
}

export namespace SearchMetadata {
  export type AsObject = {
    queryTimeMs: number,
    searchMethod: string,
    fuzzyMatchingUsed: boolean,
  }
}

export class GetCityStatisticsRequest extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): GetCityStatisticsRequest;

  getIncludeTrends(): boolean;
  setIncludeTrends(value: boolean): GetCityStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetCityStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetCityStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityStatisticsRequest): GetCityStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetCityStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityStatisticsRequest;
  static deserializeBinaryFromReader(message: GetCityStatisticsRequest, reader: jspb.BinaryReader): GetCityStatisticsRequest;
}

export namespace GetCityStatisticsRequest {
  export type AsObject = {
    cityId: string,
    includeTrends: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetCityStatisticsResponse extends jspb.Message {
  getStatistics(): CityStatistics | undefined;
  setStatistics(value?: CityStatistics): GetCityStatisticsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetCityStatisticsResponse;

  getTrendsList(): Array<TrendData>;
  setTrendsList(value: Array<TrendData>): GetCityStatisticsResponse;
  clearTrendsList(): GetCityStatisticsResponse;
  addTrends(value?: TrendData, index?: number): TrendData;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetCityStatisticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetCityStatisticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityStatisticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityStatisticsResponse): GetCityStatisticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetCityStatisticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityStatisticsResponse;
  static deserializeBinaryFromReader(message: GetCityStatisticsResponse, reader: jspb.BinaryReader): GetCityStatisticsResponse;
}

export namespace GetCityStatisticsResponse {
  export type AsObject = {
    statistics?: CityStatistics.AsObject,
    trendsList: Array<TrendData.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class TrendData extends jspb.Message {
  getMetric(): string;
  setMetric(value: string): TrendData;

  getDataPointsList(): Array<DataPoint>;
  setDataPointsList(value: Array<DataPoint>): TrendData;
  clearDataPointsList(): TrendData;
  addDataPoints(value?: DataPoint, index?: number): DataPoint;

  getPeriod(): string;
  setPeriod(value: string): TrendData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrendData.AsObject;
  static toObject(includeInstance: boolean, msg: TrendData): TrendData.AsObject;
  static serializeBinaryToWriter(message: TrendData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrendData;
  static deserializeBinaryFromReader(message: TrendData, reader: jspb.BinaryReader): TrendData;
}

export namespace TrendData {
  export type AsObject = {
    metric: string,
    dataPointsList: Array<DataPoint.AsObject>,
    period: string,
  }
}

export class DataPoint extends jspb.Message {
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): DataPoint;
  hasTimestamp(): boolean;
  clearTimestamp(): DataPoint;

  getValue(): number;
  setValue(value: number): DataPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: DataPoint): DataPoint.AsObject;
  static serializeBinaryToWriter(message: DataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DataPoint;
  static deserializeBinaryFromReader(message: DataPoint, reader: jspb.BinaryReader): DataPoint;
}

export namespace DataPoint {
  export type AsObject = {
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    value: number,
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

