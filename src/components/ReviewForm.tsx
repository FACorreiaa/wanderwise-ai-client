import { createSignal, Show, For } from 'solid-js';
import { Star, Camera, X, Upload, MapPin, Calendar, Users } from 'lucide-solid';

interface ReviewFormProps {
    poiId?: string;
    poiName?: string;
    onSubmit: (reviewData: any) => void;
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
    const [photos, setPhotos] = createSignal([]);
    const [isSubmitting, setIsSubmitting] = createSignal(false);

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
                    class={`p-1 transition-colors ${filled ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                >
                    <Star class={`w-8 h-8 ${filled ? 'fill-current' : ''}`} />
                </button>
            );
        });
    };

    const handlePhotoUpload = (event) => {
        const files = Array.from(event.target.files);
        // In a real app, you would upload these files
        const newPhotos = files.map((file, index) => ({
            id: `photo-${Date.now()}-${index}`,
            file,
            preview: URL.createObjectURL(file)
        }));
        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (photoId) => {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!rating() || !content().trim()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const reviewData = {
                poiId: props.poiId,
                rating: rating(),
                title: title().trim(),
                content: content().trim(),
                visitDate: visitDate(),
                travelType: travelType(),
                photos: photos().map(photo => photo.file)
            };

            await props.onSubmit(reviewData);
            resetForm();
        } catch (error) {
            console.error('Error submitting review:', error);
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
    };

    const getRatingLabel = (rating) => {
        const labels = {
            1: 'Terrible',
            2: 'Poor',
            3: 'Average',
            4: 'Good',
            5: 'Excellent'
        };
        return labels[rating] || '';
    };

    if (!props.isOpen) return null;

    return (
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
                        >
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
                            <div class="flex">
                                {renderStars()}
                            </div>
                            <Show when={rating() > 0}>
                                <span class="text-lg font-medium text-gray-900 dark:text-white ml-2">
                                    {getRatingLabel(rating())}
                                </span>
                            </Show>
                        </div>
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
                            onInput={(e) => setContent(e.target.value)}
                            placeholder="Share your experience, tips, and what made this place special..."
                            rows={5}
                            class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            maxLength={1000}
                        />
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{content().length}/1000 characters</p>
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
                                        <div class={`p-3 border-2 rounded-lg transition-all text-center ${
                                            travelType() === type.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}>
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
                                                src={photo.preview}
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
                            onClick={handleSubmit}
                            disabled={!rating() || !content().trim() || isSubmitting()}
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting() ? (
                                <>
                                    <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
    );
}