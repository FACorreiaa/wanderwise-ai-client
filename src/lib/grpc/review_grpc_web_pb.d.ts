import * as grpcWeb from 'grpc-web';

import * as review_pb from './review_pb'; // proto import: "review.proto"


export class ReviewServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createReview(
    request: review_pb.CreateReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.CreateReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.CreateReviewResponse>;

  getPOIReviews(
    request: review_pb.GetPOIReviewsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.GetPOIReviewsResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.GetPOIReviewsResponse>;

  getReview(
    request: review_pb.GetReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.GetReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.GetReviewResponse>;

  updateReview(
    request: review_pb.UpdateReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.UpdateReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.UpdateReviewResponse>;

  deleteReview(
    request: review_pb.DeleteReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.DeleteReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.DeleteReviewResponse>;

  getUserReviews(
    request: review_pb.GetUserReviewsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.GetUserReviewsResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.GetUserReviewsResponse>;

  likeReview(
    request: review_pb.LikeReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.LikeReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.LikeReviewResponse>;

  reportReview(
    request: review_pb.ReportReviewRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.ReportReviewResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.ReportReviewResponse>;

  getReviewStatistics(
    request: review_pb.GetReviewStatisticsRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: review_pb.GetReviewStatisticsResponse) => void
  ): grpcWeb.ClientReadableStream<review_pb.GetReviewStatisticsResponse>;

}

export class ReviewServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  createReview(
    request: review_pb.CreateReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.CreateReviewResponse>;

  getPOIReviews(
    request: review_pb.GetPOIReviewsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.GetPOIReviewsResponse>;

  getReview(
    request: review_pb.GetReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.GetReviewResponse>;

  updateReview(
    request: review_pb.UpdateReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.UpdateReviewResponse>;

  deleteReview(
    request: review_pb.DeleteReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.DeleteReviewResponse>;

  getUserReviews(
    request: review_pb.GetUserReviewsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.GetUserReviewsResponse>;

  likeReview(
    request: review_pb.LikeReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.LikeReviewResponse>;

  reportReview(
    request: review_pb.ReportReviewRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.ReportReviewResponse>;

  getReviewStatistics(
    request: review_pb.GetReviewStatisticsRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<review_pb.GetReviewStatisticsResponse>;

}

