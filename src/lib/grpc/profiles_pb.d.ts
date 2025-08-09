import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class RangeFilter extends jspb.Message {
  getMin(): number;
  setMin(value: number): RangeFilter;

  getMax(): number;
  setMax(value: number): RangeFilter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RangeFilter.AsObject;
  static toObject(includeInstance: boolean, msg: RangeFilter): RangeFilter.AsObject;
  static serializeBinaryToWriter(message: RangeFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RangeFilter;
  static deserializeBinaryFromReader(message: RangeFilter, reader: jspb.BinaryReader): RangeFilter;
}

export namespace RangeFilter {
  export type AsObject = {
    min: number,
    max: number,
  }
}

export class AccommodationPreferences extends jspb.Message {
  getId(): string;
  setId(value: string): AccommodationPreferences;

  getUserPreferenceProfileId(): string;
  setUserPreferenceProfileId(value: string): AccommodationPreferences;

  getAccommodationTypeList(): Array<string>;
  setAccommodationTypeList(value: Array<string>): AccommodationPreferences;
  clearAccommodationTypeList(): AccommodationPreferences;
  addAccommodationType(value: string, index?: number): AccommodationPreferences;

  getStarRating(): RangeFilter | undefined;
  setStarRating(value?: RangeFilter): AccommodationPreferences;
  hasStarRating(): boolean;
  clearStarRating(): AccommodationPreferences;

  getPriceRangePerNight(): RangeFilter | undefined;
  setPriceRangePerNight(value?: RangeFilter): AccommodationPreferences;
  hasPriceRangePerNight(): boolean;
  clearPriceRangePerNight(): AccommodationPreferences;

  getAmenitiesList(): Array<string>;
  setAmenitiesList(value: Array<string>): AccommodationPreferences;
  clearAmenitiesList(): AccommodationPreferences;
  addAmenities(value: string, index?: number): AccommodationPreferences;

  getRoomTypeList(): Array<string>;
  setRoomTypeList(value: Array<string>): AccommodationPreferences;
  clearRoomTypeList(): AccommodationPreferences;
  addRoomType(value: string, index?: number): AccommodationPreferences;

  getChainPreference(): string;
  setChainPreference(value: string): AccommodationPreferences;

  getCancellationPolicyList(): Array<string>;
  setCancellationPolicyList(value: Array<string>): AccommodationPreferences;
  clearCancellationPolicyList(): AccommodationPreferences;
  addCancellationPolicy(value: string, index?: number): AccommodationPreferences;

  getBookingFlexibility(): string;
  setBookingFlexibility(value: string): AccommodationPreferences;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): AccommodationPreferences;
  hasCreatedAt(): boolean;
  clearCreatedAt(): AccommodationPreferences;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): AccommodationPreferences;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): AccommodationPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccommodationPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: AccommodationPreferences): AccommodationPreferences.AsObject;
  static serializeBinaryToWriter(message: AccommodationPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccommodationPreferences;
  static deserializeBinaryFromReader(message: AccommodationPreferences, reader: jspb.BinaryReader): AccommodationPreferences;
}

export namespace AccommodationPreferences {
  export type AsObject = {
    id: string,
    userPreferenceProfileId: string,
    accommodationTypeList: Array<string>,
    starRating?: RangeFilter.AsObject,
    priceRangePerNight?: RangeFilter.AsObject,
    amenitiesList: Array<string>,
    roomTypeList: Array<string>,
    chainPreference: string,
    cancellationPolicyList: Array<string>,
    bookingFlexibility: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class DiningPreferences extends jspb.Message {
  getId(): string;
  setId(value: string): DiningPreferences;

  getUserPreferenceProfileId(): string;
  setUserPreferenceProfileId(value: string): DiningPreferences;

  getCuisineTypesList(): Array<string>;
  setCuisineTypesList(value: Array<string>): DiningPreferences;
  clearCuisineTypesList(): DiningPreferences;
  addCuisineTypes(value: string, index?: number): DiningPreferences;

  getMealTypesList(): Array<string>;
  setMealTypesList(value: Array<string>): DiningPreferences;
  clearMealTypesList(): DiningPreferences;
  addMealTypes(value: string, index?: number): DiningPreferences;

  getServiceStyleList(): Array<string>;
  setServiceStyleList(value: Array<string>): DiningPreferences;
  clearServiceStyleList(): DiningPreferences;
  addServiceStyle(value: string, index?: number): DiningPreferences;

  getPriceRangePerPerson(): RangeFilter | undefined;
  setPriceRangePerPerson(value?: RangeFilter): DiningPreferences;
  hasPriceRangePerPerson(): boolean;
  clearPriceRangePerPerson(): DiningPreferences;

  getDietaryNeedsList(): Array<string>;
  setDietaryNeedsList(value: Array<string>): DiningPreferences;
  clearDietaryNeedsList(): DiningPreferences;
  addDietaryNeeds(value: string, index?: number): DiningPreferences;

  getAllergenFreeList(): Array<string>;
  setAllergenFreeList(value: Array<string>): DiningPreferences;
  clearAllergenFreeList(): DiningPreferences;
  addAllergenFree(value: string, index?: number): DiningPreferences;

  getMichelinRated(): boolean;
  setMichelinRated(value: boolean): DiningPreferences;

  getLocalRecommendations(): boolean;
  setLocalRecommendations(value: boolean): DiningPreferences;

  getChainVsLocal(): string;
  setChainVsLocal(value: string): DiningPreferences;

  getOrganicPreference(): boolean;
  setOrganicPreference(value: boolean): DiningPreferences;

  getOutdoorSeatingPreferred(): boolean;
  setOutdoorSeatingPreferred(value: boolean): DiningPreferences;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): DiningPreferences;
  hasCreatedAt(): boolean;
  clearCreatedAt(): DiningPreferences;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): DiningPreferences;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): DiningPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DiningPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: DiningPreferences): DiningPreferences.AsObject;
  static serializeBinaryToWriter(message: DiningPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DiningPreferences;
  static deserializeBinaryFromReader(message: DiningPreferences, reader: jspb.BinaryReader): DiningPreferences;
}

export namespace DiningPreferences {
  export type AsObject = {
    id: string,
    userPreferenceProfileId: string,
    cuisineTypesList: Array<string>,
    mealTypesList: Array<string>,
    serviceStyleList: Array<string>,
    priceRangePerPerson?: RangeFilter.AsObject,
    dietaryNeedsList: Array<string>,
    allergenFreeList: Array<string>,
    michelinRated: boolean,
    localRecommendations: boolean,
    chainVsLocal: string,
    organicPreference: boolean,
    outdoorSeatingPreferred: boolean,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ActivityPreferences extends jspb.Message {
  getId(): string;
  setId(value: string): ActivityPreferences;

  getUserPreferenceProfileId(): string;
  setUserPreferenceProfileId(value: string): ActivityPreferences;

  getActivityCategoriesList(): Array<string>;
  setActivityCategoriesList(value: Array<string>): ActivityPreferences;
  clearActivityCategoriesList(): ActivityPreferences;
  addActivityCategories(value: string, index?: number): ActivityPreferences;

  getPhysicalActivityLevel(): string;
  setPhysicalActivityLevel(value: string): ActivityPreferences;

  getIndoorOutdoorPreference(): string;
  setIndoorOutdoorPreference(value: string): ActivityPreferences;

  getCulturalImmersionLevel(): string;
  setCulturalImmersionLevel(value: string): ActivityPreferences;

  getMustSeeVsHiddenGems(): string;
  setMustSeeVsHiddenGems(value: string): ActivityPreferences;

  getEducationalPreference(): boolean;
  setEducationalPreference(value: boolean): ActivityPreferences;

  getPhotographyOpportunities(): boolean;
  setPhotographyOpportunities(value: boolean): ActivityPreferences;

  getSeasonSpecificActivitiesList(): Array<string>;
  setSeasonSpecificActivitiesList(value: Array<string>): ActivityPreferences;
  clearSeasonSpecificActivitiesList(): ActivityPreferences;
  addSeasonSpecificActivities(value: string, index?: number): ActivityPreferences;

  getAvoidCrowds(): boolean;
  setAvoidCrowds(value: boolean): ActivityPreferences;

  getLocalEventsInterestList(): Array<string>;
  setLocalEventsInterestList(value: Array<string>): ActivityPreferences;
  clearLocalEventsInterestList(): ActivityPreferences;
  addLocalEventsInterest(value: string, index?: number): ActivityPreferences;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ActivityPreferences;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ActivityPreferences;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ActivityPreferences;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): ActivityPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityPreferences): ActivityPreferences.AsObject;
  static serializeBinaryToWriter(message: ActivityPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityPreferences;
  static deserializeBinaryFromReader(message: ActivityPreferences, reader: jspb.BinaryReader): ActivityPreferences;
}

export namespace ActivityPreferences {
  export type AsObject = {
    id: string,
    userPreferenceProfileId: string,
    activityCategoriesList: Array<string>,
    physicalActivityLevel: string,
    indoorOutdoorPreference: string,
    culturalImmersionLevel: string,
    mustSeeVsHiddenGems: string,
    educationalPreference: boolean,
    photographyOpportunities: boolean,
    seasonSpecificActivitiesList: Array<string>,
    avoidCrowds: boolean,
    localEventsInterestList: Array<string>,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ItineraryPreferences extends jspb.Message {
  getId(): string;
  setId(value: string): ItineraryPreferences;

  getUserPreferenceProfileId(): string;
  setUserPreferenceProfileId(value: string): ItineraryPreferences;

  getPlanningStyle(): string;
  setPlanningStyle(value: string): ItineraryPreferences;

  getPreferredPace(): string;
  setPreferredPace(value: string): ItineraryPreferences;

  getTimeFlexibility(): string;
  setTimeFlexibility(value: string): ItineraryPreferences;

  getMorningVsEvening(): string;
  setMorningVsEvening(value: string): ItineraryPreferences;

  getWeekendVsWeekday(): string;
  setWeekendVsWeekday(value: string): ItineraryPreferences;

  getPreferredSeasonsList(): Array<string>;
  setPreferredSeasonsList(value: Array<string>): ItineraryPreferences;
  clearPreferredSeasonsList(): ItineraryPreferences;
  addPreferredSeasons(value: string, index?: number): ItineraryPreferences;

  getAvoidPeakSeason(): boolean;
  setAvoidPeakSeason(value: boolean): ItineraryPreferences;

  getAdventureVsRelaxation(): string;
  setAdventureVsRelaxation(value: string): ItineraryPreferences;

  getSpontaneousVsPlanned(): string;
  setSpontaneousVsPlanned(value: string): ItineraryPreferences;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ItineraryPreferences;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ItineraryPreferences;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ItineraryPreferences;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): ItineraryPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ItineraryPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: ItineraryPreferences): ItineraryPreferences.AsObject;
  static serializeBinaryToWriter(message: ItineraryPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ItineraryPreferences;
  static deserializeBinaryFromReader(message: ItineraryPreferences, reader: jspb.BinaryReader): ItineraryPreferences;
}

export namespace ItineraryPreferences {
  export type AsObject = {
    id: string,
    userPreferenceProfileId: string,
    planningStyle: string,
    preferredPace: string,
    timeFlexibility: string,
    morningVsEvening: string,
    weekendVsWeekday: string,
    preferredSeasonsList: Array<string>,
    avoidPeakSeason: boolean,
    adventureVsRelaxation: string,
    spontaneousVsPlanned: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class InterestReference extends jspb.Message {
  getId(): string;
  setId(value: string): InterestReference;

  getName(): string;
  setName(value: string): InterestReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InterestReference.AsObject;
  static toObject(includeInstance: boolean, msg: InterestReference): InterestReference.AsObject;
  static serializeBinaryToWriter(message: InterestReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InterestReference;
  static deserializeBinaryFromReader(message: InterestReference, reader: jspb.BinaryReader): InterestReference;
}

export namespace InterestReference {
  export type AsObject = {
    id: string,
    name: string,
  }
}

export class TagReference extends jspb.Message {
  getId(): string;
  setId(value: string): TagReference;

  getName(): string;
  setName(value: string): TagReference;

  getTagType(): string;
  setTagType(value: string): TagReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TagReference.AsObject;
  static toObject(includeInstance: boolean, msg: TagReference): TagReference.AsObject;
  static serializeBinaryToWriter(message: TagReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TagReference;
  static deserializeBinaryFromReader(message: TagReference, reader: jspb.BinaryReader): TagReference;
}

export namespace TagReference {
  export type AsObject = {
    id: string,
    name: string,
    tagType: string,
  }
}

export class UserPreferenceProfile extends jspb.Message {
  getId(): string;
  setId(value: string): UserPreferenceProfile;

  getUserId(): string;
  setUserId(value: string): UserPreferenceProfile;

  getProfileName(): string;
  setProfileName(value: string): UserPreferenceProfile;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): UserPreferenceProfile;

  getSearchRadiusKm(): number;
  setSearchRadiusKm(value: number): UserPreferenceProfile;

  getPreferredTime(): DayPreference;
  setPreferredTime(value: DayPreference): UserPreferenceProfile;

  getBudgetLevel(): number;
  setBudgetLevel(value: number): UserPreferenceProfile;

  getPreferredPace(): SearchPace;
  setPreferredPace(value: SearchPace): UserPreferenceProfile;

  getPreferAccessiblePois(): boolean;
  setPreferAccessiblePois(value: boolean): UserPreferenceProfile;

  getPreferOutdoorSeating(): boolean;
  setPreferOutdoorSeating(value: boolean): UserPreferenceProfile;

  getPreferDogFriendly(): boolean;
  setPreferDogFriendly(value: boolean): UserPreferenceProfile;

  getPreferredVibesList(): Array<string>;
  setPreferredVibesList(value: Array<string>): UserPreferenceProfile;
  clearPreferredVibesList(): UserPreferenceProfile;
  addPreferredVibes(value: string, index?: number): UserPreferenceProfile;

  getPreferredTransport(): TransportPreference;
  setPreferredTransport(value: TransportPreference): UserPreferenceProfile;

  getDietaryNeedsList(): Array<string>;
  setDietaryNeedsList(value: Array<string>): UserPreferenceProfile;
  clearDietaryNeedsList(): UserPreferenceProfile;
  addDietaryNeeds(value: string, index?: number): UserPreferenceProfile;

  getInterestsList(): Array<InterestReference>;
  setInterestsList(value: Array<InterestReference>): UserPreferenceProfile;
  clearInterestsList(): UserPreferenceProfile;
  addInterests(value?: InterestReference, index?: number): InterestReference;

  getTagsList(): Array<TagReference>;
  setTagsList(value: Array<TagReference>): UserPreferenceProfile;
  clearTagsList(): UserPreferenceProfile;
  addTags(value?: TagReference, index?: number): TagReference;

  getUserLatitude(): number;
  setUserLatitude(value: number): UserPreferenceProfile;

  getUserLongitude(): number;
  setUserLongitude(value: number): UserPreferenceProfile;

  getAccommodationPreferences(): AccommodationPreferences | undefined;
  setAccommodationPreferences(value?: AccommodationPreferences): UserPreferenceProfile;
  hasAccommodationPreferences(): boolean;
  clearAccommodationPreferences(): UserPreferenceProfile;

  getDiningPreferences(): DiningPreferences | undefined;
  setDiningPreferences(value?: DiningPreferences): UserPreferenceProfile;
  hasDiningPreferences(): boolean;
  clearDiningPreferences(): UserPreferenceProfile;

  getActivityPreferences(): ActivityPreferences | undefined;
  setActivityPreferences(value?: ActivityPreferences): UserPreferenceProfile;
  hasActivityPreferences(): boolean;
  clearActivityPreferences(): UserPreferenceProfile;

  getItineraryPreferences(): ItineraryPreferences | undefined;
  setItineraryPreferences(value?: ItineraryPreferences): UserPreferenceProfile;
  hasItineraryPreferences(): boolean;
  clearItineraryPreferences(): UserPreferenceProfile;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserPreferenceProfile;
  hasCreatedAt(): boolean;
  clearCreatedAt(): UserPreferenceProfile;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserPreferenceProfile;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserPreferenceProfile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPreferenceProfile.AsObject;
  static toObject(includeInstance: boolean, msg: UserPreferenceProfile): UserPreferenceProfile.AsObject;
  static serializeBinaryToWriter(message: UserPreferenceProfile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPreferenceProfile;
  static deserializeBinaryFromReader(message: UserPreferenceProfile, reader: jspb.BinaryReader): UserPreferenceProfile;
}

export namespace UserPreferenceProfile {
  export type AsObject = {
    id: string,
    userId: string,
    profileName: string,
    isDefault: boolean,
    searchRadiusKm: number,
    preferredTime: DayPreference,
    budgetLevel: number,
    preferredPace: SearchPace,
    preferAccessiblePois: boolean,
    preferOutdoorSeating: boolean,
    preferDogFriendly: boolean,
    preferredVibesList: Array<string>,
    preferredTransport: TransportPreference,
    dietaryNeedsList: Array<string>,
    interestsList: Array<InterestReference.AsObject>,
    tagsList: Array<TagReference.AsObject>,
    userLatitude: number,
    userLongitude: number,
    accommodationPreferences?: AccommodationPreferences.AsObject,
    diningPreferences?: DiningPreferences.AsObject,
    activityPreferences?: ActivityPreferences.AsObject,
    itineraryPreferences?: ItineraryPreferences.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateUserPreferenceProfileParams extends jspb.Message {
  getProfileName(): string;
  setProfileName(value: string): CreateUserPreferenceProfileParams;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): CreateUserPreferenceProfileParams;

  getSearchRadiusKm(): number;
  setSearchRadiusKm(value: number): CreateUserPreferenceProfileParams;

  getPreferredTime(): DayPreference;
  setPreferredTime(value: DayPreference): CreateUserPreferenceProfileParams;

  getBudgetLevel(): number;
  setBudgetLevel(value: number): CreateUserPreferenceProfileParams;

  getPreferredPace(): SearchPace;
  setPreferredPace(value: SearchPace): CreateUserPreferenceProfileParams;

  getPreferAccessiblePois(): boolean;
  setPreferAccessiblePois(value: boolean): CreateUserPreferenceProfileParams;

  getPreferOutdoorSeating(): boolean;
  setPreferOutdoorSeating(value: boolean): CreateUserPreferenceProfileParams;

  getPreferDogFriendly(): boolean;
  setPreferDogFriendly(value: boolean): CreateUserPreferenceProfileParams;

  getPreferredVibesList(): Array<string>;
  setPreferredVibesList(value: Array<string>): CreateUserPreferenceProfileParams;
  clearPreferredVibesList(): CreateUserPreferenceProfileParams;
  addPreferredVibes(value: string, index?: number): CreateUserPreferenceProfileParams;

  getPreferredTransport(): TransportPreference;
  setPreferredTransport(value: TransportPreference): CreateUserPreferenceProfileParams;

  getDietaryNeedsList(): Array<string>;
  setDietaryNeedsList(value: Array<string>): CreateUserPreferenceProfileParams;
  clearDietaryNeedsList(): CreateUserPreferenceProfileParams;
  addDietaryNeeds(value: string, index?: number): CreateUserPreferenceProfileParams;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): CreateUserPreferenceProfileParams;
  clearTagsList(): CreateUserPreferenceProfileParams;
  addTags(value: string, index?: number): CreateUserPreferenceProfileParams;

  getInterestsList(): Array<string>;
  setInterestsList(value: Array<string>): CreateUserPreferenceProfileParams;
  clearInterestsList(): CreateUserPreferenceProfileParams;
  addInterests(value: string, index?: number): CreateUserPreferenceProfileParams;

  getAccommodationPreferences(): AccommodationPreferences | undefined;
  setAccommodationPreferences(value?: AccommodationPreferences): CreateUserPreferenceProfileParams;
  hasAccommodationPreferences(): boolean;
  clearAccommodationPreferences(): CreateUserPreferenceProfileParams;

  getDiningPreferences(): DiningPreferences | undefined;
  setDiningPreferences(value?: DiningPreferences): CreateUserPreferenceProfileParams;
  hasDiningPreferences(): boolean;
  clearDiningPreferences(): CreateUserPreferenceProfileParams;

  getActivityPreferences(): ActivityPreferences | undefined;
  setActivityPreferences(value?: ActivityPreferences): CreateUserPreferenceProfileParams;
  hasActivityPreferences(): boolean;
  clearActivityPreferences(): CreateUserPreferenceProfileParams;

  getItineraryPreferences(): ItineraryPreferences | undefined;
  setItineraryPreferences(value?: ItineraryPreferences): CreateUserPreferenceProfileParams;
  hasItineraryPreferences(): boolean;
  clearItineraryPreferences(): CreateUserPreferenceProfileParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserPreferenceProfileParams.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserPreferenceProfileParams): CreateUserPreferenceProfileParams.AsObject;
  static serializeBinaryToWriter(message: CreateUserPreferenceProfileParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserPreferenceProfileParams;
  static deserializeBinaryFromReader(message: CreateUserPreferenceProfileParams, reader: jspb.BinaryReader): CreateUserPreferenceProfileParams;
}

export namespace CreateUserPreferenceProfileParams {
  export type AsObject = {
    profileName: string,
    isDefault: boolean,
    searchRadiusKm: number,
    preferredTime: DayPreference,
    budgetLevel: number,
    preferredPace: SearchPace,
    preferAccessiblePois: boolean,
    preferOutdoorSeating: boolean,
    preferDogFriendly: boolean,
    preferredVibesList: Array<string>,
    preferredTransport: TransportPreference,
    dietaryNeedsList: Array<string>,
    tagsList: Array<string>,
    interestsList: Array<string>,
    accommodationPreferences?: AccommodationPreferences.AsObject,
    diningPreferences?: DiningPreferences.AsObject,
    activityPreferences?: ActivityPreferences.AsObject,
    itineraryPreferences?: ItineraryPreferences.AsObject,
  }
}

export class UpdateSearchProfileParams extends jspb.Message {
  getProfileName(): string;
  setProfileName(value: string): UpdateSearchProfileParams;

  getIsDefault(): boolean;
  setIsDefault(value: boolean): UpdateSearchProfileParams;

  getSearchRadiusKm(): number;
  setSearchRadiusKm(value: number): UpdateSearchProfileParams;

  getPreferredTime(): DayPreference;
  setPreferredTime(value: DayPreference): UpdateSearchProfileParams;

  getBudgetLevel(): number;
  setBudgetLevel(value: number): UpdateSearchProfileParams;

  getPreferredPace(): SearchPace;
  setPreferredPace(value: SearchPace): UpdateSearchProfileParams;

  getPreferAccessiblePois(): boolean;
  setPreferAccessiblePois(value: boolean): UpdateSearchProfileParams;

  getPreferOutdoorSeating(): boolean;
  setPreferOutdoorSeating(value: boolean): UpdateSearchProfileParams;

  getPreferDogFriendly(): boolean;
  setPreferDogFriendly(value: boolean): UpdateSearchProfileParams;

  getPreferredVibesList(): Array<string>;
  setPreferredVibesList(value: Array<string>): UpdateSearchProfileParams;
  clearPreferredVibesList(): UpdateSearchProfileParams;
  addPreferredVibes(value: string, index?: number): UpdateSearchProfileParams;

  getPreferredTransport(): TransportPreference;
  setPreferredTransport(value: TransportPreference): UpdateSearchProfileParams;

  getDietaryNeedsList(): Array<string>;
  setDietaryNeedsList(value: Array<string>): UpdateSearchProfileParams;
  clearDietaryNeedsList(): UpdateSearchProfileParams;
  addDietaryNeeds(value: string, index?: number): UpdateSearchProfileParams;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): UpdateSearchProfileParams;
  clearTagsList(): UpdateSearchProfileParams;
  addTags(value: string, index?: number): UpdateSearchProfileParams;

  getInterestsList(): Array<string>;
  setInterestsList(value: Array<string>): UpdateSearchProfileParams;
  clearInterestsList(): UpdateSearchProfileParams;
  addInterests(value: string, index?: number): UpdateSearchProfileParams;

  getAccommodationPreferences(): AccommodationPreferences | undefined;
  setAccommodationPreferences(value?: AccommodationPreferences): UpdateSearchProfileParams;
  hasAccommodationPreferences(): boolean;
  clearAccommodationPreferences(): UpdateSearchProfileParams;

  getDiningPreferences(): DiningPreferences | undefined;
  setDiningPreferences(value?: DiningPreferences): UpdateSearchProfileParams;
  hasDiningPreferences(): boolean;
  clearDiningPreferences(): UpdateSearchProfileParams;

  getActivityPreferences(): ActivityPreferences | undefined;
  setActivityPreferences(value?: ActivityPreferences): UpdateSearchProfileParams;
  hasActivityPreferences(): boolean;
  clearActivityPreferences(): UpdateSearchProfileParams;

  getItineraryPreferences(): ItineraryPreferences | undefined;
  setItineraryPreferences(value?: ItineraryPreferences): UpdateSearchProfileParams;
  hasItineraryPreferences(): boolean;
  clearItineraryPreferences(): UpdateSearchProfileParams;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateSearchProfileParams.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateSearchProfileParams): UpdateSearchProfileParams.AsObject;
  static serializeBinaryToWriter(message: UpdateSearchProfileParams, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateSearchProfileParams;
  static deserializeBinaryFromReader(message: UpdateSearchProfileParams, reader: jspb.BinaryReader): UpdateSearchProfileParams;
}

export namespace UpdateSearchProfileParams {
  export type AsObject = {
    profileName: string,
    isDefault: boolean,
    searchRadiusKm: number,
    preferredTime: DayPreference,
    budgetLevel: number,
    preferredPace: SearchPace,
    preferAccessiblePois: boolean,
    preferOutdoorSeating: boolean,
    preferDogFriendly: boolean,
    preferredVibesList: Array<string>,
    preferredTransport: TransportPreference,
    dietaryNeedsList: Array<string>,
    tagsList: Array<string>,
    interestsList: Array<string>,
    accommodationPreferences?: AccommodationPreferences.AsObject,
    diningPreferences?: DiningPreferences.AsObject,
    activityPreferences?: ActivityPreferences.AsObject,
    itineraryPreferences?: ItineraryPreferences.AsObject,
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
  getProfilesList(): Array<UserPreferenceProfile>;
  setProfilesList(value: Array<UserPreferenceProfile>): GetSearchProfilesResponse;
  clearProfilesList(): GetSearchProfilesResponse;
  addProfiles(value?: UserPreferenceProfile, index?: number): UserPreferenceProfile;

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
    profilesList: Array<UserPreferenceProfile.AsObject>,
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
  getProfile(): UserPreferenceProfile | undefined;
  setProfile(value?: UserPreferenceProfile): GetSearchProfileResponse;
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
    profile?: UserPreferenceProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class GetDefaultSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetDefaultSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetDefaultSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): GetDefaultSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDefaultSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDefaultSearchProfileRequest): GetDefaultSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: GetDefaultSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDefaultSearchProfileRequest;
  static deserializeBinaryFromReader(message: GetDefaultSearchProfileRequest, reader: jspb.BinaryReader): GetDefaultSearchProfileRequest;
}

export namespace GetDefaultSearchProfileRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetDefaultSearchProfileResponse extends jspb.Message {
  getProfile(): UserPreferenceProfile | undefined;
  setProfile(value?: UserPreferenceProfile): GetDefaultSearchProfileResponse;
  hasProfile(): boolean;
  clearProfile(): GetDefaultSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetDefaultSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): GetDefaultSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDefaultSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDefaultSearchProfileResponse): GetDefaultSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: GetDefaultSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDefaultSearchProfileResponse;
  static deserializeBinaryFromReader(message: GetDefaultSearchProfileResponse, reader: jspb.BinaryReader): GetDefaultSearchProfileResponse;
}

export namespace GetDefaultSearchProfileResponse {
  export type AsObject = {
    profile?: UserPreferenceProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class CreateSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): CreateSearchProfileRequest;

  getProfile(): CreateUserPreferenceProfileParams | undefined;
  setProfile(value?: CreateUserPreferenceProfileParams): CreateSearchProfileRequest;
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
    profile?: CreateUserPreferenceProfileParams.AsObject,
    request?: BaseRequest.AsObject,
  }
}

export class CreateSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): CreateSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): CreateSearchProfileResponse;

  getProfile(): UserPreferenceProfile | undefined;
  setProfile(value?: UserPreferenceProfile): CreateSearchProfileResponse;
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
    profile?: UserPreferenceProfile.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class UpdateSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UpdateSearchProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): UpdateSearchProfileRequest;

  getProfile(): UpdateSearchProfileParams | undefined;
  setProfile(value?: UpdateSearchProfileParams): UpdateSearchProfileRequest;
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
    profile?: UpdateSearchProfileParams.AsObject,
    updateFieldsList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class UpdateSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpdateSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): UpdateSearchProfileResponse;

  getProfile(): UserPreferenceProfile | undefined;
  setProfile(value?: UserPreferenceProfile): UpdateSearchProfileResponse;
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
    profile?: UserPreferenceProfile.AsObject,
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

export class SetDefaultSearchProfileRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): SetDefaultSearchProfileRequest;

  getProfileId(): string;
  setProfileId(value: string): SetDefaultSearchProfileRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): SetDefaultSearchProfileRequest;
  hasRequest(): boolean;
  clearRequest(): SetDefaultSearchProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetDefaultSearchProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetDefaultSearchProfileRequest): SetDefaultSearchProfileRequest.AsObject;
  static serializeBinaryToWriter(message: SetDefaultSearchProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetDefaultSearchProfileRequest;
  static deserializeBinaryFromReader(message: SetDefaultSearchProfileRequest, reader: jspb.BinaryReader): SetDefaultSearchProfileRequest;
}

export namespace SetDefaultSearchProfileRequest {
  export type AsObject = {
    userId: string,
    profileId: string,
    request?: BaseRequest.AsObject,
  }
}

export class SetDefaultSearchProfileResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SetDefaultSearchProfileResponse;

  getMessage(): string;
  setMessage(value: string): SetDefaultSearchProfileResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): SetDefaultSearchProfileResponse;
  hasResponse(): boolean;
  clearResponse(): SetDefaultSearchProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetDefaultSearchProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetDefaultSearchProfileResponse): SetDefaultSearchProfileResponse.AsObject;
  static serializeBinaryToWriter(message: SetDefaultSearchProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetDefaultSearchProfileResponse;
  static deserializeBinaryFromReader(message: SetDefaultSearchProfileResponse, reader: jspb.BinaryReader): SetDefaultSearchProfileResponse;
}

export namespace SetDefaultSearchProfileResponse {
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

export enum DayPreference { 
  DAY_PREFERENCE_UNSPECIFIED = 0,
  DAY_PREFERENCE_ANY = 1,
  DAY_PREFERENCE_DAY = 2,
  DAY_PREFERENCE_NIGHT = 3,
}
export enum SearchPace { 
  SEARCH_PACE_UNSPECIFIED = 0,
  SEARCH_PACE_ANY = 1,
  SEARCH_PACE_RELAXED = 2,
  SEARCH_PACE_MODERATE = 3,
  SEARCH_PACE_FAST = 4,
}
export enum TransportPreference { 
  TRANSPORT_PREFERENCE_UNSPECIFIED = 0,
  TRANSPORT_PREFERENCE_ANY = 1,
  TRANSPORT_PREFERENCE_WALK = 2,
  TRANSPORT_PREFERENCE_PUBLIC = 3,
  TRANSPORT_PREFERENCE_CAR = 4,
}
