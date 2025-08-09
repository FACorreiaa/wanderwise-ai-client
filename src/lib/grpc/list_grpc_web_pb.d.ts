import * as grpcWeb from 'grpc-web';

import * as list_pb from './list_pb'; // proto import: "list.proto"


export class ListServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createList(
    request: list_pb.CreateListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.CreateListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.CreateListResponse>;

  getLists(
    request: list_pb.GetListsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListsResponse>;

  getList(
    request: list_pb.GetListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListResponse>;

  updateList(
    request: list_pb.UpdateListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.UpdateListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.UpdateListResponse>;

  deleteList(
    request: list_pb.DeleteListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.DeleteListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.DeleteListResponse>;

  createItinerary(
    request: list_pb.CreateItineraryRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.CreateItineraryResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.CreateItineraryResponse>;

  addListItem(
    request: list_pb.AddListItemRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.AddListItemResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.AddListItemResponse>;

  updateListItem(
    request: list_pb.UpdateListItemRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.UpdateListItemResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.UpdateListItemResponse>;

  removeListItem(
    request: list_pb.RemoveListItemRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.RemoveListItemResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.RemoveListItemResponse>;

  getListItems(
    request: list_pb.GetListItemsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListItemsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListItemsResponse>;

  getListRestaurants(
    request: list_pb.GetListRestaurantsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListRestaurantsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListRestaurantsResponse>;

  getListHotels(
    request: list_pb.GetListHotelsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListHotelsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListHotelsResponse>;

  getListItineraries(
    request: list_pb.GetListItinerariesRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetListItinerariesResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetListItinerariesResponse>;

  savePublicList(
    request: list_pb.SavePublicListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.SavePublicListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.SavePublicListResponse>;

  unsaveList(
    request: list_pb.UnsaveListRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.UnsaveListResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.UnsaveListResponse>;

  getSavedLists(
    request: list_pb.GetSavedListsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.GetSavedListsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.GetSavedListsResponse>;

  searchPublicLists(
    request: list_pb.SearchPublicListsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: list_pb.SearchPublicListsResponse) => void
  ): grpcWeb.ClientReadableStream<list_pb.SearchPublicListsResponse>;

}

export class ListServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createList(
    request: list_pb.CreateListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.CreateListResponse>;

  getLists(
    request: list_pb.GetListsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListsResponse>;

  getList(
    request: list_pb.GetListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListResponse>;

  updateList(
    request: list_pb.UpdateListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.UpdateListResponse>;

  deleteList(
    request: list_pb.DeleteListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.DeleteListResponse>;

  createItinerary(
    request: list_pb.CreateItineraryRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.CreateItineraryResponse>;

  addListItem(
    request: list_pb.AddListItemRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.AddListItemResponse>;

  updateListItem(
    request: list_pb.UpdateListItemRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.UpdateListItemResponse>;

  removeListItem(
    request: list_pb.RemoveListItemRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.RemoveListItemResponse>;

  getListItems(
    request: list_pb.GetListItemsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListItemsResponse>;

  getListRestaurants(
    request: list_pb.GetListRestaurantsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListRestaurantsResponse>;

  getListHotels(
    request: list_pb.GetListHotelsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListHotelsResponse>;

  getListItineraries(
    request: list_pb.GetListItinerariesRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetListItinerariesResponse>;

  savePublicList(
    request: list_pb.SavePublicListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.SavePublicListResponse>;

  unsaveList(
    request: list_pb.UnsaveListRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.UnsaveListResponse>;

  getSavedLists(
    request: list_pb.GetSavedListsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.GetSavedListsResponse>;

  searchPublicLists(
    request: list_pb.SearchPublicListsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<list_pb.SearchPublicListsResponse>;

}

