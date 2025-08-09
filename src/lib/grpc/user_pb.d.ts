import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class UserProfile extends jspb.Message {
  getId(): string;
  setId(value: string): UserProfile;

  getUsername(): string;
  setUsername(value: string): UserProfile;

  getEmail(): string;
  setEmail(value: string): UserProfile;

  getFirstName(): string;
  setFirstName(value: string): UserProfile;

  getLastName(): string;
  setLastName(value: string): UserProfile;

  getBio(): string;
  setBio(value: string): UserProfile;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): UserProfile;

  getLocation(): string;
  setLocation(value: string): UserProfile;

  getTimezone(): string;
  setTimezone(value: string): UserProfile;

  getLanguage(): string;
  setLanguage(value: string): UserProfile;

  getCurrency(): string;
  setCurrency(value: string): UserProfile;

  getDateOfBirth(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDateOfBirth(value?: google_protobuf_timestamp_pb.Timestamp): UserProfile;
  hasDateOfBirth(): boolean;
  clearDateOfBirth(): UserProfile;

  getPhone(): string;
  setPhone(value: string): UserProfile;

  getEmailVerified(): boolean;
  setEmailVerified(value: boolean): UserProfile;

  getPhoneVerified(): boolean;
  setPhoneVerified(value: boolean): UserProfile;

  getNotificationPreferences(): NotificationPreferences | undefined;
  setNotificationPreferences(value?: NotificationPreferences): UserProfile;
  hasNotificationPreferences(): boolean;
  clearNotificationPreferences(): UserProfile;

  getPrivacySettings(): PrivacySettings | undefined;
  setPrivacySettings(value?: PrivacySettings): UserProfile;
  hasPrivacySettings(): boolean;
  clearPrivacySettings(): UserProfile;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserProfile;
  hasCreatedAt(): boolean;
  clearCreatedAt(): UserProfile;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserProfile;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserProfile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserProfile.AsObject;
  static toObject(includeInstance: boolean, msg: UserProfile): UserProfile.AsObject;
  static serializeBinaryToWriter(message: UserProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserProfile;
  static deserializeBinaryFromReader(message: UserProfile, reader: jspb.BinaryReader): UserProfile;
}

export namespace UserProfile {
  export type AsObject = {
    id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    bio: string,
    avatarUrl: string,
    location: string,
    timezone: string,
    language: string,
    currency: string,
    dateOfBirth?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    phone: string,
    emailVerified: boolean,
    phoneVerified: boolean,
    notificationPreferences?: NotificationPreferences.AsObject,
    privacySettings?: PrivacySettings.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class NotificationPreferences extends jspb.Message {
  getEmailNotifications(): boolean;
  setEmailNotifications(value: boolean): NotificationPreferences;

  getPushNotifications(): boolean;
  setPushNotifications(value: boolean): NotificationPreferences;

  getSmsNotifications(): boolean;
  setSmsNotifications(value: boolean): NotificationPreferences;

  getMarketingEmails(): boolean;
  setMarketingEmails(value: boolean): NotificationPreferences;

  getItineraryUpdates(): boolean;
  setItineraryUpdates(value: boolean): NotificationPreferences;

  getPoiRecommendations(): boolean;
  setPoiRecommendations(value: boolean): NotificationPreferences;

  getSocialActivity(): boolean;
  setSocialActivity(value: boolean): NotificationPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotificationPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: NotificationPreferences): NotificationPreferences.AsObject;
  static serializeBinaryToWriter(message: NotificationPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotificationPreferences;
  static deserializeBinaryFromReader(message: NotificationPreferences, reader: jspb.BinaryReader): NotificationPreferences;
}

export namespace NotificationPreferences {
  export type AsObject = {
    emailNotifications: boolean,
    pushNotifications: boolean,
    smsNotifications: boolean,
    marketingEmails: boolean,
    itineraryUpdates: boolean,
    poiRecommendations: boolean,
    socialActivity: boolean,
  }
}

export class PrivacySettings extends jspb.Message {
  getProfilePublic(): boolean;
  setProfilePublic(value: boolean): PrivacySettings;

  getShowLocation(): boolean;
  setShowLocation(value: boolean): PrivacySettings;

  getShowActivity(): boolean;
  setShowActivity(value: boolean): PrivacySettings;

  getAllowFriendRequests(): boolean;
  setAllowFriendRequests(value: boolean): PrivacySettings;

  getShowInSearch(): boolean;
  setShowInSearch(value: boolean): PrivacySettings;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PrivacySettings.AsObject;
  static toObject(includeInstance: boolean, msg: PrivacySettings): PrivacySettings.AsObject;
  static serializeBinaryToWriter(message: PrivacySettings, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PrivacySettings;
  static deserializeBinaryFromReader(message: PrivacySettings, reader: jspb.BinaryReader): PrivacySettings;
}

export namespace PrivacySettings {
  export type AsObject = {
    profilePublic: boolean,
    showLocation: boolean,
    showActivity: boolean,
    allowFriendRequests: boolean,
    showInSearch: boolean,
  }
}

export class SearchProfile extends jspb.Message {
  getId(): string;
  setId(value: string): SearchProfile;

  getUserId(): string;
  setUserId(value: string): SearchProfile;

  getName(): string;
  setName(value: string): SearchProfile;

  getDescription(): string;
  setDescription(value: string): SearchProfile;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): SearchProfile;

  getTravelPreferences(): TravelPreferences | undefined;
  setTravelPreferences(value?: TravelPreferences): SearchProfile;
  hasTravelPreferences(): boolean;
  clearTravelPreferences(): SearchProfile;

  getInterestsList(): Array<string>;
  setInterestsList(value: Array<string>): SearchProfile;
  clearInterestsList(): SearchProfile;
  addInterests(value: string, index?: number): SearchProfile;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): SearchProfile;
  clearTagsList(): SearchProfile;
  addTags(value: string, index?: number): SearchProfile;

  getBudgetPreferences(): BudgetPreferences | undefined;
  setBudgetPreferences(value?: BudgetPreferences): SearchProfile;
  hasBudgetPreferences(): boolean;
  clearBudgetPreferences(): SearchProfile;

  getAccessibilityNeeds(): AccessibilityNeeds | undefined;
  setAccessibilityNeeds(value?: AccessibilityNeeds): SearchProfile;
  hasAccessibilityNeeds(): boolean;
  clearAccessibilityNeeds(): SearchProfile;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): SearchProfile;
  hasCreatedAt(): boolean;
  clearCreatedAt(): SearchProfile;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): SearchProfile;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): SearchProfile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchProfile.AsObject;
  static toObject(includeInstance: boolean, msg: SearchProfile): SearchProfile.AsObject;
  static serializeBinaryToWriter(message: SearchProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchProfile;
  static deserializeBinaryFromReader(message: SearchProfile, reader: jspb.BinaryReader): SearchProfile;
}

export namespace SearchProfile {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    description: string,
    isDefault: boolean,
    travelPreferences?: TravelPreferences.AsObject,
    interestsList: Array<string>,
    tagsList: Array<string>,
    budgetPreferences?: BudgetPreferences.AsObject,
    accessibilityNeeds?: AccessibilityNeeds.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class TravelPreferences extends jspb.Message {
  getTravelStyle(): string;
  setTravelStyle(value: string): TravelPreferences;

  getPreferredActivitiesList(): Array<string>;
  setPreferredActivitiesList(value: Array<string>): TravelPreferences;
  clearPreferredActivitiesList(): TravelPreferences;
  addPreferredActivities(value: string, index?: number): TravelPreferences;

  getCuisinePreferencesList(): Array<string>;
  setCuisinePreferencesList(value: Array<string>): TravelPreferences;
  clearCuisinePreferencesList(): TravelPreferences;
  addCuisinePreferences(value: string, index?: number): TravelPreferences;

  getAccommodationTypesList(): Array<string>;
  setAccommodationTypesList(value: Array<string>): TravelPreferences;
  clearAccommodationTypesList(): TravelPreferences;
  addAccommodationTypes(value: string, index?: number): TravelPreferences;

  getPace(): string;
  setPace(value: string): TravelPreferences;

  getGroupSize(): string;
  setGroupSize(value: string): TravelPreferences;

  getMaxWalkingDistanceMeters(): number;
  setMaxWalkingDistanceMeters(value: number): TravelPreferences;

  getPrefersPopularSpots(): boolean;
  setPrefersPopularSpots(value: boolean): TravelPreferences;

  getPrefersHiddenGems(): boolean;
  setPrefersHiddenGems(value: boolean): TravelPreferences;

  getTransportationPreference(): string;
  setTransportationPreference(value: string): TravelPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TravelPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: TravelPreferences): TravelPreferences.AsObject;
  static serializeBinaryToWriter(message: TravelPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TravelPreferences;
  static deserializeBinaryFromReader(message: TravelPreferences, reader: jspb.BinaryReader): TravelPreferences;
}

export namespace TravelPreferences {
  export type AsObject = {
    travelStyle: string,
    preferredActivitiesList: Array<string>,
    cuisinePreferencesList: Array<string>,
    accommodationTypesList: Array<string>,
    pace: string,
    groupSize: string,
    maxWalkingDistanceMeters: number,
    prefersPopularSpots: boolean,
    prefersHiddenGems: boolean,
    transportationPreference: string,
  }
}

export class BudgetPreferences extends jspb.Message {
  getBudgetLevel(): string;
  setBudgetLevel(value: string): BudgetPreferences;

  getCurrency(): string;
  setCurrency(value: string): BudgetPreferences;

  getDailyBudget(): number;
  setDailyBudget(value: number): BudgetPreferences;

  getAccommodationBudget(): number;
  setAccommodationBudget(value: number): BudgetPreferences;

  getFoodBudget(): number;
  setFoodBudget(value: number): BudgetPreferences;

  getActivityBudget(): number;
  setActivityBudget(value: number): BudgetPreferences;

  getTransportBudget(): number;
  setTransportBudget(value: number): BudgetPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BudgetPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: BudgetPreferences): BudgetPreferences.AsObject;
  static serializeBinaryToWriter(message: BudgetPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BudgetPreferences;
  static deserializeBinaryFromReader(message: BudgetPreferences, reader: jspb.BinaryReader): BudgetPreferences;
}

export namespace BudgetPreferences {
  export type AsObject = {
    budgetLevel: string,
    currency: string,
    dailyBudget: number,
    accommodationBudget: number,
    foodBudget: number,
    activityBudget: number,
    transportBudget: number,
  }
}

export class AccessibilityNeeds extends jspb.Message {
  getWheelchairAccessible(): boolean;
  setWheelchairAccessible(value: boolean): AccessibilityNeeds;

  getHearingAssistance(): boolean;
  setHearingAssistance(value: boolean): AccessibilityNeeds;

  getVisualAssistance(): boolean;
  setVisualAssistance(value: boolean): AccessibilityNeeds;

  getMobilityAssistance(): boolean;
  setMobilityAssistance(value: boolean): AccessibilityNeeds;

  getDietaryRestrictionsList(): Array<string>;
  setDietaryRestrictionsList(value: Array<string>): AccessibilityNeeds;
  clearDietaryRestrictionsList(): AccessibilityNeeds;
  addDietaryRestrictions(value: string, index?: number): AccessibilityNeeds;

  getSpecialRequirementsList(): Array<string>;
  setSpecialRequirementsList(value: Array<string>): AccessibilityNeeds;
  clearSpecialRequirementsList(): AccessibilityNeeds;
  addSpecialRequirements(value: string, index?: number): AccessibilityNeeds;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccessibilityNeeds.AsObject;
  static toObject(includeInstance: boolean, msg: AccessibilityNeeds): AccessibilityNeeds.AsObject;
  static serializeBinaryToWriter(message: AccessibilityNeeds, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccessibilityNeeds;
  static deserializeBinaryFromReader(message: AccessibilityNeeds, reader: jspb.BinaryReader): AccessibilityNeeds;
}

export namespace AccessibilityNeeds {
  export type AsObject = {
    wheelchairAccessible: boolean,
    hearingAssistance: boolean,
    visualAssistance: boolean,
    mobilityAssistance: boolean,
    dietaryRestrictionsList: Array<string>,
    specialRequirementsList: Array<string>,
  }
}

export class Interest extends jspb.Message {
  getId(): string;
  setId(value: string): Interest;

  getUserId(): string;
  setUserId(value: string): Interest;

  getName(): string;
  setName(value: string): Interest;

  getCategory(): string;
  setCategory(value: string): Interest;

  getDescription(): string;
  setDescription(value: string): Interest;

  getWeight(): number;
  setWeight(value: number): Interest;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Interest;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Interest;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Interest;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Interest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Interest.AsObject;
  static toObject(includeInstance: boolean, msg: Interest): Interest.AsObject;
  static serializeBinaryToWriter(message: Interest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Interest;
  static deserializeBinaryFromReader(message: Interest, reader: jspb.BinaryReader): Interest;
}

export namespace Interest {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    category: string,
    description: string,
    weight: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class Tag extends jspb.Message {
  getId(): string;
  setId(value: string): Tag;

  getUserId(): string;
  setUserId(value: string): Tag;

  getName(): string;
  setName(value: string): Tag;

  getColor(): string;
  setColor(value: string): Tag;

  getDescription(): string;
  setDescription(value: string): Tag;

  getUsageCount(): number;
  setUsageCount(value: number): Tag;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Tag;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Tag;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Tag;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Tag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tag.AsObject;
  static toObject(includeInstance: boolean, msg: Tag): Tag.AsObject;
  static serializeBinaryToWriter(message: Tag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tag;
  static deserializeBinaryFromReader(message: Tag, reader: jspb.BinaryReader): Tag;
}

export namespace Tag {
  export type AsObject = {
    id: string,
    userId: string,
    name: string,
    color: string,
    description: string,
    usageCount: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class UserStats extends jspb.Message {
  getTotalSearches(): number;
  setTotalSearches(value: number): UserStats;

  getSavedPois(): number;
  setSavedPois(value: number): UserStats;

  getCreatedItineraries(): number;
  setCreatedItineraries(value: number): UserStats;

  getCountriesVisited(): number;
  setCountriesVisited(value: number): UserStats;

  getCitiesExplored(): number;
  setCitiesExplored(value: number): UserStats;

  getLastActivity(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastActivity(value?: google_protobuf_timestamp_pb.Timestamp): UserStats;
  hasLastActivity(): boolean;
  clearLastActivity(): UserStats;

  getMemberSince(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setMemberSince(value?: google_protobuf_timestamp_pb.Timestamp): UserStats;
  hasMemberSince(): boolean;
  clearMemberSince(): UserStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserStats.AsObject;
  static toObject(includeInstance: boolean, msg: UserStats): UserStats.AsObject;
  static serializeBinaryToWriter(message: UserStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserStats;
  static deserializeBinaryFromReader(message: UserStats, reader: jspb.BinaryReader): UserStats;
}

export namespace UserStats {
  export type AsObject = {
    totalSearches: number,
    savedPois: number,
    createdItineraries: number,
    countriesVisited: number,
    citiesExplored: number,
    lastActivity?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    memberSince?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GetUserProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetUserProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetUserProfileRequest;
  hasRequest(): boolean;
  clearRequest(): GetUserProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserProfileRequest): GetUserProfileRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserProfileRequest;
  static deserializeBinaryFromReader(message: GetUserProfileRequest, reader: jspb.BinaryReader): GetUserProfileRequest;
}

export namespace GetUserProfileRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetUserProfileResponse extends jspb.Message {
  getProfile(): UserProfile | undefined;
  setProfile(value?: UserProfile): GetUserProfileResponse;
  hasProfile(): boolean;
  clearProfile(): GetUserProfileResponse;

  getStats(): UserStats | undefined;
  setStats(value?: UserStats): GetUserProfileResponse;
  hasStats(): boolean;
  clearStats(): GetUserProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetUserProfileResponse;
  hasResponse(): boolean;
  clearResponse(): GetUserProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserProfileResponse): GetUserProfileResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserProfileResponse;
  static deserializeBinaryFromReader(message: GetUserProfileResponse, reader: jspb.BinaryReader): GetUserProfileResponse;
}

export namespace GetUserProfileResponse {
  export type AsObject = {
    profile?: UserProfile.AsObject,
    stats?: UserStats.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateUserProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateUserProfileRequest;

  getProfile(): UserProfile | undefined;
  setProfile(value?: UserProfile): UpdateUserProfileRequest;
  hasProfile(): boolean;
  clearProfile(): UpdateUserProfileRequest;

  getUpdateFieldsList(): Array<string>;
  setUpdateFieldsList(value: Array<string>): UpdateUserProfileRequest;
  clearUpdateFieldsList(): UpdateUserProfileRequest;
  addUpdateFields(value: string, index?: number): UpdateUserProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateUserProfileRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateUserProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserProfileRequest): UpdateUserProfileRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateUserProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserProfileRequest;
  static deserializeBinaryFromReader(message: UpdateUserProfileRequest, reader: jspb.BinaryReader): UpdateUserProfileRequest;
}

export namespace UpdateUserProfileRequest {
  export type AsObject = {
    userId: string,
    profile?: UserProfile.AsObject,
    updateFieldsList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateUserProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateUserProfileResponse;

  getMessage(): string;
  setMessage(value: string): UpdateUserProfileResponse;

  getProfile(): UserProfile | undefined;
  setProfile(value?: UserProfile): UpdateUserProfileResponse;
  hasProfile(): boolean;
  clearProfile(): UpdateUserProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateUserProfileResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateUserProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserProfileResponse): UpdateUserProfileResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateUserProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserProfileResponse;
  static deserializeBinaryFromReader(message: UpdateUserProfileResponse, reader: jspb.BinaryReader): UpdateUserProfileResponse;
}

export namespace UpdateUserProfileResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    profile?: UserProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class GetSearchProfilesRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetSearchProfilesRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetSearchProfilesRequest;
  hasRequest(): boolean;
  clearRequest(): GetSearchProfilesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSearchProfilesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSearchProfilesRequest): GetSearchProfilesRequest.AsObject;
  static serializeBinaryToWriter(message: GetSearchProfilesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSearchProfilesRequest;
  static deserializeBinaryFromReader(message: GetSearchProfilesRequest, reader: jspb.BinaryReader): GetSearchProfilesRequest;
}

export namespace GetSearchProfilesRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetSearchProfilesResponse extends jspb.Message {
  getProfilesList(): Array<SearchProfile>;
  setProfilesList(value: Array<SearchProfile>): GetSearchProfilesResponse;
  clearProfilesList(): GetSearchProfilesResponse;
  addProfiles(value?: SearchProfile, index?: number): SearchProfile;

  getDefaultProfileId(): string;
  setDefaultProfileId(value: string): GetSearchProfilesResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetSearchProfilesResponse;
  hasResponse(): boolean;
  clearResponse(): GetSearchProfilesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSearchProfilesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSearchProfilesResponse): GetSearchProfilesResponse.AsObject;
  static serializeBinaryToWriter(message: GetSearchProfilesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSearchProfilesResponse;
  static deserializeBinaryFromReader(message: GetSearchProfilesResponse, reader: jspb.BinaryReader): GetSearchProfilesResponse;
}

export namespace GetSearchProfilesResponse {
  export type AsObject = {
    profilesList: Array<SearchProfile.AsObject>,
    defaultProfileId: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetSearchProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): GetSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): GetSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSearchProfileRequest): GetSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: GetSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSearchProfileRequest;
  static deserializeBinaryFromReader(message: GetSearchProfileRequest, reader: jspb.BinaryReader): GetSearchProfileRequest;
}

export namespace GetSearchProfileRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetSearchProfileResponse extends jspb.Message {
  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): GetSearchProfileResponse;
  hasProfile(): boolean;
  clearProfile(): GetSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): GetSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSearchProfileResponse): GetSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: GetSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSearchProfileResponse;
  static deserializeBinaryFromReader(message: GetSearchProfileResponse, reader: jspb.BinaryReader): GetSearchProfileResponse;
}

export namespace GetSearchProfileResponse {
  export type AsObject = {
    profile?: SearchProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CreateSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateSearchProfileRequest;

  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): CreateSearchProfileRequest;
  hasProfile(): boolean;
  clearProfile(): CreateSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): CreateSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateSearchProfileRequest): CreateSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: CreateSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateSearchProfileRequest;
  static deserializeBinaryFromReader(message: CreateSearchProfileRequest, reader: jspb.BinaryReader): CreateSearchProfileRequest;
}

export namespace CreateSearchProfileRequest {
  export type AsObject = {
    userId: string,
    profile?: SearchProfile.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): CreateSearchProfileResponse;

  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): CreateSearchProfileResponse;
  hasProfile(): boolean;
  clearProfile(): CreateSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): CreateSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateSearchProfileResponse): CreateSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: CreateSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateSearchProfileResponse;
  static deserializeBinaryFromReader(message: CreateSearchProfileResponse, reader: jspb.BinaryReader): CreateSearchProfileResponse;
}

export namespace CreateSearchProfileResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    profile?: SearchProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateSearchProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): UpdateSearchProfileRequest;

  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): UpdateSearchProfileRequest;
  hasProfile(): boolean;
  clearProfile(): UpdateSearchProfileRequest;

  getUpdateFieldsList(): Array<string>;
  setUpdateFieldsList(value: Array<string>): UpdateSearchProfileRequest;
  clearUpdateFieldsList(): UpdateSearchProfileRequest;
  addUpdateFields(value: string, index?: number): UpdateSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateSearchProfileRequest): UpdateSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSearchProfileRequest;
  static deserializeBinaryFromReader(message: UpdateSearchProfileRequest, reader: jspb.BinaryReader): UpdateSearchProfileRequest;
}

export namespace UpdateSearchProfileRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    profile?: SearchProfile.AsObject,
    updateFieldsList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): UpdateSearchProfileResponse;

  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): UpdateSearchProfileResponse;
  hasProfile(): boolean;
  clearProfile(): UpdateSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateSearchProfileResponse): UpdateSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSearchProfileResponse;
  static deserializeBinaryFromReader(message: UpdateSearchProfileResponse, reader: jspb.BinaryReader): UpdateSearchProfileResponse;
}

export namespace UpdateSearchProfileResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    profile?: SearchProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteSearchProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): DeleteSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteSearchProfileRequest): DeleteSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSearchProfileRequest;
  static deserializeBinaryFromReader(message: DeleteSearchProfileRequest, reader: jspb.BinaryReader): DeleteSearchProfileRequest;
}

export namespace DeleteSearchProfileRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): DeleteSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DeleteSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteSearchProfileResponse): DeleteSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteSearchProfileResponse;
  static deserializeBinaryFromReader(message: DeleteSearchProfileResponse, reader: jspb.BinaryReader): DeleteSearchProfileResponse;
}

export namespace DeleteSearchProfileResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetDefaultProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetDefaultProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetDefaultProfileRequest;
  hasRequest(): boolean;
  clearRequest(): GetDefaultProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDefaultProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDefaultProfileRequest): GetDefaultProfileRequest.AsObject;
  static serializeBinaryToWriter(message: GetDefaultProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDefaultProfileRequest;
  static deserializeBinaryFromReader(message: GetDefaultProfileRequest, reader: jspb.BinaryReader): GetDefaultProfileRequest;
}

export namespace GetDefaultProfileRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetDefaultProfileResponse extends jspb.Message {
  getProfile(): SearchProfile | undefined;
  setProfile(value?: SearchProfile): GetDefaultProfileResponse;
  hasProfile(): boolean;
  clearProfile(): GetDefaultProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetDefaultProfileResponse;
  hasResponse(): boolean;
  clearResponse(): GetDefaultProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDefaultProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDefaultProfileResponse): GetDefaultProfileResponse.AsObject;
  static serializeBinaryToWriter(message: GetDefaultProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDefaultProfileResponse;
  static deserializeBinaryFromReader(message: GetDefaultProfileResponse, reader: jspb.BinaryReader): GetDefaultProfileResponse;
}

export namespace GetDefaultProfileResponse {
  export type AsObject = {
    profile?: SearchProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class SetDefaultProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): SetDefaultProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): SetDefaultProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SetDefaultProfileRequest;
  hasRequest(): boolean;
  clearRequest(): SetDefaultProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetDefaultProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetDefaultProfileRequest): SetDefaultProfileRequest.AsObject;
  static serializeBinaryToWriter(message: SetDefaultProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetDefaultProfileRequest;
  static deserializeBinaryFromReader(message: SetDefaultProfileRequest, reader: jspb.BinaryReader): SetDefaultProfileRequest;
}

export namespace SetDefaultProfileRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    request?: BaseRequest.AsObject,
  }
}

export class SetDefaultProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SetDefaultProfileResponse;

  getMessage(): string;
  setMessage(value: string): SetDefaultProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SetDefaultProfileResponse;
  hasResponse(): boolean;
  clearResponse(): SetDefaultProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetDefaultProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetDefaultProfileResponse): SetDefaultProfileResponse.AsObject;
  static serializeBinaryToWriter(message: SetDefaultProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetDefaultProfileResponse;
  static deserializeBinaryFromReader(message: SetDefaultProfileResponse, reader: jspb.BinaryReader): SetDefaultProfileResponse;
}

export namespace SetDefaultProfileResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetInterestsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetInterestsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetInterestsRequest;
  hasRequest(): boolean;
  clearRequest(): GetInterestsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInterestsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetInterestsRequest): GetInterestsRequest.AsObject;
  static serializeBinaryToWriter(message: GetInterestsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInterestsRequest;
  static deserializeBinaryFromReader(message: GetInterestsRequest, reader: jspb.BinaryReader): GetInterestsRequest;
}

export namespace GetInterestsRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetInterestsResponse extends jspb.Message {
  getInterestsList(): Array<Interest>;
  setInterestsList(value: Array<Interest>): GetInterestsResponse;
  clearInterestsList(): GetInterestsResponse;
  addInterests(value?: Interest, index?: number): Interest;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetInterestsResponse;
  hasResponse(): boolean;
  clearResponse(): GetInterestsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetInterestsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetInterestsResponse): GetInterestsResponse.AsObject;
  static serializeBinaryToWriter(message: GetInterestsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetInterestsResponse;
  static deserializeBinaryFromReader(message: GetInterestsResponse, reader: jspb.BinaryReader): GetInterestsResponse;
}

export namespace GetInterestsResponse {
  export type AsObject = {
    interestsList: Array<Interest.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class CreateInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateInterestRequest;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): CreateInterestRequest;
  hasInterest(): boolean;
  clearInterest(): CreateInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateInterestRequest;
  hasRequest(): boolean;
  clearRequest(): CreateInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInterestRequest): CreateInterestRequest.AsObject;
  static serializeBinaryToWriter(message: CreateInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInterestRequest;
  static deserializeBinaryFromReader(message: CreateInterestRequest, reader: jspb.BinaryReader): CreateInterestRequest;
}

export namespace CreateInterestRequest {
  export type AsObject = {
    userId: string,
    interest?: Interest.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateInterestResponse;

  getMessage(): string;
  setMessage(value: string): CreateInterestResponse;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): CreateInterestResponse;
  hasInterest(): boolean;
  clearInterest(): CreateInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateInterestResponse;
  hasResponse(): boolean;
  clearResponse(): CreateInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateInterestResponse): CreateInterestResponse.AsObject;
  static serializeBinaryToWriter(message: CreateInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateInterestResponse;
  static deserializeBinaryFromReader(message: CreateInterestResponse, reader: jspb.BinaryReader): CreateInterestResponse;
}

export namespace CreateInterestResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    interest?: Interest.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateInterestRequest;

  getInterestId(): string;
  setInterestId(value: string): UpdateInterestRequest;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): UpdateInterestRequest;
  hasInterest(): boolean;
  clearInterest(): UpdateInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateInterestRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInterestRequest): UpdateInterestRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInterestRequest;
  static deserializeBinaryFromReader(message: UpdateInterestRequest, reader: jspb.BinaryReader): UpdateInterestRequest;
}

export namespace UpdateInterestRequest {
  export type AsObject = {
    userId: string,
    interestId: string,
    interest?: Interest.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateInterestResponse;

  getMessage(): string;
  setMessage(value: string): UpdateInterestResponse;

  getInterest(): Interest | undefined;
  setInterest(value?: Interest): UpdateInterestResponse;
  hasInterest(): boolean;
  clearInterest(): UpdateInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateInterestResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateInterestResponse): UpdateInterestResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateInterestResponse;
  static deserializeBinaryFromReader(message: UpdateInterestResponse, reader: jspb.BinaryReader): UpdateInterestResponse;
}

export namespace UpdateInterestResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    interest?: Interest.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteInterestRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteInterestRequest;

  getInterestId(): string;
  setInterestId(value: string): DeleteInterestRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteInterestRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteInterestRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteInterestRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteInterestRequest): DeleteInterestRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteInterestRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteInterestRequest;
  static deserializeBinaryFromReader(message: DeleteInterestRequest, reader: jspb.BinaryReader): DeleteInterestRequest;
}

export namespace DeleteInterestRequest {
  export type AsObject = {
    userId: string,
    interestId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteInterestResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteInterestResponse;

  getMessage(): string;
  setMessage(value: string): DeleteInterestResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DeleteInterestResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteInterestResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteInterestResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteInterestResponse): DeleteInterestResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteInterestResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteInterestResponse;
  static deserializeBinaryFromReader(message: DeleteInterestResponse, reader: jspb.BinaryReader): DeleteInterestResponse;
}

export namespace DeleteInterestResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    response?: BaseResponse.AsObject,
  }
}

export class GetTagsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetTagsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetTagsRequest;
  hasRequest(): boolean;
  clearRequest(): GetTagsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagsRequest): GetTagsRequest.AsObject;
  static serializeBinaryToWriter(message: GetTagsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagsRequest;
  static deserializeBinaryFromReader(message: GetTagsRequest, reader: jspb.BinaryReader): GetTagsRequest;
}

export namespace GetTagsRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetTagsResponse extends jspb.Message {
  getTagsList(): Array<Tag>;
  setTagsList(value: Array<Tag>): GetTagsResponse;
  clearTagsList(): GetTagsResponse;
  addTags(value?: Tag, index?: number): Tag;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetTagsResponse;
  hasResponse(): boolean;
  clearResponse(): GetTagsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagsResponse): GetTagsResponse.AsObject;
  static serializeBinaryToWriter(message: GetTagsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagsResponse;
  static deserializeBinaryFromReader(message: GetTagsResponse, reader: jspb.BinaryReader): GetTagsResponse;
}

export namespace GetTagsResponse {
  export type AsObject = {
    tagsList: Array<Tag.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class GetTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetTagRequest;

  getTagId(): string;
  setTagId(value: string): GetTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetTagRequest;
  hasRequest(): boolean;
  clearRequest(): GetTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagRequest): GetTagRequest.AsObject;
  static serializeBinaryToWriter(message: GetTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagRequest;
  static deserializeBinaryFromReader(message: GetTagRequest, reader: jspb.BinaryReader): GetTagRequest;
}

export namespace GetTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetTagResponse extends jspb.Message {
  getTag(): Tag | undefined;
  setTag(value?: Tag): GetTagResponse;
  hasTag(): boolean;
  clearTag(): GetTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetTagResponse;
  hasResponse(): boolean;
  clearResponse(): GetTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTagResponse): GetTagResponse.AsObject;
  static serializeBinaryToWriter(message: GetTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTagResponse;
  static deserializeBinaryFromReader(message: GetTagResponse, reader: jspb.BinaryReader): GetTagResponse;
}

export namespace GetTagResponse {
  export type AsObject = {
    tag?: Tag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CreateTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateTagRequest;

  getTag(): Tag | undefined;
  setTag(value?: Tag): CreateTagRequest;
  hasTag(): boolean;
  clearTag(): CreateTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): CreateTagRequest;
  hasRequest(): boolean;
  clearRequest(): CreateTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagRequest): CreateTagRequest.AsObject;
  static serializeBinaryToWriter(message: CreateTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagRequest;
  static deserializeBinaryFromReader(message: CreateTagRequest, reader: jspb.BinaryReader): CreateTagRequest;
}

export namespace CreateTagRequest {
  export type AsObject = {
    userId: string,
    tag?: Tag.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateTagResponse;

  getMessage(): string;
  setMessage(value: string): CreateTagResponse;

  getTag(): Tag | undefined;
  setTag(value?: Tag): CreateTagResponse;
  hasTag(): boolean;
  clearTag(): CreateTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): CreateTagResponse;
  hasResponse(): boolean;
  clearResponse(): CreateTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTagResponse): CreateTagResponse.AsObject;
  static serializeBinaryToWriter(message: CreateTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTagResponse;
  static deserializeBinaryFromReader(message: CreateTagResponse, reader: jspb.BinaryReader): CreateTagResponse;
}

export namespace CreateTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    tag?: Tag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateTagRequest;

  getTagId(): string;
  setTagId(value: string): UpdateTagRequest;

  getTag(): Tag | undefined;
  setTag(value?: Tag): UpdateTagRequest;
  hasTag(): boolean;
  clearTag(): UpdateTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): UpdateTagRequest;
  hasRequest(): boolean;
  clearRequest(): UpdateTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagRequest): UpdateTagRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagRequest;
  static deserializeBinaryFromReader(message: UpdateTagRequest, reader: jspb.BinaryReader): UpdateTagRequest;
}

export namespace UpdateTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    tag?: Tag.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateTagResponse;

  getMessage(): string;
  setMessage(value: string): UpdateTagResponse;

  getTag(): Tag | undefined;
  setTag(value?: Tag): UpdateTagResponse;
  hasTag(): boolean;
  clearTag(): UpdateTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): UpdateTagResponse;
  hasResponse(): boolean;
  clearResponse(): UpdateTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTagResponse): UpdateTagResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTagResponse;
  static deserializeBinaryFromReader(message: UpdateTagResponse, reader: jspb.BinaryReader): UpdateTagResponse;
}

export namespace UpdateTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
    tag?: Tag.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class DeleteTagRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DeleteTagRequest;

  getTagId(): string;
  setTagId(value: string): DeleteTagRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): DeleteTagRequest;
  hasRequest(): boolean;
  clearRequest(): DeleteTagRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTagRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTagRequest): DeleteTagRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteTagRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTagRequest;
  static deserializeBinaryFromReader(message: DeleteTagRequest, reader: jspb.BinaryReader): DeleteTagRequest;
}

export namespace DeleteTagRequest {
  export type AsObject = {
    userId: string,
    tagId: string,
    request?: BaseRequest.AsObject,
  }
}

export class DeleteTagResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteTagResponse;

  getMessage(): string;
  setMessage(value: string): DeleteTagResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): DeleteTagResponse;
  hasResponse(): boolean;
  clearResponse(): DeleteTagResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTagResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTagResponse): DeleteTagResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteTagResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTagResponse;
  static deserializeBinaryFromReader(message: DeleteTagResponse, reader: jspb.BinaryReader): DeleteTagResponse;
}

export namespace DeleteTagResponse {
  export type AsObject = {
    success: boolean,
    message: string,
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

