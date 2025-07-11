import { A } from "@solidjs/router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  Download,
  Settings,
  X,
} from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { useAuth } from "~/contexts/AuthContext";

export default function BillingPage() {
  const { user } = useAuth();
  const [notification, setNotification] = createSignal<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Mobile-friendly notification */}
      <Show when={notification()}>
        <div
          class={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 p-4 rounded-lg shadow-lg border ${
            notification()?.type === "success"
              ? "bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700"
              : "bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700"
          } animate-in slide-in-from-top-2 duration-300`}
        >
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{notification()?.message}</span>
            <button
              onClick={() => setNotification(null)}
              class="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Show>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <A
              href="/settings"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </A>
            <h1 class="text-3xl font-bold text-gray-900">
              Billing & Subscription
            </h1>
          </div>
          <p class="text-lg text-gray-600">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>

        <div class="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div class="lg:col-span-2 space-y-6">
            {/* Current Plan */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">
                  Current Plan
                </h2>
                <div class="flex items-center gap-2">
                  <CheckCircle class="w-5 h-5 text-green-500" />
                  <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>

              <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-2xl font-bold mb-2">Explorer Plan</h3>
                    <p class="text-blue-100 mb-4">
                      Perfect for regular city discoverers
                    </p>
                    <div class="flex items-center gap-4">
                      <span class="text-3xl font-bold">$5.99</span>
                      <span class="text-blue-100">per month</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-blue-100 text-sm mb-1">Next billing</p>
                    <p class="text-white font-medium">Jan 15, 2025</p>
                  </div>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Plan</span>
                  <span class="font-medium text-gray-900">
                    Explorer - Monthly
                  </span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Status</span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle class="w-3 h-3 mr-1" />
                    Active
                  </span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Next billing date</span>
                  <span class="font-medium text-gray-900">
                    January 15, 2025
                  </span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-gray-600">Amount</span>
                  <span class="font-medium text-gray-900">$5.99</span>
                </div>
              </div>
            </div>

            {/* Plan Management */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Plan Management
              </h2>
              <div class="space-y-4">
                <A href="/pricing/plan-selection">
                  <button class="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-colors">
                    <Settings class="w-4 h-4" />
                    Change Plan
                  </button>
                </A>
                <div class="sm:ml-4 sm:inline-block">
                  <button class="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                    Cancel Subscription
                  </button>
                </div>
              </div>
              <div class="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div class="flex items-center gap-2">
                  <AlertCircle class="w-5 h-5 text-yellow-600" />
                  <p class="text-sm text-yellow-800">
                    <strong>Want to save money?</strong> Switch to yearly
                    billing and save $16.88 per year!
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Payment Method
              </h2>
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <span class="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p class="text-sm text-gray-500">Expires 12/26</p>
                  </div>
                </div>
                <button class="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                  Update
                </button>
              </div>
            </div>

            {/* Billing History */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-900">
                  Billing History
                </h2>
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              <div class="space-y-4">
                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle class="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">December 2024</p>
                      <p class="text-sm text-gray-500">
                        Explorer Plan - Monthly
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">$5.99</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-green-600">Paid</span>
                      <button class="text-sm text-blue-600 hover:text-blue-700">
                        <Download class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between py-4 border-b border-gray-100">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle class="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">November 2024</p>
                      <p class="text-sm text-gray-500">
                        Explorer Plan - Monthly
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">$5.99</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-green-600">Paid</span>
                      <button class="text-sm text-blue-600 hover:text-blue-700">
                        <Download class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between py-4">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle class="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">October 2024</p>
                      <p class="text-sm text-gray-500">
                        Explorer Plan - Monthly
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">$5.99</p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-sm text-green-600">Paid</span>
                      <button class="text-sm text-blue-600 hover:text-blue-700">
                        <Download class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div class="space-y-6">
            {/* Quick Actions */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div class="space-y-3">
                <button class="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-3">
                  <CreditCard class="w-5 h-5" />
                  <span>Update Payment Method</span>
                </button>
                <button class="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <Download class="w-5 h-5" />
                  <span>Download Invoice</span>
                </button>
                <button class="w-full text-left px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <Calendar class="w-5 h-5" />
                  <span>Billing History</span>
                </button>
              </div>
            </div>

            {/* Subscription Summary */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Subscription Summary
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">Monthly cost</span>
                  <span class="font-medium">$5.99</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Annual cost</span>
                  <span class="font-medium">$71.88</span>
                </div>
                <div class="flex justify-between text-green-600">
                  <span>Yearly savings</span>
                  <span class="font-medium">$16.88</span>
                </div>
                <div class="pt-3 border-t border-gray-200">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Started</span>
                    <span class="font-medium">Oct 15, 2024</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Our support team is here to help with any billing questions.
              </p>
              <button class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
