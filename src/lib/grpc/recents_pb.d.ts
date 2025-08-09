import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class RecentInteraction extends jspb.Message {
  getId(): string;
  setId(value: string): RecentInteraction;

  getUserId(): string;
  setUserId(value: string): RecentInteraction;

  getInteractionType(): InteractionType;
  setInteractionType(value: InteractionType): RecentInteraction;

  getEntityId(): string;
  setEntityId(value: string): RecentInteraction;

  getEntityType(): string;
  setEntityType(value: string): RecentInteraction;

  getEntityName(): string;
  setEntityName(value: string): RecentInteraction;

  getDescription(): string;
  setDescription(value: string): RecentInteraction;

  getCityId(): string;
  setCityId(value: string): RecentInteraction;

  getCityName(): string;
  setCityName(value: string): RecentInteraction;

  getCountry(): string;
  setCountry(value: string): RecentInteraction;

  getContext(): InteractionContext | undefined;
  setContext(value?: InteractionContext): RecentInteraction;
  hasContext(): boolean;
  clearContext(): RecentInteraction;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): RecentInteraction;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): RecentInteraction;
  hasCreatedAt(): boolean;
  clearCreatedAt(): RecentInteraction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecentInteraction.AsObject;
  static toObject(includeInstance: boolean, msg: RecentInteraction): RecentInteraction.AsObject;
  static serializeBinaryToWriter(message: RecentInteraction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecentInteraction;
  static deserializeBinaryFromReader(message: RecentInteraction, reader: jspb.BinaryReader): RecentInteraction;
}

export namespace RecentInteraction {
  export type AsObject = {
    id: string,
    userId: string,
    interactionType: InteractionType,
    entityId: string,
    entityType: string,
    entityName: string,
    description: string,
    cityId: string,
    cityName: string,
    country: string,
    context?: InteractionContext.AsObject,
    metadataMap: Array<[string, string]>,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class InteractionContext extends jspb.Message {
  getSourcePage(): string;
  setSourcePage(value: string): InteractionContext;

  getUserAgent(): string;
  setUserAgent(value: string): InteractionContext;

  getDeviceType(): string;
  setDeviceType(value: string): InteractionContext;

  getLocation(): GeoLocation | undefined;
  setLocation(value?: GeoLocation): InteractionContext;
  hasLocation(): boolean;
  clearLocation(): InteractionContext;

  getSessionId(): string;
  setSessionId(value: string): InteractionContext;

  getReferrer(): string;
  setReferrer(value: string): InteractionContext;

  getCustomPropertiesMap(): jspb.Map<string, string>;
  clearCustomPropertiesMap(): InteractionContext;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InteractionContext.AsObject;
  static toObject(includeInstance: boolean, msg: InteractionContext): InteractionContext.AsObject;
  static serializeBinaryToWriter(message: InteractionContext, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InteractionContext;
  static deserializeBinaryFromReader(message: InteractionContext, reader: jspb.BinaryReader): InteractionContext;
}

export namespace InteractionContext {
  export type AsObject = {
    sourcePage: string,
    userAgent: string,
    deviceType: string,
    location?: GeoLocation.AsObject,
    sessionId: string,
    referrer: string,
    customPropertiesMap: Array<[string, string]>,
  }
}

export class GeoLocation extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): GeoLocation;

  getLongitude(): number;
  setLongitude(value: number): GeoLocation;

  getCity(): string;
  setCity(value: string): GeoLocation;

  getCountry(): string;
  setCountry(value: string): GeoLocation;

  getAccuracy(): number;
  setAccuracy(value: number): GeoLocation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoLocation.AsObject;
  static toObject(includeInstance: boolean, msg: GeoLocation): GeoLocation.AsObject;
  static serializeBinaryToWriter(message: GeoLocation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoLocation;
  static deserializeBinaryFromReader(message: GeoLocation, reader: jspb.BinaryReader): GeoLocation;
}

export namespace GeoLocation {
  export type AsObject = {
    latitude: number,
    longitude: number,
    city: string,
    country: string,
    accuracy: number,
  }
}

export class CityInteractions extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): CityInteractions;

  getCityName(): string;
  setCityName(value: string): CityInteractions;

  getCountry(): string;
  setCountry(value: string): CityInteractions;

  getCountryCode(): string;
  setCountryCode(value: string): CityInteractions;

  getTotalInteractions(): number;
  setTotalInteractions(value: number): CityInteractions;

  getSearches(): number;
  setSearches(value: number): CityInteractions;

  getFavorites(): number;
  setFavorites(value: number): CityInteractions;

  getItinerariesCreated(): number;
  setItinerariesCreated(value: number): CityInteractions;

  getPoisViewed(): number;
  setPoisViewed(value: number): CityInteractions;

  getFirstInteraction(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFirstInteraction(value?: google_protobuf_timestamp_pb.Timestamp): CityInteractions;
  hasFirstInteraction(): boolean;
  clearFirstInteraction(): CityInteractions;

  getLastInteraction(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastInteraction(value?: google_protobuf_timestamp_pb.Timestamp): CityInteractions;
  hasLastInteraction(): boolean;
  clearLastInteraction(): CityInteractions;

  getTopCategoriesList(): Array<string>;
  setTopCategoriesList(value: Array<string>): CityInteractions;
  clearTopCategoriesList(): CityInteractions;
  addTopCategories(value: string, index?: number): CityInteractions;

  getPreferences(): CityPreferences | undefined;
  setPreferences(value?: CityPreferences): CityInteractions;
  hasPreferences(): boolean;
  clearPreferences(): CityInteractions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityInteractions.AsObject;
  static toObject(includeInstance: boolean, msg: CityInteractions): CityInteractions.AsObject;
  static serializeBinaryToWriter(message: CityInteractions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityInteractions;
  static deserializeBinaryFromReader(message: CityInteractions, reader: jspb.BinaryReader): CityInteractions;
}

export namespace CityInteractions {
  export type AsObject = {
    cityId: string,
    cityName: string,
    country: string,
    countryCode: string,
    totalInteractions: number,
    searches: number,
    favorites: number,
    itinerariesCreated: number,
    poisViewed: number,
    firstInteraction?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    lastInteraction?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    topCategoriesList: Array<string>,
    preferences?: CityPreferences.AsObject,
  }
}

export class CityPreferences extends jspb.Message {
  getPreferredCategoriesList(): Array<string>;
  setPreferredCategoriesList(value: Array<string>): CityPreferences;
  clearPreferredCategoriesList(): CityPreferences;
  addPreferredCategories(value: string, index?: number): CityPreferences;

  getPreferredPriceRange(): string;
  setPreferredPriceRange(value: string): CityPreferences;

  getPreferredRadiusMeters(): number;
  setPreferredRadiusMeters(value: number): CityPreferences;

  getPreferredTimeOfDay(): string;
  setPreferredTimeOfDay(value: string): CityPreferences;

  getAvoidedCategoriesList(): Array<string>;
  setAvoidedCategoriesList(value: Array<string>): CityPreferences;
  clearAvoidedCategoriesList(): CityPreferences;
  addAvoidedCategories(value: string, index?: number): CityPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: CityPreferences): CityPreferences.AsObject;
  static serializeBinaryToWriter(message: CityPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityPreferences;
  static deserializeBinaryFromReader(message: CityPreferences, reader: jspb.BinaryReader): CityPreferences;
}

export namespace CityPreferences {
  export type AsObject = {
    preferredCategoriesList: Array<string>,
    preferredPriceRange: string,
    preferredRadiusMeters: number,
    preferredTimeOfDay: string,
    avoidedCategoriesList: Array<string>,
  }
}

export class FrequentPlace extends jspb.Message {
  getPlaceId(): string;
  setPlaceId(value: string): FrequentPlace;

  getPlaceName(): string;
  setPlaceName(value: string): FrequentPlace;

  getPlaceType(): string;
  setPlaceType(value: string): FrequentPlace;

  getCategory(): string;
  setCategory(value: string): FrequentPlace;

  getLatitude(): number;
  setLatitude(value: number): FrequentPlace;

  getLongitude(): number;
  setLongitude(value: number): FrequentPlace;

  getCityName(): string;
  setCityName(value: string): FrequentPlace;

  getVisitCount(): number;
  setVisitCount(value: number): FrequentPlace;

  getInteractionCount(): number;
  setInteractionCount(value: number): FrequentPlace;

  getFirstVisit(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setFirstVisit(value?: google_protobuf_timestamp_pb.Timestamp): FrequentPlace;
  hasFirstVisit(): boolean;
  clearFirstVisit(): FrequentPlace;

  getLastVisit(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastVisit(value?: google_protobuf_timestamp_pb.Timestamp): FrequentPlace;
  hasLastVisit(): boolean;
  clearLastVisit(): FrequentPlace;

  getVisitFrequencyScore(): number;
  setVisitFrequencyScore(value: number): FrequentPlace;

  getInteractionTypesList(): Array<InteractionType>;
  setInteractionTypesList(value: Array<InteractionType>): FrequentPlace;
  clearInteractionTypesList(): FrequentPlace;
  addInteractionTypes(value: InteractionType, index?: number): FrequentPlace;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FrequentPlace.AsObject;
  static toObject(includeInstance: boolean, msg: FrequentPlace): FrequentPlace.AsObject;
  static serializeBinaryToWriter(message: FrequentPlace, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FrequentPlace;
  static deserializeBinaryFromReader(message: FrequentPlace, reader: jspb.BinaryReader): FrequentPlace;
}

export namespace FrequentPlace {
  export type AsObject = {
    placeId: string,
    placeName: string,
    placeType: string,
    category: string,
    latitude: number,
    longitude: number,
    cityName: string,
    visitCount: number,
    interactionCount: number,
    firstVisit?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    lastVisit?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    visitFrequencyScore: number,
    interactionTypesList: Array<InteractionType>,
  }
}

export class InteractionFilter extends jspb.Message {
  getInteractionTypesList(): Array<InteractionType>;
  setInteractionTypesList(value: Array<InteractionType>): InteractionFilter;
  clearInteractionTypesList(): InteractionFilter;
  addInteractionTypes(value: InteractionType, index?: number): InteractionFilter;

  getEntityTypesList(): Array<string>;
  setEntityTypesList(value: Array<string>): InteractionFilter;
  clearEntityTypesList(): InteractionFilter;
  addEntityTypes(value: string, index?: number): InteractionFilter;

  getCityId(): string;
  setCityId(value: string): InteractionFilter;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): InteractionFilter;
  hasStartDate(): boolean;
  clearStartDate(): InteractionFilter;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): InteractionFilter;
  hasEndDate(): boolean;
  clearEndDate(): InteractionFilter;

  getSearchQuery(): string;
  setSearchQuery(value: string): InteractionFilter;

  getCategoriesList(): Array<string>;
  setCategoriesList(value: Array<string>): InteractionFilter;
  clearCategoriesList(): InteractionFilter;
  addCategories(value: string, index?: number): InteractionFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InteractionFilter.AsObject;
  static toObject(includeInstance: boolean, msg: InteractionFilter): InteractionFilter.AsObject;
  static serializeBinaryToWriter(message: InteractionFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InteractionFilter;
  static deserializeBinaryFromReader(message: InteractionFilter, reader: jspb.BinaryReader): InteractionFilter;
}

export namespace InteractionFilter {
  export type AsObject = {
    interactionTypesList: Array<InteractionType>,
    entityTypesList: Array<string>,
    cityId: string,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    searchQuery: string,
    categoriesList: Array<string>,
  }
}

export class GetRecentInteractionsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetRecentInteractionsRequest;

  getLimit(): number;
  setLimit(value: number): GetRecentInteractionsRequest;

  getOffset(): number;
  setOffset(value: number): GetRecentInteractionsRequest;

  getFilter(): InteractionFilter | undefined;
  setFilter(value?: InteractionFilter): GetRecentInteractionsRequest;
  hasFilter(): boolean;
  clearFilter(): GetRecentInteractionsRequest;

  getGroupByCity(): boolean;
  setGroupByCity(value: boolean): GetRecentInteractionsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetRecentInteractionsRequest;
  hasRequest(): boolean;
  clearRequest(): GetRecentInteractionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRecentInteractionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRecentInteractionsRequest): GetRecentInteractionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetRecentInteractionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRecentInteractionsRequest;
  static deserializeBinaryFromReader(message: GetRecentInteractionsRequest, reader: jspb.BinaryReader): GetRecentInteractionsRequest;
}

export namespace GetRecentInteractionsRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    offset: number,
    filter?: InteractionFilter.AsObject,
    groupByCity: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetRecentInteractionsResponse extends jspb.Message {
  getInteractionsList(): Array<RecentInteraction>;
  setInteractionsList(value: Array<RecentInteraction>): GetRecentInteractionsResponse;
  clearInteractionsList(): GetRecentInteractionsResponse;
  addInteractions(value?: RecentInteraction, index?: number): RecentInteraction;

  getTotalCount(): number;
  setTotalCount(value: number): GetRecentInteractionsResponse;

  getCitySummariesList(): Array<CityInteractionSummary>;
  setCitySummariesList(value: Array<CityInteractionSummary>): GetRecentInteractionsResponse;
  clearCitySummariesList(): GetRecentInteractionsResponse;
  addCitySummaries(value?: CityInteractionSummary, index?: number): CityInteractionSummary;

  getAnalytics(): InteractionAnalytics | undefined;
  setAnalytics(value?: InteractionAnalytics): GetRecentInteractionsResponse;
  hasAnalytics(): boolean;
  clearAnalytics(): GetRecentInteractionsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetRecentInteractionsResponse;
  hasResponse(): boolean;
  clearResponse(): GetRecentInteractionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRecentInteractionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRecentInteractionsResponse): GetRecentInteractionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetRecentInteractionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRecentInteractionsResponse;
  static deserializeBinaryFromReader(message: GetRecentInteractionsResponse, reader: jspb.BinaryReader): GetRecentInteractionsResponse;
}

export namespace GetRecentInteractionsResponse {
  export type AsObject = {
    interactionsList: Array<RecentInteraction.AsObject>,
    totalCount: number,
    citySummariesList: Array<CityInteractionSummary.AsObject>,
    analytics?: InteractionAnalytics.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CityInteractionSummary extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): CityInteractionSummary;

  getCityName(): string;
  setCityName(value: string): CityInteractionSummary;

  getCountry(): string;
  setCountry(value: string): CityInteractionSummary;

  getInteractionCount(): number;
  setInteractionCount(value: number): CityInteractionSummary;

  getLatestInteraction(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLatestInteraction(value?: google_protobuf_timestamp_pb.Timestamp): CityInteractionSummary;
  hasLatestInteraction(): boolean;
  clearLatestInteraction(): CityInteractionSummary;

  getRecentInteractionsList(): Array<RecentInteraction>;
  setRecentInteractionsList(value: Array<RecentInteraction>): CityInteractionSummary;
  clearRecentInteractionsList(): CityInteractionSummary;
  addRecentInteractions(value?: RecentInteraction, index?: number): RecentInteraction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityInteractionSummary.AsObject;
  static toObject(includeInstance: boolean, msg: CityInteractionSummary): CityInteractionSummary.AsObject;
  static serializeBinaryToWriter(message: CityInteractionSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityInteractionSummary;
  static deserializeBinaryFromReader(message: CityInteractionSummary, reader: jspb.BinaryReader): CityInteractionSummary;
}

export namespace CityInteractionSummary {
  export type AsObject = {
    cityId: string,
    cityName: string,
    country: string,
    interactionCount: number,
    latestInteraction?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    recentInteractionsList: Array<RecentInteraction.AsObject>,
  }
}

export class InteractionAnalytics extends jspb.Message {
  getTotalInteractionsToday(): number;
  setTotalInteractionsToday(value: number): InteractionAnalytics;

  getTotalInteractionsThisWeek(): number;
  setTotalInteractionsThisWeek(value: number): InteractionAnalytics;

  getUniqueCitiesVisited(): number;
  setUniqueCitiesVisited(value: number): InteractionAnalytics;

  getTopCategoriesList(): Array<string>;
  setTopCategoriesList(value: Array<string>): InteractionAnalytics;
  clearTopCategoriesList(): InteractionAnalytics;
  addTopCategories(value: string, index?: number): InteractionAnalytics;

  getMostActiveTimeOfDay(): string;
  setMostActiveTimeOfDay(value: string): InteractionAnalytics;

  getAverageInteractionsPerDay(): number;
  setAverageInteractionsPerDay(value: number): InteractionAnalytics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InteractionAnalytics.AsObject;
  static toObject(includeInstance: boolean, msg: InteractionAnalytics): InteractionAnalytics.AsObject;
  static serializeBinaryToWriter(message: InteractionAnalytics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InteractionAnalytics;
  static deserializeBinaryFromReader(message: InteractionAnalytics, reader: jspb.BinaryReader): InteractionAnalytics;
}

export namespace InteractionAnalytics {
  export type AsObject = {
    totalInteractionsToday: number,
    totalInteractionsThisWeek: number,
    uniqueCitiesVisited: number,
    topCategoriesList: Array<string>,
    mostActiveTimeOfDay: string,
    averageInteractionsPerDay: number,
  }
}

export class GetCityInteractionsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetCityInteractionsRequest;

  getCityName(): string;
  setCityName(value: string): GetCityInteractionsRequest;

  getIncludeDetails(): boolean;
  setIncludeDetails(value: boolean): GetCityInteractionsRequest;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): GetCityInteractionsRequest;
  hasStartDate(): boolean;
  clearStartDate(): GetCityInteractionsRequest;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): GetCityInteractionsRequest;
  hasEndDate(): boolean;
  clearEndDate(): GetCityInteractionsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetCityInteractionsRequest;
  hasRequest(): boolean;
  clearRequest(): GetCityInteractionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityInteractionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityInteractionsRequest): GetCityInteractionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetCityInteractionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityInteractionsRequest;
  static deserializeBinaryFromReader(message: GetCityInteractionsRequest, reader: jspb.BinaryReader): GetCityInteractionsRequest;
}

export namespace GetCityInteractionsRequest {
  export type AsObject = {
    userId: string,
    cityName: string,
    includeDetails: boolean,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class GetCityInteractionsResponse extends jspb.Message {
  getCityInteractions(): CityInteractions | undefined;
  setCityInteractions(value?: CityInteractions): GetCityInteractionsResponse;
  hasCityInteractions(): boolean;
  clearCityInteractions(): GetCityInteractionsResponse;

  getDetailedInteractionsList(): Array<RecentInteraction>;
  setDetailedInteractionsList(value: Array<RecentInteraction>): GetCityInteractionsResponse;
  clearDetailedInteractionsList(): GetCityInteractionsResponse;
  addDetailedInteractions(value?: RecentInteraction, index?: number): RecentInteraction;

  getInsights(): CityInsights | undefined;
  setInsights(value?: CityInsights): GetCityInteractionsResponse;
  hasInsights(): boolean;
  clearInsights(): GetCityInteractionsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetCityInteractionsResponse;
  hasResponse(): boolean;
  clearResponse(): GetCityInteractionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCityInteractionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCityInteractionsResponse): GetCityInteractionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetCityInteractionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCityInteractionsResponse;
  static deserializeBinaryFromReader(message: GetCityInteractionsResponse, reader: jspb.BinaryReader): GetCityInteractionsResponse;
}

export namespace GetCityInteractionsResponse {
  export type AsObject = {
    cityInteractions?: CityInteractions.AsObject,
    detailedInteractionsList: Array<RecentInteraction.AsObject>,
    insights?: CityInsights.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CityInsights extends jspb.Message {
  getDiscoveryPattern(): string;
  setDiscoveryPattern(value: string): CityInsights;

  getSuggestedCategoriesList(): Array<string>;
  setSuggestedCategoriesList(value: Array<string>): CityInsights;
  clearSuggestedCategoriesList(): CityInsights;
  addSuggestedCategories(value: string, index?: number): CityInsights;

  getUnexploredAreasList(): Array<string>;
  setUnexploredAreasList(value: Array<string>): CityInsights;
  clearUnexploredAreasList(): CityInsights;
  addUnexploredAreas(value: string, index?: number): CityInsights;

  getEngagementScore(): number;
  setEngagementScore(value: number): CityInsights;

  getVisitFrequency(): string;
  setVisitFrequency(value: string): CityInsights;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityInsights.AsObject;
  static toObject(includeInstance: boolean, msg: CityInsights): CityInsights.AsObject;
  static serializeBinaryToWriter(message: CityInsights, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityInsights;
  static deserializeBinaryFromReader(message: CityInsights, reader: jspb.BinaryReader): CityInsights;
}

export namespace CityInsights {
  export type AsObject = {
    discoveryPattern: string,
    suggestedCategoriesList: Array<string>,
    unexploredAreasList: Array<string>,
    engagementScore: number,
    visitFrequency: string,
  }
}

export class RecordInteractionRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): RecordInteractionRequest;

  getInteractionType(): InteractionType;
  setInteractionType(value: InteractionType): RecordInteractionRequest;

  getEntityId(): string;
  setEntityId(value: string): RecordInteractionRequest;

  getEntityType(): string;
  setEntityType(value: string): RecordInteractionRequest;

  getEntityName(): string;
  setEntityName(value: string): RecordInteractionRequest;

  getCityId(): string;
  setCityId(value: string): RecordInteractionRequest;

  getContext(): InteractionContext | undefined;
  setContext(value?: InteractionContext): RecordInteractionRequest;
  hasContext(): boolean;
  clearContext(): RecordInteractionRequest;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): RecordInteractionRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RecordInteractionRequest;
  hasRequest(): boolean;
  clearRequest(): RecordInteractionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordInteractionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RecordInteractionRequest): RecordInteractionRequest.AsObject;
  static serializeBinaryToWriter(message: RecordInteractionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordInteractionRequest;
  static deserializeBinaryFromReader(message: RecordInteractionRequest, reader: jspb.BinaryReader): RecordInteractionRequest;
}

export namespace RecordInteractionRequest {
  export type AsObject = {
    userId: string,
    interactionType: InteractionType,
    entityId: string,
    entityType: string,
    entityName: string,
    cityId: string,
    context?: InteractionContext.AsObject,
    metadataMap: Array<[string, string]>,
    request?: BaseRequest.AsObject,
  }
}

export class RecordInteractionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RecordInteractionResponse;

  getInteractionId(): string;
  setInteractionId(value: string): RecordInteractionResponse;

  getMessage(): string;
  setMessage(value: string): RecordInteractionResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RecordInteractionResponse;
  hasResponse(): boolean;
  clearResponse(): RecordInteractionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecordInteractionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RecordInteractionResponse): RecordInteractionResponse.AsObject;
  static serializeBinaryToWriter(message: RecordInteractionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecordInteractionResponse;
  static deserializeBinaryFromReader(message: RecordInteractionResponse, reader: jspb.BinaryReader): RecordInteractionResponse;
}

export namespace RecordInteractionResponse {
  export type AsObject = {
    success: boolean,
    interactionId: string,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetInteractionHistoryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetInteractionHistoryRequest;

  getFilter(): InteractionFilter | undefined;
  setFilter(value?: InteractionFilter): GetInteractionHistoryRequest;
  hasFilter(): boolean;
  clearFilter(): GetInteractionHistoryRequest;

  getLimit(): number;
  setLimit(value: number): GetInteractionHistoryRequest;

  getOffset(): number;
  setOffset(value: number): GetInteractionHistoryRequest;

  getSortBy(): string;
  setSortBy(value: string): GetInteractionHistoryRequest;

  getSortOrder(): string;
  setSortOrder(value: string): GetInteractionHistoryRequest;

  getIncludeAnalytics(): boolean;
  setIncludeAnalytics(value: boolean): GetInteractionHistoryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetInteractionHistoryRequest;
  hasRequest(): boolean;
  clearRequest(): GetInteractionHistoryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInteractionHistoryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInteractionHistoryRequest): GetInteractionHistoryRequest.AsObject;
  static serializeBinaryToWriter(message: GetInteractionHistoryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInteractionHistoryRequest;
  static deserializeBinaryFromReader(message: GetInteractionHistoryRequest, reader: jspb.BinaryReader): GetInteractionHistoryRequest;
}

export namespace GetInteractionHistoryRequest {
  export type AsObject = {
    userId: string,
    filter?: InteractionFilter.AsObject,
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: string,
    includeAnalytics: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetInteractionHistoryResponse extends jspb.Message {
  getInteractionsList(): Array<RecentInteraction>;
  setInteractionsList(value: Array<RecentInteraction>): GetInteractionHistoryResponse;
  clearInteractionsList(): GetInteractionHistoryResponse;
  addInteractions(value?: RecentInteraction, index?: number): RecentInteraction;

  getTotalCount(): number;
  setTotalCount(value: number): GetInteractionHistoryResponse;

  getAnalytics(): InteractionAnalytics | undefined;
  setAnalytics(value?: InteractionAnalytics): GetInteractionHistoryResponse;
  hasAnalytics(): boolean;
  clearAnalytics(): GetInteractionHistoryResponse;

  getTrendsList(): Array<TrendData>;
  setTrendsList(value: Array<TrendData>): GetInteractionHistoryResponse;
  clearTrendsList(): GetInteractionHistoryResponse;
  addTrends(value?: TrendData, index?: number): TrendData;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetInteractionHistoryResponse;
  hasResponse(): boolean;
  clearResponse(): GetInteractionHistoryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInteractionHistoryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInteractionHistoryResponse): GetInteractionHistoryResponse.AsObject;
  static serializeBinaryToWriter(message: GetInteractionHistoryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInteractionHistoryResponse;
  static deserializeBinaryFromReader(message: GetInteractionHistoryResponse, reader: jspb.BinaryReader): GetInteractionHistoryResponse;
}

export namespace GetInteractionHistoryResponse {
  export type AsObject = {
    interactionsList: Array<RecentInteraction.AsObject>,
    totalCount: number,
    analytics?: InteractionAnalytics.AsObject,
    trendsList: Array<TrendData.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class TrendData extends jspb.Message {
  getDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDate(value?: google_protobuf_timestamp_pb.Timestamp): TrendData;
  hasDate(): boolean;
  clearDate(): TrendData;

  getInteractionCount(): number;
  setInteractionCount(value: number): TrendData;

  getTypeBreakdownList(): Array<InteractionTypeCount>;
  setTypeBreakdownList(value: Array<InteractionTypeCount>): TrendData;
  clearTypeBreakdownList(): TrendData;
  addTypeBreakdown(value?: InteractionTypeCount, index?: number): InteractionTypeCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrendData.AsObject;
  static toObject(includeInstance: boolean, msg: TrendData): TrendData.AsObject;
  static serializeBinaryToWriter(message: TrendData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrendData;
  static deserializeBinaryFromReader(message: TrendData, reader: jspb.BinaryReader): TrendData;
}

export namespace TrendData {
  export type AsObject = {
    date?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    interactionCount: number,
    typeBreakdownList: Array<InteractionTypeCount.AsObject>,
  }
}

export class InteractionTypeCount extends jspb.Message {
  getType(): InteractionType;
  setType(value: InteractionType): InteractionTypeCount;

  getCount(): number;
  setCount(value: number): InteractionTypeCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InteractionTypeCount.AsObject;
  static toObject(includeInstance: boolean, msg: InteractionTypeCount): InteractionTypeCount.AsObject;
  static serializeBinaryToWriter(message: InteractionTypeCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InteractionTypeCount;
  static deserializeBinaryFromReader(message: InteractionTypeCount, reader: jspb.BinaryReader): InteractionTypeCount;
}

export namespace InteractionTypeCount {
  export type AsObject = {
    type: InteractionType,
    count: number,
  }
}

export class GetFrequentPlacesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetFrequentPlacesRequest;

  getLimit(): number;
  setLimit(value: number): GetFrequentPlacesRequest;

  getMinFrequencyScore(): number;
  setMinFrequencyScore(value: number): GetFrequentPlacesRequest;

  getTimeRange(): string;
  setTimeRange(value: string): GetFrequentPlacesRequest;

  getPlaceTypesList(): Array<string>;
  setPlaceTypesList(value: Array<string>): GetFrequentPlacesRequest;
  clearPlaceTypesList(): GetFrequentPlacesRequest;
  addPlaceTypes(value: string, index?: number): GetFrequentPlacesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetFrequentPlacesRequest;
  hasRequest(): boolean;
  clearRequest(): GetFrequentPlacesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFrequentPlacesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFrequentPlacesRequest): GetFrequentPlacesRequest.AsObject;
  static serializeBinaryToWriter(message: GetFrequentPlacesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFrequentPlacesRequest;
  static deserializeBinaryFromReader(message: GetFrequentPlacesRequest, reader: jspb.BinaryReader): GetFrequentPlacesRequest;
}

export namespace GetFrequentPlacesRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    minFrequencyScore: number,
    timeRange: string,
    placeTypesList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class GetFrequentPlacesResponse extends jspb.Message {
  getPlacesList(): Array<FrequentPlace>;
  setPlacesList(value: Array<FrequentPlace>): GetFrequentPlacesResponse;
  clearPlacesList(): GetFrequentPlacesResponse;
  addPlaces(value?: FrequentPlace, index?: number): FrequentPlace;

  getInsights(): FrequentPlaceInsights | undefined;
  setInsights(value?: FrequentPlaceInsights): GetFrequentPlacesResponse;
  hasInsights(): boolean;
  clearInsights(): GetFrequentPlacesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetFrequentPlacesResponse;
  hasResponse(): boolean;
  clearResponse(): GetFrequentPlacesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFrequentPlacesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFrequentPlacesResponse): GetFrequentPlacesResponse.AsObject;
  static serializeBinaryToWriter(message: GetFrequentPlacesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFrequentPlacesResponse;
  static deserializeBinaryFromReader(message: GetFrequentPlacesResponse, reader: jspb.BinaryReader): GetFrequentPlacesResponse;
}

export namespace GetFrequentPlacesResponse {
  export type AsObject = {
    placesList: Array<FrequentPlace.AsObject>,
    insights?: FrequentPlaceInsights.AsObject,
    response?: BaseResponse.AsObject,
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

export class FrequentPlaceInsights extends jspb.Message {
  getTravelPattern(): string;
  setTravelPattern(value: string): FrequentPlaceInsights;

  getFavoriteCategoriesList(): Array<string>;
  setFavoriteCategoriesList(value: Array<string>): FrequentPlaceInsights;
  clearFavoriteCategoriesList(): FrequentPlaceInsights;
  addFavoriteCategories(value: string, index?: number): FrequentPlaceInsights;

  getExplorationDiversityScore(): number;
  setExplorationDiversityScore(value: number): FrequentPlaceInsights;

  getLoyaltyLevel(): string;
  setLoyaltyLevel(value: string): FrequentPlaceInsights;

  getRecommendedNewPlacesList(): Array<string>;
  setRecommendedNewPlacesList(value: Array<string>): FrequentPlaceInsights;
  clearRecommendedNewPlacesList(): FrequentPlaceInsights;
  addRecommendedNewPlaces(value: string, index?: number): FrequentPlaceInsights;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FrequentPlaceInsights.AsObject;
  static toObject(includeInstance: boolean, msg: FrequentPlaceInsights): FrequentPlaceInsights.AsObject;
  static serializeBinaryToWriter(message: FrequentPlaceInsights, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FrequentPlaceInsights;
  static deserializeBinaryFromReader(message: FrequentPlaceInsights, reader: jspb.BinaryReader): FrequentPlaceInsights;
}

export namespace FrequentPlaceInsights {
  export type AsObject = {
    travelPattern: string,
    favoriteCategoriesList: Array<string>,
    explorationDiversityScore: number,
    loyaltyLevel: string,
    recommendedNewPlacesList: Array<string>,
  }
}

export enum InteractionType { 
  INTERACTION_TYPE_UNSPECIFIED = 0,
  INTERACTION_TYPE_SEARCH = 1,
  INTERACTION_TYPE_VIEW = 2,
  INTERACTION_TYPE_FAVORITE = 3,
  INTERACTION_TYPE_UNFAVORITE = 4,
  INTERACTION_TYPE_SAVE_ITINERARY = 5,
  INTERACTION_TYPE_CREATE_LIST = 6,
  INTERACTION_TYPE_CHAT = 7,
  INTERACTION_TYPE_DISCOVERY = 8,
  INTERACTION_TYPE_RECOMMENDATION_CLICK = 9,
  INTERACTION_TYPE_BOOKING_ATTEMPT = 10,
}
