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

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!email().trim()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call - replace with actual waitlist API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        props.onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to join waitlist:', error);
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
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <Card class="w-full max-w-md bg-white dark:bg-gray-800 border-0 shadow-2xl animate-in zoom-in-95 duration-200">
          <CardHeader class="relative pb-4">
            <button
              onClick={props.onClose}
              class="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X class="w-4 h-4 text-gray-500" />
            </button>
            
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Smartphone class="w-5 h-5 text-white" />
              </div>
              <CardTitle class="text-xl font-bold text-gray-900 dark:text-white">
                Join the Waitlist
              </CardTitle>
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm">
              Be the first to know when our mobile apps launch. We'll send you an exclusive early access invitation.
            </p>
          </CardHeader>

          <CardContent class="pt-0">
            <Show when={!isSubmitted()} fallback={
              <div class="text-center py-6">
                <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle class="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  You're on the list!
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm">
                  Thanks for joining! We'll notify you as soon as the apps are ready.
                </p>
              </div>
            }>
              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="space-y-2">
                  <label 
                    for="waitlist-email" 
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Email Address
                  </label>
                  <div class="relative">
                    <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="waitlist-email"
                      type="email"
                      value={email()}
                      onInput={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                <div class="space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting() || !email().trim()}
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
                    <p class="text-xs text-gray-500 dark:text-gray-400">
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