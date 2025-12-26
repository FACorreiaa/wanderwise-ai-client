import { Component, createSignal, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import {
  FiArrowRight,
  FiCheck,
  FiMapPin,
  FiHeart,
  FiMessageCircle,
  FiUser,
  FiCamera,
} from "solid-icons/fi";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  action: string;
  route: string;
}

const OnboardingCard: Component = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal(0);
  const [showOnboarding, setShowOnboarding] = createSignal(true);

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Create Your Travel Profile",
      description: "Set up your preferences to get personalized recommendations",
      icon: FiUser,
      completed: false,
      action: "Create Profile",
      route: "/profiles",
    },
    {
      id: "interests",
      title: "Choose Your Interests",
      description: "Select topics and activities you love to discover relevant places",
      icon: FiHeart,
      completed: false,
      action: "Set Interests",
      route: "/settings?tab=interests",
    },
    {
      id: "chat",
      title: "Try AI Planning",
      description: "Ask our AI assistant to create a personalized itinerary for you",
      icon: FiMessageCircle,
      completed: false,
      action: "Start Chat",
      route: "/chat",
    },
    {
      id: "explore",
      title: "Explore Destinations",
      description: "Browse hotels, restaurants, and attractions in your favorite cities",
      icon: FiMapPin,
      completed: false,
      action: "Explore",
      route: "/itinerary",
    },
  ];

  const [onboardingSteps, setOnboardingSteps] = createSignal(steps);

  const markStepCompleted = (stepId: string) => {
    setOnboardingSteps((prev) =>
      prev.map((step) => (step.id === stepId ? { ...step, completed: true } : step)),
    );
  };

  const goToStep = (route: string, stepId: string) => {
    markStepCompleted(stepId);
    navigate(route);
  };

  const nextStep = () => {
    const current = currentStep();
    if (current < onboardingSteps().length - 1) {
      setCurrentStep(current + 1);
    }
  };

  const prevStep = () => {
    const current = currentStep();
    if (current > 0) {
      setCurrentStep(current - 1);
    }
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingSkipped", "true");
  };

  const completedSteps = () => onboardingSteps().filter((step) => step.completed).length;
  const progressPercentage = () => Math.round((completedSteps() / onboardingSteps().length) * 100);

  return (
    <Show when={showOnboarding()}>
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card class="w-full max-w-2xl mx-auto">
          <CardHeader class="text-center pb-4">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiMapPin class="w-8 h-8 text-white" />
            </div>
            <CardTitle class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Loci!
            </CardTitle>
            <CardDescription class="text-base text-gray-600 dark:text-gray-300">
              Let's get you set up for personalized travel recommendations
            </CardDescription>

            {/* Progress Bar */}
            <div class="mt-6">
              <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span>Progress</span>
                <span>
                  {completedSteps()} of {onboardingSteps().length} completed
                </span>
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  class="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage()}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent class="pt-2">
            {/* Current Step Display */}
            <Show when={currentStep() < onboardingSteps().length}>
              <div class="mb-6">
                <div class="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div class="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const step = onboardingSteps()[currentStep()];
                      const IconComponent = step.icon;
                      return (
                        <>
                          {step.completed ? (
                            <FiCheck class="w-6 h-6 text-white" />
                          ) : (
                            <IconComponent class="w-6 h-6 text-white" />
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-1">
                      {onboardingSteps()[currentStep()].title}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {onboardingSteps()[currentStep()].description}
                    </p>
                    <Button
                      onClick={() =>
                        goToStep(
                          onboardingSteps()[currentStep()].route,
                          onboardingSteps()[currentStep()].id,
                        )
                      }
                      class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                      size="sm"
                    >
                      {onboardingSteps()[currentStep()].action}
                      <FiArrowRight class="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Show>

            {/* All Steps Overview */}
            <div class="space-y-3 mb-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Getting Started Steps:</h4>
              <For each={onboardingSteps()}>
                {(step, index) => (
                  <div
                    class={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      step.completed
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        : index() === currentStep()
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <div
                      class={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? "bg-green-600 dark:bg-green-500"
                          : index() === currentStep()
                            ? "bg-blue-600 dark:bg-blue-500"
                            : "bg-gray-400 dark:bg-gray-600"
                      }`}
                    >
                      {step.completed ? (
                        <FiCheck class="w-4 h-4 text-white" />
                      ) : (
                        <span class="text-white text-sm font-medium">{index() + 1}</span>
                      )}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <h5
                          class={`text-sm font-medium ${
                            step.completed
                              ? "text-green-900 dark:text-green-100"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {step.title}
                        </h5>
                        {step.completed && (
                          <Badge class="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <p
                        class={`text-xs ${
                          step.completed
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {!step.completed && (
                      <Button
                        onClick={() => goToStep(step.route, step.id)}
                        variant="ghost"
                        size="sm"
                        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <FiArrowRight class="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </For>
            </div>

            {/* Quick Start Tips */}
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 mb-6">
              <h4 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FiCamera class="w-4 h-4" />
                Quick Tips to Get Started
              </h4>
              <ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Start by creating a travel profile with your preferences</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Try asking the AI: "Plan a weekend in Porto for art lovers"</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Save places to your favorites for easy access later</span>
                </li>
                <li class="flex items-start gap-2">
                  <div class="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                  <span>Create custom lists to organize your travel plans</span>
                </li>
              </ul>
            </div>

            {/* Navigation Buttons */}
            <div class="flex items-center justify-between">
              <button
                onClick={skipOnboarding}
                class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm font-medium"
              >
                Skip for now
              </button>

              <div class="flex items-center gap-2">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  size="sm"
                  disabled={currentStep() === 0}
                >
                  Previous
                </Button>

                <Show
                  when={currentStep() < onboardingSteps().length - 1}
                  fallback={
                    <Button
                      onClick={skipOnboarding}
                      class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                      size="sm"
                    >
                      Get Started
                    </Button>
                  }
                >
                  <Button
                    onClick={nextStep}
                    class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                    size="sm"
                  >
                    Next
                  </Button>
                </Show>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Show>
  );
};

export default OnboardingCard;
