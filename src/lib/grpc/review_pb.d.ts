import * as jspb from 'google-protobuf'

import * as common_pb from './common_pb'; // proto import: "common.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class Review extends jspb.Message {
  getId(): string;
  setId(value: string): Review;

  getUserId(): string;
  setUserId(value: string): Review;

  getPoiId(): string;
  setPoiId(value: string): Review;

  getRating(): number;
  setRating(value: number): Review;

  getTitle(): string;
  setTitle(value: string): Review;

  getContent(): string;
  setContent(value: string): Review;

  getPhotosList(): Array<string>;
  setPhotosList(value: Array<string>): Review;
  clearPhotosList(): Review;
  addPhotos(value: string, index?: number): Review;

  getStatus(): ReviewStatus;
  setStatus(value: ReviewStatus): Review;

  getVisitDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setVisitDate(value?: google_protobuf_timestamp_pb.Timestamp): Review;
  hasVisitDate(): boolean;
  clearVisitDate(): Review;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Review;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Review;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Review;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Review;

  getHelpfulCount(): number;
  setHelpfulCount(value: number): Review;

  getReportCount(): number;
  setReportCount(value: number): Review;

  getIsVerified(): boolean;
  setIsVerified(value: boolean): Review;

  getLanguage(): string;
  setLanguage(value: string): Review;

  getAspects(): ReviewAspects | undefined;
  setAspects(value?: ReviewAspects): Review;
  hasAspects(): boolean;
  clearAspects(): Review;

  getReviewer(): ReviewerInfo | undefined;
  setReviewer(value?: ReviewerInfo): Review;
  hasReviewer(): boolean;
  clearReviewer(): Review;

  getBusinessResponse(): BusinessResponse | undefined;
  setBusinessResponse(value?: BusinessResponse): Review;
  hasBusinessResponse(): boolean;
  clearBusinessResponse(): Review;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Review.AsObject;
  static toObject(includeInstance: boolean, msg: Review): Review.AsObject;
  static serializeBinaryToWriter(message: Review, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Review;
  static deserializeBinaryFromReader(message: Review, reader: jspb.BinaryReader): Review;
}

export namespace Review {
  export type AsObject = {
    id: string,
    userId: string,
    poiId: string,
    rating: number,
    title: string,
    content: string,
    photosList: Array<string>,
    status: ReviewStatus,
    visitDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    helpfulCount: number,
    reportCount: number,
    isVerified: boolean,
    language: string,
    aspects?: ReviewAspects.AsObject,
    reviewer?: ReviewerInfo.AsObject,
    businessResponse?: BusinessResponse.AsObject,
  }
}

export class ReviewAspects extends jspb.Message {
  getServiceRating(): number;
  setServiceRating(value: number): ReviewAspects;

  getQualityRating(): number;
  setQualityRating(value: number): ReviewAspects;

  getValueRating(): number;
  setValueRating(value: number): ReviewAspects;

  getAtmosphereRating(): number;
  setAtmosphereRating(value: number): ReviewAspects;

  getCleanlinessRating(): number;
  setCleanlinessRating(value: number): ReviewAspects;

  getLocationRating(): number;
  setLocationRating(value: number): ReviewAspects;

  getFoodRating(): number;
  setFoodRating(value: number): ReviewAspects;

  getRoomRating(): number;
  setRoomRating(value: number): ReviewAspects;

  getAmenitiesRating(): number;
  setAmenitiesRating(value: number): ReviewAspects;

  getStaffRating(): number;
  setStaffRating(value: number): ReviewAspects;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewAspects.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewAspects): ReviewAspects.AsObject;
  static serializeBinaryToWriter(message: ReviewAspects, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewAspects;
  static deserializeBinaryFromReader(message: ReviewAspects, reader: jspb.BinaryReader): ReviewAspects;
}

export namespace ReviewAspects {
  export type AsObject = {
    serviceRating: number,
    qualityRating: number,
    valueRating: number,
    atmosphereRating: number,
    cleanlinessRating: number,
    locationRating: number,
    foodRating: number,
    roomRating: number,
    amenitiesRating: number,
    staffRating: number,
  }
}

export class ReviewerInfo extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): ReviewerInfo;

  getDisplayName(): string;
  setDisplayName(value: string): ReviewerInfo;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): ReviewerInfo;

  getReviewCount(): number;
  setReviewCount(value: number): ReviewerInfo;

  getIsVerified(): boolean;
  setIsVerified(value: boolean): ReviewerInfo;

  getLevel(): string;
  setLevel(value: string): ReviewerInfo;

  getMemberSince(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setMemberSince(value?: google_protobuf_timestamp_pb.Timestamp): ReviewerInfo;
  hasMemberSince(): boolean;
  clearMemberSince(): ReviewerInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewerInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewerInfo): ReviewerInfo.AsObject;
  static serializeBinaryToWriter(message: ReviewerInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewerInfo;
  static deserializeBinaryFromReader(message: ReviewerInfo, reader: jspb.BinaryReader): ReviewerInfo;
}

export namespace ReviewerInfo {
  export type AsObject = {
    userId: string,
    displayName: string,
    avatarUrl: string,
    reviewCount: number,
    isVerified: boolean,
    level: string,
    memberSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class BusinessResponse extends jspb.Message {
  getId(): string;
  setId(value: string): BusinessResponse;

  getBusinessUserId(): string;
  setBusinessUserId(value: string): BusinessResponse;

  getContent(): string;
  setContent(value: string): BusinessResponse;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): BusinessResponse;
  hasCreatedAt(): boolean;
  clearCreatedAt(): BusinessResponse;

  getResponderName(): string;
  setResponderName(value: string): BusinessResponse;

  getResponderTitle(): string;
  setResponderTitle(value: string): BusinessResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BusinessResponse.AsObject;
  static toObject(includeInstance: boolean, msg: BusinessResponse): BusinessResponse.AsObject;
  static serializeBinaryToWriter(message: BusinessResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BusinessResponse;
  static deserializeBinaryFromReader(message: BusinessResponse, reader: jspb.BinaryReader): BusinessResponse;
}

export namespace BusinessResponse {
  export type AsObject = {
    id: string,
    businessUserId: string,
    content: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    responderName: string,
    responderTitle: string,
  }
}

export class ReviewStatistics extends jspb.Message {
  getPoiId(): string;
  setPoiId(value: string): ReviewStatistics;

  getOverallRating(): number;
  setOverallRating(value: number): ReviewStatistics;

  getTotalReviews(): number;
  setTotalReviews(value: number): ReviewStatistics;

  getRatingBreakdown(): common_pb.RatingBreakdown | undefined;
  setRatingBreakdown(value?: common_pb.RatingBreakdown): ReviewStatistics;
  hasRatingBreakdown(): boolean;
  clearRatingBreakdown(): ReviewStatistics;

  getAspectAverages(): ReviewAspectAverages | undefined;
  setAspectAverages(value?: ReviewAspectAverages): ReviewStatistics;
  hasAspectAverages(): boolean;
  clearAspectAverages(): ReviewStatistics;

  getTrends(): RecentReviewTrends | undefined;
  setTrends(value?: RecentReviewTrends): ReviewStatistics;
  hasTrends(): boolean;
  clearTrends(): ReviewStatistics;

  getTagsList(): Array<ReviewTag>;
  setTagsList(value: Array<ReviewTag>): ReviewStatistics;
  clearTagsList(): ReviewStatistics;
  addTags(value?: ReviewTag, index?: number): ReviewTag;

  getLanguageDistribution(): LanguageDistribution | undefined;
  setLanguageDistribution(value?: LanguageDistribution): ReviewStatistics;
  hasLanguageDistribution(): boolean;
  clearLanguageDistribution(): ReviewStatistics;

  getLastUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastUpdated(value?: google_protobuf_timestamp_pb.Timestamp): ReviewStatistics;
  hasLastUpdated(): boolean;
  clearLastUpdated(): ReviewStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewStatistics): ReviewStatistics.AsObject;
  static serializeBinaryToWriter(message: ReviewStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewStatistics;
  static deserializeBinaryFromReader(message: ReviewStatistics, reader: jspb.BinaryReader): ReviewStatistics;
}

export namespace ReviewStatistics {
  export type AsObject = {
    poiId: string,
    overallRating: number,
    totalReviews: number,
    ratingBreakdown?: common_pb.RatingBreakdown.AsObject,
    aspectAverages?: ReviewAspectAverages.AsObject,
    trends?: RecentReviewTrends.AsObject,
    tagsList: Array<ReviewTag.AsObject>,
    languageDistribution?: LanguageDistribution.AsObject,
    lastUpdated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ReviewAspectAverages extends jspb.Message {
  getServiceAverage(): number;
  setServiceAverage(value: number): ReviewAspectAverages;

  getQualityAverage(): number;
  setQualityAverage(value: number): ReviewAspectAverages;

  getValueAverage(): number;
  setValueAverage(value: number): ReviewAspectAverages;

  getAtmosphereAverage(): number;
  setAtmosphereAverage(value: number): ReviewAspectAverages;

  getCleanlinessAverage(): number;
  setCleanlinessAverage(value: number): ReviewAspectAverages;

  getLocationAverage(): number;
  setLocationAverage(value: number): ReviewAspectAverages;

  getFoodAverage(): number;
  setFoodAverage(value: number): ReviewAspectAverages;

  getRoomAverage(): number;
  setRoomAverage(value: number): ReviewAspectAverages;

  getAmenitiesAverage(): number;
  setAmenitiesAverage(value: number): ReviewAspectAverages;

  getStaffAverage(): number;
  setStaffAverage(value: number): ReviewAspectAverages;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewAspectAverages.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewAspectAverages): ReviewAspectAverages.AsObject;
  static serializeBinaryToWriter(message: ReviewAspectAverages, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewAspectAverages;
  static deserializeBinaryFromReader(message: ReviewAspectAverages, reader: jspb.BinaryReader): ReviewAspectAverages;
}

export namespace ReviewAspectAverages {
  export type AsObject = {
    serviceAverage: number,
    qualityAverage: number,
    valueAverage: number,
    atmosphereAverage: number,
    cleanlinessAverage: number,
    locationAverage: number,
    foodAverage: number,
    roomAverage: number,
    amenitiesAverage: number,
    staffAverage: number,
  }
}

export class RecentReviewTrends extends jspb.Message {
  getRatingTrend(): number;
  setRatingTrend(value: number): RecentReviewTrends;

  getReviewsLast30Days(): number;
  setReviewsLast30Days(value: number): RecentReviewTrends;

  getAverageRatingLast30Days(): number;
  setAverageRatingLast30Days(value: number): RecentReviewTrends;

  getRatingChangePercentage(): number;
  setRatingChangePercentage(value: number): RecentReviewTrends;

  getMonthlyDataList(): Array<MonthlyReviewData>;
  setMonthlyDataList(value: Array<MonthlyReviewData>): RecentReviewTrends;
  clearMonthlyDataList(): RecentReviewTrends;
  addMonthlyData(value?: MonthlyReviewData, index?: number): MonthlyReviewData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecentReviewTrends.AsObject;
  static toObject(includeInstance: boolean, msg: RecentReviewTrends): RecentReviewTrends.AsObject;
  static serializeBinaryToWriter(message: RecentReviewTrends, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecentReviewTrends;
  static deserializeBinaryFromReader(message: RecentReviewTrends, reader: jspb.BinaryReader): RecentReviewTrends;
}

export namespace RecentReviewTrends {
  export type AsObject = {
    ratingTrend: number,
    reviewsLast30Days: number,
    averageRatingLast30Days: number,
    ratingChangePercentage: number,
    monthlyDataList: Array<MonthlyReviewData.AsObject>,
  }
}

export class MonthlyReviewData extends jspb.Message {
  getYear(): number;
  setYear(value: number): MonthlyReviewData;

  getMonth(): number;
  setMonth(value: number): MonthlyReviewData;

  getReviewCount(): number;
  setReviewCount(value: number): MonthlyReviewData;

  getAverageRating(): number;
  setAverageRating(value: number): MonthlyReviewData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonthlyReviewData.AsObject;
  static toObject(includeInstance: boolean, msg: MonthlyReviewData): MonthlyReviewData.AsObject;
  static serializeBinaryToWriter(message: MonthlyReviewData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonthlyReviewData;
  static deserializeBinaryFromReader(message: MonthlyReviewData, reader: jspb.BinaryReader): MonthlyReviewData;
}

export namespace MonthlyReviewData {
  export type AsObject = {
    year: number,
    month: number,
    reviewCount: number,
    averageRating: number,
  }
}

export class ReviewTag extends jspb.Message {
  getTag(): string;
  setTag(value: string): ReviewTag;

  getCount(): number;
  setCount(value: number): ReviewTag;

  getSentimentScore(): number;
  setSentimentScore(value: number): ReviewTag;

  getCategory(): string;
  setCategory(value: string): ReviewTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewTag.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewTag): ReviewTag.AsObject;
  static serializeBinaryToWriter(message: ReviewTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewTag;
  static deserializeBinaryFromReader(message: ReviewTag, reader: jspb.BinaryReader): ReviewTag;
}

export namespace ReviewTag {
  export type AsObject = {
    tag: string,
    count: number,
    sentimentScore: number,
    category: string,
  }
}

export class LanguageDistribution extends jspb.Message {
  getLanguagesList(): Array<LanguageCount>;
  setLanguagesList(value: Array<LanguageCount>): LanguageDistribution;
  clearLanguagesList(): LanguageDistribution;
  addLanguages(value?: LanguageCount, index?: number): LanguageCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LanguageDistribution.AsObject;
  static toObject(includeInstance: boolean, msg: LanguageDistribution): LanguageDistribution.AsObject;
  static serializeBinaryToWriter(message: LanguageDistribution, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LanguageDistribution;
  static deserializeBinaryFromReader(message: LanguageDistribution, reader: jspb.BinaryReader): LanguageDistribution;
}

export namespace LanguageDistribution {
  export type AsObject = {
    languagesList: Array<LanguageCount.AsObject>,
  }
}

export class LanguageCount extends jspb.Message {
  getLanguageCode(): string;
  setLanguageCode(value: string): LanguageCount;

  getLanguageName(): string;
  setLanguageName(value: string): LanguageCount;

  getCount(): number;
  setCount(value: number): LanguageCount;

  getPercentage(): number;
  setPercentage(value: number): LanguageCount;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LanguageCount.AsObject;
  static toObject(includeInstance: boolean, msg: LanguageCount): LanguageCount.AsObject;
  static serializeBinaryToWriter(message: LanguageCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LanguageCount;
  static deserializeBinaryFromReader(message: LanguageCount, reader: jspb.BinaryReader): LanguageCount;
}

export namespace LanguageCount {
  export type AsObject = {
    languageCode: string,
    languageName: string,
    count: number,
    percentage: number,
  }
}

export class ReviewFilter extends jspb.Message {
  getRatingFiltersList(): Array<number>;
  setRatingFiltersList(value: Array<number>): ReviewFilter;
  clearRatingFiltersList(): ReviewFilter;
  addRatingFilters(value: number, index?: number): ReviewFilter;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): ReviewFilter;
  hasStartDate(): boolean;
  clearStartDate(): ReviewFilter;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): ReviewFilter;
  hasEndDate(): boolean;
  clearEndDate(): ReviewFilter;

  getLanguagesList(): Array<string>;
  setLanguagesList(value: Array<string>): ReviewFilter;
  clearLanguagesList(): ReviewFilter;
  addLanguages(value: string, index?: number): ReviewFilter;

  getVerifiedOnly(): boolean;
  setVerifiedOnly(value: boolean): ReviewFilter;

  getWithPhotosOnly(): boolean;
  setWithPhotosOnly(value: boolean): ReviewFilter;

  getKeywordsList(): Array<string>;
  setKeywordsList(value: Array<string>): ReviewFilter;
  clearKeywordsList(): ReviewFilter;
  addKeywords(value: string, index?: number): ReviewFilter;

  getSortBy(): ReviewSortBy;
  setSortBy(value: ReviewSortBy): ReviewFilter;

  getSortDirection(): common_pb.SortDirection;
  setSortDirection(value: common_pb.SortDirection): ReviewFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReviewFilter.AsObject;
  static toObject(includeInstance: boolean, msg: ReviewFilter): ReviewFilter.AsObject;
  static serializeBinaryToWriter(message: ReviewFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReviewFilter;
  static deserializeBinaryFromReader(message: ReviewFilter, reader: jspb.BinaryReader): ReviewFilter;
}

export namespace ReviewFilter {
  export type AsObject = {
    ratingFiltersList: Array<number>,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    languagesList: Array<string>,
    verifiedOnly: boolean,
    withPhotosOnly: boolean,
    keywordsList: Array<string>,
    sortBy: ReviewSortBy,
    sortDirection: common_pb.SortDirection,
  }
}

export class CreateReviewRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateReviewRequest;

  getPoiId(): string;
  setPoiId(value: string): CreateReviewRequest;

  getRating(): number;
  setRating(value: number): CreateReviewRequest;

  getTitle(): string;
  setTitle(value: string): CreateReviewRequest;

  getContent(): string;
  setContent(value: string): CreateReviewRequest;

  getPhotoUrlsList(): Array<string>;
  setPhotoUrlsList(value: Array<string>): CreateReviewRequest;
  clearPhotoUrlsList(): CreateReviewRequest;
  addPhotoUrls(value: string, index?: number): CreateReviewRequest;

  getVisitDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setVisitDate(value?: google_protobuf_timestamp_pb.Timestamp): CreateReviewRequest;
  hasVisitDate(): boolean;
  clearVisitDate(): CreateReviewRequest;

  getAspects(): ReviewAspects | undefined;
  setAspects(value?: ReviewAspects): CreateReviewRequest;
  hasAspects(): boolean;
  clearAspects(): CreateReviewRequest;

  getLanguage(): string;
  setLanguage(value: string): CreateReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateReviewRequest;
  hasRequest(): boolean;
  clearRequest(): CreateReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateReviewRequest): CreateReviewRequest.AsObject;
  static serializeBinaryToWriter(message: CreateReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateReviewRequest;
  static deserializeBinaryFromReader(message: CreateReviewRequest, reader: jspb.BinaryReader): CreateReviewRequest;
}

export namespace CreateReviewRequest {
  export type AsObject = {
    userId: string,
    poiId: string,
    rating: number,
    title: string,
    content: string,
    photoUrlsList: Array<string>,
    visitDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    aspects?: ReviewAspects.AsObject,
    language: string,
    request?: BaseRequest.AsObject,
  }
}

export class CreateReviewResponse extends jspb.Message {
  getResponse(): common_pb.Response | undefined;
  setResponse(value?: common_pb.Response): CreateReviewResponse;
  hasResponse(): boolean;
  clearResponse(): CreateReviewResponse;

  getReview(): Review | undefined;
  setReview(value?: Review): CreateReviewResponse;
  hasReview(): boolean;
  clearReview(): CreateReviewResponse;

  getBaseResponse(): BaseResponse | undefined;
  setBaseResponse(value?: BaseResponse): CreateReviewResponse;
  hasBaseResponse(): boolean;
  clearBaseResponse(): CreateReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateReviewResponse): CreateReviewResponse.AsObject;
  static serializeBinaryToWriter(message: CreateReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateReviewResponse;
  static deserializeBinaryFromReader(message: CreateReviewResponse, reader: jspb.BinaryReader): CreateReviewResponse;
}

export namespace CreateReviewResponse {
  export type AsObject = {
    response?: common_pb.Response.AsObject,
    review?: Review.AsObject,
    baseResponse?: BaseResponse.AsObject,
  }
}

export class GetPOIReviewsRequest extends jspb.Message {
  getPoiId(): string;
  setPoiId(value: string): GetPOIReviewsRequest;

  getPagination(): common_pb.PaginationRequest | undefined;
  setPagination(value?: common_pb.PaginationRequest): GetPOIReviewsRequest;
  hasPagination(): boolean;
  clearPagination(): GetPOIReviewsRequest;

  getFilter(): ReviewFilter | undefined;
  setFilter(value?: ReviewFilter): GetPOIReviewsRequest;
  hasFilter(): boolean;
  clearFilter(): GetPOIReviewsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetPOIReviewsRequest;
  hasRequest(): boolean;
  clearRequest(): GetPOIReviewsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIReviewsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIReviewsRequest): GetPOIReviewsRequest.AsObject;
  static serializeBinaryToWriter(message: GetPOIReviewsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIReviewsRequest;
  static deserializeBinaryFromReader(message: GetPOIReviewsRequest, reader: jspb.BinaryReader): GetPOIReviewsRequest;
}

export namespace GetPOIReviewsRequest {
  export type AsObject = {
    poiId: string,
    pagination?: common_pb.PaginationRequest.AsObject,
    filter?: ReviewFilter.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class GetPOIReviewsResponse extends jspb.Message {
  getReviewsList(): Array<Review>;
  setReviewsList(value: Array<Review>): GetPOIReviewsResponse;
  clearReviewsList(): GetPOIReviewsResponse;
  addReviews(value?: Review, index?: number): Review;

  getPagination(): common_pb.PaginationResponse | undefined;
  setPagination(value?: common_pb.PaginationResponse): GetPOIReviewsResponse;
  hasPagination(): boolean;
  clearPagination(): GetPOIReviewsResponse;

  getStatistics(): ReviewStatistics | undefined;
  setStatistics(value?: ReviewStatistics): GetPOIReviewsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetPOIReviewsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetPOIReviewsResponse;
  hasResponse(): boolean;
  clearResponse(): GetPOIReviewsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPOIReviewsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPOIReviewsResponse): GetPOIReviewsResponse.AsObject;
  static serializeBinaryToWriter(message: GetPOIReviewsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPOIReviewsResponse;
  static deserializeBinaryFromReader(message: GetPOIReviewsResponse, reader: jspb.BinaryReader): GetPOIReviewsResponse;
}

export namespace GetPOIReviewsResponse {
  export type AsObject = {
    reviewsList: Array<Review.AsObject>,
    pagination?: common_pb.PaginationResponse.AsObject,
    statistics?: ReviewStatistics.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class GetReviewRequest extends jspb.Message {
  getReviewId(): string;
  setReviewId(value: string): GetReviewRequest;

  getUserId(): string;
  setUserId(value: string): GetReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetReviewRequest;
  hasRequest(): boolean;
  clearRequest(): GetReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetReviewRequest): GetReviewRequest.AsObject;
  static serializeBinaryToWriter(message: GetReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReviewRequest;
  static deserializeBinaryFromReader(message: GetReviewRequest, reader: jspb.BinaryReader): GetReviewRequest;
}

export namespace GetReviewRequest {
  export type AsObject = {
    reviewId: string,
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetReviewResponse extends jspb.Message {
  getReview(): Review | undefined;
  setReview(value?: Review): GetReviewResponse;
  hasReview(): boolean;
  clearReview(): GetReviewResponse;

  getCanEdit(): boolean;
  setCanEdit(value: boolean): GetReviewResponse;

  getCanDelete(): boolean;
  setCanDelete(value: boolean): GetReviewResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetReviewResponse;
  hasResponse(): boolean;
  clearResponse(): GetReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetReviewResponse): GetReviewResponse.AsObject;
  static serializeBinaryToWriter(message: GetReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReviewResponse;
  static deserializeBinaryFromReader(message: GetReviewResponse, reader: jspb.BinaryReader): GetReviewResponse;
}

export namespace GetReviewResponse {
  export type AsObject = {
    review?: Review.AsObject,
    canEdit: boolean,
    canDelete: boolean,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateReviewRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateReviewRequest;

  getReviewId(): string;
  setReviewId(value: string): UpdateReviewRequest;

  getRating(): number;
  setRating(value: number): UpdateReviewRequest;

  getTitle(): string;
  setTitle(value: string): UpdateReviewRequest;

  getContent(): string;
  setContent(value: string): UpdateReviewRequest;

  getPhotoUrlsList(): Array<string>;
  setPhotoUrlsList(value: Array<string>): UpdateReviewRequest;
  clearPhotoUrlsList(): UpdateReviewRequest;
  addPhotoUrls(value: string, index?: number): UpdateReviewRequest;

  getVisitDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setVisitDate(value?: google_protobuf_timestamp_pb.Timestamp): UpdateReviewRequest;
  hasVisitDate(): boolean;
  clearVisitDate(): UpdateReviewRequest;

  getAspects(): ReviewAspects | undefined;
  setAspects(value?: ReviewAspects): UpdateReviewRequest;
  hasAspects(): boolean;
  clearAspects(): UpdateReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateReviewRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateReviewRequest): UpdateReviewRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateReviewRequest;
  static deserializeBinaryFromReader(message: UpdateReviewRequest, reader: jspb.BinaryReader): UpdateReviewRequest;
}

export namespace UpdateReviewRequest {
  export type AsObject = {
    userId: string,
    reviewId: string,
    rating: number,
    title: string,
    content: string,
    photoUrlsList: Array<string>,
    visitDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    aspects?: ReviewAspects.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateReviewResponse extends jspb.Message {
  getResponse(): common_pb.Response | undefined;
  setResponse(value?: common_pb.Response): UpdateReviewResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateReviewResponse;

  getReview(): Review | undefined;
  setReview(value?: Review): UpdateReviewResponse;
  hasReview(): boolean;
  clearReview(): UpdateReviewResponse;

  getBaseResponse(): BaseResponse | undefined;
  setBaseResponse(value?: BaseResponse): UpdateReviewResponse;
  hasBaseResponse(): boolean;
  clearBaseResponse(): UpdateReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateReviewResponse): UpdateReviewResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateReviewResponse;
  static deserializeBinaryFromReader(message: UpdateReviewResponse, reader: jspb.BinaryReader): UpdateReviewResponse;
}

export namespace UpdateReviewResponse {
  export type AsObject = {
    response?: common_pb.Response.AsObject,
    review?: Review.AsObject,
    baseResponse?: BaseResponse.AsObject,
  }
}

export class DeleteReviewRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteReviewRequest;

  getReviewId(): string;
  setReviewId(value: string): DeleteReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteReviewRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteReviewRequest): DeleteReviewRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteReviewRequest;
  static deserializeBinaryFromReader(message: DeleteReviewRequest, reader: jspb.BinaryReader): DeleteReviewRequest;
}

export namespace DeleteReviewRequest {
  export type AsObject = {
    userId: string,
    reviewId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteReviewResponse extends jspb.Message {
  getResponse(): common_pb.Response | undefined;
  setResponse(value?: common_pb.Response): DeleteReviewResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteReviewResponse;

  getBaseResponse(): BaseResponse | undefined;
  setBaseResponse(value?: BaseResponse): DeleteReviewResponse;
  hasBaseResponse(): boolean;
  clearBaseResponse(): DeleteReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteReviewResponse): DeleteReviewResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteReviewResponse;
  static deserializeBinaryFromReader(message: DeleteReviewResponse, reader: jspb.BinaryReader): DeleteReviewResponse;
}

export namespace DeleteReviewResponse {
  export type AsObject = {
    response?: common_pb.Response.AsObject,
    baseResponse?: BaseResponse.AsObject,
  }
}

export class GetUserReviewsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetUserReviewsRequest;

  getPagination(): common_pb.PaginationRequest | undefined;
  setPagination(value?: common_pb.PaginationRequest): GetUserReviewsRequest;
  hasPagination(): boolean;
  clearPagination(): GetUserReviewsRequest;

  getFilter(): ReviewFilter | undefined;
  setFilter(value?: ReviewFilter): GetUserReviewsRequest;
  hasFilter(): boolean;
  clearFilter(): GetUserReviewsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetUserReviewsRequest;
  hasRequest(): boolean;
  clearRequest(): GetUserReviewsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserReviewsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserReviewsRequest): GetUserReviewsRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserReviewsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserReviewsRequest;
  static deserializeBinaryFromReader(message: GetUserReviewsRequest, reader: jspb.BinaryReader): GetUserReviewsRequest;
}

export namespace GetUserReviewsRequest {
  export type AsObject = {
    userId: string,
    pagination?: common_pb.PaginationRequest.AsObject,
    filter?: ReviewFilter.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class GetUserReviewsResponse extends jspb.Message {
  getReviewsList(): Array<Review>;
  setReviewsList(value: Array<Review>): GetUserReviewsResponse;
  clearReviewsList(): GetUserReviewsResponse;
  addReviews(value?: Review, index?: number): Review;

  getPagination(): common_pb.PaginationResponse | undefined;
  setPagination(value?: common_pb.PaginationResponse): GetUserReviewsResponse;
  hasPagination(): boolean;
  clearPagination(): GetUserReviewsResponse;

  getStatistics(): UserReviewStatistics | undefined;
  setStatistics(value?: UserReviewStatistics): GetUserReviewsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetUserReviewsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetUserReviewsResponse;
  hasResponse(): boolean;
  clearResponse(): GetUserReviewsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserReviewsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserReviewsResponse): GetUserReviewsResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserReviewsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserReviewsResponse;
  static deserializeBinaryFromReader(message: GetUserReviewsResponse, reader: jspb.BinaryReader): GetUserReviewsResponse;
}

export namespace GetUserReviewsResponse {
  export type AsObject = {
    reviewsList: Array<Review.AsObject>,
    pagination?: common_pb.PaginationResponse.AsObject,
    statistics?: UserReviewStatistics.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UserReviewStatistics extends jspb.Message {
  getTotalReviews(): number;
  setTotalReviews(value: number): UserReviewStatistics;

  getAverageRatingGiven(): number;
  setAverageRatingGiven(value: number): UserReviewStatistics;

  getHelpfulVotesReceived(): number;
  setHelpfulVotesReceived(value: number): UserReviewStatistics;

  getReviewerLevel(): string;
  setReviewerLevel(value: string): UserReviewStatistics;

  getTopCategoriesReviewedList(): Array<string>;
  setTopCategoriesReviewedList(value: Array<string>): UserReviewStatistics;
  clearTopCategoriesReviewedList(): UserReviewStatistics;
  addTopCategoriesReviewed(value: string, index?: number): UserReviewStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserReviewStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: UserReviewStatistics): UserReviewStatistics.AsObject;
  static serializeBinaryToWriter(message: UserReviewStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserReviewStatistics;
  static deserializeBinaryFromReader(message: UserReviewStatistics, reader: jspb.BinaryReader): UserReviewStatistics;
}

export namespace UserReviewStatistics {
  export type AsObject = {
    totalReviews: number,
    averageRatingGiven: number,
    helpfulVotesReceived: number,
    reviewerLevel: string,
    topCategoriesReviewedList: Array<string>,
  }
}

export class LikeReviewRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): LikeReviewRequest;

  getReviewId(): string;
  setReviewId(value: string): LikeReviewRequest;

  getIsLike(): boolean;
  setIsLike(value: boolean): LikeReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): LikeReviewRequest;
  hasRequest(): boolean;
  clearRequest(): LikeReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LikeReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LikeReviewRequest): LikeReviewRequest.AsObject;
  static serializeBinaryToWriter(message: LikeReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LikeReviewRequest;
  static deserializeBinaryFromReader(message: LikeReviewRequest, reader: jspb.BinaryReader): LikeReviewRequest;
}

export namespace LikeReviewRequest {
  export type AsObject = {
    userId: string,
    reviewId: string,
    isLike: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class LikeReviewResponse extends jspb.Message {
  getResponse(): common_pb.Response | undefined;
  setResponse(value?: common_pb.Response): LikeReviewResponse;
  hasResponse(): boolean;
  clearResponse(): LikeReviewResponse;

  getNewHelpfulCount(): number;
  setNewHelpfulCount(value: number): LikeReviewResponse;

  getBaseResponse(): BaseResponse | undefined;
  setBaseResponse(value?: BaseResponse): LikeReviewResponse;
  hasBaseResponse(): boolean;
  clearBaseResponse(): LikeReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LikeReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: LikeReviewResponse): LikeReviewResponse.AsObject;
  static serializeBinaryToWriter(message: LikeReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LikeReviewResponse;
  static deserializeBinaryFromReader(message: LikeReviewResponse, reader: jspb.BinaryReader): LikeReviewResponse;
}

export namespace LikeReviewResponse {
  export type AsObject = {
    response?: common_pb.Response.AsObject,
    newHelpfulCount: number,
    baseResponse?: BaseResponse.AsObject,
  }
}

export class ReportReviewRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): ReportReviewRequest;

  getReviewId(): string;
  setReviewId(value: string): ReportReviewRequest;

  getReason(): string;
  setReason(value: string): ReportReviewRequest;

  getDetails(): string;
  setDetails(value: string): ReportReviewRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): ReportReviewRequest;
  hasRequest(): boolean;
  clearRequest(): ReportReviewRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportReviewRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ReportReviewRequest): ReportReviewRequest.AsObject;
  static serializeBinaryToWriter(message: ReportReviewRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportReviewRequest;
  static deserializeBinaryFromReader(message: ReportReviewRequest, reader: jspb.BinaryReader): ReportReviewRequest;
}

export namespace ReportReviewRequest {
  export type AsObject = {
    userId: string,
    reviewId: string,
    reason: string,
    details: string,
    request?: BaseRequest.AsObject,
  }
}

export class ReportReviewResponse extends jspb.Message {
  getResponse(): common_pb.Response | undefined;
  setResponse(value?: common_pb.Response): ReportReviewResponse;
  hasResponse(): boolean;
  clearResponse(): ReportReviewResponse;

  getBaseResponse(): BaseResponse | undefined;
  setBaseResponse(value?: BaseResponse): ReportReviewResponse;
  hasBaseResponse(): boolean;
  clearBaseResponse(): ReportReviewResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReportReviewResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ReportReviewResponse): ReportReviewResponse.AsObject;
  static serializeBinaryToWriter(message: ReportReviewResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReportReviewResponse;
  static deserializeBinaryFromReader(message: ReportReviewResponse, reader: jspb.BinaryReader): ReportReviewResponse;
}

export namespace ReportReviewResponse {
  export type AsObject = {
    response?: common_pb.Response.AsObject,
    baseResponse?: BaseResponse.AsObject,
  }
}

export class GetReviewStatisticsRequest extends jspb.Message {
  getPoiId(): string;
  setPoiId(value: string): GetReviewStatisticsRequest;

  getIncludeTrends(): boolean;
  setIncludeTrends(value: boolean): GetReviewStatisticsRequest;

  getIncludeTags(): boolean;
  setIncludeTags(value: boolean): GetReviewStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetReviewStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetReviewStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReviewStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetReviewStatisticsRequest): GetReviewStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetReviewStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReviewStatisticsRequest;
  static deserializeBinaryFromReader(message: GetReviewStatisticsRequest, reader: jspb.BinaryReader): GetReviewStatisticsRequest;
}

export namespace GetReviewStatisticsRequest {
  export type AsObject = {
    poiId: string,
    includeTrends: boolean,
    includeTags: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetReviewStatisticsResponse extends jspb.Message {
  getStatistics(): ReviewStatistics | undefined;
  setStatistics(value?: ReviewStatistics): GetReviewStatisticsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetReviewStatisticsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetReviewStatisticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetReviewStatisticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetReviewStatisticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetReviewStatisticsResponse): GetReviewStatisticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetReviewStatisticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetReviewStatisticsResponse;
  static deserializeBinaryFromReader(message: GetReviewStatisticsResponse, reader: jspb.BinaryReader): GetReviewStatisticsResponse;
}

export namespace GetReviewStatisticsResponse {
  export type AsObject = {
    statistics?: ReviewStatistics.AsObject,
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

export enum ReviewStatus { 
  REVIEW_STATUS_UNSPECIFIED = 0,
  REVIEW_STATUS_PENDING = 1,
  REVIEW_STATUS_PUBLISHED = 2,
  REVIEW_STATUS_HIDDEN = 3,
  REVIEW_STATUS_DELETED = 4,
  REVIEW_STATUS_FLAGGED = 5,
}
export enum ReviewSortBy { 
  REVIEW_SORT_BY_UNSPECIFIED = 0,
  REVIEW_SORT_BY_DATE = 1,
  REVIEW_SORT_BY_RATING = 2,
  REVIEW_SORT_BY_HELPFUL = 3,
  REVIEW_SORT_BY_RELEVANCE = 4,
}
