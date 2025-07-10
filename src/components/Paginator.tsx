import { For, Show } from 'solid-js';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-solid';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Paginator(props: PaginatorProps) {
  const startItem = () => (props.currentPage - 1) * props.itemsPerPage + 1;
  const endItem = () => Math.min(props.currentPage * props.itemsPerPage, props.totalItems);
  
  // Debug logging
  console.log('Paginator props:', {
    currentPage: props.currentPage,
    totalPages: props.totalPages,
    totalItems: props.totalItems,
    itemsPerPage: props.itemsPerPage,
    startItem: startItem(),
    endItem: endItem()
  });

  // Generate page numbers to display - simplified for mobile
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const { currentPage, totalPages } = props;

    if (totalPages <= 5) {
      // Show all pages if total is 5 or less (mobile-friendly)
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Show first 3 pages, then ellipsis, then last page
        for (let i = 2; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page, ellipsis, then last 3 pages
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current page, ellipsis, last page
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div class={`bg-white dark:bg-gray-800 ${props.className || ''}`}>
      {/* Mobile-first compact pagination - Always visible */}
      <div class="px-3 py-2 sm:px-4 sm:py-3">
        {/* Page info - Mobile optimized */}
        <div class="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3">
          <span>
            Page {props.currentPage} of {props.totalPages}
          </span>
          <span class="hidden sm:inline">
            {startItem() === endItem() 
              ? `${startItem()} of ${props.totalItems}`
              : `${startItem()}-${endItem()} of ${props.totalItems}`
            }
          </span>
        </div>

        {/* Navigation controls - Mobile-first */}
        <div class="flex items-center justify-between gap-2">
          {/* Previous button */}
          <button
            onClick={() => props.currentPage > 1 && props.onPageChange(props.currentPage - 1)}
            disabled={props.currentPage === 1}
            class="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft class="w-3 h-3 sm:w-4 sm:h-4" />
            <span class="hidden sm:inline">Previous</span>
            <span class="sm:hidden">Prev</span>
          </button>

          {/* Page numbers - Compact for mobile */}
          <div class="flex items-center gap-1">
            <For each={getPageNumbers()}>
              {(page) => (
                <Show
                  when={typeof page === 'number'}
                  fallback={
                    <span class="px-2 py-1 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
                      ...
                    </span>
                  }
                >
                  <button
                    onClick={() => props.onPageChange(page as number)}
                    class={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded border transition-colors ${
                      props.currentPage === page
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                </Show>
              )}
            </For>
          </div>

          {/* Next button */}
          <button
            onClick={() => props.currentPage < props.totalPages && props.onPageChange(props.currentPage + 1)}
            disabled={props.currentPage === props.totalPages}
            class="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="hidden sm:inline">Next</span>
            <span class="sm:hidden">Next</span>
            <ChevronRight class="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}