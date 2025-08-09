import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class List extends jspb.Message {
  getId(): string;
  setId(value: string): List;

  getUserId(): string;
  setUserId(value: string): List;

  getName(): string;
  setName(value: string): List;

  getDescription(): string;
  setDescription(value: string): List;

  getImageUrl(): string;
  setImageUrl(value: string): List;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): List;

  getIsItinerary(): boolean;
  setIsItinerary(value: boolean): List;

  getParentListId(): string;
  setParentListId(value: string): List;

  getCityId(): string;
  setCityId(value: string): List;

  getViewCount(): number;
  setViewCount(value: number): List;

  getSaveCount(): number;
  setSaveCount(value: number): List;

  getItemCount(): number;
  setItemCount(value: number): List;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): List;
  hasCreatedAt(): boolean;
  clearCreatedAt(): List;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): List;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): List;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): List.AsObject;
  static toObject(includeInstance: boolean, msg: List): List.AsObject;
  static serializeBinaryToWriter(message: List, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): List;
  static deserializeBinaryFromReader(message: List, reader: jspb.BinaryReader): List;
}

export namespace List {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    description: string,
    imageUrl: string,
    isPublic: boolean,
    isItinerary: boolean,
    parentListId: string,
    cityId: string,
    viewCount: number,
    saveCount: number,
    itemCount: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ListItem extends jspb.Message {
  getListId(): string;
  setListId(value: string): ListItem;

  getItemId(): string;
  setItemId(value: string): ListItem;

  getPoiId(): string;
  setPoiId(value: string): ListItem;

  getContentType(): ContentType;
  setContentType(value: ContentType): ListItem;

  getPosition(): number;
  setPosition(value: number): ListItem;

  getNotes(): string;
  setNotes(value: string): ListItem;

  getDayNumber(): number;
  setDayNumber(value: number): ListItem;

  getTimeSlot(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimeSlot(value?: google_protobuf_timestamp_pb.Timestamp): ListItem;
  hasTimeSlot(): boolean;
  clearTimeSlot(): ListItem;

  getDuration(): number;
  setDuration(value: number): ListItem;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ListItem;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ListItem;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ListItem;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): ListItem;

  getSourceLlmInteractionId(): string;
  setSourceLlmInteractionId(value: string): ListItem;

  getItemAiDescription(): string;
  setItemAiDescription(value: string): ListItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListItem.AsObject;
  static toObject(includeInstance: boolean, msg: ListItem): ListItem.AsObject;
  static serializeBinaryToWriter(message: ListItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListItem;
  static deserializeBinaryFromReader(message: ListItem, reader: jspb.BinaryReader): ListItem;
}

export namespace ListItem {
  export type AsObject = {
    listId: string,
    itemId: string,
    poiId: string,
    contentType: ContentType,
    position: number,
    notes: string,
    dayNumber: number,
    timeSlot?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    duration: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    sourceLlmInteractionId: string,
    itemAiDescription: string,
  }
}

export class ListWithItems extends jspb.Message {
  getList(): List | undefined;
  setList(value?: List): ListWithItems;
  hasList(): boolean;
  clearList(): ListWithItems;

  getItemsList(): Array<ListItem>;
  setItemsList(value: Array<ListItem>): ListWithItems;
  clearItemsList(): ListWithItems;
  addItems(value?: ListItem, index?: number): ListItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWithItems.AsObject;
  static toObject(includeInstance: boolean, msg: ListWithItems): ListWithItems.AsObject;
  static serializeBinaryToWriter(message: ListWithItems, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWithItems;
  static deserializeBinaryFromReader(message: ListWithItems, reader: jspb.BinaryReader): ListWithItems;
}

export namespace ListWithItems {
  export type AsObject = {
    list?: List.AsObject,
    itemsList: Array<ListItem.AsObject>,
  }
}

export class ListItemWithContent extends jspb.Message {
  getListItem(): ListItem | undefined;
  setListItem(value?: ListItem): ListItemWithContent;
  hasListItem(): boolean;
  clearListItem(): ListItemWithContent;

  getPoi(): POIDetailedInfo | undefined;
  setPoi(value?: POIDetailedInfo): ListItemWithContent;
  hasPoi(): boolean;
  clearPoi(): ListItemWithContent;

  getRestaurant(): RestaurantDetailedInfo | undefined;
  setRestaurant(value?: RestaurantDetailedInfo): ListItemWithContent;
  hasRestaurant(): boolean;
  clearRestaurant(): ListItemWithContent;

  getHotel(): HotelDetailedInfo | undefined;
  setHotel(value?: HotelDetailedInfo): ListItemWithContent;
  hasHotel(): boolean;
  clearHotel(): ListItemWithContent;

  getItinerary(): UserSavedItinerary | undefined;
  setItinerary(value?: UserSavedItinerary): ListItemWithContent;
  hasItinerary(): boolean;
  clearItinerary(): ListItemWithContent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListItemWithContent.AsObject;
  static toObject(includeInstance: boolean, msg: ListItemWithContent): ListItemWithContent.AsObject;
  static serializeBinaryToWriter(message: ListItemWithContent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListItemWithContent;
  static deserializeBinaryFromReader(message: ListItemWithContent, reader: jspb.BinaryReader): ListItemWithContent;
}

export namespace ListItemWithContent {
  export type AsObject = {
    listItem?: ListItem.AsObject,
    poi?: POIDetailedInfo.AsObject,
    restaurant?: RestaurantDetailedInfo.AsObject,
    hotel?: HotelDetailedInfo.AsObject,
    itinerary?: UserSavedItinerary.AsObject,
  }
}

export class ListWithDetailedItems extends jspb.Message {
  getList(): List | undefined;
  setList(value?: List): ListWithDetailedItems;
  hasList(): boolean;
  clearList(): ListWithDetailedItems;

  getItemsList(): Array<ListItemWithContent>;
  setItemsList(value: Array<ListItemWithContent>): ListWithDetailedItems;
  clearItemsList(): ListWithDetailedItems;
  addItems(value?: ListItemWithContent, index?: number): ListItemWithContent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListWithDetailedItems.AsObject;
  static toObject(includeInstance: boolean, msg: ListWithDetailedItems): ListWithDetailedItems.AsObject;
  static serializeBinaryToWriter(message: ListWithDetailedItems, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListWithDetailedItems;
  static deserializeBinaryFromReader(message: ListWithDetailedItems, reader: jspb.BinaryReader): ListWithDetailedItems;
}

export namespace ListWithDetailedItems {
  export type AsObject = {
    list?: List.AsObject,
    itemsList: Array<ListItemWithContent.AsObject>,
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

export class CreateListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateListRequest;

  getName(): string;
  setName(value: string): CreateListRequest;

  getDescription(): string;
  setDescription(value: string): CreateListRequest;

  getCityId(): string;
  setCityId(value: string): CreateListRequest;

  getIsItinerary(): boolean;
  setIsItinerary(value: boolean): CreateListRequest;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): CreateListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateListRequest;
  hasRequest(): boolean;
  clearRequest(): CreateListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateListRequest): CreateListRequest.AsObject;
  static serializeBinaryToWriter(message: CreateListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateListRequest;
  static deserializeBinaryFromReader(message: CreateListRequest, reader: jspb.BinaryReader): CreateListRequest;
}

export namespace CreateListRequest {
  export type AsObject = {
    userId: string,
    name: string,
    description: string,
    cityId: string,
    isItinerary: boolean,
    isPublic: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class CreateListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateListResponse;

  getMessage(): string;
  setMessage(value: string): CreateListResponse;

  getList(): List | undefined;
  setList(value?: List): CreateListResponse;
  hasList(): boolean;
  clearList(): CreateListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateListResponse;
  hasResponse(): boolean;
  clearResponse(): CreateListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateListResponse): CreateListResponse.AsObject;
  static serializeBinaryToWriter(message: CreateListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateListResponse;
  static deserializeBinaryFromReader(message: CreateListResponse, reader: jspb.BinaryReader): CreateListResponse;
}

export namespace CreateListResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    list?: List.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class GetListsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListsRequest;

  getLimit(): number;
  setLimit(value: number): GetListsRequest;

  getOffset(): number;
  setOffset(value: number): GetListsRequest;

  getIncludeItems(): boolean;
  setIncludeItems(value: boolean): GetListsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListsRequest;
  hasRequest(): boolean;
  clearRequest(): GetListsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListsRequest): GetListsRequest.AsObject;
  static serializeBinaryToWriter(message: GetListsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListsRequest;
  static deserializeBinaryFromReader(message: GetListsRequest, reader: jspb.BinaryReader): GetListsRequest;
}

export namespace GetListsRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    offset: number,
    includeItems: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetListsResponse extends jspb.Message {
  getListsList(): Array<ListWithItems>;
  setListsList(value: Array<ListWithItems>): GetListsResponse;
  clearListsList(): GetListsResponse;
  addLists(value?: ListWithItems, index?: number): ListWithItems;

  getTotalCount(): number;
  setTotalCount(value: number): GetListsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListsResponse;
  hasResponse(): boolean;
  clearResponse(): GetListsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListsResponse): GetListsResponse.AsObject;
  static serializeBinaryToWriter(message: GetListsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListsResponse;
  static deserializeBinaryFromReader(message: GetListsResponse, reader: jspb.BinaryReader): GetListsResponse;
}

export namespace GetListsResponse {
  export type AsObject = {
    listsList: Array<ListWithItems.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class GetListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListRequest;

  getListId(): string;
  setListId(value: string): GetListRequest;

  getIncludeDetailedItems(): boolean;
  setIncludeDetailedItems(value: boolean): GetListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListRequest;
  hasRequest(): boolean;
  clearRequest(): GetListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListRequest): GetListRequest.AsObject;
  static serializeBinaryToWriter(message: GetListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListRequest;
  static deserializeBinaryFromReader(message: GetListRequest, reader: jspb.BinaryReader): GetListRequest;
}

export namespace GetListRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    includeDetailedItems: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetListResponse extends jspb.Message {
  getList(): ListWithDetailedItems | undefined;
  setList(value?: ListWithDetailedItems): GetListResponse;
  hasList(): boolean;
  clearList(): GetListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListResponse;
  hasResponse(): boolean;
  clearResponse(): GetListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListResponse): GetListResponse.AsObject;
  static serializeBinaryToWriter(message: GetListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListResponse;
  static deserializeBinaryFromReader(message: GetListResponse, reader: jspb.BinaryReader): GetListResponse;
}

export namespace GetListResponse {
  export type AsObject = {
    list?: ListWithDetailedItems.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateListRequest;

  getListId(): string;
  setListId(value: string): UpdateListRequest;

  getName(): string;
  setName(value: string): UpdateListRequest;

  getDescription(): string;
  setDescription(value: string): UpdateListRequest;

  getImageUrl(): string;
  setImageUrl(value: string): UpdateListRequest;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): UpdateListRequest;

  getCityId(): string;
  setCityId(value: string): UpdateListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateListRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateListRequest): UpdateListRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateListRequest;
  static deserializeBinaryFromReader(message: UpdateListRequest, reader: jspb.BinaryReader): UpdateListRequest;
}

export namespace UpdateListRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    name: string,
    description: string,
    imageUrl: string,
    isPublic: boolean,
    cityId: string,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateListResponse;

  getMessage(): string;
  setMessage(value: string): UpdateListResponse;

  getList(): List | undefined;
  setList(value?: List): UpdateListResponse;
  hasList(): boolean;
  clearList(): UpdateListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateListResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateListResponse): UpdateListResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateListResponse;
  static deserializeBinaryFromReader(message: UpdateListResponse, reader: jspb.BinaryReader): UpdateListResponse;
}

export namespace UpdateListResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    list?: List.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteListRequest;

  getListId(): string;
  setListId(value: string): DeleteListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteListRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteListRequest): DeleteListRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteListRequest;
  static deserializeBinaryFromReader(message: DeleteListRequest, reader: jspb.BinaryReader): DeleteListRequest;
}

export namespace DeleteListRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteListResponse;

  getMessage(): string;
  setMessage(value: string): DeleteListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DeleteListResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteListResponse): DeleteListResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteListResponse;
  static deserializeBinaryFromReader(message: DeleteListResponse, reader: jspb.BinaryReader): DeleteListResponse;
}

export namespace DeleteListResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class CreateItineraryRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateItineraryRequest;

  getParentListId(): string;
  setParentListId(value: string): CreateItineraryRequest;

  getName(): string;
  setName(value: string): CreateItineraryRequest;

  getDescription(): string;
  setDescription(value: string): CreateItineraryRequest;

  getIsPublic(): boolean;
  setIsPublic(value: boolean): CreateItineraryRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateItineraryRequest;
  hasRequest(): boolean;
  clearRequest(): CreateItineraryRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateItineraryRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateItineraryRequest): CreateItineraryRequest.AsObject;
  static serializeBinaryToWriter(message: CreateItineraryRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateItineraryRequest;
  static deserializeBinaryFromReader(message: CreateItineraryRequest, reader: jspb.BinaryReader): CreateItineraryRequest;
}

export namespace CreateItineraryRequest {
  export type AsObject = {
    userId: string,
    parentListId: string,
    name: string,
    description: string,
    isPublic: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class CreateItineraryResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateItineraryResponse;

  getMessage(): string;
  setMessage(value: string): CreateItineraryResponse;

  getItinerary(): List | undefined;
  setItinerary(value?: List): CreateItineraryResponse;
  hasItinerary(): boolean;
  clearItinerary(): CreateItineraryResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateItineraryResponse;
  hasResponse(): boolean;
  clearResponse(): CreateItineraryResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateItineraryResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateItineraryResponse): CreateItineraryResponse.AsObject;
  static serializeBinaryToWriter(message: CreateItineraryResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateItineraryResponse;
  static deserializeBinaryFromReader(message: CreateItineraryResponse, reader: jspb.BinaryReader): CreateItineraryResponse;
}

export namespace CreateItineraryResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    itinerary?: List.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class AddListItemRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): AddListItemRequest;

  getListId(): string;
  setListId(value: string): AddListItemRequest;

  getItemId(): string;
  setItemId(value: string): AddListItemRequest;

  getContentType(): ContentType;
  setContentType(value: ContentType): AddListItemRequest;

  getPosition(): number;
  setPosition(value: number): AddListItemRequest;

  getNotes(): string;
  setNotes(value: string): AddListItemRequest;

  getDayNumber(): number;
  setDayNumber(value: number): AddListItemRequest;

  getTimeSlot(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimeSlot(value?: google_protobuf_timestamp_pb.Timestamp): AddListItemRequest;
  hasTimeSlot(): boolean;
  clearTimeSlot(): AddListItemRequest;

  getDurationMinutes(): number;
  setDurationMinutes(value: number): AddListItemRequest;

  getSourceLlmInteractionId(): string;
  setSourceLlmInteractionId(value: string): AddListItemRequest;

  getItemAiDescription(): string;
  setItemAiDescription(value: string): AddListItemRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): AddListItemRequest;
  hasRequest(): boolean;
  clearRequest(): AddListItemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddListItemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddListItemRequest): AddListItemRequest.AsObject;
  static serializeBinaryToWriter(message: AddListItemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddListItemRequest;
  static deserializeBinaryFromReader(message: AddListItemRequest, reader: jspb.BinaryReader): AddListItemRequest;
}

export namespace AddListItemRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    itemId: string,
    contentType: ContentType,
    position: number,
    notes: string,
    dayNumber: number,
    timeSlot?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    durationMinutes: number,
    sourceLlmInteractionId: string,
    itemAiDescription: string,
    request?: BaseRequest.AsObject,
  }
}

export class AddListItemResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): AddListItemResponse;

  getMessage(): string;
  setMessage(value: string): AddListItemResponse;

  getItem(): ListItem | undefined;
  setItem(value?: ListItem): AddListItemResponse;
  hasItem(): boolean;
  clearItem(): AddListItemResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): AddListItemResponse;
  hasResponse(): boolean;
  clearResponse(): AddListItemResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddListItemResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddListItemResponse): AddListItemResponse.AsObject;
  static serializeBinaryToWriter(message: AddListItemResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddListItemResponse;
  static deserializeBinaryFromReader(message: AddListItemResponse, reader: jspb.BinaryReader): AddListItemResponse;
}

export namespace AddListItemResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    item?: ListItem.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateListItemRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateListItemRequest;

  getListId(): string;
  setListId(value: string): UpdateListItemRequest;

  getItemId(): string;
  setItemId(value: string): UpdateListItemRequest;

  getContentType(): ContentType;
  setContentType(value: ContentType): UpdateListItemRequest;

  getPosition(): number;
  setPosition(value: number): UpdateListItemRequest;

  getNotes(): string;
  setNotes(value: string): UpdateListItemRequest;

  getDayNumber(): number;
  setDayNumber(value: number): UpdateListItemRequest;

  getTimeSlot(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimeSlot(value?: google_protobuf_timestamp_pb.Timestamp): UpdateListItemRequest;
  hasTimeSlot(): boolean;
  clearTimeSlot(): UpdateListItemRequest;

  getDurationMinutes(): number;
  setDurationMinutes(value: number): UpdateListItemRequest;

  getSourceLlmInteractionId(): string;
  setSourceLlmInteractionId(value: string): UpdateListItemRequest;

  getItemAiDescription(): string;
  setItemAiDescription(value: string): UpdateListItemRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateListItemRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateListItemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateListItemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateListItemRequest): UpdateListItemRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateListItemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateListItemRequest;
  static deserializeBinaryFromReader(message: UpdateListItemRequest, reader: jspb.BinaryReader): UpdateListItemRequest;
}

export namespace UpdateListItemRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    itemId: string,
    contentType: ContentType,
    position: number,
    notes: string,
    dayNumber: number,
    timeSlot?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    durationMinutes: number,
    sourceLlmInteractionId: string,
    itemAiDescription: string,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateListItemResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateListItemResponse;

  getMessage(): string;
  setMessage(value: string): UpdateListItemResponse;

  getItem(): ListItem | undefined;
  setItem(value?: ListItem): UpdateListItemResponse;
  hasItem(): boolean;
  clearItem(): UpdateListItemResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateListItemResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateListItemResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateListItemResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateListItemResponse): UpdateListItemResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateListItemResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateListItemResponse;
  static deserializeBinaryFromReader(message: UpdateListItemResponse, reader: jspb.BinaryReader): UpdateListItemResponse;
}

export namespace UpdateListItemResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    item?: ListItem.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class RemoveListItemRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): RemoveListItemRequest;

  getListId(): string;
  setListId(value: string): RemoveListItemRequest;

  getItemId(): string;
  setItemId(value: string): RemoveListItemRequest;

  getContentType(): ContentType;
  setContentType(value: ContentType): RemoveListItemRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): RemoveListItemRequest;
  hasRequest(): boolean;
  clearRequest(): RemoveListItemRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveListItemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveListItemRequest): RemoveListItemRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveListItemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveListItemRequest;
  static deserializeBinaryFromReader(message: RemoveListItemRequest, reader: jspb.BinaryReader): RemoveListItemRequest;
}

export namespace RemoveListItemRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    itemId: string,
    contentType: ContentType,
    request?: BaseRequest.AsObject,
  }
}

export class RemoveListItemResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveListItemResponse;

  getMessage(): string;
  setMessage(value: string): RemoveListItemResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): RemoveListItemResponse;
  hasResponse(): boolean;
  clearResponse(): RemoveListItemResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveListItemResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveListItemResponse): RemoveListItemResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveListItemResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveListItemResponse;
  static deserializeBinaryFromReader(message: RemoveListItemResponse, reader: jspb.BinaryReader): RemoveListItemResponse;
}

export namespace RemoveListItemResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetListItemsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListItemsRequest;

  getListId(): string;
  setListId(value: string): GetListItemsRequest;

  getIncludeContentDetails(): boolean;
  setIncludeContentDetails(value: boolean): GetListItemsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListItemsRequest;
  hasRequest(): boolean;
  clearRequest(): GetListItemsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListItemsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListItemsRequest): GetListItemsRequest.AsObject;
  static serializeBinaryToWriter(message: GetListItemsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListItemsRequest;
  static deserializeBinaryFromReader(message: GetListItemsRequest, reader: jspb.BinaryReader): GetListItemsRequest;
}

export namespace GetListItemsRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    includeContentDetails: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetListItemsResponse extends jspb.Message {
  getItemsList(): Array<ListItemWithContent>;
  setItemsList(value: Array<ListItemWithContent>): GetListItemsResponse;
  clearItemsList(): GetListItemsResponse;
  addItems(value?: ListItemWithContent, index?: number): ListItemWithContent;

  getTotalCount(): number;
  setTotalCount(value: number): GetListItemsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListItemsResponse;
  hasResponse(): boolean;
  clearResponse(): GetListItemsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListItemsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListItemsResponse): GetListItemsResponse.AsObject;
  static serializeBinaryToWriter(message: GetListItemsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListItemsResponse;
  static deserializeBinaryFromReader(message: GetListItemsResponse, reader: jspb.BinaryReader): GetListItemsResponse;
}

export namespace GetListItemsResponse {
  export type AsObject = {
    itemsList: Array<ListItemWithContent.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class GetListRestaurantsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListRestaurantsRequest;

  getListId(): string;
  setListId(value: string): GetListRestaurantsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListRestaurantsRequest;
  hasRequest(): boolean;
  clearRequest(): GetListRestaurantsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListRestaurantsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListRestaurantsRequest): GetListRestaurantsRequest.AsObject;
  static serializeBinaryToWriter(message: GetListRestaurantsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListRestaurantsRequest;
  static deserializeBinaryFromReader(message: GetListRestaurantsRequest, reader: jspb.BinaryReader): GetListRestaurantsRequest;
}

export namespace GetListRestaurantsRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetListRestaurantsResponse extends jspb.Message {
  getRestaurantsList(): Array<RestaurantDetailedInfo>;
  setRestaurantsList(value: Array<RestaurantDetailedInfo>): GetListRestaurantsResponse;
  clearRestaurantsList(): GetListRestaurantsResponse;
  addRestaurants(value?: RestaurantDetailedInfo, index?: number): RestaurantDetailedInfo;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListRestaurantsResponse;
  hasResponse(): boolean;
  clearResponse(): GetListRestaurantsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListRestaurantsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListRestaurantsResponse): GetListRestaurantsResponse.AsObject;
  static serializeBinaryToWriter(message: GetListRestaurantsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListRestaurantsResponse;
  static deserializeBinaryFromReader(message: GetListRestaurantsResponse, reader: jspb.BinaryReader): GetListRestaurantsResponse;
}

export namespace GetListRestaurantsResponse {
  export type AsObject = {
    restaurantsList: Array<RestaurantDetailedInfo.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class GetListHotelsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListHotelsRequest;

  getListId(): string;
  setListId(value: string): GetListHotelsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListHotelsRequest;
  hasRequest(): boolean;
  clearRequest(): GetListHotelsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListHotelsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListHotelsRequest): GetListHotelsRequest.AsObject;
  static serializeBinaryToWriter(message: GetListHotelsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListHotelsRequest;
  static deserializeBinaryFromReader(message: GetListHotelsRequest, reader: jspb.BinaryReader): GetListHotelsRequest;
}

export namespace GetListHotelsRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetListHotelsResponse extends jspb.Message {
  getHotelsList(): Array<HotelDetailedInfo>;
  setHotelsList(value: Array<HotelDetailedInfo>): GetListHotelsResponse;
  clearHotelsList(): GetListHotelsResponse;
  addHotels(value?: HotelDetailedInfo, index?: number): HotelDetailedInfo;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListHotelsResponse;
  hasResponse(): boolean;
  clearResponse(): GetListHotelsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListHotelsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListHotelsResponse): GetListHotelsResponse.AsObject;
  static serializeBinaryToWriter(message: GetListHotelsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListHotelsResponse;
  static deserializeBinaryFromReader(message: GetListHotelsResponse, reader: jspb.BinaryReader): GetListHotelsResponse;
}

export namespace GetListHotelsResponse {
  export type AsObject = {
    hotelsList: Array<HotelDetailedInfo.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class GetListItinerariesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetListItinerariesRequest;

  getListId(): string;
  setListId(value: string): GetListItinerariesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetListItinerariesRequest;
  hasRequest(): boolean;
  clearRequest(): GetListItinerariesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListItinerariesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetListItinerariesRequest): GetListItinerariesRequest.AsObject;
  static serializeBinaryToWriter(message: GetListItinerariesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListItinerariesRequest;
  static deserializeBinaryFromReader(message: GetListItinerariesRequest, reader: jspb.BinaryReader): GetListItinerariesRequest;
}

export namespace GetListItinerariesRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetListItinerariesResponse extends jspb.Message {
  getItinerariesList(): Array<UserSavedItinerary>;
  setItinerariesList(value: Array<UserSavedItinerary>): GetListItinerariesResponse;
  clearItinerariesList(): GetListItinerariesResponse;
  addItineraries(value?: UserSavedItinerary, index?: number): UserSavedItinerary;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetListItinerariesResponse;
  hasResponse(): boolean;
  clearResponse(): GetListItinerariesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetListItinerariesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetListItinerariesResponse): GetListItinerariesResponse.AsObject;
  static serializeBinaryToWriter(message: GetListItinerariesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetListItinerariesResponse;
  static deserializeBinaryFromReader(message: GetListItinerariesResponse, reader: jspb.BinaryReader): GetListItinerariesResponse;
}

export namespace GetListItinerariesResponse {
  export type AsObject = {
    itinerariesList: Array<UserSavedItinerary.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class SavePublicListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): SavePublicListRequest;

  getListId(): string;
  setListId(value: string): SavePublicListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SavePublicListRequest;
  hasRequest(): boolean;
  clearRequest(): SavePublicListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SavePublicListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SavePublicListRequest): SavePublicListRequest.AsObject;
  static serializeBinaryToWriter(message: SavePublicListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SavePublicListRequest;
  static deserializeBinaryFromReader(message: SavePublicListRequest, reader: jspb.BinaryReader): SavePublicListRequest;
}

export namespace SavePublicListRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class SavePublicListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SavePublicListResponse;

  getMessage(): string;
  setMessage(value: string): SavePublicListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SavePublicListResponse;
  hasResponse(): boolean;
  clearResponse(): SavePublicListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SavePublicListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SavePublicListResponse): SavePublicListResponse.AsObject;
  static serializeBinaryToWriter(message: SavePublicListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SavePublicListResponse;
  static deserializeBinaryFromReader(message: SavePublicListResponse, reader: jspb.BinaryReader): SavePublicListResponse;
}

export namespace SavePublicListResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class UnsaveListRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UnsaveListRequest;

  getListId(): string;
  setListId(value: string): UnsaveListRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UnsaveListRequest;
  hasRequest(): boolean;
  clearRequest(): UnsaveListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnsaveListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnsaveListRequest): UnsaveListRequest.AsObject;
  static serializeBinaryToWriter(message: UnsaveListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnsaveListRequest;
  static deserializeBinaryFromReader(message: UnsaveListRequest, reader: jspb.BinaryReader): UnsaveListRequest;
}

export namespace UnsaveListRequest {
  export type AsObject = {
    userId: string,
    listId: string,
    request?: BaseRequest.AsObject,
  }
}

export class UnsaveListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UnsaveListResponse;

  getMessage(): string;
  setMessage(value: string): UnsaveListResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UnsaveListResponse;
  hasResponse(): boolean;
  clearResponse(): UnsaveListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnsaveListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UnsaveListResponse): UnsaveListResponse.AsObject;
  static serializeBinaryToWriter(message: UnsaveListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnsaveListResponse;
  static deserializeBinaryFromReader(message: UnsaveListResponse, reader: jspb.BinaryReader): UnsaveListResponse;
}

export namespace UnsaveListResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetSavedListsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetSavedListsRequest;

  getLimit(): number;
  setLimit(value: number): GetSavedListsRequest;

  getOffset(): number;
  setOffset(value: number): GetSavedListsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetSavedListsRequest;
  hasRequest(): boolean;
  clearRequest(): GetSavedListsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSavedListsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSavedListsRequest): GetSavedListsRequest.AsObject;
  static serializeBinaryToWriter(message: GetSavedListsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSavedListsRequest;
  static deserializeBinaryFromReader(message: GetSavedListsRequest, reader: jspb.BinaryReader): GetSavedListsRequest;
}

export namespace GetSavedListsRequest {
  export type AsObject = {
    userId: string,
    limit: number,
    offset: number,
    request?: BaseRequest.AsObject,
  }
}

export class GetSavedListsResponse extends jspb.Message {
  getListsList(): Array<ListWithItems>;
  setListsList(value: Array<ListWithItems>): GetSavedListsResponse;
  clearListsList(): GetSavedListsResponse;
  addLists(value?: ListWithItems, index?: number): ListWithItems;

  getTotalCount(): number;
  setTotalCount(value: number): GetSavedListsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetSavedListsResponse;
  hasResponse(): boolean;
  clearResponse(): GetSavedListsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSavedListsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSavedListsResponse): GetSavedListsResponse.AsObject;
  static serializeBinaryToWriter(message: GetSavedListsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSavedListsResponse;
  static deserializeBinaryFromReader(message: GetSavedListsResponse, reader: jspb.BinaryReader): GetSavedListsResponse;
}

export namespace GetSavedListsResponse {
  export type AsObject = {
    listsList: Array<ListWithItems.AsObject>,
    totalCount: number,
    response?: BaseResponse.AsObject,
  }
}

export class SearchPublicListsRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchPublicListsRequest;

  getCityId(): string;
  setCityId(value: string): SearchPublicListsRequest;

  getCategoriesList(): Array<string>;
  setCategoriesList(value: Array<string>): SearchPublicListsRequest;
  clearCategoriesList(): SearchPublicListsRequest;
  addCategories(value: string, index?: number): SearchPublicListsRequest;

  getLimit(): number;
  setLimit(value: number): SearchPublicListsRequest;

  getOffset(): number;
  setOffset(value: number): SearchPublicListsRequest;

  getSortBy(): string;
  setSortBy(value: string): SearchPublicListsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SearchPublicListsRequest;
  hasRequest(): boolean;
  clearRequest(): SearchPublicListsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPublicListsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPublicListsRequest): SearchPublicListsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchPublicListsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPublicListsRequest;
  static deserializeBinaryFromReader(message: SearchPublicListsRequest, reader: jspb.BinaryReader): SearchPublicListsRequest;
}

export namespace SearchPublicListsRequest {
  export type AsObject = {
    query: string,
    cityId: string,
    categoriesList: Array<string>,
    limit: number,
    offset: number,
    sortBy: string,
    request?: BaseRequest.AsObject,
  }
}

export class SearchPublicListsResponse extends jspb.Message {
  getListsList(): Array<ListWithItems>;
  setListsList(value: Array<ListWithItems>): SearchPublicListsResponse;
  clearListsList(): SearchPublicListsResponse;
  addLists(value?: ListWithItems, index?: number): ListWithItems;

  getTotalCount(): number;
  setTotalCount(value: number): SearchPublicListsResponse;

  getMetadata(): SearchMetadata | undefined;
  setMetadata(value?: SearchMetadata): SearchPublicListsResponse;
  hasMetadata(): boolean;
  clearMetadata(): SearchPublicListsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SearchPublicListsResponse;
  hasResponse(): boolean;
  clearResponse(): SearchPublicListsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPublicListsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPublicListsResponse): SearchPublicListsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchPublicListsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPublicListsResponse;
  static deserializeBinaryFromReader(message: SearchPublicListsResponse, reader: jspb.BinaryReader): SearchPublicListsResponse;
}

export namespace SearchPublicListsResponse {
  export type AsObject = {
    listsList: Array<ListWithItems.AsObject>,
    totalCount: number,
    metadata?: SearchMetadata.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class SearchMetadata extends jspb.Message {
  getQueryTimeMs(): number;
  setQueryTimeMs(value: number): SearchMetadata;

  getSearchMethod(): string;
  setSearchMethod(value: string): SearchMetadata;

  getFiltersAppliedMap(): jspb.Map<string, string>;
  clearFiltersAppliedMap(): SearchMetadata;

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
    filtersAppliedMap: Array<[string, string]>,
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

export enum ContentType { 
  CONTENT_TYPE_UNSPECIFIED = 0,
  CONTENT_TYPE_POI = 1,
  CONTENT_TYPE_RESTAURANT = 2,
  CONTENT_TYPE_HOTEL = 3,
  CONTENT_TYPE_ITINERARY = 4,
}
