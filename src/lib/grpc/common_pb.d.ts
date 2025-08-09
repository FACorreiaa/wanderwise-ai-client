import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class Response extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): Response;

  getMessage(): string;
  setMessage(value: string): Response;

  getError(): ErrorDetails | undefined;
  setError(value?: ErrorDetails): Response;
  hasError(): boolean;
  clearError(): Response;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): Response;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Response.AsObject;
  static toObject(includeInstance: boolean, msg: Response): Response.AsObject;
  static serializeBinaryToWriter(message: Response, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Response;
  static deserializeBinaryFromReader(message: Response, reader: jspb.BinaryReader): Response;
}

export namespace Response {
  export type AsObject = {
    success: boolean,
    message: string,
    error?: ErrorDetails.AsObject,
    metadataMap: Array<[string, string]>,
  }
}

export class ErrorDetails extends jspb.Message {
  getCode(): string;
  setCode(value: string): ErrorDetails;

  getMessage(): string;
  setMessage(value: string): ErrorDetails;

  getFieldErrorsList(): Array<FieldError>;
  setFieldErrorsList(value: Array<FieldError>): ErrorDetails;
  clearFieldErrorsList(): ErrorDetails;
  addFieldErrors(value?: FieldError, index?: number): FieldError;

  getTraceId(): string;
  setTraceId(value: string): ErrorDetails;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): ErrorDetails;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorDetails.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorDetails): ErrorDetails.AsObject;
  static serializeBinaryToWriter(message: ErrorDetails, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorDetails;
  static deserializeBinaryFromReader(message: ErrorDetails, reader: jspb.BinaryReader): ErrorDetails;
}

export namespace ErrorDetails {
  export type AsObject = {
    code: string,
    message: string,
    fieldErrorsList: Array<FieldError.AsObject>,
    traceId: string,
    detailsMap: Array<[string, string]>,
  }
}

export class FieldError extends jspb.Message {
  getField(): string;
  setField(value: string): FieldError;

  getMessage(): string;
  setMessage(value: string): FieldError;

  getCode(): string;
  setCode(value: string): FieldError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FieldError.AsObject;
  static toObject(includeInstance: boolean, msg: FieldError): FieldError.AsObject;
  static serializeBinaryToWriter(message: FieldError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FieldError;
  static deserializeBinaryFromReader(message: FieldError, reader: jspb.BinaryReader): FieldError;
}

export namespace FieldError {
  export type AsObject = {
    field: string,
    message: string,
    code: string,
  }
}

export class PaginationRequest extends jspb.Message {
  getPage(): number;
  setPage(value: number): PaginationRequest;

  getPageSize(): number;
  setPageSize(value: number): PaginationRequest;

  getOffset(): number;
  setOffset(value: number): PaginationRequest;

  getLimit(): number;
  setLimit(value: number): PaginationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaginationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PaginationRequest): PaginationRequest.AsObject;
  static serializeBinaryToWriter(message: PaginationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaginationRequest;
  static deserializeBinaryFromReader(message: PaginationRequest, reader: jspb.BinaryReader): PaginationRequest;
}

export namespace PaginationRequest {
  export type AsObject = {
    page: number,
    pageSize: number,
    offset: number,
    limit: number,
  }
}

export class PaginationResponse extends jspb.Message {
  getCurrentPage(): number;
  setCurrentPage(value: number): PaginationResponse;

  getPageSize(): number;
  setPageSize(value: number): PaginationResponse;

  getTotalItems(): number;
  setTotalItems(value: number): PaginationResponse;

  getTotalPages(): number;
  setTotalPages(value: number): PaginationResponse;

  getHasNextPage(): boolean;
  setHasNextPage(value: boolean): PaginationResponse;

  getHasPreviousPage(): boolean;
  setHasPreviousPage(value: boolean): PaginationResponse;

  getNextCursor(): string;
  setNextCursor(value: string): PaginationResponse;

  getPreviousCursor(): string;
  setPreviousCursor(value: string): PaginationResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaginationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PaginationResponse): PaginationResponse.AsObject;
  static serializeBinaryToWriter(message: PaginationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaginationResponse;
  static deserializeBinaryFromReader(message: PaginationResponse, reader: jspb.BinaryReader): PaginationResponse;
}

export namespace PaginationResponse {
  export type AsObject = {
    currentPage: number,
    pageSize: number,
    totalItems: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean,
    nextCursor: string,
    previousCursor: string,
  }
}

export class Coordinates extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): Coordinates;

  getLongitude(): number;
  setLongitude(value: number): Coordinates;

  getAltitude(): number;
  setAltitude(value: number): Coordinates;

  getAccuracy(): number;
  setAccuracy(value: number): Coordinates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Coordinates.AsObject;
  static toObject(includeInstance: boolean, msg: Coordinates): Coordinates.AsObject;
  static serializeBinaryToWriter(message: Coordinates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Coordinates;
  static deserializeBinaryFromReader(message: Coordinates, reader: jspb.BinaryReader): Coordinates;
}

export namespace Coordinates {
  export type AsObject = {
    latitude: number,
    longitude: number,
    altitude: number,
    accuracy: number,
  }
}

export class GeoBounds extends jspb.Message {
  getSouthwest(): Coordinates | undefined;
  setSouthwest(value?: Coordinates): GeoBounds;
  hasSouthwest(): boolean;
  clearSouthwest(): GeoBounds;

  getNortheast(): Coordinates | undefined;
  setNortheast(value?: Coordinates): GeoBounds;
  hasNortheast(): boolean;
  clearNortheast(): GeoBounds;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoBounds.AsObject;
  static toObject(includeInstance: boolean, msg: GeoBounds): GeoBounds.AsObject;
  static serializeBinaryToWriter(message: GeoBounds, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoBounds;
  static deserializeBinaryFromReader(message: GeoBounds, reader: jspb.BinaryReader): GeoBounds;
}

export namespace GeoBounds {
  export type AsObject = {
    southwest?: Coordinates.AsObject,
    northeast?: Coordinates.AsObject,
  }
}

export class Address extends jspb.Message {
  getStreet(): string;
  setStreet(value: string): Address;

  getCity(): string;
  setCity(value: string): Address;

  getState(): string;
  setState(value: string): Address;

  getPostalCode(): string;
  setPostalCode(value: string): Address;

  getCountry(): string;
  setCountry(value: string): Address;

  getCountryCode(): string;
  setCountryCode(value: string): Address;

  getFormattedAddress(): string;
  setFormattedAddress(value: string): Address;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Address.AsObject;
  static toObject(includeInstance: boolean, msg: Address): Address.AsObject;
  static serializeBinaryToWriter(message: Address, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Address;
  static deserializeBinaryFromReader(message: Address, reader: jspb.BinaryReader): Address;
}

export namespace Address {
  export type AsObject = {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string,
    countryCode: string,
    formattedAddress: string,
  }
}

export class ContactInfo extends jspb.Message {
  getPhone(): string;
  setPhone(value: string): ContactInfo;

  getEmail(): string;
  setEmail(value: string): ContactInfo;

  getWebsite(): string;
  setWebsite(value: string): ContactInfo;

  getSocialMediaList(): Array<SocialMedia>;
  setSocialMediaList(value: Array<SocialMedia>): ContactInfo;
  clearSocialMediaList(): ContactInfo;
  addSocialMedia(value?: SocialMedia, index?: number): SocialMedia;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ContactInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ContactInfo): ContactInfo.AsObject;
  static serializeBinaryToWriter(message: ContactInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ContactInfo;
  static deserializeBinaryFromReader(message: ContactInfo, reader: jspb.BinaryReader): ContactInfo;
}

export namespace ContactInfo {
  export type AsObject = {
    phone: string,
    email: string,
    website: string,
    socialMediaList: Array<SocialMedia.AsObject>,
  }
}

export class SocialMedia extends jspb.Message {
  getPlatform(): string;
  setPlatform(value: string): SocialMedia;

  getUrl(): string;
  setUrl(value: string): SocialMedia;

  getHandle(): string;
  setHandle(value: string): SocialMedia;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SocialMedia.AsObject;
  static toObject(includeInstance: boolean, msg: SocialMedia): SocialMedia.AsObject;
  static serializeBinaryToWriter(message: SocialMedia, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SocialMedia;
  static deserializeBinaryFromReader(message: SocialMedia, reader: jspb.BinaryReader): SocialMedia;
}

export namespace SocialMedia {
  export type AsObject = {
    platform: string,
    url: string,
    handle: string,
  }
}

export class OpeningHours extends jspb.Message {
  getScheduleList(): Array<DaySchedule>;
  setScheduleList(value: Array<DaySchedule>): OpeningHours;
  clearScheduleList(): OpeningHours;
  addSchedule(value?: DaySchedule, index?: number): DaySchedule;

  getTimezone(): string;
  setTimezone(value: string): OpeningHours;

  getSpecialHoursList(): Array<SpecialHours>;
  setSpecialHoursList(value: Array<SpecialHours>): OpeningHours;
  clearSpecialHoursList(): OpeningHours;
  addSpecialHours(value?: SpecialHours, index?: number): SpecialHours;

  getIs247(): boolean;
  setIs247(value: boolean): OpeningHours;

  getIsClosed(): boolean;
  setIsClosed(value: boolean): OpeningHours;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpeningHours.AsObject;
  static toObject(includeInstance: boolean, msg: OpeningHours): OpeningHours.AsObject;
  static serializeBinaryToWriter(message: OpeningHours, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpeningHours;
  static deserializeBinaryFromReader(message: OpeningHours, reader: jspb.BinaryReader): OpeningHours;
}

export namespace OpeningHours {
  export type AsObject = {
    scheduleList: Array<DaySchedule.AsObject>,
    timezone: string,
    specialHoursList: Array<SpecialHours.AsObject>,
    is247: boolean,
    isClosed: boolean,
  }
}

export class DaySchedule extends jspb.Message {
  getDay(): DayOfWeek;
  setDay(value: DayOfWeek): DaySchedule;

  getTimeSlotsList(): Array<TimeSlot>;
  setTimeSlotsList(value: Array<TimeSlot>): DaySchedule;
  clearTimeSlotsList(): DaySchedule;
  addTimeSlots(value?: TimeSlot, index?: number): TimeSlot;

  getIsClosed(): boolean;
  setIsClosed(value: boolean): DaySchedule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DaySchedule.AsObject;
  static toObject(includeInstance: boolean, msg: DaySchedule): DaySchedule.AsObject;
  static serializeBinaryToWriter(message: DaySchedule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DaySchedule;
  static deserializeBinaryFromReader(message: DaySchedule, reader: jspb.BinaryReader): DaySchedule;
}

export namespace DaySchedule {
  export type AsObject = {
    day: DayOfWeek,
    timeSlotsList: Array<TimeSlot.AsObject>,
    isClosed: boolean,
  }
}

export class TimeSlot extends jspb.Message {
  getOpenTime(): string;
  setOpenTime(value: string): TimeSlot;

  getCloseTime(): string;
  setCloseTime(value: string): TimeSlot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeSlot.AsObject;
  static toObject(includeInstance: boolean, msg: TimeSlot): TimeSlot.AsObject;
  static serializeBinaryToWriter(message: TimeSlot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeSlot;
  static deserializeBinaryFromReader(message: TimeSlot, reader: jspb.BinaryReader): TimeSlot;
}

export namespace TimeSlot {
  export type AsObject = {
    openTime: string,
    closeTime: string,
  }
}

export class SpecialHours extends jspb.Message {
  getDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDate(value?: google_protobuf_timestamp_pb.Timestamp): SpecialHours;
  hasDate(): boolean;
  clearDate(): SpecialHours;

  getDescription(): string;
  setDescription(value: string): SpecialHours;

  getTimeSlotsList(): Array<TimeSlot>;
  setTimeSlotsList(value: Array<TimeSlot>): SpecialHours;
  clearTimeSlotsList(): SpecialHours;
  addTimeSlots(value?: TimeSlot, index?: number): TimeSlot;

  getIsClosed(): boolean;
  setIsClosed(value: boolean): SpecialHours;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SpecialHours.AsObject;
  static toObject(includeInstance: boolean, msg: SpecialHours): SpecialHours.AsObject;
  static serializeBinaryToWriter(message: SpecialHours, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SpecialHours;
  static deserializeBinaryFromReader(message: SpecialHours, reader: jspb.BinaryReader): SpecialHours;
}

export namespace SpecialHours {
  export type AsObject = {
    date?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    description: string,
    timeSlotsList: Array<TimeSlot.AsObject>,
    isClosed: boolean,
  }
}

export class Rating extends jspb.Message {
  getAverage(): number;
  setAverage(value: number): Rating;

  getCount(): number;
  setCount(value: number): Rating;

  getBreakdown(): RatingBreakdown | undefined;
  setBreakdown(value?: RatingBreakdown): Rating;
  hasBreakdown(): boolean;
  clearBreakdown(): Rating;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Rating.AsObject;
  static toObject(includeInstance: boolean, msg: Rating): Rating.AsObject;
  static serializeBinaryToWriter(message: Rating, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Rating;
  static deserializeBinaryFromReader(message: Rating, reader: jspb.BinaryReader): Rating;
}

export namespace Rating {
  export type AsObject = {
    average: number,
    count: number,
    breakdown?: RatingBreakdown.AsObject,
  }
}

export class RatingBreakdown extends jspb.Message {
  getFiveStar(): number;
  setFiveStar(value: number): RatingBreakdown;

  getFourStar(): number;
  setFourStar(value: number): RatingBreakdown;

  getThreeStar(): number;
  setThreeStar(value: number): RatingBreakdown;

  getTwoStar(): number;
  setTwoStar(value: number): RatingBreakdown;

  getOneStar(): number;
  setOneStar(value: number): RatingBreakdown;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RatingBreakdown.AsObject;
  static toObject(includeInstance: boolean, msg: RatingBreakdown): RatingBreakdown.AsObject;
  static serializeBinaryToWriter(message: RatingBreakdown, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RatingBreakdown;
  static deserializeBinaryFromReader(message: RatingBreakdown, reader: jspb.BinaryReader): RatingBreakdown;
}

export namespace RatingBreakdown {
  export type AsObject = {
    fiveStar: number,
    fourStar: number,
    threeStar: number,
    twoStar: number,
    oneStar: number,
  }
}

export class Media extends jspb.Message {
  getPhotosList(): Array<Photo>;
  setPhotosList(value: Array<Photo>): Media;
  clearPhotosList(): Media;
  addPhotos(value?: Photo, index?: number): Photo;

  getVideosList(): Array<Video>;
  setVideosList(value: Array<Video>): Media;
  clearVideosList(): Media;
  addVideos(value?: Video, index?: number): Video;

  getVirtualToursList(): Array<VirtualTour>;
  setVirtualToursList(value: Array<VirtualTour>): Media;
  clearVirtualToursList(): Media;
  addVirtualTours(value?: VirtualTour, index?: number): VirtualTour;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Media.AsObject;
  static toObject(includeInstance: boolean, msg: Media): Media.AsObject;
  static serializeBinaryToWriter(message: Media, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Media;
  static deserializeBinaryFromReader(message: Media, reader: jspb.BinaryReader): Media;
}

export namespace Media {
  export type AsObject = {
    photosList: Array<Photo.AsObject>,
    videosList: Array<Video.AsObject>,
    virtualToursList: Array<VirtualTour.AsObject>,
  }
}

export class Photo extends jspb.Message {
  getId(): string;
  setId(value: string): Photo;

  getUrl(): string;
  setUrl(value: string): Photo;

  getThumbnailUrl(): string;
  setThumbnailUrl(value: string): Photo;

  getCaption(): string;
  setCaption(value: string): Photo;

  getAltText(): string;
  setAltText(value: string): Photo;

  getWidth(): number;
  setWidth(value: number): Photo;

  getHeight(): number;
  setHeight(value: number): Photo;

  getPhotographer(): string;
  setPhotographer(value: string): Photo;

  getTakenAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTakenAt(value?: google_protobuf_timestamp_pb.Timestamp): Photo;
  hasTakenAt(): boolean;
  clearTakenAt(): Photo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Photo.AsObject;
  static toObject(includeInstance: boolean, msg: Photo): Photo.AsObject;
  static serializeBinaryToWriter(message: Photo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Photo;
  static deserializeBinaryFromReader(message: Photo, reader: jspb.BinaryReader): Photo;
}

export namespace Photo {
  export type AsObject = {
    id: string,
    url: string,
    thumbnailUrl: string,
    caption: string,
    altText: string,
    width: number,
    height: number,
    photographer: string,
    takenAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Video extends jspb.Message {
  getId(): string;
  setId(value: string): Video;

  getUrl(): string;
  setUrl(value: string): Video;

  getThumbnailUrl(): string;
  setThumbnailUrl(value: string): Video;

  getTitle(): string;
  setTitle(value: string): Video;

  getDescription(): string;
  setDescription(value: string): Video;

  getDurationSeconds(): number;
  setDurationSeconds(value: number): Video;

  getProvider(): string;
  setProvider(value: string): Video;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Video.AsObject;
  static toObject(includeInstance: boolean, msg: Video): Video.AsObject;
  static serializeBinaryToWriter(message: Video, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Video;
  static deserializeBinaryFromReader(message: Video, reader: jspb.BinaryReader): Video;
}

export namespace Video {
  export type AsObject = {
    id: string,
    url: string,
    thumbnailUrl: string,
    title: string,
    description: string,
    durationSeconds: number,
    provider: string,
  }
}

export class VirtualTour extends jspb.Message {
  getId(): string;
  setId(value: string): VirtualTour;

  getUrl(): string;
  setUrl(value: string): VirtualTour;

  getTitle(): string;
  setTitle(value: string): VirtualTour;

  getProvider(): string;
  setProvider(value: string): VirtualTour;

  getPreviewImageUrl(): string;
  setPreviewImageUrl(value: string): VirtualTour;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VirtualTour.AsObject;
  static toObject(includeInstance: boolean, msg: VirtualTour): VirtualTour.AsObject;
  static serializeBinaryToWriter(message: VirtualTour, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VirtualTour;
  static deserializeBinaryFromReader(message: VirtualTour, reader: jspb.BinaryReader): VirtualTour;
}

export namespace VirtualTour {
  export type AsObject = {
    id: string,
    url: string,
    title: string,
    provider: string,
    previewImageUrl: string,
  }
}

export class SortOptions extends jspb.Message {
  getField(): string;
  setField(value: string): SortOptions;

  getDirection(): SortDirection;
  setDirection(value: SortDirection): SortOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SortOptions.AsObject;
  static toObject(includeInstance: boolean, msg: SortOptions): SortOptions.AsObject;
  static serializeBinaryToWriter(message: SortOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SortOptions;
  static deserializeBinaryFromReader(message: SortOptions, reader: jspb.BinaryReader): SortOptions;
}

export namespace SortOptions {
  export type AsObject = {
    field: string,
    direction: SortDirection,
  }
}

export class FilterOptions extends jspb.Message {
  getCategoriesList(): Array<string>;
  setCategoriesList(value: Array<string>): FilterOptions;
  clearCategoriesList(): FilterOptions;
  addCategories(value: string, index?: number): FilterOptions;

  getPriceRangesList(): Array<PriceRange>;
  setPriceRangesList(value: Array<PriceRange>): FilterOptions;
  clearPriceRangesList(): FilterOptions;
  addPriceRanges(value: PriceRange, index?: number): FilterOptions;

  getMinRating(): number;
  setMinRating(value: number): FilterOptions;

  getMaxDistanceMeters(): number;
  setMaxDistanceMeters(value: number): FilterOptions;

  getOpenNow(): boolean;
  setOpenNow(value: boolean): FilterOptions;

  getAmenitiesList(): Array<string>;
  setAmenitiesList(value: Array<string>): FilterOptions;
  clearAmenitiesList(): FilterOptions;
  addAmenities(value: string, index?: number): FilterOptions;

  getCustomFiltersMap(): jspb.Map<string, string>;
  clearCustomFiltersMap(): FilterOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterOptions.AsObject;
  static toObject(includeInstance: boolean, msg: FilterOptions): FilterOptions.AsObject;
  static serializeBinaryToWriter(message: FilterOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterOptions;
  static deserializeBinaryFromReader(message: FilterOptions, reader: jspb.BinaryReader): FilterOptions;
}

export namespace FilterOptions {
  export type AsObject = {
    categoriesList: Array<string>,
    priceRangesList: Array<PriceRange>,
    minRating: number,
    maxDistanceMeters: number,
    openNow: boolean,
    amenitiesList: Array<string>,
    customFiltersMap: Array<[string, string]>,
  }
}

export class LocalizedString extends jspb.Message {
  getLanguageCode(): string;
  setLanguageCode(value: string): LocalizedString;

  getText(): string;
  setText(value: string): LocalizedString;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LocalizedString.AsObject;
  static toObject(includeInstance: boolean, msg: LocalizedString): LocalizedString.AsObject;
  static serializeBinaryToWriter(message: LocalizedString, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LocalizedString;
  static deserializeBinaryFromReader(message: LocalizedString, reader: jspb.BinaryReader): LocalizedString;
}

export namespace LocalizedString {
  export type AsObject = {
    languageCode: string,
    text: string,
  }
}

export class MultilingualText extends jspb.Message {
  getTranslationsList(): Array<LocalizedString>;
  setTranslationsList(value: Array<LocalizedString>): MultilingualText;
  clearTranslationsList(): MultilingualText;
  addTranslations(value?: LocalizedString, index?: number): LocalizedString;

  getDefaultLanguage(): string;
  setDefaultLanguage(value: string): MultilingualText;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MultilingualText.AsObject;
  static toObject(includeInstance: boolean, msg: MultilingualText): MultilingualText.AsObject;
  static serializeBinaryToWriter(message: MultilingualText, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MultilingualText;
  static deserializeBinaryFromReader(message: MultilingualText, reader: jspb.BinaryReader): MultilingualText;
}

export namespace MultilingualText {
  export type AsObject = {
    translationsList: Array<LocalizedString.AsObject>,
    defaultLanguage: string,
  }
}

export class AuditInfo extends jspb.Message {
  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): AuditInfo;
  hasCreatedAt(): boolean;
  clearCreatedAt(): AuditInfo;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): AuditInfo;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): AuditInfo;

  getCreatedBy(): string;
  setCreatedBy(value: string): AuditInfo;

  getUpdatedBy(): string;
  setUpdatedBy(value: string): AuditInfo;

  getVersion(): number;
  setVersion(value: number): AuditInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AuditInfo.AsObject;
  static toObject(includeInstance: boolean, msg: AuditInfo): AuditInfo.AsObject;
  static serializeBinaryToWriter(message: AuditInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AuditInfo;
  static deserializeBinaryFromReader(message: AuditInfo, reader: jspb.BinaryReader): AuditInfo;
}

export namespace AuditInfo {
  export type AsObject = {
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    createdBy: string,
    updatedBy: string,
    version: number,
  }
}

export class HealthCheckRequest extends jspb.Message {
  getService(): string;
  setService(value: string): HealthCheckRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): HealthCheckRequest;
  hasRequest(): boolean;
  clearRequest(): HealthCheckRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthCheckRequest.AsObject;
  static toObject(includeInstance: boolean, msg: HealthCheckRequest): HealthCheckRequest.AsObject;
  static serializeBinaryToWriter(message: HealthCheckRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthCheckRequest;
  static deserializeBinaryFromReader(message: HealthCheckRequest, reader: jspb.BinaryReader): HealthCheckRequest;
}

export namespace HealthCheckRequest {
  export type AsObject = {
    service: string,
    request?: BaseRequest.AsObject,
  }
}

export class HealthCheckResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): HealthCheckResponse;

  getVersion(): string;
  setVersion(value: string): HealthCheckResponse;

  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): HealthCheckResponse;
  hasTimestamp(): boolean;
  clearTimestamp(): HealthCheckResponse;

  getComponentsMap(): jspb.Map<string, ComponentHealth>;
  clearComponentsMap(): HealthCheckResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): HealthCheckResponse;
  hasResponse(): boolean;
  clearResponse(): HealthCheckResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HealthCheckResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HealthCheckResponse): HealthCheckResponse.AsObject;
  static serializeBinaryToWriter(message: HealthCheckResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HealthCheckResponse;
  static deserializeBinaryFromReader(message: HealthCheckResponse, reader: jspb.BinaryReader): HealthCheckResponse;
}

export namespace HealthCheckResponse {
  export type AsObject = {
    status: string,
    version: string,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    componentsMap: Array<[string, ComponentHealth.AsObject]>,
    response?: BaseResponse.AsObject,
  }
}

export class ComponentHealth extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): ComponentHealth;

  getMessage(): string;
  setMessage(value: string): ComponentHealth;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): ComponentHealth;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ComponentHealth.AsObject;
  static toObject(includeInstance: boolean, msg: ComponentHealth): ComponentHealth.AsObject;
  static serializeBinaryToWriter(message: ComponentHealth, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ComponentHealth;
  static deserializeBinaryFromReader(message: ComponentHealth, reader: jspb.BinaryReader): ComponentHealth;
}

export namespace ComponentHealth {
  export type AsObject = {
    status: string,
    message: string,
    detailsMap: Array<[string, string]>,
  }
}

export class FeatureFlag extends jspb.Message {
  getName(): string;
  setName(value: string): FeatureFlag;

  getEnabled(): boolean;
  setEnabled(value: boolean): FeatureFlag;

  getDescription(): string;
  setDescription(value: string): FeatureFlag;

  getParametersMap(): jspb.Map<string, string>;
  clearParametersMap(): FeatureFlag;

  getUserSegmentsList(): Array<string>;
  setUserSegmentsList(value: Array<string>): FeatureFlag;
  clearUserSegmentsList(): FeatureFlag;
  addUserSegments(value: string, index?: number): FeatureFlag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeatureFlag.AsObject;
  static toObject(includeInstance: boolean, msg: FeatureFlag): FeatureFlag.AsObject;
  static serializeBinaryToWriter(message: FeatureFlag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeatureFlag;
  static deserializeBinaryFromReader(message: FeatureFlag, reader: jspb.BinaryReader): FeatureFlag;
}

export namespace FeatureFlag {
  export type AsObject = {
    name: string,
    enabled: boolean,
    description: string,
    parametersMap: Array<[string, string]>,
    userSegmentsList: Array<string>,
  }
}

export class ApiVersion extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): ApiVersion;

  getDeprecated(): boolean;
  setDeprecated(value: boolean): ApiVersion;

  getSunsetDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setSunsetDate(value?: google_protobuf_timestamp_pb.Timestamp): ApiVersion;
  hasSunsetDate(): boolean;
  clearSunsetDate(): ApiVersion;

  getMigrationGuideUrl(): string;
  setMigrationGuideUrl(value: string): ApiVersion;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ApiVersion.AsObject;
  static toObject(includeInstance: boolean, msg: ApiVersion): ApiVersion.AsObject;
  static serializeBinaryToWriter(message: ApiVersion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ApiVersion;
  static deserializeBinaryFromReader(message: ApiVersion, reader: jspb.BinaryReader): ApiVersion;
}

export namespace ApiVersion {
  export type AsObject = {
    version: string,
    deprecated: boolean,
    sunsetDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    migrationGuideUrl: string,
  }
}

export class RateLimitInfo extends jspb.Message {
  getRequestsRemaining(): number;
  setRequestsRemaining(value: number): RateLimitInfo;

  getRequestsLimit(): number;
  setRequestsLimit(value: number): RateLimitInfo;

  getResetTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setResetTime(value?: google_protobuf_timestamp_pb.Timestamp): RateLimitInfo;
  hasResetTime(): boolean;
  clearResetTime(): RateLimitInfo;

  getRetryAfterSeconds(): number;
  setRetryAfterSeconds(value: number): RateLimitInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RateLimitInfo.AsObject;
  static toObject(includeInstance: boolean, msg: RateLimitInfo): RateLimitInfo.AsObject;
  static serializeBinaryToWriter(message: RateLimitInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RateLimitInfo;
  static deserializeBinaryFromReader(message: RateLimitInfo, reader: jspb.BinaryReader): RateLimitInfo;
}

export namespace RateLimitInfo {
  export type AsObject = {
    requestsRemaining: number,
    requestsLimit: number,
    resetTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    retryAfterSeconds: number,
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

export enum DayOfWeek { 
  DAY_OF_WEEK_UNSPECIFIED = 0,
  DAY_OF_WEEK_MONDAY = 1,
  DAY_OF_WEEK_TUESDAY = 2,
  DAY_OF_WEEK_WEDNESDAY = 3,
  DAY_OF_WEEK_THURSDAY = 4,
  DAY_OF_WEEK_FRIDAY = 5,
  DAY_OF_WEEK_SATURDAY = 6,
  DAY_OF_WEEK_SUNDAY = 7,
}
export enum PriceRange { 
  PRICE_RANGE_UNSPECIFIED = 0,
  PRICE_RANGE_FREE = 1,
  PRICE_RANGE_BUDGET = 2,
  PRICE_RANGE_MODERATE = 3,
  PRICE_RANGE_EXPENSIVE = 4,
  PRICE_RANGE_LUXURY = 5,
}
export enum SortDirection { 
  SORT_DIRECTION_UNSPECIFIED = 0,
  SORT_DIRECTION_ASC = 1,
  SORT_DIRECTION_DESC = 2,
}
