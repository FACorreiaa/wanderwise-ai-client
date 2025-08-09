import * as grpcWeb from 'grpc-web';

import * as customer_pb from './customer_pb'; // proto import: "customer.proto"


export class CustomerClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getCustomer(
    request: customer_pb.GetCustomerReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: customer_pb.GetCustomerRes) => void
  ): grpcWeb.ClientReadableStream<customer_pb.GetCustomerRes>;

  createCustomer(
    request: customer_pb.CreateCustomerReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: customer_pb.CreateCustomerRes) => void
  ): grpcWeb.ClientReadableStream<customer_pb.CreateCustomerRes>;

  updateCustomer(
    request: customer_pb.UpdateCustomerReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: customer_pb.UpdateCustomerRes) => void
  ): grpcWeb.ClientReadableStream<customer_pb.UpdateCustomerRes>;

  deleteCustomer(
    request: customer_pb.DeleteCustomerReq,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: customer_pb.NilRes) => void
  ): grpcWeb.ClientReadableStream<customer_pb.NilRes>;

}

export class CustomerPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  getCustomer(
    request: customer_pb.GetCustomerReq,
    metadata?: grpcWeb.Metadata
  ): Promise<customer_pb.GetCustomerRes>;

  createCustomer(
    request: customer_pb.CreateCustomerReq,
    metadata?: grpcWeb.Metadata
  ): Promise<customer_pb.CreateCustomerRes>;

  updateCustomer(
    request: customer_pb.UpdateCustomerReq,
    metadata?: grpcWeb.Metadata
  ): Promise<customer_pb.UpdateCustomerRes>;

  deleteCustomer(
    request: customer_pb.DeleteCustomerReq,
    metadata?: grpcWeb.Metadata
  ): Promise<customer_pb.NilRes>;

}

