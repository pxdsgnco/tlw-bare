'use client';

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function EventsPagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: EventsPaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 2, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="box-border content-stretch flex flex-col gap-2 items-center justify-start p-0 relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-row items-center justify-between max-w-[1440px] px-16 py-8 relative shrink-0 w-full">
        
        {/* Previous Button */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2.5 relative rounded-md shrink-0 border border-[#dddddd] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#50576b]" />
            <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
              <p className="block leading-[20px] whitespace-pre">Previous</p>
            </div>
          </button>
        </div>

        {/* Page Numbers */}
        <div className="box-border content-stretch flex flex-row gap-[11px] items-center justify-start p-0 relative shrink-0">
          {/* First Page Button */}
          <button
            onClick={handleFirst}
            disabled={currentPage === 1}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-5 h-5 text-[#50576b]" />
          </button>

          {renderPageNumbers().map((page, index) => (
            page === '...' ? (
              <div
                key={`ellipsis-${index}`}
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 border border-[#dddddd]"
              >
                <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                  <p className="block leading-[20px] whitespace-pre">...</p>
                </div>
              </div>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 transition-colors ${
                  currentPage === page
                    ? 'bg-[#fb7102] border border-[#fb7102]'
                    : 'border border-[#dddddd] hover:bg-gray-50'
                }`}
              >
                <div className={`font-bold leading-[0] not-italic relative shrink-0 text-[14px] text-left text-nowrap tracking-[-0.14px] ${
                  currentPage === page ? 'text-[#ffffff]' : 'text-[#50576b]'
                }`}>
                  <p className="block leading-[20px] whitespace-pre">{page}</p>
                </div>
              </button>
            )
          ))}

          {/* Last Page Button */}
          <button
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-5 h-5 text-[#50576b]" />
          </button>
        </div>

        {/* Next Button */}
        <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-end justify-center min-h-px min-w-px p-0 relative shrink-0">
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2.5 relative rounded-md shrink-0 border border-[#dddddd] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-medium leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
              <p className="block leading-[20px] whitespace-pre">Next</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#50576b]" />
          </button>
        </div>
      </div>
    </div>
  );
}