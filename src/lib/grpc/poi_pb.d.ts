import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


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

  getSubcategory(): string;
  setSubcategory(value: string): POIDetailedInfo;

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

  getEmail(): string;
  setEmail(value: string): POIDetailedInfo;

  getWebsite(): string;
  setWebsite(value: string): POIDetailedInfo;

  getOpeningHoursList(): Array<string>;
  setOpeningHoursList(value: Array<string>): POIDetailedInfo;
  clearOpeningHoursList(): POIDetailedInfo;
  addOpeningHours(value: string, index?: number): POIDetailedInfo;

  getPhotosList(): Array<string>;
  setPhotosList(value: Array<string>): POIDetailedInfo;
  clearPhotosList(): POIDetailedInfo;
  addPhotos(value: string, index?: number): POIDetailedInfo;

  getAmenitiesList(): Array<string>;
  setAmenitiesList(value: Array<string>): POIDetailedInfo;
  clearAmenitiesList(): POIDetailedInfo;
  addAmenities(value: string, index?: number): POIDetailedInfo;

  getDistance(): string;
  setDistance(value: string): POIDetailedInfo;

  getCityId(): string;
  setCityId(value: string): POIDetailedInfo;

  getCityName(): string;
  setCityName(value: string): POIDetailedInfo;

  getCountry(): string;
  setCountry(value: string): POIDetailedInfo;

  getIsVerified(): boolean;
  setIsVerified(value: boolean): POIDetailedInfo;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): POIDetailedInfo;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): POIDetailedInfo;
  hasCreatedAt(): boolean;
  clearCreatedAt(): POIDetailedInfo;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): POIDetailedInfo;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): POIDetailedInfo;

  getTagsList(): Array<Tags>;
  setTagsList(value: Array<Tags>): POIDetailedInfo;
  clearTagsList(): POIDetailedInfo;
  addTags(value?: Tags, index?: number): Tags;

  getPhoneNumber(): string;
  setPhoneNumber(value: string): POIDetailedInfo;

  getPriceLevel(): string;
  setPriceLevel(value: string): POIDetailedInfo;

  getSource(): string;
  setSource(value: string): POIDetailedInfo;

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
    subcategory: string,
    description: string,
    rating: number,
    reviewCount: number,
    priceRange: string,
    address: string,
    phone: string,
    email: string,
    website: string,
    openingHoursList: Array<string>,
    photosList: Array<string>,
    amenitiesList: Array<string>,
    distance: string,
    cityId: string,
    cityName: string,
    country: string,
    isVerified: boolean,
    metadataMap: Array<[string, string]>,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    tagsList: Array<Tags.AsObject>,
    phoneNumber: string,
    priceLevel: string,
    source: string,
  }
}

export class RestaurantDetailedInfo extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): RestaurantDetailedInfo;
  hasPoi(): boolean;
  clearPoi(): RestaurantDetailedInfo;

  getCuisineType(): string;
  setCuisineType(value: string): RestaurantDetailedInfo;

  getDietaryOptionsList(): Array<string>;
  setDietaryOptionsList(value: Array<string>): RestaurantDetailedInfo;
  clearDietaryOptionsList(): RestaurantDetailedInfo;
  addDietaryOptions(value: string, index?: number): RestaurantDetailedInfo;

  getDressCode(): string;
  setDressCode(value: string): RestaurantDetailedInfo;

  getReservationsRequired(): boolean;
  setReservationsRequired(value: boolean): RestaurantDetailedInfo;

  getAverageMealDuration(): string;
  setAverageMealDuration(value: string): RestaurantDetailedInfo;

  getSpecialtiesList(): Array<string>;
  setSpecialtiesList(value: Array<string>): RestaurantDetailedInfo;
  clearSpecialtiesList(): RestaurantDetailedInfo;
  addSpecialties(value: string, index?: number): RestaurantDetailedInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestaurantDetailedInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RestaurantDetailedInfo): RestaurantDetailedInfo.AsObject;
  static serializeBinaryToWriter(message: RestaurantDetailedInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestaurantDetailedInfo;
  static deserializeBinaryFromReader(message: RestaurantDetailedInfo, reader: jspb.BinaryReader): RestaurantDetailedInfo;
}

export namespace RestaurantDetailedInfo {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    cuisineType: string,
    dietaryOptionsList: Array<string>,
    dressCode: string,
    reservationsRequired: boolean,
    averageMealDuration: string,
    specialtiesList: Array<string>,
  }
}

export class HotelDetailedInfo extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): HotelDetailedInfo;
  hasPoi(): boolean;
  clearPoi(): HotelDetailedInfo;

  getStarRating(): number;
  setStarRating(value: number): HotelDetailedInfo;

  getRoomTypesList(): Array<string>;
  setRoomTypesList(value: Array<string>): HotelDetailedInfo;
  clearRoomTypesList(): HotelDetailedInfo;
  addRoomTypes(value: string, index?: number): HotelDetailedInfo;

  getAmenitiesList(): Array<string>;
  setAmenitiesList(value: Array<string>): HotelDetailedInfo;
  clearAmenitiesList(): HotelDetailedInfo;
  addAmenities(value: string, index?: number): HotelDetailedInfo;

  getCheckInTime(): string;
  setCheckInTime(value: string): HotelDetailedInfo;

  getCheckOutTime(): string;
  setCheckOutTime(value: string): HotelDetailedInfo;

  getPetFriendly(): boolean;
  setPetFriendly(value: boolean): HotelDetailedInfo;

  getParkingAvailable(): boolean;
  setParkingAvailable(value: boolean): HotelDetailedInfo;

  getPropertyType(): string;
  setPropertyType(value: string): HotelDetailedInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HotelDetailedInfo.AsObject;
  static toObject(includeInstance: boolean, msg: HotelDetailedInfo): HotelDetailedInfo.AsObject;
  static serializeBinaryToWriter(message: HotelDetailedInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HotelDetailedInfo;
  static deserializeBinaryFromReader(message: HotelDetailedInfo, reader: jspb.BinaryReader): HotelDetailedInfo;
}

export namespace HotelDetailedInfo {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    starRating: number,
    roomTypesList: Array<string>,
    amenitiesList: Array<string>,
    checkInTime: string,
    checkOutTime: string,
    petFriendly: boolean,
    parkingAvailable: boolean,
    propertyType: string,
  }
}

export class GeoPoint extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): GeoPoint;

  getLongitude(): number;
  setLongitude(value: number): GeoPoint;

  getLimit(): number;
  setLimit(value: number): GeoPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoPoint.AsObject;
  static toObject(includeInstance: boolean, msg: GeoPoint): GeoPoint.AsObject;
  static serializeBinaryToWriter(message: GeoPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoPoint;
  static deserializeBinaryFromReader(message: GeoPoint, reader: jspb.BinaryReader): GeoPoint;
}

export namespace GeoPoint {
  export type AsObject = {
    latitude: number,
    longitude: number,
    limit: number,
  }
}

export class POIFilter extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): POIFilter;

  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): POIFilter;
  hasLocation(): boolean;
  clearLocation(): POIFilter;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): POIFilter;

  getCategoriesList(): Array<string>;
  setCategoriesList(value: Array<string>): POIFilter;
  clearCategoriesList(): POIFilter;
  addCategories(value: string, index?: number): POIFilter;

  getPriceRangesList(): Array<string>;
  setPriceRangesList(value: Array<string>): POIFilter;
  clearPriceRangesList(): POIFilter;
  addPriceRanges(value: string, index?: number): POIFilter;

  getMinRating(): number;
  setMinRating(value: number): POIFilter;

  getSortBy(): string;
  setSortBy(value: string): POIFilter;

  getSortOrder(): string;
  setSortOrder(value: string): POIFilter;

  getLimit(): number;
  setLimit(value: number): POIFilter;

  getOffset(): number;
  setOffset(value: number): POIFilter;

  getCityId(): string;
  setCityId(value: string): POIFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POIFilter.AsObject;
  static toObject(includeInstance: boolean, msg: POIFilter): POIFilter.AsObject;
  static serializeBinaryToWriter(message: POIFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POIFilter;
  static deserializeBinaryFromReader(message: POIFilter, reader: jspb.BinaryReader): POIFilter;
}

export namespace POIFilter {
  export type AsObject = {
    query: string,
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    categoriesList: Array<string>,
    priceRangesList: Array<string>,
    minRating: number,
    sortBy: string,
    sortOrder: string,
    limit: number,
    offset: number,
    cityId: string,
  }
}

export class GetPOIsByCityRequest extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): GetPOIsByCityRequest;

  getLimit(): number;
  setLimit(value: number): GetPOIsByCityRequest;

  getOffset(): number;
  setOffset(value: number): GetPOIsByCityRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetPOIsByCityRequest;
  hasRequest(): boolean;
  clearRequest(): GetPOIsByCityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIsByCityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIsByCityRequest): GetPOIsByCityRequest.AsObject;
  static serializeBinaryToWriter(message: GetPOIsByCityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIsByCityRequest;
  static deserializeBinaryFromReader(message: GetPOIsByCityRequest, reader: jspb.BinaryReader): GetPOIsByCityRequest;
}

export namespace GetPOIsByCityRequest {
  export type AsObject = {
    cityId: string,
    limit: number,
    offset: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetPOIsByCityResponse extends jspb.Message {
  getPoisList(): Array<POIDetailedInfo>;
  setPoisList(value: Array<POIDetailedInfo>): GetPOIsByCityResponse;
  clearPoisList(): GetPOIsByCityResponse;
  addPois(value?: POIDetailedInfo, index?: number): POIDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): GetPOIsByCityResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetPOIsByCityResponse;
  hasResponse(): boolean;
  clearResponse(): GetPOIsByCityResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIsByCityResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIsByCityResponse): GetPOIsByCityResponse.AsObject;
  static serializeBinaryToWriter(message: GetPOIsByCityResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIsByCityResponse;
  static deserializeBinaryFromReader(message: GetPOIsByCityResponse, reader: jspb.BinaryReader): GetPOIsByCityResponse;
}

export namespace GetPOIsByCityResponse {
  export type AsObject = {
    poisList: Array<POIDetailedInfo.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class SearchPOIsRequest extends jspb.Message {
  getFilter(): POIFilter | undefined;
  setFilter(value?: POIFilter): SearchPOIsRequest;
  hasFilter(): boolean;
  clearFilter(): SearchPOIsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchPOIsRequest;
  hasRequest(): boolean;
  clearRequest(): SearchPOIsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsRequest): SearchPOIsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsRequest;
  static deserializeBinaryFromReader(message: SearchPOIsRequest, reader: jspb.BinaryReader): SearchPOIsRequest;
}

export namespace SearchPOIsRequest {
  export type AsObject = {
    filter?: POIFilter.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class SearchPOIsResponse extends jspb.Message {
  getPoisList(): Array<POIDetailedInfo>;
  setPoisList(value: Array<POIDetailedInfo>): SearchPOIsResponse;
  clearPoisList(): SearchPOIsResponse;
  addPois(value?: POIDetailedInfo, index?: number): POIDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): SearchPOIsResponse;

  getMetadata(): SearchMetadata | undefined;
  setMetadata(value?: SearchMetadata): SearchPOIsResponse;
  hasMetadata(): boolean;
  clearMetadata(): SearchPOIsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SearchPOIsResponse;
  hasResponse(): boolean;
  clearResponse(): SearchPOIsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsResponse): SearchPOIsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsResponse;
  static deserializeBinaryFromReader(message: SearchPOIsResponse, reader: jspb.BinaryReader): SearchPOIsResponse;
}

export namespace SearchPOIsResponse {
  export type AsObject = {
    poisList: Array<POIDetailedInfo.AsObject>,
    totalCount: number,
    metadata?: SearchMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class SearchPOIsSemanticRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchPOIsSemanticRequest;

  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): SearchPOIsSemanticRequest;
  hasLocation(): boolean;
  clearLocation(): SearchPOIsSemanticRequest;

  getLimit(): number;
  setLimit(value: number): SearchPOIsSemanticRequest;

  getSemanticThreshold(): number;
  setSemanticThreshold(value: number): SearchPOIsSemanticRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchPOIsSemanticRequest;
  hasRequest(): boolean;
  clearRequest(): SearchPOIsSemanticRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsSemanticRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsSemanticRequest): SearchPOIsSemanticRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsSemanticRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsSemanticRequest;
  static deserializeBinaryFromReader(message: SearchPOIsSemanticRequest, reader: jspb.BinaryReader): SearchPOIsSemanticRequest;
}

export namespace SearchPOIsSemanticRequest {
  export type AsObject = {
    query: string,
    location?: GeoPoint.AsObject,
    limit: number,
    semanticThreshold: number,
    request?: BaseRequest.AsObject,
  }
}

export class SearchPOIsSemanticByCityRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchPOIsSemanticByCityRequest;

  getCityId(): string;
  setCityId(value: string): SearchPOIsSemanticByCityRequest;

  getLimit(): number;
  setLimit(value: number): SearchPOIsSemanticByCityRequest;

  getSemanticThreshold(): number;
  setSemanticThreshold(value: number): SearchPOIsSemanticByCityRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchPOIsSemanticByCityRequest;
  hasRequest(): boolean;
  clearRequest(): SearchPOIsSemanticByCityRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsSemanticByCityRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsSemanticByCityRequest): SearchPOIsSemanticByCityRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsSemanticByCityRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsSemanticByCityRequest;
  static deserializeBinaryFromReader(message: SearchPOIsSemanticByCityRequest, reader: jspb.BinaryReader): SearchPOIsSemanticByCityRequest;
}

export namespace SearchPOIsSemanticByCityRequest {
  export type AsObject = {
    query: string,
    cityId: string,
    limit: number,
    semanticThreshold: number,
    request?: BaseRequest.AsObject,
  }
}

export class SearchPOIsSemanticResponse extends jspb.Message {
  getPoisList(): Array<POISemanticMatch>;
  setPoisList(value: Array<POISemanticMatch>): SearchPOIsSemanticResponse;
  clearPoisList(): SearchPOIsSemanticResponse;
  addPois(value?: POISemanticMatch, index?: number): POISemanticMatch;

  getTotalCount(): number;
  setTotalCount(value: number): SearchPOIsSemanticResponse;

  getMetadata(): SearchMetadata | undefined;
  setMetadata(value?: SearchMetadata): SearchPOIsSemanticResponse;
  hasMetadata(): boolean;
  clearMetadata(): SearchPOIsSemanticResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SearchPOIsSemanticResponse;
  hasResponse(): boolean;
  clearResponse(): SearchPOIsSemanticResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsSemanticResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsSemanticResponse): SearchPOIsSemanticResponse.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsSemanticResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsSemanticResponse;
  static deserializeBinaryFromReader(message: SearchPOIsSemanticResponse, reader: jspb.BinaryReader): SearchPOIsSemanticResponse;
}

export namespace SearchPOIsSemanticResponse {
  export type AsObject = {
    poisList: Array<POISemanticMatch.AsObject>,
    totalCount: number,
    metadata?: SearchMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class POISemanticMatch extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): POISemanticMatch;
  hasPoi(): boolean;
  clearPoi(): POISemanticMatch;

  getSimilarityScore(): number;
  setSimilarityScore(value: number): POISemanticMatch;

  getMatchReason(): string;
  setMatchReason(value: string): POISemanticMatch;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POISemanticMatch.AsObject;
  static toObject(includeInstance: boolean, msg: POISemanticMatch): POISemanticMatch.AsObject;
  static serializeBinaryToWriter(message: POISemanticMatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POISemanticMatch;
  static deserializeBinaryFromReader(message: POISemanticMatch, reader: jspb.BinaryReader): POISemanticMatch;
}

export namespace POISemanticMatch {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    similarityScore: number,
    matchReason: string,
  }
}

export class SearchPOIsHybridRequest extends jspb.Message {
  getFilter(): POIFilter | undefined;
  setFilter(value?: POIFilter): SearchPOIsHybridRequest;
  hasFilter(): boolean;
  clearFilter(): SearchPOIsHybridRequest;

  getSemanticQuery(): string;
  setSemanticQuery(value: string): SearchPOIsHybridRequest;

  getSemanticWeight(): number;
  setSemanticWeight(value: number): SearchPOIsHybridRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchPOIsHybridRequest;
  hasRequest(): boolean;
  clearRequest(): SearchPOIsHybridRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsHybridRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsHybridRequest): SearchPOIsHybridRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsHybridRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsHybridRequest;
  static deserializeBinaryFromReader(message: SearchPOIsHybridRequest, reader: jspb.BinaryReader): SearchPOIsHybridRequest;
}

export namespace SearchPOIsHybridRequest {
  export type AsObject = {
    filter?: POIFilter.AsObject,
    semanticQuery: string,
    semanticWeight: number,
    request?: BaseRequest.AsObject,
  }
}

export class SearchPOIsHybridResponse extends jspb.Message {
  getPoisList(): Array<POIHybridMatch>;
  setPoisList(value: Array<POIHybridMatch>): SearchPOIsHybridResponse;
  clearPoisList(): SearchPOIsHybridResponse;
  addPois(value?: POIHybridMatch, index?: number): POIHybridMatch;

  getTotalCount(): number;
  setTotalCount(value: number): SearchPOIsHybridResponse;

  getMetadata(): SearchMetadata | undefined;
  setMetadata(value?: SearchMetadata): SearchPOIsHybridResponse;
  hasMetadata(): boolean;
  clearMetadata(): SearchPOIsHybridResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SearchPOIsHybridResponse;
  hasResponse(): boolean;
  clearResponse(): SearchPOIsHybridResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPOIsHybridResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPOIsHybridResponse): SearchPOIsHybridResponse.AsObject;
  static serializeBinaryToWriter(message: SearchPOIsHybridResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPOIsHybridResponse;
  static deserializeBinaryFromReader(message: SearchPOIsHybridResponse, reader: jspb.BinaryReader): SearchPOIsHybridResponse;
}

export namespace SearchPOIsHybridResponse {
  export type AsObject = {
    poisList: Array<POIHybridMatch.AsObject>,
    totalCount: number,
    metadata?: SearchMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class POIHybridMatch extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): POIHybridMatch;
  hasPoi(): boolean;
  clearPoi(): POIHybridMatch;

  getSpatialScore(): number;
  setSpatialScore(value: number): POIHybridMatch;

  getSemanticScore(): number;
  setSemanticScore(value: number): POIHybridMatch;

  getCombinedScore(): number;
  setCombinedScore(value: number): POIHybridMatch;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POIHybridMatch.AsObject;
  static toObject(includeInstance: boolean, msg: POIHybridMatch): POIHybridMatch.AsObject;
  static serializeBinaryToWriter(message: POIHybridMatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POIHybridMatch;
  static deserializeBinaryFromReader(message: POIHybridMatch, reader: jspb.BinaryReader): POIHybridMatch;
}

export namespace POIHybridMatch {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    spatialScore: number,
    semanticScore: number,
    combinedScore: number,
  }
}

export class SearchMetadata extends jspb.Message {
  getQueryTimeMs(): number;
  setQueryTimeMs(value: number): SearchMetadata;

  getSearchMethod(): string;
  setSearchMethod(value: string): SearchMetadata;

  getDebugInfoMap(): jspb.Map<string, string>;
  clearDebugInfoMap(): SearchMetadata;

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
    debugInfoMap: Array<[string, string]>,
  }
}

export class GetNearbyRecommendationsRequest extends jspb.Message {
  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): GetNearbyRecommendationsRequest;
  hasLocation(): boolean;
  clearLocation(): GetNearbyRecommendationsRequest;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): GetNearbyRecommendationsRequest;

  getUserId(): string;
  setUserId(value: string): GetNearbyRecommendationsRequest;

  getPreferredCategoriesList(): Array<string>;
  setPreferredCategoriesList(value: Array<string>): GetNearbyRecommendationsRequest;
  clearPreferredCategoriesList(): GetNearbyRecommendationsRequest;
  addPreferredCategories(value: string, index?: number): GetNearbyRecommendationsRequest;

  getLimit(): number;
  setLimit(value: number): GetNearbyRecommendationsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetNearbyRecommendationsRequest;
  hasRequest(): boolean;
  clearRequest(): GetNearbyRecommendationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNearbyRecommendationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNearbyRecommendationsRequest): GetNearbyRecommendationsRequest.AsObject;
  static serializeBinaryToWriter(message: GetNearbyRecommendationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNearbyRecommendationsRequest;
  static deserializeBinaryFromReader(message: GetNearbyRecommendationsRequest, reader: jspb.BinaryReader): GetNearbyRecommendationsRequest;
}

export namespace GetNearbyRecommendationsRequest {
  export type AsObject = {
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    userId: string,
    preferredCategoriesList: Array<string>,
    limit: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetNearbyRecommendationsResponse extends jspb.Message {
  getRecommendationsList(): Array<POIRecommendation>;
  setRecommendationsList(value: Array<POIRecommendation>): GetNearbyRecommendationsResponse;
  clearRecommendationsList(): GetNearbyRecommendationsResponse;
  addRecommendations(value?: POIRecommendation, index?: number): POIRecommendation;

  getMetadata(): RecommendationMetadata | undefined;
  setMetadata(value?: RecommendationMetadata): GetNearbyRecommendationsResponse;
  hasMetadata(): boolean;
  clearMetadata(): GetNearbyRecommendationsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetNearbyRecommendationsResponse;
  hasResponse(): boolean;
  clearResponse(): GetNearbyRecommendationsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNearbyRecommendationsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetNearbyRecommendationsResponse): GetNearbyRecommendationsResponse.AsObject;
  static serializeBinaryToWriter(message: GetNearbyRecommendationsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNearbyRecommendationsResponse;
  static deserializeBinaryFromReader(message: GetNearbyRecommendationsResponse, reader: jspb.BinaryReader): GetNearbyRecommendationsResponse;
}

export namespace GetNearbyRecommendationsResponse {
  export type AsObject = {
    recommendationsList: Array<POIRecommendation.AsObject>,
    metadata?: RecommendationMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class POIRecommendation extends jspb.Message {
  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): POIRecommendation;
  hasPoi(): boolean;
  clearPoi(): POIRecommendation;

  getRecommendationScore(): number;
  setRecommendationScore(value: number): POIRecommendation;

  getRecommendationReason(): string;
  setRecommendationReason(value: string): POIRecommendation;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): POIRecommendation;
  clearTagsList(): POIRecommendation;
  addTags(value: string, index?: number): POIRecommendation;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): POIRecommendation.AsObject;
  static toObject(includeInstance: boolean, msg: POIRecommendation): POIRecommendation.AsObject;
  static serializeBinaryToWriter(message: POIRecommendation, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): POIRecommendation;
  static deserializeBinaryFromReader(message: POIRecommendation, reader: jspb.BinaryReader): POIRecommendation;
}

export namespace POIRecommendation {
  export type AsObject = {
    poi?: POIDetailedInfo.AsObject,
    recommendationScore: number,
    recommendationReason: string,
    tagsList: Array<string>,
  }
}

export class RecommendationMetadata extends jspb.Message {
  getPersonalizationLevel(): string;
  setPersonalizationLevel(value: string): RecommendationMetadata;

  getAppliedFiltersList(): Array<string>;
  setAppliedFiltersList(value: Array<string>): RecommendationMetadata;
  clearAppliedFiltersList(): RecommendationMetadata;
  addAppliedFilters(value: string, index?: number): RecommendationMetadata;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecommendationMetadata.AsObject;
  static toObject(includeInstance: boolean, msg: RecommendationMetadata): RecommendationMetadata.AsObject;
  static serializeBinaryToWriter(message: RecommendationMetadata, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecommendationMetadata;
  static deserializeBinaryFromReader(message: RecommendationMetadata, reader: jspb.BinaryReader): RecommendationMetadata;
}

export namespace RecommendationMetadata {
  export type AsObject = {
    personalizationLevel: string,
    appliedFiltersList: Array<string>,
  }
}

export class DiscoverRestaurantsRequest extends jspb.Message {
  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): DiscoverRestaurantsRequest;
  hasLocation(): boolean;
  clearLocation(): DiscoverRestaurantsRequest;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): DiscoverRestaurantsRequest;

  getCuisineTypesList(): Array<string>;
  setCuisineTypesList(value: Array<string>): DiscoverRestaurantsRequest;
  clearCuisineTypesList(): DiscoverRestaurantsRequest;
  addCuisineTypes(value: string, index?: number): DiscoverRestaurantsRequest;

  getPriceRangesList(): Array<string>;
  setPriceRangesList(value: Array<string>): DiscoverRestaurantsRequest;
  clearPriceRangesList(): DiscoverRestaurantsRequest;
  addPriceRanges(value: string, index?: number): DiscoverRestaurantsRequest;

  getMinRating(): number;
  setMinRating(value: number): DiscoverRestaurantsRequest;

  getLimit(): number;
  setLimit(value: number): DiscoverRestaurantsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DiscoverRestaurantsRequest;
  hasRequest(): boolean;
  clearRequest(): DiscoverRestaurantsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverRestaurantsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverRestaurantsRequest): DiscoverRestaurantsRequest.AsObject;
  static serializeBinaryToWriter(message: DiscoverRestaurantsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverRestaurantsRequest;
  static deserializeBinaryFromReader(message: DiscoverRestaurantsRequest, reader: jspb.BinaryReader): DiscoverRestaurantsRequest;
}

export namespace DiscoverRestaurantsRequest {
  export type AsObject = {
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    cuisineTypesList: Array<string>,
    priceRangesList: Array<string>,
    minRating: number,
    limit: number,
    request?: BaseRequest.AsObject,
  }
}

export class DiscoverRestaurantsResponse extends jspb.Message {
  getRestaurantsList(): Array<RestaurantDetailedInfo>;
  setRestaurantsList(value: Array<RestaurantDetailedInfo>): DiscoverRestaurantsResponse;
  clearRestaurantsList(): DiscoverRestaurantsResponse;
  addRestaurants(value?: RestaurantDetailedInfo, index?: number): RestaurantDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): DiscoverRestaurantsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DiscoverRestaurantsResponse;
  hasResponse(): boolean;
  clearResponse(): DiscoverRestaurantsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverRestaurantsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverRestaurantsResponse): DiscoverRestaurantsResponse.AsObject;
  static serializeBinaryToWriter(message: DiscoverRestaurantsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverRestaurantsResponse;
  static deserializeBinaryFromReader(message: DiscoverRestaurantsResponse, reader: jspb.BinaryReader): DiscoverRestaurantsResponse;
}

export namespace DiscoverRestaurantsResponse {
  export type AsObject = {
    restaurantsList: Array<RestaurantDetailedInfo.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class DiscoverActivitiesRequest extends jspb.Message {
  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): DiscoverActivitiesRequest;
  hasLocation(): boolean;
  clearLocation(): DiscoverActivitiesRequest;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): DiscoverActivitiesRequest;

  getActivityTypesList(): Array<string>;
  setActivityTypesList(value: Array<string>): DiscoverActivitiesRequest;
  clearActivityTypesList(): DiscoverActivitiesRequest;
  addActivityTypes(value: string, index?: number): DiscoverActivitiesRequest;

  getLimit(): number;
  setLimit(value: number): DiscoverActivitiesRequest;

  getDuration(): string;
  setDuration(value: string): DiscoverActivitiesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DiscoverActivitiesRequest;
  hasRequest(): boolean;
  clearRequest(): DiscoverActivitiesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverActivitiesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverActivitiesRequest): DiscoverActivitiesRequest.AsObject;
  static serializeBinaryToWriter(message: DiscoverActivitiesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverActivitiesRequest;
  static deserializeBinaryFromReader(message: DiscoverActivitiesRequest, reader: jspb.BinaryReader): DiscoverActivitiesRequest;
}

export namespace DiscoverActivitiesRequest {
  export type AsObject = {
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    activityTypesList: Array<string>,
    limit: number,
    duration: string,
    request?: BaseRequest.AsObject,
  }
}

export class DiscoverActivitiesResponse extends jspb.Message {
  getActivitiesList(): Array<POIDetailedInfo>;
  setActivitiesList(value: Array<POIDetailedInfo>): DiscoverActivitiesResponse;
  clearActivitiesList(): DiscoverActivitiesResponse;
  addActivities(value?: POIDetailedInfo, index?: number): POIDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): DiscoverActivitiesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DiscoverActivitiesResponse;
  hasResponse(): boolean;
  clearResponse(): DiscoverActivitiesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverActivitiesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverActivitiesResponse): DiscoverActivitiesResponse.AsObject;
  static serializeBinaryToWriter(message: DiscoverActivitiesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverActivitiesResponse;
  static deserializeBinaryFromReader(message: DiscoverActivitiesResponse, reader: jspb.BinaryReader): DiscoverActivitiesResponse;
}

export namespace DiscoverActivitiesResponse {
  export type AsObject = {
    activitiesList: Array<POIDetailedInfo.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class DiscoverHotelsRequest extends jspb.Message {
  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): DiscoverHotelsRequest;
  hasLocation(): boolean;
  clearLocation(): DiscoverHotelsRequest;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): DiscoverHotelsRequest;

  getPropertyTypesList(): Array<string>;
  setPropertyTypesList(value: Array<string>): DiscoverHotelsRequest;
  clearPropertyTypesList(): DiscoverHotelsRequest;
  addPropertyTypes(value: string, index?: number): DiscoverHotelsRequest;

  getStarRatingsList(): Array<number>;
  setStarRatingsList(value: Array<number>): DiscoverHotelsRequest;
  clearStarRatingsList(): DiscoverHotelsRequest;
  addStarRatings(value: number, index?: number): DiscoverHotelsRequest;

  getPriceRangesList(): Array<string>;
  setPriceRangesList(value: Array<string>): DiscoverHotelsRequest;
  clearPriceRangesList(): DiscoverHotelsRequest;
  addPriceRanges(value: string, index?: number): DiscoverHotelsRequest;

  getLimit(): number;
  setLimit(value: number): DiscoverHotelsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DiscoverHotelsRequest;
  hasRequest(): boolean;
  clearRequest(): DiscoverHotelsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverHotelsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverHotelsRequest): DiscoverHotelsRequest.AsObject;
  static serializeBinaryToWriter(message: DiscoverHotelsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverHotelsRequest;
  static deserializeBinaryFromReader(message: DiscoverHotelsRequest, reader: jspb.BinaryReader): DiscoverHotelsRequest;
}

export namespace DiscoverHotelsRequest {
  export type AsObject = {
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    propertyTypesList: Array<string>,
    starRatingsList: Array<number>,
    priceRangesList: Array<string>,
    limit: number,
    request?: BaseRequest.AsObject,
  }
}

export class DiscoverHotelsResponse extends jspb.Message {
  getHotelsList(): Array<HotelDetailedInfo>;
  setHotelsList(value: Array<HotelDetailedInfo>): DiscoverHotelsResponse;
  clearHotelsList(): DiscoverHotelsResponse;
  addHotels(value?: HotelDetailedInfo, index?: number): HotelDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): DiscoverHotelsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DiscoverHotelsResponse;
  hasResponse(): boolean;
  clearResponse(): DiscoverHotelsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverHotelsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverHotelsResponse): DiscoverHotelsResponse.AsObject;
  static serializeBinaryToWriter(message: DiscoverHotelsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverHotelsResponse;
  static deserializeBinaryFromReader(message: DiscoverHotelsResponse, reader: jspb.BinaryReader): DiscoverHotelsResponse;
}

export namespace DiscoverHotelsResponse {
  export type AsObject = {
    hotelsList: Array<HotelDetailedInfo.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class DiscoverAttractionsRequest extends jspb.Message {
  getLocation(): GeoPoint | undefined;
  setLocation(value?: GeoPoint): DiscoverAttractionsRequest;
  hasLocation(): boolean;
  clearLocation(): DiscoverAttractionsRequest;

  getRadiusMeters(): number;
  setRadiusMeters(value: number): DiscoverAttractionsRequest;

  getAttractionTypesList(): Array<string>;
  setAttractionTypesList(value: Array<string>): DiscoverAttractionsRequest;
  clearAttractionTypesList(): DiscoverAttractionsRequest;
  addAttractionTypes(value: string, index?: number): DiscoverAttractionsRequest;

  getLimit(): number;
  setLimit(value: number): DiscoverAttractionsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DiscoverAttractionsRequest;
  hasRequest(): boolean;
  clearRequest(): DiscoverAttractionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverAttractionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverAttractionsRequest): DiscoverAttractionsRequest.AsObject;
  static serializeBinaryToWriter(message: DiscoverAttractionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverAttractionsRequest;
  static deserializeBinaryFromReader(message: DiscoverAttractionsRequest, reader: jspb.BinaryReader): DiscoverAttractionsRequest;
}

export namespace DiscoverAttractionsRequest {
  export type AsObject = {
    location?: GeoPoint.AsObject,
    radiusMeters: number,
    attractionTypesList: Array<string>,
    limit: number,
    request?: BaseRequest.AsObject,
  }
}

export class DiscoverAttractionsResponse extends jspb.Message {
  getAttractionsList(): Array<POIDetailedInfo>;
  setAttractionsList(value: Array<POIDetailedInfo>): DiscoverAttractionsResponse;
  clearAttractionsList(): DiscoverAttractionsResponse;
  addAttractions(value?: POIDetailedInfo, index?: number): POIDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): DiscoverAttractionsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DiscoverAttractionsResponse;
  hasResponse(): boolean;
  clearResponse(): DiscoverAttractionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiscoverAttractionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DiscoverAttractionsResponse): DiscoverAttractionsResponse.AsObject;
  static serializeBinaryToWriter(message: DiscoverAttractionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiscoverAttractionsResponse;
  static deserializeBinaryFromReader(message: DiscoverAttractionsResponse, reader: jspb.BinaryReader): DiscoverAttractionsResponse;
}

export namespace DiscoverAttractionsResponse {
  export type AsObject = {
    attractionsList: Array<POIDetailedInfo.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class AddToFavoritesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): AddToFavoritesRequest;

  getPoiId(): string;
  setPoiId(value: string): AddToFavoritesRequest;

  getIsLlmPoi(): boolean;
  setIsLlmPoi(value: boolean): AddToFavoritesRequest;

  getPoiData(): POIDetailedInfo | undefined;
  setPoiData(value?: POIDetailedInfo): AddToFavoritesRequest;
  hasPoiData(): boolean;
  clearPoiData(): AddToFavoritesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): AddToFavoritesRequest;
  hasRequest(): boolean;
  clearRequest(): AddToFavoritesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddToFavoritesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddToFavoritesRequest): AddToFavoritesRequest.AsObject;
  static serializeBinaryToWriter(message: AddToFavoritesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddToFavoritesRequest;
  static deserializeBinaryFromReader(message: AddToFavoritesRequest, reader: jspb.BinaryReader): AddToFavoritesRequest;
}

export namespace AddToFavoritesRequest {
  export type AsObject = {
    userId: string,
    poiId: string,
    isLlmPoi: boolean,
    poiData?: POIDetailedInfo.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class AddToFavoritesResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): AddToFavoritesResponse;

  getMessage(): string;
  setMessage(value: string): AddToFavoritesResponse;

  getPoiId(): string;
  setPoiId(value: string): AddToFavoritesResponse;

  getFavoriteId(): string;
  setFavoriteId(value: string): AddToFavoritesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): AddToFavoritesResponse;
  hasResponse(): boolean;
  clearResponse(): AddToFavoritesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddToFavoritesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddToFavoritesResponse): AddToFavoritesResponse.AsObject;
  static serializeBinaryToWriter(message: AddToFavoritesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddToFavoritesResponse;
  static deserializeBinaryFromReader(message: AddToFavoritesResponse, reader: jspb.BinaryReader): AddToFavoritesResponse;
}

export namespace AddToFavoritesResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    poiId: string,
    favoriteId: string,
    response?: BaseResponse.AsObject,
  }
}

export class RemoveFromFavoritesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): RemoveFromFavoritesRequest;

  getPoiId(): string;
  setPoiId(value: string): RemoveFromFavoritesRequest;

  getIsLlmPoi(): boolean;
  setIsLlmPoi(value: boolean): RemoveFromFavoritesRequest;

  getPoiData(): POIDetailedInfo | undefined;
  setPoiData(value?: POIDetailedInfo): RemoveFromFavoritesRequest;
  hasPoiData(): boolean;
  clearPoiData(): RemoveFromFavoritesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RemoveFromFavoritesRequest;
  hasRequest(): boolean;
  clearRequest(): RemoveFromFavoritesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveFromFavoritesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveFromFavoritesRequest): RemoveFromFavoritesRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveFromFavoritesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveFromFavoritesRequest;
  static deserializeBinaryFromReader(message: RemoveFromFavoritesRequest, reader: jspb.BinaryReader): RemoveFromFavoritesRequest;
}

export namespace RemoveFromFavoritesRequest {
  export type AsObject = {
    userId: string,
    poiId: string,
    isLlmPoi: boolean,
    poiData?: POIDetailedInfo.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class RemoveFromFavoritesResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveFromFavoritesResponse;

  getMessage(): string;
  setMessage(value: string): RemoveFromFavoritesResponse;

  getPoiId(): string;
  setPoiId(value: string): RemoveFromFavoritesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RemoveFromFavoritesResponse;
  hasResponse(): boolean;
  clearResponse(): RemoveFromFavoritesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveFromFavoritesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveFromFavoritesResponse): RemoveFromFavoritesResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveFromFavoritesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveFromFavoritesResponse;
  static deserializeBinaryFromReader(message: RemoveFromFavoritesResponse, reader: jspb.BinaryReader): RemoveFromFavoritesResponse;
}

export namespace RemoveFromFavoritesResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    poiId: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetFavoritesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetFavoritesRequest;

  getPage(): number;
  setPage(value: number): GetFavoritesRequest;

  getPageSize(): number;
  setPageSize(value: number): GetFavoritesRequest;

  getLimit(): number;
  setLimit(value: number): GetFavoritesRequest;

  getOffset(): number;
  setOffset(value: number): GetFavoritesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetFavoritesRequest;
  hasRequest(): boolean;
  clearRequest(): GetFavoritesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFavoritesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFavoritesRequest): GetFavoritesRequest.AsObject;
  static serializeBinaryToWriter(message: GetFavoritesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFavoritesRequest;
  static deserializeBinaryFromReader(message: GetFavoritesRequest, reader: jspb.BinaryReader): GetFavoritesRequest;
}

export namespace GetFavoritesRequest {
  export type AsObject = {
    userId: string,
    page: number,
    pageSize: number,
    limit: number,
    offset: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetFavoritesResponse extends jspb.Message {
  getFavoritesList(): Array<POIDetailedInfo>;
  setFavoritesList(value: Array<POIDetailedInfo>): GetFavoritesResponse;
  clearFavoritesList(): GetFavoritesResponse;
  addFavorites(value?: POIDetailedInfo, index?: number): POIDetailedInfo;

  getTotalCount(): number;
  setTotalCount(value: number): GetFavoritesResponse;

  getCurrentPage(): number;
  setCurrentPage(value: number): GetFavoritesResponse;

  getTotalPages(): number;
  setTotalPages(value: number): GetFavoritesResponse;

  getLimit(): number;
  setLimit(value: number): GetFavoritesResponse;

  getOffset(): number;
  setOffset(value: number): GetFavoritesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetFavoritesResponse;
  hasResponse(): boolean;
  clearResponse(): GetFavoritesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFavoritesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFavoritesResponse): GetFavoritesResponse.AsObject;
  static serializeBinaryToWriter(message: GetFavoritesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFavoritesResponse;
  static deserializeBinaryFromReader(message: GetFavoritesResponse, reader: jspb.BinaryReader): GetFavoritesResponse;
}

export namespace GetFavoritesResponse {
  export type AsObject = {
    favoritesList: Array<POIDetailedInfo.AsObject>,
    totalCount: number,
    currentPage: number,
    totalPages: number,
    limit: number,
    offset: number,
    response?: BaseResponse.AsObject,
  }
}

export class GetItinerariesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetItinerariesRequest;

  getLimit(): number;
  setLimit(value: number): GetItinerariesRequest;

  getOffset(): number;
  setOffset(value: number): GetItinerariesRequest;

  getPage(): number;
  setPage(value: number): GetItinerariesRequest;

  getPageSize(): number;
  setPageSize(value: number): GetItinerariesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetItinerariesRequest;
  hasRequest(): boolean;
  clearRequest(): GetItinerariesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetItinerariesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetItinerariesRequest): GetItinerariesRequest.AsObject;
  static serializeBinaryToWriter(message: GetItinerariesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetItinerariesRequest;
  static deserializeBinaryFromReader(message: GetItinerariesRequest, reader: jspb.BinaryReader): GetItinerariesRequest;
}

export namespace GetItinerariesRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    offset: number,
    page: number,
    pageSize: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetItinerariesResponse extends jspb.Message {
  getItinerariesList(): Array<UserItinerary>;
  setItinerariesList(value: Array<UserItinerary>): GetItinerariesResponse;
  clearItinerariesList(): GetItinerariesResponse;
  addItineraries(value?: UserItinerary, index?: number): UserItinerary;

  getTotalCount(): number;
  setTotalCount(value: number): GetItinerariesResponse;

  getPage(): number;
  setPage(value: number): GetItinerariesResponse;

  getPageSize(): number;
  setPageSize(value: number): GetItinerariesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetItinerariesResponse;
  hasResponse(): boolean;
  clearResponse(): GetItinerariesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetItinerariesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetItinerariesResponse): GetItinerariesResponse.AsObject;
  static serializeBinaryToWriter(message: GetItinerariesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetItinerariesResponse;
  static deserializeBinaryFromReader(message: GetItinerariesResponse, reader: jspb.BinaryReader): GetItinerariesResponse;
}

export namespace GetItinerariesResponse {
  export type AsObject = {
    itinerariesList: Array<UserItinerary.AsObject>,
    totalCount: number,
    page: number,
    pageSize: number,
    response?: BaseResponse.AsObject,
  }
}

export class GetItineraryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetItineraryRequest;

  getItineraryId(): string;
  setItineraryId(value: string): GetItineraryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetItineraryRequest;
  hasRequest(): boolean;
  clearRequest(): GetItineraryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetItineraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetItineraryRequest): GetItineraryRequest.AsObject;
  static serializeBinaryToWriter(message: GetItineraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetItineraryRequest;
  static deserializeBinaryFromReader(message: GetItineraryRequest, reader: jspb.BinaryReader): GetItineraryRequest;
}

export namespace GetItineraryRequest {
  export type AsObject = {
    userId: string,
    itineraryId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetItineraryResponse extends jspb.Message {
  getItinerary(): UserItinerary | undefined;
  setItinerary(value?: UserItinerary): GetItineraryResponse;
  hasItinerary(): boolean;
  clearItinerary(): GetItineraryResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetItineraryResponse;
  hasResponse(): boolean;
  clearResponse(): GetItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetItineraryResponse): GetItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: GetItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetItineraryResponse;
  static deserializeBinaryFromReader(message: GetItineraryResponse, reader: jspb.BinaryReader): GetItineraryResponse;
}

export namespace GetItineraryResponse {
  export type AsObject = {
    itinerary?: UserItinerary.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateItineraryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateItineraryRequest;

  getItineraryId(): string;
  setItineraryId(value: string): UpdateItineraryRequest;

  getTitle(): string;
  setTitle(value: string): UpdateItineraryRequest;

  getDescription(): string;
  setDescription(value: string): UpdateItineraryRequest;

  getMarkdownContent(): string;
  setMarkdownContent(value: string): UpdateItineraryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateItineraryRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateItineraryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateItineraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateItineraryRequest): UpdateItineraryRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateItineraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateItineraryRequest;
  static deserializeBinaryFromReader(message: UpdateItineraryRequest, reader: jspb.BinaryReader): UpdateItineraryRequest;
}

export namespace UpdateItineraryRequest {
  export type AsObject = {
    userId: string,
    itineraryId: string,
    title: string,
    description: string,
    markdownContent: string,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateItineraryResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateItineraryResponse;

  getMessage(): string;
  setMessage(value: string): UpdateItineraryResponse;

  getItinerary(): UserItinerary | undefined;
  setItinerary(value?: UserItinerary): UpdateItineraryResponse;
  hasItinerary(): boolean;
  clearItinerary(): UpdateItineraryResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateItineraryResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateItineraryResponse): UpdateItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateItineraryResponse;
  static deserializeBinaryFromReader(message: UpdateItineraryResponse, reader: jspb.BinaryReader): UpdateItineraryResponse;
}

export namespace UpdateItineraryResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    itinerary?: UserItinerary.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UserItinerary extends jspb.Message {
  getId(): string;
  setId(value: string): UserItinerary;

  getUserId(): string;
  setUserId(value: string): UserItinerary;

  getSessionId(): string;
  setSessionId(value: string): UserItinerary;

  getTitle(): string;
  setTitle(value: string): UserItinerary;

  getDescription(): string;
  setDescription(value: string): UserItinerary;

  getMarkdownContent(): string;
  setMarkdownContent(value: string): UserItinerary;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserItinerary;
  hasCreatedAt(): boolean;
  clearCreatedAt(): UserItinerary;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserItinerary;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserItinerary;

  getTagsList(): Array<Tags>;
  setTagsList(value: Array<Tags>): UserItinerary;
  clearTagsList(): UserItinerary;
  addTags(value?: Tags, index?: number): Tags;

  getEstimatedRepeatedDays(): string;
  setEstimatedRepeatedDays(value: string): UserItinerary;

  getEstimatedCostLevel11(): number;
  setEstimatedCostLevel11(value: number): UserItinerary;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): UserItinerary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserItinerary.AsObject;
  static toObject(includeInstance: boolean, msg: UserItinerary): UserItinerary.AsObject;
  static serializeBinaryToWriter(message: UserItinerary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserItinerary;
  static deserializeBinaryFromReader(message: UserItinerary, reader: jspb.BinaryReader): UserItinerary;
}

export namespace UserItinerary {
  export type AsObject = {
    id: string,
    userId: string,
    sessionId: string,
    title: string,
    description: string,
    markdownContent: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    tagsList: Array<Tags.AsObject>,
    estimatedRepeatedDays: string,
    estimatedCostLevel11: number,
    isPublic: boolean,
  }
}

export class Tags extends jspb.Message {
  getId(): string;
  setId(value: string): Tags;

  getUserId(): string;
  setUserId(value: string): Tags;

  getName(): string;
  setName(value: string): Tags;

  getTagType(): string;
  setTagType(value: string): Tags;

  getDescription(): string;
  setDescription(value: string): Tags;

  getSource(): string;
  setSource(value: string): Tags;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Tags;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Tags;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Tags;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Tags;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tags.AsObject;
  static toObject(includeInstance: boolean, msg: Tags): Tags.AsObject;
  static serializeBinaryToWriter(message: Tags, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tags;
  static deserializeBinaryFromReader(message: Tags, reader: jspb.BinaryReader): Tags;
}

export namespace Tags {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    tagType: string,
    description: string,
    source: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GenerateEmbeddingsRequest extends jspb.Message {
  getBatchSize(): number;
  setBatchSize(value: number): GenerateEmbeddingsRequest;

  getForceRegenerate(): boolean;
  setForceRegenerate(value: boolean): GenerateEmbeddingsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GenerateEmbeddingsRequest;
  hasRequest(): boolean;
  clearRequest(): GenerateEmbeddingsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateEmbeddingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateEmbeddingsRequest): GenerateEmbeddingsRequest.AsObject;
  static serializeBinaryToWriter(message: GenerateEmbeddingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateEmbeddingsRequest;
  static deserializeBinaryFromReader(message: GenerateEmbeddingsRequest, reader: jspb.BinaryReader): GenerateEmbeddingsRequest;
}

export namespace GenerateEmbeddingsRequest {
  export type AsObject = {
    batchSize: number,
    forceRegenerate: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GenerateEmbeddingsResponse extends jspb.Message {
  getProcessedCount(): number;
  setProcessedCount(value: number): GenerateEmbeddingsResponse;

  getUpdatedCount(): number;
  setUpdatedCount(value: number): GenerateEmbeddingsResponse;

  getStatus(): string;
  setStatus(value: string): GenerateEmbeddingsResponse;

  getErrorsList(): Array<string>;
  setErrorsList(value: Array<string>): GenerateEmbeddingsResponse;
  clearErrorsList(): GenerateEmbeddingsResponse;
  addErrors(value: string, index?: number): GenerateEmbeddingsResponse;

  getMessage(): string;
  setMessage(value: string): GenerateEmbeddingsResponse;

  getSuccess(): boolean;
  setSuccess(value: boolean): GenerateEmbeddingsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GenerateEmbeddingsResponse;
  hasResponse(): boolean;
  clearResponse(): GenerateEmbeddingsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GenerateEmbeddingsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GenerateEmbeddingsResponse): GenerateEmbeddingsResponse.AsObject;
  static serializeBinaryToWriter(message: GenerateEmbeddingsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GenerateEmbeddingsResponse;
  static deserializeBinaryFromReader(message: GenerateEmbeddingsResponse, reader: jspb.BinaryReader): GenerateEmbeddingsResponse;
}

export namespace GenerateEmbeddingsResponse {
  export type AsObject = {
    processedCount: number,
    updatedCount: number,
    status: string,
    errorsList: Array<string>,
    message: string,
    success: boolean,
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

