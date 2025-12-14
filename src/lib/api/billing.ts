import { useQuery, useMutation, useQueryClient } from '@tanstack/solid-query';

// Types
export interface SubscriptionData {
    plan: 'free' | 'paid' | 'premium';
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

// Mock data for now - will be replaced with actual RPC calls when proto is ready
const mockSubscription: SubscriptionData = {
    plan: 'free',
    status: 'active',
    usage: {
        requestsToday: 3,
        requestsLimit: 5,
    },
};

const mockPaymentHistory: PaymentHistoryItem[] = [];
const mockInvoices: Invoice[] = [];

// Queries
export function useUserSubscription() {
    return useQuery(() => ({
        queryKey: ['user-subscription'],
        queryFn: async (): Promise<SubscriptionData> => {
            // TODO: Replace with actual RPC call when proto is generated
            // const client = getGrpcClient();
            // const response = await client.billing.getUserSubscription({});
            // return response;

            // Mock for now
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockSubscription;
        },
        staleTime: 60000, // 1 minute
    }));
}

export function usePaymentHistory(limit: number = 10) {
    return useQuery(() => ({
        queryKey: ['payment-history', limit],
        queryFn: async (): Promise<PaymentHistoryItem[]> => {
            // TODO: Replace with actual RPC call
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockPaymentHistory;
        },
        staleTime: 300000, // 5 minutes
    }));
}

export function useUserInvoices(limit: number = 10) {
    return useQuery(() => ({
        queryKey: ['user-invoices', limit],
        queryFn: async (): Promise<Invoice[]> => {
            // TODO: Replace with actual RPC call
            await new Promise(resolve => setTimeout(resolve, 500));
            return mockInvoices;
        },
        staleTime: 300000, // 5 minutes
    }));
}

// Mutations
export function useCreateCheckoutSession() {
    const queryClient = useQueryClient();

    return useMutation(() => ({
        mutationFn: async (_params: { priceId: string; successUrl: string; cancelUrl: string }) => {
            // TODO: Replace with actual RPC call
            // const client = getGrpcClient();
            // const response = await client.billing.createCheckoutSession(params);
            // return response;

            // Mock - in real implementation, this would return a Stripe checkout URL
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { url: 'https://checkout.stripe.com/mock' };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
        },
    }));
}

export function useCreateCustomerPortalSession() {
    return useMutation(() => ({
        mutationFn: async (_params: { returnUrl: string }) => {
            // TODO: Replace with actual RPC call
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { url: 'https://billing.stripe.com/mock' };
        },
    }));
}

export function useCancelSubscription() {
    const queryClient = useQueryClient();

    return useMutation(() => ({
        mutationFn: async (_params: { cancelAtPeriodEnd: boolean }) => {
            // TODO: Replace with actual RPC call
            await new Promise(resolve => setTimeout(resolve, 1000));
            return { success: true };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
        },
    }));
}
