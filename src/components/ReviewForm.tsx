import { createSignal, Show, For } from 'solid-js';
import { Star, Camera, X, Calendar } from 'lucide-solid';
import type { PhotoUploadEvent } from '../lib/api/types';
// import type { UploadedPhoto } from '~/lib/api/types';

interface ReviewData {
    rating: number;
    title: string;
    content: string;
    visitDate: string;
    travelType: string;
    photos: File[]; // Changed from UploadedPhoto[]
    poiId?: string;
}

// Internal type for managing photos in the form, distinct from the API's UploadedPhoto if needed
interface FormPhoto {
    id: string;
    file: File;
    url: string; // Using url for preview
}

interface ReviewFormProps {
    poiId?: string;
    poiName?: string;
    onSubmit: (reviewData: ReviewData) => void;
    onCancel: () => void;
    isOpen: boolean;
}

export default function ReviewForm(props: ReviewFormProps) {
    const [rating, setRating] = createSignal(0);
    const [hoverRating, setHoverRating] = createSignal(0);
    const [title, setTitle] = createSignal('');
    const [content, setContent] = createSignal('');
    const [visitDate, setVisitDate] = createSignal('');
    const [travelType, setTravelType] = createSignal('');
    const [photos, setPhotos] = createSignal<FormPhoto[]>([]); // Using internal FormPhoto type
    const [isSubmitting, setIsSubmitting] = createSignal(false);
    const [errors, setErrors] = createSignal<{ rating?: string; content?: string }>({});

    const travelTypes = [
        { id: 'solo', label: 'Solo Travel', icon: '🎒' },
        { id: 'couple', label: 'Couple', icon: '💑' },
        { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
        { id: 'friends', label: 'Friends', icon: '👥' },
        { id: 'business', label: 'Business', icon: '💼' }
    ];

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            const filled = starValue <= (hoverRating() || rating());

            return (
                <button
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    class={`p - 1 transition - colors ${filled ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'} `}
                >
                    <Star class={`w - 8 h - 8 ${filled ? 'fill-current' : ''} `} />
                </button>
            );
        });
    };

    const handlePhotoUpload = (event: PhotoUploadEvent) => {
        const files = event.target.files ? Array.from(event.target.files) : [];
        // In a real app, you would upload these files
        const newPhotos: FormPhoto[] = files.map((file, index) => ({
            id: `photo - ${Date.now()} -${index} `,
            file,
            url: URL.createObjectURL(file) // Using url as preview
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (photoId: string) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        // Validate on submit
        const validationErrors: { rating?: string; content?: string } = {};
        if (!rating()) {
            validationErrors.rating = 'Please select a rating';
        }
        if (!content().trim()) {
            validationErrors.content = 'Please write a review';
        } else if (content().trim().length < 10) {
            validationErrors.content = 'Review must be at least 10 characters';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        setIsSubmitting(true);

        try {
            const reviewDataDictionary: ReviewData = {
                poiId: props.poiId,
                rating: rating(),
                title: title().trim(),
                content: content().trim(),
                visitDate: visitDate(),
                travelType: travelType(),
                photos: photos().map(photo => photo.file) // Assigning File[] to ReviewData
            };

            await props.onSubmit(reviewDataDictionary);
            resetForm();
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrors({ content: 'Failed to submit review. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setRating(0);
        setHoverRating(0);
        setTitle('');
        setContent('');
        setVisitDate('');
        setTravelType('');
        setPhotos([]);
        setErrors({});
    };

    const getRatingLabel = (rating: number): string => {
        const labels: Record<number, string> = {
            1: 'Terrible',
            2: 'Poor',
            3: 'Average',
            4: 'Good',
            5: 'Excellent'
        };
        return labels[rating] || '';
    };

    return (
        <Show when={props.isOpen}>
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div class="flex items-center justify-between">
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Write a Review</h2>
                                <Show when={props.poiName}>
                                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">for {props.poiName}</p>
                                </Show>
                            </div>
                            <button
                                onClick={props.onCancel}
                                class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">

                                <X class="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} class="p-6 space-y-6">
                        {/* Rating */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Overall Rating *
                            </label>
                            <div class="flex items-center gap-2">
                                <div class={`flex p-1 rounded-lg ${errors().rating ? 'ring-2 ring-red-500' : ''}`}>
                                    {renderStars()}
                                </div>
                                <Show when={rating() > 0}>
                                    <span class="text-lg font-medium text-gray-900 dark:text-white ml-2">
                                        {getRatingLabel(rating())}
                                    </span>
                                </Show>
                            </div>
                            <Show when={errors().rating}>
                                <p class="mt-1 text-sm text-red-500 dark:text-red-400">{errors().rating}</p>
                            </Show>
                        </div>

                        {/* Title */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Review Title
                            </label>
                            <input
                                type="text"
                                value={title()}
                                onInput={(e) => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                maxLength={100}
                            />
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{title().length}/100 characters</p>
                        </div>

                        {/* Content */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Review *
                            </label>
                            <textarea
                                value={content()}
                                onInput={(e) => {
                                    setContent(e.target.value);
                                    if (errors().content) setErrors({ ...errors(), content: undefined });
                                }}
                                placeholder="Share your experience, tips, and what made this place special..."
                                rows={5}
                                class={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${errors().content
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                                    }`}
                                maxLength={1000}
                            />
                            <div class="flex justify-between mt-1">
                                <Show when={errors().content} fallback={<span></span>}>
                                    <p class="text-sm text-red-500 dark:text-red-400">{errors().content}</p>
                                </Show>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{content().length}/1000 characters</p>
                            </div>
                        </div>

                        {/* Visit Date */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                When did you visit?
                            </label>
                            <div class="relative">
                                <Calendar class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                                <input
                                    type="date"
                                    value={visitDate()}
                                    onInput={(e) => setVisitDate(e.target.value)}
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    max={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        {/* Travel Type */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Type of Travel
                            </label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <For each={travelTypes}>
                                    {(type) => (
                                        <label class="relative cursor-pointer">
                                            <input
                                                type="radio"
                                                name="travelType"
                                                value={type.id}
                                                checked={travelType() === type.id}
                                                onChange={() => setTravelType(type.id)}
                                                class="sr-only"
                                            />
                                            <div class={`p - 3 border - 2 rounded - lg transition - all text - center ${travelType() === type.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                                } `}>
                                                <div class="text-xl mb-1">{type.icon}</div>
                                                <div class="text-sm font-medium text-gray-900 dark:text-white">{type.label}</div>
                                            </div>
                                        </label>
                                    )}
                                </For>
                            </div>
                        </div>

                        {/* Photos */}
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Add Photos (Optional)
                            </label>

                            {/* Photo Upload */}
                            <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    class="hidden"
                                    id="photo-upload"
                                />
                                <label for="photo-upload" class="cursor-pointer">
                                    <Camera class="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                                    <p class="text-sm text-gray-600 dark:text-gray-300">
                                        <span class="text-blue-600 dark:text-blue-400 font-medium">Click to upload</span> or drag and drop
                                    </p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">PNG, JPG up to 10MB each</p>
                                </label>
                            </div>

                            {/* Photo Preview */}
                            <Show when={photos().length > 0}>
                                <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <For each={photos()}>
                                        {(photo) => (
                                            <div class="relative group">
                                                <img
                                                    src={photo.url}
                                                    alt="Review photo"
                                                    class="w-full aspect-square object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removePhoto(photo.id)}
                                                    class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X class="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </div>
                    </form>

                    {/* Footer */}
                    <div class="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                            Your review will be public and help other travelers
                        </p>

                        <div class="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={props.onCancel}
                                class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                                disabled={isSubmitting()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!rating() || !content().trim() || isSubmitting()}
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting() ? (
                                    <>
                                        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Show>
    );
}