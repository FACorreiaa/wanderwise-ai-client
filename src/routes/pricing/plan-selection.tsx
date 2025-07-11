import { A } from "@solidjs/router";
import { 
  ArrowLeft, 
  Check, 
  MapPin, 
  Star, 
  CreditCard, 
  Shield, 
  Calendar,
  DollarSign,
  Lock,
  Apple,
  Smartphone
} from "lucide-solid";
import { createSignal, Show } from "solid-js";

export default function PlanSelection() {
  const [selectedPeriod, setSelectedPeriod] = createSignal<
    "monthly" | "yearly"
  >("monthly");
  const [selectedPayment, setSelectedPayment] = createSignal<
    "card" | "paypal" | "apple" | "google"
  >("card");

  const plans = {
    monthly: {
      name: "Explorer",
      price: "$5.99",
      period: "per month",
      description: "For regular city discoverers",
      icon: MapPin,
      color: "blue",
      features: [
        "Everything in Free",
        "Unlimited searches & recommendations",
        "Advanced filtering (cuisine, accessibility, niche tags)",
        "Up to 100 saved locations",
        "Custom lists & collections",
        "Priority customer support",
        "Ad-free experience",
        "Enhanced AI recommendations",
      ],
      total: "$5.99/month",
      billing: "Billed monthly",
    },
    yearly: {
      name: "Explorer",
      price: "$55",
      period: "per year",
      description: "For regular city discoverers",
      icon: MapPin,
      color: "blue",
      features: [
        "Everything in Free",
        "Unlimited searches & recommendations",
        "Advanced filtering (cuisine, accessibility, niche tags)",
        "Up to 100 saved locations",
        "Custom lists & collections",
        "Priority customer support",
        "Ad-free experience",
        "Enhanced AI recommendations",
      ],
      total: "$55/year",
      billing: "Billed annually",
      savings: "Save $16.88 per year",
    },
  };

  const currentPlan = () => plans[selectedPeriod()];
  const IconComponent = MapPin;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header class="mb-8">
          <div class="flex items-center gap-4 mb-6">
            <A
              href="/pricing"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft class="w-5 h-5" />
            </A>
            <h1 class="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          </div>
          <p class="text-lg text-gray-600">
            Select your preferred billing cycle for the Explorer Plan
          </p>
        </header>

        {/* Plan Selection Toggle */}
        <div class="mb-8">
          <div class="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setSelectedPeriod("monthly")}
              class={`px-6 py-3 rounded-md font-medium transition-colors ${
                selectedPeriod() === "monthly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPeriod("yearly")}
              class={`px-6 py-3 rounded-md font-medium transition-colors relative ${
                selectedPeriod() === "yearly"
                  ? "bg-white dark:bg-gray-700 text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <span class="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 23%
              </span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div class="grid lg:grid-cols-3 gap-8">
          {/* Plan Details - Left Column */}
          <div class="lg:col-span-2 space-y-8">
            {/* Selected Plan Card */}
            <div class="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Selected Plan</h2>
                <div class="flex items-center gap-2">
                  <Star class="w-5 h-5 text-blue-500" />
                  <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              </div>

              <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-2xl font-bold mb-2">{currentPlan().name} Plan</h3>
                    <p class="text-blue-100 mb-4">{currentPlan().description}</p>
                    <div class="flex items-center gap-4">
                      <span class="text-3xl font-bold">{currentPlan().price}</span>
                      <span class="text-blue-100">/{selectedPeriod() === "monthly" ? "month" : "year"}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <Show when={selectedPeriod() === "yearly"}>
                      <div class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                        Save 23%
                      </div>
                    </Show>
                    <p class="text-blue-100 text-sm">{currentPlan().billing}</p>
                  </div>
                </div>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-3">
                  <h4 class="font-semibold text-gray-900">Plan Features:</h4>
                  <ul class="space-y-2">
                    {currentPlan().features.slice(0, 4).map((feature) => (
                      <li class="flex items-start">
                        <Check class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                        <span class="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div class="space-y-3">
                  <h4 class="font-semibold text-gray-900">Additional Benefits:</h4>
                  <ul class="space-y-2">
                    {currentPlan().features.slice(4).map((feature) => (
                      <li class="flex items-start">
                        <Check class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-green-500" />
                        <span class="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div class="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <h2 class="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => setSelectedPayment("card")}
                  class={`p-4 border rounded-lg text-center transition-colors ${
                    selectedPayment() === "card"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <CreditCard class="w-6 h-6 mx-auto mb-2" />
                  <span class="text-sm font-medium">Credit Card</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("paypal")}
                  class={`p-4 border rounded-lg text-center transition-colors ${
                    selectedPayment() === "paypal"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <DollarSign class="w-6 h-6 mx-auto mb-2" />
                  <span class="text-sm font-medium">PayPal</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("apple")}
                  class={`p-4 border rounded-lg text-center transition-colors ${
                    selectedPayment() === "apple"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Apple class="w-6 h-6 mx-auto mb-2" />
                  <span class="text-sm font-medium">Apple Pay</span>
                </button>
                
                <button
                  onClick={() => setSelectedPayment("google")}
                  class={`p-4 border rounded-lg text-center transition-colors ${
                    selectedPayment() === "google"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Smartphone class="w-6 h-6 mx-auto mb-2" />
                  <span class="text-sm font-medium">Google Pay</span>
                </button>
              </div>

              <Show when={selectedPayment() === "card"}>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                      <Lock class="w-4 h-4" />
                      <span>Your payment information is encrypted and secure</span>
                    </div>
                  </div>
                </div>
              </Show>

              <Show when={selectedPayment() !== "card"}>
                <div class="bg-gray-50 p-6 rounded-lg text-center">
                  <div class="text-gray-600 mb-2">
                    You'll be redirected to complete your payment with {
                      selectedPayment() === "paypal" ? "PayPal" :
                      selectedPayment() === "apple" ? "Apple Pay" : "Google Pay"
                    }
                  </div>
                  <div class="text-sm text-gray-500">
                    Secure payment processing powered by industry-leading encryption
                  </div>
                </div>
              </Show>
            </div>

            {/* Action Buttons */}
            <div class="flex flex-col sm:flex-row gap-4">
              <button class="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Shield class="w-5 h-5" />
                Subscribe to {currentPlan().name} - {currentPlan().total}
              </button>
              <A href="/pricing">
                <button class="w-full sm:w-auto px-6 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors">
                  Back to Plans
                </button>
              </A>
            </div>
          </div>

          {/* Order Summary - Right Sidebar */}
          <div class="space-y-6">
            {/* Summary Card */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Plan</span>
                  <span class="font-medium text-gray-900">{currentPlan().name}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-gray-100">
                  <span class="text-gray-600">Billing</span>
                  <span class="font-medium text-gray-900">
                    {selectedPeriod() === "monthly" ? "Monthly" : "Yearly"}
                  </span>
                </div>
                <Show when={selectedPeriod() === "yearly"}>
                  <div class="flex justify-between items-center py-3 border-b border-gray-100 text-green-600">
                    <span>Annual Savings</span>
                    <span class="font-medium">$16.88</span>
                  </div>
                </Show>
                <div class="flex justify-between items-center py-3 text-lg font-bold">
                  <span>Total</span>
                  <span>{currentPlan().total}</span>
                </div>
              </div>

              <div class="space-y-3">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div class="flex items-center gap-2 text-green-800">
                    <Shield class="w-4 h-4" />
                    <span class="text-sm font-medium">30-day money-back guarantee</span>
                  </div>
                </div>

                <div class="text-sm text-gray-600 space-y-1">
                  <p>✓ Cancel or change anytime</p>
                  <p>✓ Secure payment processing</p>
                  <p>✓ Instant access to all features</p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Secure Payment
              </h3>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <Lock class="w-5 h-5 text-green-500" />
                  <span class="text-sm text-gray-600">256-bit SSL encryption</span>
                </div>
                <div class="flex items-center gap-3">
                  <Shield class="w-5 h-5 text-green-500" />
                  <span class="text-sm text-gray-600">PCI DSS compliant</span>
                </div>
                <div class="flex items-center gap-3">
                  <Calendar class="w-5 h-5 text-green-500" />
                  <span class="text-sm text-gray-600">30-day guarantee</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Need Help?
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Questions about billing or our plans? We're here to help.
              </p>
              <button class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div class="mt-12 text-center">
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="font-semibold text-gray-900 mb-2">Questions about your subscription?</h3>
            <p class="text-gray-600 text-sm mb-4">
              All subscriptions include full access to features, priority support, and our 30-day money-back guarantee.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <A
                href="/pricing"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Back to all pricing plans
              </A>
              <span class="hidden sm:inline text-gray-400">•</span>
              <A
                href="/features"
                class="text-blue-600 hover:text-blue-700 font-medium"
              >
                View all features
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}