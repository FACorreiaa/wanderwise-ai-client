import { createSignal, Show } from 'solid-js';
import { X, Link, Copy, Check, Share2, MessageCircle, Twitter } from 'lucide-solid';
import { Button } from '~/ui/button';
import { createShareLink, copyShareLink, shareViaWebShare } from '~/lib/api/share';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentType: string;
    contentId: string;
    title: string;
    description?: string;
    imageUrl?: string;
}

/**
 * Modal for sharing content via link, copy, or social media
 */
export function ShareModal(props: ShareModalProps) {
    const [shareUrl, setShareUrl] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [isCopied, setIsCopied] = createSignal(false);
    const [error, setError] = createSignal('');

    // Generate share link on open
    const handleGenerateLink = async () => {
        setIsLoading(true);
        setError('');

        try {
            const result = await createShareLink(
                props.contentType,
                props.contentId,
                props.title,
                props.description,
                props.imageUrl
            );

            if (result) {
                setShareUrl(result.shareUrl);
            } else {
                setError('Failed to generate share link');
            }
        } catch (e) {
            setError('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Copy link to clipboard
    const handleCopy = async () => {
        const url = shareUrl();
        if (!url) return;

        const success = await copyShareLink(url);
        if (success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // Share via native share dialog
    const handleNativeShare = async () => {
        const url = shareUrl();
        if (!url) return;

        await shareViaWebShare(props.title, props.description || '', url);
    };

    // Share on Twitter
    const handleTwitterShare = () => {
        const url = shareUrl();
        if (!url) return;

        const tweetText = encodeURIComponent(`${props.title} - Check this out!`);
        const tweetUrl = encodeURIComponent(url);
        window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank');
    };

    // Share on WhatsApp
    const handleWhatsAppShare = () => {
        const url = shareUrl();
        if (!url) return;

        const message = encodeURIComponent(`${props.title}: ${url}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    {/* Header */}
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center gap-2">
                            <Share2 class="w-5 h-5 text-blue-500" />
                            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Share</h2>
                        </div>
                        <button
                            onClick={props.onClose}
                            class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X class="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div class="p-6 space-y-4">
                        {/* Title preview */}
                        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <h3 class="font-medium text-gray-900 dark:text-white">{props.title}</h3>
                            <Show when={props.description}>
                                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                    {props.description}
                                </p>
                            </Show>
                            <span class="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full mt-2">
                                {props.contentType}
                            </span>
                        </div>

                        {/* Generate link button */}
                        <Show when={!shareUrl()}>
                            <Button
                                onClick={handleGenerateLink}
                                disabled={isLoading()}
                                class="w-full gap-2"
                            >
                                {isLoading() ? (
                                    <>
                                        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generating link...
                                    </>
                                ) : (
                                    <>
                                        <Link class="w-4 h-4" />
                                        Generate Share Link
                                    </>
                                )}
                            </Button>
                        </Show>

                        {/* Share link and options */}
                        <Show when={shareUrl()}>
                            {/* Link input */}
                            <div class="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl()}
                                    readonly
                                    class="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm truncate"
                                />
                                <Button onClick={handleCopy} variant="secondary" class="gap-1.5">
                                    {isCopied() ? (
                                        <>
                                            <Check class="w-4 h-4 text-green-500" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy class="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Share buttons */}
                            <div class="flex gap-3 justify-center pt-2">
                                <button
                                    onClick={handleNativeShare}
                                    class="p-3 bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60 rounded-full transition-colors"
                                    title="Share"
                                >
                                    <Share2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </button>
                                <button
                                    onClick={handleTwitterShare}
                                    class="p-3 bg-sky-100 dark:bg-sky-900/40 hover:bg-sky-200 dark:hover:bg-sky-800/60 rounded-full transition-colors"
                                    title="Share on Twitter"
                                >
                                    <Twitter class="w-5 h-5 text-sky-600 dark:text-sky-400" />
                                </button>
                                <button
                                    onClick={handleWhatsAppShare}
                                    class="p-3 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-800/60 rounded-full transition-colors"
                                    title="Share on WhatsApp"
                                >
                                    <MessageCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
                                </button>
                            </div>
                        </Show>

                        {/* Error */}
                        <Show when={error()}>
                            <p class="text-sm text-red-500 text-center">{error()}</p>
                        </Show>
                    </div>
                </div>
            </div>
        </Show>
    );
}

export default ShareModal;
