import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class MainPageStatistics extends jspb.Message {
  getTotalPois(): number;
  setTotalPois(value: number): MainPageStatistics;

  getTotalCities(): number;
  setTotalCities(value: number): MainPageStatistics;

  getTotalUsers(): number;
  setTotalUsers(value: number): MainPageStatistics;

  getTotalItineraries(): number;
  setTotalItineraries(value: number): MainPageStatistics;

  getTotalSearchesToday(): number;
  setTotalSearchesToday(value: number): MainPageStatistics;

  getActiveUsersToday(): number;
  setActiveUsersToday(value: number): MainPageStatistics;

  getRecentActivity(): RecentActivity | undefined;
  setRecentActivity(value?: RecentActivity): MainPageStatistics;
  hasRecentActivity(): boolean;
  clearRecentActivity(): MainPageStatistics;

  getPopularDestinationsList(): Array<PopularDestination>;
  setPopularDestinationsList(value: Array<PopularDestination>): MainPageStatistics;
  clearPopularDestinationsList(): MainPageStatistics;
  addPopularDestinations(value?: PopularDestination, index?: number): PopularDestination;

  getTrendingCategories(): TrendingCategories | undefined;
  setTrendingCategories(value?: TrendingCategories): MainPageStatistics;
  hasTrendingCategories(): boolean;
  clearTrendingCategories(): MainPageStatistics;

  getLastUpdated(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastUpdated(value?: google_protobuf_timestamp_pb.Timestamp): MainPageStatistics;
  hasLastUpdated(): boolean;
  clearLastUpdated(): MainPageStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MainPageStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: MainPageStatistics): MainPageStatistics.AsObject;
  static serializeBinaryToWriter(message: MainPageStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MainPageStatistics;
  static deserializeBinaryFromReader(message: MainPageStatistics, reader: jspb.BinaryReader): MainPageStatistics;
}

export namespace MainPageStatistics {
  export type AsObject = {
    totalPois: number,
    totalCities: number,
    totalUsers: number,
    totalItineraries: number,
    totalSearchesToday: number,
    activeUsersToday: number,
    recentActivity?: RecentActivity.AsObject,
    popularDestinationsList: Array<PopularDestination.AsObject>,
    trendingCategories?: TrendingCategories.AsObject,
    lastUpdated?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class RecentActivity extends jspb.Message {
  getSearchesLastHour(): number;
  setSearchesLastHour(value: number): RecentActivity;

  getNewUsersToday(): number;
  setNewUsersToday(value: number): RecentActivity;

  getItinerariesCreatedToday(): number;
  setItinerariesCreatedToday(value: number): RecentActivity;

  getPoisFavoritedToday(): number;
  setPoisFavoritedToday(value: number): RecentActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecentActivity.AsObject;
  static toObject(includeInstance: boolean, msg: RecentActivity): RecentActivity.AsObject;
  static serializeBinaryToWriter(message: RecentActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecentActivity;
  static deserializeBinaryFromReader(message: RecentActivity, reader: jspb.BinaryReader): RecentActivity;
}

export namespace RecentActivity {
  export type AsObject = {
    searchesLastHour: number,
    newUsersToday: number,
    itinerariesCreatedToday: number,
    poisFavoritedToday: number,
  }
}

export class PopularDestination extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): PopularDestination;

  getCityName(): string;
  setCityName(value: string): PopularDestination;

  getCountry(): string;
  setCountry(value: string): PopularDestination;

  getSearchCount(): number;
  setSearchCount(value: number): PopularDestination;

  getUserCount(): number;
  setUserCount(value: number): PopularDestination;

  getGrowthPercentage(): number;
  setGrowthPercentage(value: number): PopularDestination;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PopularDestination.AsObject;
  static toObject(includeInstance: boolean, msg: PopularDestination): PopularDestination.AsObject;
  static serializeBinaryToWriter(message: PopularDestination, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PopularDestination;
  static deserializeBinaryFromReader(message: PopularDestination, reader: jspb.BinaryReader): PopularDestination;
}

export namespace PopularDestination {
  export type AsObject = {
    cityId: string,
    cityName: string,
    country: string,
    searchCount: number,
    userCount: number,
    growthPercentage: number,
  }
}

export class TrendingCategories extends jspb.Message {
  getCategoriesList(): Array<CategoryTrend>;
  setCategoriesList(value: Array<CategoryTrend>): TrendingCategories;
  clearCategoriesList(): TrendingCategories;
  addCategories(value?: CategoryTrend, index?: number): CategoryTrend;

  getTimePeriod(): string;
  setTimePeriod(value: string): TrendingCategories;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TrendingCategories.AsObject;
  static toObject(includeInstance: boolean, msg: TrendingCategories): TrendingCategories.AsObject;
  static serializeBinaryToWriter(message: TrendingCategories, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TrendingCategories;
  static deserializeBinaryFromReader(message: TrendingCategories, reader: jspb.BinaryReader): TrendingCategories;
}

export namespace TrendingCategories {
  export type AsObject = {
    categoriesList: Array<CategoryTrend.AsObject>,
    timePeriod: string,
  }
}

export class CategoryTrend extends jspb.Message {
  getCategory(): string;
  setCategory(value: string): CategoryTrend;

  getSearchCount(): number;
  setSearchCount(value: number): CategoryTrend;

  getGrowthPercentage(): number;
  setGrowthPercentage(value: number): CategoryTrend;

  getRank(): number;
  setRank(value: number): CategoryTrend;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CategoryTrend.AsObject;
  static toObject(includeInstance: boolean, msg: CategoryTrend): CategoryTrend.AsObject;
  static serializeBinaryToWriter(message: CategoryTrend, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CategoryTrend;
  static deserializeBinaryFromReader(message: CategoryTrend, reader: jspb.BinaryReader): CategoryTrend;
}

export namespace CategoryTrend {
  export type AsObject = {
    category: string,
    searchCount: number,
    growthPercentage: number,
    rank: number,
  }
}

export class DetailedPOIStatistics extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): DetailedPOIStatistics;

  getTotalPoiSearches(): number;
  setTotalPoiSearches(value: number): DetailedPOIStatistics;

  getFavoritePoisCount(): number;
  setFavoritePoisCount(value: number): DetailedPOIStatistics;

  getVisitedCitiesCount(): number;
  setVisitedCitiesCount(value: number): DetailedPOIStatistics;

  getTopCategoriesList(): Array<string>;
  setTopCategoriesList(value: Array<string>): DetailedPOIStatistics;
  clearTopCategoriesList(): DetailedPOIStatistics;
  addTopCategories(value: string, index?: number): DetailedPOIStatistics;

  getCityInteractionsList(): Array<CityInteractionStats>;
  setCityInteractionsList(value: Array<CityInteractionStats>): DetailedPOIStatistics;
  clearCityInteractionsList(): DetailedPOIStatistics;
  addCityInteractions(value?: CityInteractionStats, index?: number): CityInteractionStats;

  getSearchPatterns(): SearchPatterns | undefined;
  setSearchPatterns(value?: SearchPatterns): DetailedPOIStatistics;
  hasSearchPatterns(): boolean;
  clearSearchPatterns(): DetailedPOIStatistics;

  getTimeAnalytics(): TimeBasedAnalytics | undefined;
  setTimeAnalytics(value?: TimeBasedAnalytics): DetailedPOIStatistics;
  hasTimeAnalytics(): boolean;
  clearTimeAnalytics(): DetailedPOIStatistics;

  getGeneratedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setGeneratedAt(value?: google_protobuf_timestamp_pb.Timestamp): DetailedPOIStatistics;
  hasGeneratedAt(): boolean;
  clearGeneratedAt(): DetailedPOIStatistics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetailedPOIStatistics.AsObject;
  static toObject(includeInstance: boolean, msg: DetailedPOIStatistics): DetailedPOIStatistics.AsObject;
  static serializeBinaryToWriter(message: DetailedPOIStatistics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetailedPOIStatistics;
  static deserializeBinaryFromReader(message: DetailedPOIStatistics, reader: jspb.BinaryReader): DetailedPOIStatistics;
}

export namespace DetailedPOIStatistics {
  export type AsObject = {
    userId: string,
    totalPoiSearches: number,
    favoritePoisCount: number,
    visitedCitiesCount: number,
    topCategoriesList: Array<string>,
    cityInteractionsList: Array<CityInteractionStats.AsObject>,
    searchPatterns?: SearchPatterns.AsObject,
    timeAnalytics?: TimeBasedAnalytics.AsObject,
    generatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CityInteractionStats extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): CityInteractionStats;

  getCityName(): string;
  setCityName(value: string): CityInteractionStats;

  getSearchCount(): number;
  setSearchCount(value: number): CityInteractionStats;

  getPoisFavorited(): number;
  setPoisFavorited(value: number): CityInteractionStats;

  getItinerariesCreated(): number;
  setItinerariesCreated(value: number): CityInteractionStats;

  getLastInteraction(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setLastInteraction(value?: google_protobuf_timestamp_pb.Timestamp): CityInteractionStats;
  hasLastInteraction(): boolean;
  clearLastInteraction(): CityInteractionStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityInteractionStats.AsObject;
  static toObject(includeInstance: boolean, msg: CityInteractionStats): CityInteractionStats.AsObject;
  static serializeBinaryToWriter(message: CityInteractionStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityInteractionStats;
  static deserializeBinaryFromReader(message: CityInteractionStats, reader: jspb.BinaryReader): CityInteractionStats;
}

export namespace CityInteractionStats {
  export type AsObject = {
    cityId: string,
    cityName: string,
    searchCount: number,
    poisFavorited: number,
    itinerariesCreated: number,
    lastInteraction?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SearchPatterns extends jspb.Message {
  getFrequentKeywordsList(): Array<string>;
  setFrequentKeywordsList(value: Array<string>): SearchPatterns;
  clearFrequentKeywordsList(): SearchPatterns;
  addFrequentKeywords(value: string, index?: number): SearchPatterns;

  getPreferredCategoriesList(): Array<string>;
  setPreferredCategoriesList(value: Array<string>): SearchPatterns;
  clearPreferredCategoriesList(): SearchPatterns;
  addPreferredCategories(value: string, index?: number): SearchPatterns;

  getPreferredPriceRange(): string;
  setPreferredPriceRange(value: string): SearchPatterns;

  getAverageSearchRadius(): number;
  setAverageSearchRadius(value: number): SearchPatterns;

  getMostActiveTimeOfDay(): string;
  setMostActiveTimeOfDay(value: string): SearchPatterns;

  getMostActiveDayOfWeek(): string;
  setMostActiveDayOfWeek(value: string): SearchPatterns;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchPatterns.AsObject;
  static toObject(includeInstance: boolean, msg: SearchPatterns): SearchPatterns.AsObject;
  static serializeBinaryToWriter(message: SearchPatterns, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchPatterns;
  static deserializeBinaryFromReader(message: SearchPatterns, reader: jspb.BinaryReader): SearchPatterns;
}

export namespace SearchPatterns {
  export type AsObject = {
    frequentKeywordsList: Array<string>,
    preferredCategoriesList: Array<string>,
    preferredPriceRange: string,
    averageSearchRadius: number,
    mostActiveTimeOfDay: string,
    mostActiveDayOfWeek: string,
  }
}

export class TimeBasedAnalytics extends jspb.Message {
  getHourlyActivityList(): Array<HourlyActivity>;
  setHourlyActivityList(value: Array<HourlyActivity>): TimeBasedAnalytics;
  clearHourlyActivityList(): TimeBasedAnalytics;
  addHourlyActivity(value?: HourlyActivity, index?: number): HourlyActivity;

  getDailyActivityList(): Array<DailyActivity>;
  setDailyActivityList(value: Array<DailyActivity>): TimeBasedAnalytics;
  clearDailyActivityList(): TimeBasedAnalytics;
  addDailyActivity(value?: DailyActivity, index?: number): DailyActivity;

  getMonthlyActivityList(): Array<MonthlyActivity>;
  setMonthlyActivityList(value: Array<MonthlyActivity>): TimeBasedAnalytics;
  clearMonthlyActivityList(): TimeBasedAnalytics;
  addMonthlyActivity(value?: MonthlyActivity, index?: number): MonthlyActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TimeBasedAnalytics.AsObject;
  static toObject(includeInstance: boolean, msg: TimeBasedAnalytics): TimeBasedAnalytics.AsObject;
  static serializeBinaryToWriter(message: TimeBasedAnalytics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TimeBasedAnalytics;
  static deserializeBinaryFromReader(message: TimeBasedAnalytics, reader: jspb.BinaryReader): TimeBasedAnalytics;
}

export namespace TimeBasedAnalytics {
  export type AsObject = {
    hourlyActivityList: Array<HourlyActivity.AsObject>,
    dailyActivityList: Array<DailyActivity.AsObject>,
    monthlyActivityList: Array<MonthlyActivity.AsObject>,
  }
}

export class HourlyActivity extends jspb.Message {
  getHour(): number;
  setHour(value: number): HourlyActivity;

  getActivityCount(): number;
  setActivityCount(value: number): HourlyActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HourlyActivity.AsObject;
  static toObject(includeInstance: boolean, msg: HourlyActivity): HourlyActivity.AsObject;
  static serializeBinaryToWriter(message: HourlyActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HourlyActivity;
  static deserializeBinaryFromReader(message: HourlyActivity, reader: jspb.BinaryReader): HourlyActivity;
}

export namespace HourlyActivity {
  export type AsObject = {
    hour: number,
    activityCount: number,
  }
}

export class DailyActivity extends jspb.Message {
  getDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setDate(value?: google_protobuf_timestamp_pb.Timestamp): DailyActivity;
  hasDate(): boolean;
  clearDate(): DailyActivity;

  getSearches(): number;
  setSearches(value: number): DailyActivity;

  getFavoritesAdded(): number;
  setFavoritesAdded(value: number): DailyActivity;

  getItinerariesCreated(): number;
  setItinerariesCreated(value: number): DailyActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DailyActivity.AsObject;
  static toObject(includeInstance: boolean, msg: DailyActivity): DailyActivity.AsObject;
  static serializeBinaryToWriter(message: DailyActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DailyActivity;
  static deserializeBinaryFromReader(message: DailyActivity, reader: jspb.BinaryReader): DailyActivity;
}

export namespace DailyActivity {
  export type AsObject = {
    date?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    searches: number,
    favoritesAdded: number,
    itinerariesCreated: number,
  }
}

export class MonthlyActivity extends jspb.Message {
  getYear(): number;
  setYear(value: number): MonthlyActivity;

  getMonth(): number;
  setMonth(value: number): MonthlyActivity;

  getTotalActivity(): number;
  setTotalActivity(value: number): MonthlyActivity;

  getGrowthPercentage(): number;
  setGrowthPercentage(value: number): MonthlyActivity;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonthlyActivity.AsObject;
  static toObject(includeInstance: boolean, msg: MonthlyActivity): MonthlyActivity.AsObject;
  static serializeBinaryToWriter(message: MonthlyActivity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonthlyActivity;
  static deserializeBinaryFromReader(message: MonthlyActivity, reader: jspb.BinaryReader): MonthlyActivity;
}

export namespace MonthlyActivity {
  export type AsObject = {
    year: number,
    month: number,
    totalActivity: number,
    growthPercentage: number,
  }
}

export class LandingPageUserStats extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): LandingPageUserStats;

  getSearchesThisWeek(): number;
  setSearchesThisWeek(value: number): LandingPageUserStats;

  getNewFavoritesThisWeek(): number;
  setNewFavoritesThisWeek(value: number): LandingPageUserStats;

  getItinerariesCreatedThisMonth(): number;
  setItinerariesCreatedThisMonth(value: number): LandingPageUserStats;

  getRecentlySearchedCitiesList(): Array<string>;
  setRecentlySearchedCitiesList(value: Array<string>): LandingPageUserStats;
  clearRecentlySearchedCitiesList(): LandingPageUserStats;
  addRecentlySearchedCities(value: string, index?: number): LandingPageUserStats;

  getRecentInteractionsList(): Array<RecentInteraction>;
  setRecentInteractionsList(value: Array<RecentInteraction>): LandingPageUserStats;
  clearRecentInteractionsList(): LandingPageUserStats;
  addRecentInteractions(value?: RecentInteraction, index?: number): RecentInteraction;

  getRecommendations(): PersonalizedRecommendations | undefined;
  setRecommendations(value?: PersonalizedRecommendations): LandingPageUserStats;
  hasRecommendations(): boolean;
  clearRecommendations(): LandingPageUserStats;

  getBadges(): AchievementBadges | undefined;
  setBadges(value?: AchievementBadges): LandingPageUserStats;
  hasBadges(): boolean;
  clearBadges(): LandingPageUserStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LandingPageUserStats.AsObject;
  static toObject(includeInstance: boolean, msg: LandingPageUserStats): LandingPageUserStats.AsObject;
  static serializeBinaryToWriter(message: LandingPageUserStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LandingPageUserStats;
  static deserializeBinaryFromReader(message: LandingPageUserStats, reader: jspb.BinaryReader): LandingPageUserStats;
}

export namespace LandingPageUserStats {
  export type AsObject = {
    userId: string,
    searchesThisWeek: number,
    newFavoritesThisWeek: number,
    itinerariesCreatedThisMonth: number,
    recentlySearchedCitiesList: Array<string>,
    recentInteractionsList: Array<RecentInteraction.AsObject>,
    recommendations?: PersonalizedRecommendations.AsObject,
    badges?: AchievementBadges.AsObject,
  }
}

export class RecentInteraction extends jspb.Message {
  getType(): string;
  setType(value: string): RecentInteraction;

  getDescription(): string;
  setDescription(value: string): RecentInteraction;

  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): RecentInteraction;
  hasTimestamp(): boolean;
  clearTimestamp(): RecentInteraction;

  getCityName(): string;
  setCityName(value: string): RecentInteraction;

  getMetadataMap(): jspb.Map<string, string>;
  clearMetadataMap(): RecentInteraction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecentInteraction.AsObject;
  static toObject(includeInstance: boolean, msg: RecentInteraction): RecentInteraction.AsObject;
  static serializeBinaryToWriter(message: RecentInteraction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecentInteraction;
  static deserializeBinaryFromReader(message: RecentInteraction, reader: jspb.BinaryReader): RecentInteraction;
}

export namespace RecentInteraction {
  export type AsObject = {
    type: string,
    description: string,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    cityName: string,
    metadataMap: Array<[string, string]>,
  }
}

export class PersonalizedRecommendations extends jspb.Message {
  getSuggestedCitiesList(): Array<string>;
  setSuggestedCitiesList(value: Array<string>): PersonalizedRecommendations;
  clearSuggestedCitiesList(): PersonalizedRecommendations;
  addSuggestedCities(value: string, index?: number): PersonalizedRecommendations;

  getSuggestedCategoriesList(): Array<string>;
  setSuggestedCategoriesList(value: Array<string>): PersonalizedRecommendations;
  clearSuggestedCategoriesList(): PersonalizedRecommendations;
  addSuggestedCategories(value: string, index?: number): PersonalizedRecommendations;

  getRecommendationReason(): string;
  setRecommendationReason(value: string): PersonalizedRecommendations;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PersonalizedRecommendations.AsObject;
  static toObject(includeInstance: boolean, msg: PersonalizedRecommendations): PersonalizedRecommendations.AsObject;
  static serializeBinaryToWriter(message: PersonalizedRecommendations, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PersonalizedRecommendations;
  static deserializeBinaryFromReader(message: PersonalizedRecommendations, reader: jspb.BinaryReader): PersonalizedRecommendations;
}

export namespace PersonalizedRecommendations {
  export type AsObject = {
    suggestedCitiesList: Array<string>,
    suggestedCategoriesList: Array<string>,
    recommendationReason: string,
  }
}

export class AchievementBadges extends jspb.Message {
  getEarnedBadgesList(): Array<Badge>;
  setEarnedBadgesList(value: Array<Badge>): AchievementBadges;
  clearEarnedBadgesList(): AchievementBadges;
  addEarnedBadges(value?: Badge, index?: number): Badge;

  getAvailableBadgesList(): Array<Badge>;
  setAvailableBadgesList(value: Array<Badge>): AchievementBadges;
  clearAvailableBadgesList(): AchievementBadges;
  addAvailableBadges(value?: Badge, index?: number): Badge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AchievementBadges.AsObject;
  static toObject(includeInstance: boolean, msg: AchievementBadges): AchievementBadges.AsObject;
  static serializeBinaryToWriter(message: AchievementBadges, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AchievementBadges;
  static deserializeBinaryFromReader(message: AchievementBadges, reader: jspb.BinaryReader): AchievementBadges;
}

export namespace AchievementBadges {
  export type AsObject = {
    earnedBadgesList: Array<Badge.AsObject>,
    availableBadgesList: Array<Badge.AsObject>,
  }
}

export class Badge extends jspb.Message {
  getId(): string;
  setId(value: string): Badge;

  getName(): string;
  setName(value: string): Badge;

  getDescription(): string;
  setDescription(value: string): Badge;

  getIconUrl(): string;
  setIconUrl(value: string): Badge;

  getEarnedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEarnedAt(value?: google_protobuf_timestamp_pb.Timestamp): Badge;
  hasEarnedAt(): boolean;
  clearEarnedAt(): Badge;

  getProgress(): number;
  setProgress(value: number): Badge;

  getTarget(): number;
  setTarget(value: number): Badge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Badge.AsObject;
  static toObject(includeInstance: boolean, msg: Badge): Badge.AsObject;
  static serializeBinaryToWriter(message: Badge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Badge;
  static deserializeBinaryFromReader(message: Badge, reader: jspb.BinaryReader): Badge;
}

export namespace Badge {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    iconUrl: string,
    earnedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    progress: number,
    target: number,
  }
}

export class SystemAnalytics extends jspb.Message {
  getUserGrowth(): UserGrowthMetrics | undefined;
  setUserGrowth(value?: UserGrowthMetrics): SystemAnalytics;
  hasUserGrowth(): boolean;
  clearUserGrowth(): SystemAnalytics;

  getUsageMetrics(): UsageMetrics | undefined;
  setUsageMetrics(value?: UsageMetrics): SystemAnalytics;
  hasUsageMetrics(): boolean;
  clearUsageMetrics(): SystemAnalytics;

  getPerformanceMetrics(): PerformanceMetrics | undefined;
  setPerformanceMetrics(value?: PerformanceMetrics): SystemAnalytics;
  hasPerformanceMetrics(): boolean;
  clearPerformanceMetrics(): SystemAnalytics;

  getErrorMetrics(): ErrorMetrics | undefined;
  setErrorMetrics(value?: ErrorMetrics): SystemAnalytics;
  hasErrorMetrics(): boolean;
  clearErrorMetrics(): SystemAnalytics;

  getGeographicDistribution(): GeographicDistribution | undefined;
  setGeographicDistribution(value?: GeographicDistribution): SystemAnalytics;
  hasGeographicDistribution(): boolean;
  clearGeographicDistribution(): SystemAnalytics;

  getFeatureUsage(): FeatureUsage | undefined;
  setFeatureUsage(value?: FeatureUsage): SystemAnalytics;
  hasFeatureUsage(): boolean;
  clearFeatureUsage(): SystemAnalytics;

  getGeneratedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setGeneratedAt(value?: google_protobuf_timestamp_pb.Timestamp): SystemAnalytics;
  hasGeneratedAt(): boolean;
  clearGeneratedAt(): SystemAnalytics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemAnalytics.AsObject;
  static toObject(includeInstance: boolean, msg: SystemAnalytics): SystemAnalytics.AsObject;
  static serializeBinaryToWriter(message: SystemAnalytics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemAnalytics;
  static deserializeBinaryFromReader(message: SystemAnalytics, reader: jspb.BinaryReader): SystemAnalytics;
}

export namespace SystemAnalytics {
  export type AsObject = {
    userGrowth?: UserGrowthMetrics.AsObject,
    usageMetrics?: UsageMetrics.AsObject,
    performanceMetrics?: PerformanceMetrics.AsObject,
    errorMetrics?: ErrorMetrics.AsObject,
    geographicDistribution?: GeographicDistribution.AsObject,
    featureUsage?: FeatureUsage.AsObject,
    generatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class UserGrowthMetrics extends jspb.Message {
  getTotalUsers(): number;
  setTotalUsers(value: number): UserGrowthMetrics;

  getNewUsersToday(): number;
  setNewUsersToday(value: number): UserGrowthMetrics;

  getNewUsersThisWeek(): number;
  setNewUsersThisWeek(value: number): UserGrowthMetrics;

  getNewUsersThisMonth(): number;
  setNewUsersThisMonth(value: number): UserGrowthMetrics;

  getGrowthRateWeekly(): number;
  setGrowthRateWeekly(value: number): UserGrowthMetrics;

  getGrowthRateMonthly(): number;
  setGrowthRateMonthly(value: number): UserGrowthMetrics;

  getActiveUsersToday(): number;
  setActiveUsersToday(value: number): UserGrowthMetrics;

  getActiveUsersThisWeek(): number;
  setActiveUsersThisWeek(value: number): UserGrowthMetrics;

  getRetentionRateWeekly(): number;
  setRetentionRateWeekly(value: number): UserGrowthMetrics;

  getRetentionRateMonthly(): number;
  setRetentionRateMonthly(value: number): UserGrowthMetrics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserGrowthMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: UserGrowthMetrics): UserGrowthMetrics.AsObject;
  static serializeBinaryToWriter(message: UserGrowthMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserGrowthMetrics;
  static deserializeBinaryFromReader(message: UserGrowthMetrics, reader: jspb.BinaryReader): UserGrowthMetrics;
}

export namespace UserGrowthMetrics {
  export type AsObject = {
    totalUsers: number,
    newUsersToday: number,
    newUsersThisWeek: number,
    newUsersThisMonth: number,
    growthRateWeekly: number,
    growthRateMonthly: number,
    activeUsersToday: number,
    activeUsersThisWeek: number,
    retentionRateWeekly: number,
    retentionRateMonthly: number,
  }
}

export class UsageMetrics extends jspb.Message {
  getTotalSearches(): number;
  setTotalSearches(value: number): UsageMetrics;

  getSearchesToday(): number;
  setSearchesToday(value: number): UsageMetrics;

  getSearchesThisWeek(): number;
  setSearchesThisWeek(value: number): UsageMetrics;

  getAverageSearchesPerUser(): number;
  setAverageSearchesPerUser(value: number): UsageMetrics;

  getTotalApiCalls(): number;
  setTotalApiCalls(value: number): UsageMetrics;

  getAverageResponseTimeMs(): number;
  setAverageResponseTimeMs(value: number): UsageMetrics;

  getPeakConcurrentUsers(): number;
  setPeakConcurrentUsers(value: number): UsageMetrics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UsageMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: UsageMetrics): UsageMetrics.AsObject;
  static serializeBinaryToWriter(message: UsageMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UsageMetrics;
  static deserializeBinaryFromReader(message: UsageMetrics, reader: jspb.BinaryReader): UsageMetrics;
}

export namespace UsageMetrics {
  export type AsObject = {
    totalSearches: number,
    searchesToday: number,
    searchesThisWeek: number,
    averageSearchesPerUser: number,
    totalApiCalls: number,
    averageResponseTimeMs: number,
    peakConcurrentUsers: number,
  }
}

export class PerformanceMetrics extends jspb.Message {
  getCpuUsagePercentage(): number;
  setCpuUsagePercentage(value: number): PerformanceMetrics;

  getMemoryUsagePercentage(): number;
  setMemoryUsagePercentage(value: number): PerformanceMetrics;

  getDiskUsagePercentage(): number;
  setDiskUsagePercentage(value: number): PerformanceMetrics;

  getActiveDatabaseConnections(): number;
  setActiveDatabaseConnections(value: number): PerformanceMetrics;

  getAverageDbQueryTimeMs(): number;
  setAverageDbQueryTimeMs(value: number): PerformanceMetrics;

  getCacheHitRatePercentage(): number;
  setCacheHitRatePercentage(value: number): PerformanceMetrics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PerformanceMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: PerformanceMetrics): PerformanceMetrics.AsObject;
  static serializeBinaryToWriter(message: PerformanceMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PerformanceMetrics;
  static deserializeBinaryFromReader(message: PerformanceMetrics, reader: jspb.BinaryReader): PerformanceMetrics;
}

export namespace PerformanceMetrics {
  export type AsObject = {
    cpuUsagePercentage: number,
    memoryUsagePercentage: number,
    diskUsagePercentage: number,
    activeDatabaseConnections: number,
    averageDbQueryTimeMs: number,
    cacheHitRatePercentage: number,
  }
}

export class ErrorMetrics extends jspb.Message {
  getTotalErrorsToday(): number;
  setTotalErrorsToday(value: number): ErrorMetrics;

  getTotalErrorsThisWeek(): number;
  setTotalErrorsThisWeek(value: number): ErrorMetrics;

  getErrorRatePercentage(): number;
  setErrorRatePercentage(value: number): ErrorMetrics;

  getErrorBreakdownList(): Array<ErrorBreakdown>;
  setErrorBreakdownList(value: Array<ErrorBreakdown>): ErrorMetrics;
  clearErrorBreakdownList(): ErrorMetrics;
  addErrorBreakdown(value?: ErrorBreakdown, index?: number): ErrorBreakdown;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorMetrics): ErrorMetrics.AsObject;
  static serializeBinaryToWriter(message: ErrorMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorMetrics;
  static deserializeBinaryFromReader(message: ErrorMetrics, reader: jspb.BinaryReader): ErrorMetrics;
}

export namespace ErrorMetrics {
  export type AsObject = {
    totalErrorsToday: number,
    totalErrorsThisWeek: number,
    errorRatePercentage: number,
    errorBreakdownList: Array<ErrorBreakdown.AsObject>,
  }
}

export class ErrorBreakdown extends jspb.Message {
  getErrorType(): string;
  setErrorType(value: string): ErrorBreakdown;

  getCount(): number;
  setCount(value: number): ErrorBreakdown;

  getPercentage(): number;
  setPercentage(value: number): ErrorBreakdown;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorBreakdown.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorBreakdown): ErrorBreakdown.AsObject;
  static serializeBinaryToWriter(message: ErrorBreakdown, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorBreakdown;
  static deserializeBinaryFromReader(message: ErrorBreakdown, reader: jspb.BinaryReader): ErrorBreakdown;
}

export namespace ErrorBreakdown {
  export type AsObject = {
    errorType: string,
    count: number,
    percentage: number,
  }
}

export class GeographicDistribution extends jspb.Message {
  getCountryStatsList(): Array<CountryStats>;
  setCountryStatsList(value: Array<CountryStats>): GeographicDistribution;
  clearCountryStatsList(): GeographicDistribution;
  addCountryStats(value?: CountryStats, index?: number): CountryStats;

  getCityStatsList(): Array<CityStats>;
  setCityStatsList(value: Array<CityStats>): GeographicDistribution;
  clearCityStatsList(): GeographicDistribution;
  addCityStats(value?: CityStats, index?: number): CityStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeographicDistribution.AsObject;
  static toObject(includeInstance: boolean, msg: GeographicDistribution): GeographicDistribution.AsObject;
  static serializeBinaryToWriter(message: GeographicDistribution, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeographicDistribution;
  static deserializeBinaryFromReader(message: GeographicDistribution, reader: jspb.BinaryReader): GeographicDistribution;
}

export namespace GeographicDistribution {
  export type AsObject = {
    countryStatsList: Array<CountryStats.AsObject>,
    cityStatsList: Array<CityStats.AsObject>,
  }
}

export class CountryStats extends jspb.Message {
  getCountryCode(): string;
  setCountryCode(value: string): CountryStats;

  getCountryName(): string;
  setCountryName(value: string): CountryStats;

  getUserCount(): number;
  setUserCount(value: number): CountryStats;

  getSearchCount(): number;
  setSearchCount(value: number): CountryStats;

  getPercentageOfTotal(): number;
  setPercentageOfTotal(value: number): CountryStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CountryStats.AsObject;
  static toObject(includeInstance: boolean, msg: CountryStats): CountryStats.AsObject;
  static serializeBinaryToWriter(message: CountryStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CountryStats;
  static deserializeBinaryFromReader(message: CountryStats, reader: jspb.BinaryReader): CountryStats;
}

export namespace CountryStats {
  export type AsObject = {
    countryCode: string,
    countryName: string,
    userCount: number,
    searchCount: number,
    percentageOfTotal: number,
  }
}

export class CityStats extends jspb.Message {
  getCityId(): string;
  setCityId(value: string): CityStats;

  getCityName(): string;
  setCityName(value: string): CityStats;

  getSearchCount(): number;
  setSearchCount(value: number): CityStats;

  getPoiCount(): number;
  setPoiCount(value: number): CityStats;

  getPopularityScore(): number;
  setPopularityScore(value: number): CityStats;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CityStats.AsObject;
  static toObject(includeInstance: boolean, msg: CityStats): CityStats.AsObject;
  static serializeBinaryToWriter(message: CityStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CityStats;
  static deserializeBinaryFromReader(message: CityStats, reader: jspb.BinaryReader): CityStats;
}

export namespace CityStats {
  export type AsObject = {
    cityId: string,
    cityName: string,
    searchCount: number,
    poiCount: number,
    popularityScore: number,
  }
}

export class FeatureUsage extends jspb.Message {
  getSemanticSearches(): number;
  setSemanticSearches(value: number): FeatureUsage;

  getFavoritesAdded(): number;
  setFavoritesAdded(value: number): FeatureUsage;

  getItinerariesCreated(): number;
  setItinerariesCreated(value: number): FeatureUsage;

  getListsCreated(): number;
  setListsCreated(value: number): FeatureUsage;

  getChatSessions(): number;
  setChatSessions(value: number): FeatureUsage;

  getFeatureMetricsList(): Array<FeatureMetric>;
  setFeatureMetricsList(value: Array<FeatureMetric>): FeatureUsage;
  clearFeatureMetricsList(): FeatureUsage;
  addFeatureMetrics(value?: FeatureMetric, index?: number): FeatureMetric;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeatureUsage.AsObject;
  static toObject(includeInstance: boolean, msg: FeatureUsage): FeatureUsage.AsObject;
  static serializeBinaryToWriter(message: FeatureUsage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeatureUsage;
  static deserializeBinaryFromReader(message: FeatureUsage, reader: jspb.BinaryReader): FeatureUsage;
}

export namespace FeatureUsage {
  export type AsObject = {
    semanticSearches: number,
    favoritesAdded: number,
    itinerariesCreated: number,
    listsCreated: number,
    chatSessions: number,
    featureMetricsList: Array<FeatureMetric.AsObject>,
  }
}

export class FeatureMetric extends jspb.Message {
  getFeatureName(): string;
  setFeatureName(value: string): FeatureMetric;

  getUsageCount(): number;
  setUsageCount(value: number): FeatureMetric;

  getAdoptionRate(): number;
  setAdoptionRate(value: number): FeatureMetric;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeatureMetric.AsObject;
  static toObject(includeInstance: boolean, msg: FeatureMetric): FeatureMetric.AsObject;
  static serializeBinaryToWriter(message: FeatureMetric, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeatureMetric;
  static deserializeBinaryFromReader(message: FeatureMetric, reader: jspb.BinaryReader): FeatureMetric;
}

export namespace FeatureMetric {
  export type AsObject = {
    featureName: string,
    usageCount: number,
    adoptionRate: number,
  }
}

export class StatisticsEvent extends jspb.Message {
  getEventType(): string;
  setEventType(value: string): StatisticsEvent;

  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): StatisticsEvent;
  hasTimestamp(): boolean;
  clearTimestamp(): StatisticsEvent;

  getMainStats(): MainPageStatistics | undefined;
  setMainStats(value?: MainPageStatistics): StatisticsEvent;
  hasMainStats(): boolean;
  clearMainStats(): StatisticsEvent;

  getMetricUpdate(): MetricUpdate | undefined;
  setMetricUpdate(value?: MetricUpdate): StatisticsEvent;
  hasMetricUpdate(): boolean;
  clearMetricUpdate(): StatisticsEvent;

  getSystemAlert(): SystemAlert | undefined;
  setSystemAlert(value?: SystemAlert): StatisticsEvent;
  hasSystemAlert(): boolean;
  clearSystemAlert(): StatisticsEvent;

  getPayloadCase(): StatisticsEvent.PayloadCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatisticsEvent.AsObject;
  static toObject(includeInstance: boolean, msg: StatisticsEvent): StatisticsEvent.AsObject;
  static serializeBinaryToWriter(message: StatisticsEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatisticsEvent;
  static deserializeBinaryFromReader(message: StatisticsEvent, reader: jspb.BinaryReader): StatisticsEvent;
}

export namespace StatisticsEvent {
  export type AsObject = {
    eventType: string,
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    mainStats?: MainPageStatistics.AsObject,
    metricUpdate?: MetricUpdate.AsObject,
    systemAlert?: SystemAlert.AsObject,
  }

  export enum PayloadCase { 
    PAYLOAD_NOT_SET = 0,
    MAIN_STATS = 3,
    METRIC_UPDATE = 4,
    SYSTEM_ALERT = 5,
  }
}

export class MetricUpdate extends jspb.Message {
  getMetricName(): string;
  setMetricName(value: string): MetricUpdate;

  getValue(): number;
  setValue(value: number): MetricUpdate;

  getChangeType(): string;
  setChangeType(value: string): MetricUpdate;

  getPreviousValue(): number;
  setPreviousValue(value: number): MetricUpdate;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: MetricUpdate): MetricUpdate.AsObject;
  static serializeBinaryToWriter(message: MetricUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricUpdate;
  static deserializeBinaryFromReader(message: MetricUpdate, reader: jspb.BinaryReader): MetricUpdate;
}

export namespace MetricUpdate {
  export type AsObject = {
    metricName: string,
    value: number,
    changeType: string,
    previousValue: number,
  }
}

export class SystemAlert extends jspb.Message {
  getAlertType(): string;
  setAlertType(value: string): SystemAlert;

  getMessage(): string;
  setMessage(value: string): SystemAlert;

  getSeverity(): string;
  setSeverity(value: string): SystemAlert;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): SystemAlert;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SystemAlert.AsObject;
  static toObject(includeInstance: boolean, msg: SystemAlert): SystemAlert.AsObject;
  static serializeBinaryToWriter(message: SystemAlert, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SystemAlert;
  static deserializeBinaryFromReader(message: SystemAlert, reader: jspb.BinaryReader): SystemAlert;
}

export namespace SystemAlert {
  export type AsObject = {
    alertType: string,
    message: string,
    severity: string,
    detailsMap: Array<[string, string]>,
  }
}

export class GetMainPageStatisticsRequest extends jspb.Message {
  getIncludeTrends(): boolean;
  setIncludeTrends(value: boolean): GetMainPageStatisticsRequest;

  getTimeRange(): string;
  setTimeRange(value: string): GetMainPageStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetMainPageStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetMainPageStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMainPageStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMainPageStatisticsRequest): GetMainPageStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetMainPageStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMainPageStatisticsRequest;
  static deserializeBinaryFromReader(message: GetMainPageStatisticsRequest, reader: jspb.BinaryReader): GetMainPageStatisticsRequest;
}

export namespace GetMainPageStatisticsRequest {
  export type AsObject = {
    includeTrends: boolean,
    timeRange: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetMainPageStatisticsResponse extends jspb.Message {
  getStatistics(): MainPageStatistics | undefined;
  setStatistics(value?: MainPageStatistics): GetMainPageStatisticsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetMainPageStatisticsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetMainPageStatisticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetMainPageStatisticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMainPageStatisticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMainPageStatisticsResponse): GetMainPageStatisticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetMainPageStatisticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMainPageStatisticsResponse;
  static deserializeBinaryFromReader(message: GetMainPageStatisticsResponse, reader: jspb.BinaryReader): GetMainPageStatisticsResponse;
}

export namespace GetMainPageStatisticsResponse {
  export type AsObject = {
    statistics?: MainPageStatistics.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class StreamMainPageStatisticsRequest extends jspb.Message {
  getUpdateIntervalSeconds(): number;
  setUpdateIntervalSeconds(value: number): StreamMainPageStatisticsRequest;

  getMetricFiltersList(): Array<string>;
  setMetricFiltersList(value: Array<string>): StreamMainPageStatisticsRequest;
  clearMetricFiltersList(): StreamMainPageStatisticsRequest;
  addMetricFilters(value: string, index?: number): StreamMainPageStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): StreamMainPageStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): StreamMainPageStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamMainPageStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StreamMainPageStatisticsRequest): StreamMainPageStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: StreamMainPageStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamMainPageStatisticsRequest;
  static deserializeBinaryFromReader(message: StreamMainPageStatisticsRequest, reader: jspb.BinaryReader): StreamMainPageStatisticsRequest;
}

export namespace StreamMainPageStatisticsRequest {
  export type AsObject = {
    updateIntervalSeconds: number,
    metricFiltersList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class GetDetailedPOIStatisticsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetDetailedPOIStatisticsRequest;

  getTimeRange(): string;
  setTimeRange(value: string): GetDetailedPOIStatisticsRequest;

  getIncludePredictions(): boolean;
  setIncludePredictions(value: boolean): GetDetailedPOIStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetDetailedPOIStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetDetailedPOIStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDetailedPOIStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDetailedPOIStatisticsRequest): GetDetailedPOIStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetDetailedPOIStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDetailedPOIStatisticsRequest;
  static deserializeBinaryFromReader(message: GetDetailedPOIStatisticsRequest, reader: jspb.BinaryReader): GetDetailedPOIStatisticsRequest;
}

export namespace GetDetailedPOIStatisticsRequest {
  export type AsObject = {
    userId: string,
    timeRange: string,
    includePredictions: boolean,
    request?: BaseRequest.AsObject,
  }
}

export class GetDetailedPOIStatisticsResponse extends jspb.Message {
  getStatistics(): DetailedPOIStatistics | undefined;
  setStatistics(value?: DetailedPOIStatistics): GetDetailedPOIStatisticsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetDetailedPOIStatisticsResponse;

  getPredictionsList(): Array<Prediction>;
  setPredictionsList(value: Array<Prediction>): GetDetailedPOIStatisticsResponse;
  clearPredictionsList(): GetDetailedPOIStatisticsResponse;
  addPredictions(value?: Prediction, index?: number): Prediction;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetDetailedPOIStatisticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetDetailedPOIStatisticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDetailedPOIStatisticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDetailedPOIStatisticsResponse): GetDetailedPOIStatisticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetDetailedPOIStatisticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDetailedPOIStatisticsResponse;
  static deserializeBinaryFromReader(message: GetDetailedPOIStatisticsResponse, reader: jspb.BinaryReader): GetDetailedPOIStatisticsResponse;
}

export namespace GetDetailedPOIStatisticsResponse {
  export type AsObject = {
    statistics?: DetailedPOIStatistics.AsObject,
    predictionsList: Array<Prediction.AsObject>,
    response?: BaseResponse.AsObject,
  }
}

export class Prediction extends jspb.Message {
  getMetric(): string;
  setMetric(value: string): Prediction;

  getPredictedValue(): number;
  setPredictedValue(value: number): Prediction;

  getConfidenceLevel(): string;
  setConfidenceLevel(value: string): Prediction;

  getTimeHorizon(): string;
  setTimeHorizon(value: string): Prediction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Prediction.AsObject;
  static toObject(includeInstance: boolean, msg: Prediction): Prediction.AsObject;
  static serializeBinaryToWriter(message: Prediction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Prediction;
  static deserializeBinaryFromReader(message: Prediction, reader: jspb.BinaryReader): Prediction;
}

export namespace Prediction {
  export type AsObject = {
    metric: string,
    predictedValue: number,
    confidenceLevel: string,
    timeHorizon: string,
  }
}

export class GetLandingPageStatisticsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetLandingPageStatisticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetLandingPageStatisticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetLandingPageStatisticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLandingPageStatisticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetLandingPageStatisticsRequest): GetLandingPageStatisticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetLandingPageStatisticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLandingPageStatisticsRequest;
  static deserializeBinaryFromReader(message: GetLandingPageStatisticsRequest, reader: jspb.BinaryReader): GetLandingPageStatisticsRequest;
}

export namespace GetLandingPageStatisticsRequest {
  export type AsObject = {
    userId: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetLandingPageStatisticsResponse extends jspb.Message {
  getStatistics(): LandingPageUserStats | undefined;
  setStatistics(value?: LandingPageUserStats): GetLandingPageStatisticsResponse;
  hasStatistics(): boolean;
  clearStatistics(): GetLandingPageStatisticsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetLandingPageStatisticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetLandingPageStatisticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetLandingPageStatisticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetLandingPageStatisticsResponse): GetLandingPageStatisticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetLandingPageStatisticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetLandingPageStatisticsResponse;
  static deserializeBinaryFromReader(message: GetLandingPageStatisticsResponse, reader: jspb.BinaryReader): GetLandingPageStatisticsResponse;
}

export namespace GetLandingPageStatisticsResponse {
  export type AsObject = {
    statistics?: LandingPageUserStats.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class GetUserActivityAnalyticsRequest extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): GetUserActivityAnalyticsRequest;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): GetUserActivityAnalyticsRequest;
  hasStartDate(): boolean;
  clearStartDate(): GetUserActivityAnalyticsRequest;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): GetUserActivityAnalyticsRequest;
  hasEndDate(): boolean;
  clearEndDate(): GetUserActivityAnalyticsRequest;

  getGranularity(): string;
  setGranularity(value: string): GetUserActivityAnalyticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetUserActivityAnalyticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetUserActivityAnalyticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserActivityAnalyticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserActivityAnalyticsRequest): GetUserActivityAnalyticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserActivityAnalyticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserActivityAnalyticsRequest;
  static deserializeBinaryFromReader(message: GetUserActivityAnalyticsRequest, reader: jspb.BinaryReader): GetUserActivityAnalyticsRequest;
}

export namespace GetUserActivityAnalyticsRequest {
  export type AsObject = {
    userId: string,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    granularity: string,
    request?: BaseRequest.AsObject,
  }
}

export class GetUserActivityAnalyticsResponse extends jspb.Message {
  getActivityDataList(): Array<ActivityDataPoint>;
  setActivityDataList(value: Array<ActivityDataPoint>): GetUserActivityAnalyticsResponse;
  clearActivityDataList(): GetUserActivityAnalyticsResponse;
  addActivityData(value?: ActivityDataPoint, index?: number): ActivityDataPoint;

  getSummary(): ActivitySummary | undefined;
  setSummary(value?: ActivitySummary): GetUserActivityAnalyticsResponse;
  hasSummary(): boolean;
  clearSummary(): GetUserActivityAnalyticsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetUserActivityAnalyticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetUserActivityAnalyticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserActivityAnalyticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserActivityAnalyticsResponse): GetUserActivityAnalyticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserActivityAnalyticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserActivityAnalyticsResponse;
  static deserializeBinaryFromReader(message: GetUserActivityAnalyticsResponse, reader: jspb.BinaryReader): GetUserActivityAnalyticsResponse;
}

export namespace GetUserActivityAnalyticsResponse {
  export type AsObject = {
    activityDataList: Array<ActivityDataPoint.AsObject>,
    summary?: ActivitySummary.AsObject,
    response?: BaseResponse.AsObject,
  }
}

export class ActivityDataPoint extends jspb.Message {
  getTimestamp(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setTimestamp(value?: google_protobuf_timestamp_pb.Timestamp): ActivityDataPoint;
  hasTimestamp(): boolean;
  clearTimestamp(): ActivityDataPoint;

  getSearches(): number;
  setSearches(value: number): ActivityDataPoint;

  getFavorites(): number;
  setFavorites(value: number): ActivityDataPoint;

  getItineraryActions(): number;
  setItineraryActions(value: number): ActivityDataPoint;

  getChatMessages(): number;
  setChatMessages(value: number): ActivityDataPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityDataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityDataPoint): ActivityDataPoint.AsObject;
  static serializeBinaryToWriter(message: ActivityDataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityDataPoint;
  static deserializeBinaryFromReader(message: ActivityDataPoint, reader: jspb.BinaryReader): ActivityDataPoint;
}

export namespace ActivityDataPoint {
  export type AsObject = {
    timestamp?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    searches: number,
    favorites: number,
    itineraryActions: number,
    chatMessages: number,
  }
}

export class ActivitySummary extends jspb.Message {
  getTotalSearches(): number;
  setTotalSearches(value: number): ActivitySummary;

  getTotalFavorites(): number;
  setTotalFavorites(value: number): ActivitySummary;

  getTotalItineraryActions(): number;
  setTotalItineraryActions(value: number): ActivitySummary;

  getMostActiveHour(): number;
  setMostActiveHour(value: number): ActivitySummary;

  getMostActiveDay(): string;
  setMostActiveDay(value: string): ActivitySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivitySummary.AsObject;
  static toObject(includeInstance: boolean, msg: ActivitySummary): ActivitySummary.AsObject;
  static serializeBinaryToWriter(message: ActivitySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivitySummary;
  static deserializeBinaryFromReader(message: ActivitySummary, reader: jspb.BinaryReader): ActivitySummary;
}

export namespace ActivitySummary {
  export type AsObject = {
    totalSearches: number,
    totalFavorites: number,
    totalItineraryActions: number,
    mostActiveHour: number,
    mostActiveDay: string,
  }
}

export class GetSystemAnalyticsRequest extends jspb.Message {
  getTimeRange(): string;
  setTimeRange(value: string): GetSystemAnalyticsRequest;

  getMetricCategoriesList(): Array<string>;
  setMetricCategoriesList(value: Array<string>): GetSystemAnalyticsRequest;
  clearMetricCategoriesList(): GetSystemAnalyticsRequest;
  addMetricCategories(value: string, index?: number): GetSystemAnalyticsRequest;

  getRequest(): BaseRequest | undefined;
  setRequest(value?: BaseRequest): GetSystemAnalyticsRequest;
  hasRequest(): boolean;
  clearRequest(): GetSystemAnalyticsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemAnalyticsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemAnalyticsRequest): GetSystemAnalyticsRequest.AsObject;
  static serializeBinaryToWriter(message: GetSystemAnalyticsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemAnalyticsRequest;
  static deserializeBinaryFromReader(message: GetSystemAnalyticsRequest, reader: jspb.BinaryReader): GetSystemAnalyticsRequest;
}

export namespace GetSystemAnalyticsRequest {
  export type AsObject = {
    timeRange: string,
    metricCategoriesList: Array<string>,
    request?: BaseRequest.AsObject,
  }
}

export class GetSystemAnalyticsResponse extends jspb.Message {
  getAnalytics(): SystemAnalytics | undefined;
  setAnalytics(value?: SystemAnalytics): GetSystemAnalyticsResponse;
  hasAnalytics(): boolean;
  clearAnalytics(): GetSystemAnalyticsResponse;

  getResponse(): BaseResponse | undefined;
  setResponse(value?: BaseResponse): GetSystemAnalyticsResponse;
  hasResponse(): boolean;
  clearResponse(): GetSystemAnalyticsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSystemAnalyticsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSystemAnalyticsResponse): GetSystemAnalyticsResponse.AsObject;
  static serializeBinaryToWriter(message: GetSystemAnalyticsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSystemAnalyticsResponse;
  static deserializeBinaryFromReader(message: GetSystemAnalyticsResponse, reader: jspb.BinaryReader): GetSystemAnalyticsResponse;
}

export namespace GetSystemAnalyticsResponse {
  export type AsObject = {
    analytics?: SystemAnalytics.AsObject,
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

