import { createSignal, Show } from 'solid-js';
import { X, Mail, Smartphone, CheckCircle } from 'lucide-solid';
import { Button } from '@/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';

interface WaitlistModalProps {
  isOpen: () => boolean;
  onClose: () => void;
}

export default function WaitlistModal(props: WaitlistModalProps) {
  const [email, setEmail] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [isSubmitted, setIsSubmitted] = createSignal(false);
  const [emailError, setEmailError] = createSignal('');

  const validateEmail = (email: string): boolean => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateEmail(email())) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual waitlist API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        setEmailError('');
        props.onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      setEmailError('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen()}>
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-2xl"
        onClick={handleBackdropClick}
      >
        <Card class="w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 glass-panel gradient-border">
          <CardHeader class="relative pb-4">
            <button
              onClick={props.onClose}
              class="absolute right-4 top-4 p-1 rounded-full hover:bg-white/60 dark:hover:bg-slate-800/70 transition-colors border border-transparent hover:border-white/40 dark:hover:border-slate-700"
              aria-label="Close modal"
            >
              <X class="w-4 h-4 text-slate-500 dark:text-slate-300" />
            </button>

            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-[#0c7df2] rounded-lg flex items-center justify-center shadow-[0_12px_32px_rgba(12,125,242,0.22)] ring-2 ring-white/60 dark:ring-slate-800">
                <Smartphone class="w-5 h-5 text-white" />
              </div>
              <CardTitle class="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Join the Waitlist
              </CardTitle>
            </div>

            <p class="text-slate-600 dark:text-slate-200 text-sm">
              Be the first to know when our mobile apps launch. We'll send you an exclusive early access invitation.
            </p>
          </CardHeader>

          <CardContent class="pt-0">
            <Show when={!isSubmitted()} fallback={
              <div class="text-center py-6">
                <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle class="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  You're on the list!
                </h3>
                <p class="text-slate-600 dark:text-slate-200 text-sm">
                  Thanks for joining! We'll notify you as soon as the apps are ready.
                </p>
              </div>
            }>
              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="space-y-2">
                  <label
                    for="waitlist-email"
                    class="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Email Address
                  </label>
                  <div class="relative">
                    <Mail class={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${emailError() ? 'text-red-500' : 'text-slate-400'}`} />
                    <input
                      id="waitlist-email"
                      type="email"
                      value={email()}
                      onInput={(e) => {
                        setEmail(e.target.value);
                        if (emailError()) setEmailError('');
                      }}
                      placeholder="your@email.com"
                      class={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white/60 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 backdrop-blur transition-colors ${emailError()
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-white/50 dark:border-slate-800/70 focus:ring-cyan-400'
                        }`}
                    />
                  </div>
                  <Show when={emailError()}>
                    <p class="text-sm text-red-500 dark:text-red-400">{emailError()}</p>
                  </Show>
                </div>

                <div class="space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting()}
                    class="w-full text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isSubmitting() ? (
                      <div class="flex items-center justify-center gap-2">
                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Joining...
                      </div>
                    ) : (
                      'Join Waitlist'
                    )}
                  </Button>

                  <div class="text-center">
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      We respect your privacy. No spam, just updates about our mobile apps.
                    </p>
                  </div>
                </div>
              </form>
            </Show>
          </CardContent>
        </Card>
      </div>
    </Show>
  );
}

