import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import { createClient } from "@connectrpc/connect";
import { PaymentService } from "@buf/loci_loci-proto.bufbuild_es/loci/payment/v1/payment_pb.js";
import type {
  Invoice as PaymentInvoice,
  Payment,
  Subscription,
} from "@buf/loci_loci-proto.bufbuild_es/loci/payment/v1/payment_pb.js";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { transport } from "../connect-transport";

// Types
export interface SubscriptionData {
  plan: "free" | "paid" | "premium";
  status: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  usage: {
    requestsToday: number;
    requestsLimit: number;
  };
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber?: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl?: string;
  createdAt: string;
}

const paymentClient = createClient(PaymentService, transport);

function timestampToISOString(timestamp?: Timestamp): string {
  if (!timestamp) return "";
  const seconds = Number(timestamp.seconds);
  return new Date(seconds * 1000 + timestamp.nanos / 1_000_000).toISOString();
}

function mapSubscription(
  subscription?: Subscription,
  usage?: SubscriptionData["usage"],
): SubscriptionData {
  return {
    plan: (subscription?.planId || "free") as SubscriptionData["plan"],
    status: subscription?.status || "active",
    currentPeriodEnd: timestampToISOString(subscription?.currentPeriodEnd),
    cancelAtPeriodEnd: subscription?.cancelAtPeriodEnd,
    usage: usage || {
      requestsToday: 0,
      requestsLimit: 5,
    },
  };
}

function mapPayment(payment: Payment): PaymentHistoryItem {
  return {
    id: payment.id,
    amount: Number(payment.amount),
    currency: payment.currency,
    status: payment.status,
    description: payment.description || undefined,
    createdAt: timestampToISOString(payment.createdAt),
  };
}

function mapInvoice(invoice: PaymentInvoice): Invoice {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber || undefined,
    amount: Number(invoice.amount),
    currency: invoice.currency,
    status: invoice.status,
    pdfUrl: invoice.pdfUrl || undefined,
    createdAt: timestampToISOString(invoice.issuedAt),
  };
}

// Queries
export function useUserSubscription() {
  return useQuery(() => ({
    queryKey: ["user-subscription"],
    queryFn: async (): Promise<SubscriptionData> => {
      const response = await paymentClient.getSubscription({});
      return mapSubscription(response.subscription, {
        requestsToday: response.usage?.requestsToday || 0,
        requestsLimit: response.usage?.requestsLimit || 5,
      });
    },
    staleTime: 60000, // 1 minute
  }));
}

export function usePaymentHistory(limit: number = 10) {
  return useQuery(() => ({
    queryKey: ["payment-history", limit],
    queryFn: async (): Promise<PaymentHistoryItem[]> => {
      const response = await paymentClient.getUserPayments({ page: 1, pageSize: limit });
      return response.payments.map(mapPayment);
    },
    staleTime: 300000, // 5 minutes
  }));
}

export function useUserInvoices(limit: number = 10) {
  return useQuery(() => ({
    queryKey: ["user-invoices", limit],
    queryFn: async (): Promise<Invoice[]> => {
      const response = await paymentClient.getUserInvoices({ page: 1, pageSize: limit });
      return response.invoices.map(mapInvoice);
    },
    staleTime: 300000, // 5 minutes
  }));
}

// Mutations
export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: {
      priceId: string;
      successUrl: string;
      cancelUrl: string;
      mode?: string;
    }) => {
      return paymentClient.createCheckoutSession({
        priceId: params.priceId,
        successUrl: params.successUrl,
        cancelUrl: params.cancelUrl,
        mode: params.mode || "subscription",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  }));
}

export function useCreateCustomerPortalSession() {
  return useMutation(() => ({
    mutationFn: async (params: { returnUrl: string }) => {
      return paymentClient.createCustomerPortalSession(params);
    },
  }));
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation(() => ({
    mutationFn: async (params: { cancelAtPeriodEnd: boolean; subscriptionId?: string }) => {
      await paymentClient.cancelSubscription({
        subscriptionId: params.subscriptionId || "",
        cancelAtPeriodEnd: params.cancelAtPeriodEnd,
      });
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  }));
}
