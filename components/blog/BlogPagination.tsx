'use client';

import Image from 'next/image';

const imgLucideChevronLeft = "http://localhost:3845/assets/d3201b8af545e7a16b5b059ed6329716eff8a585.svg";
const imgLucideChevronsLeft = "http://localhost:3845/assets/f39544c1366b3ca57962544a9630575ec0effd44.svg";
const imgLucideChevronsRight = "http://localhost:3845/assets/92b130dde04f8b32a7a4579833e5edea876ac5ef.svg";
const imgLucideChevronRight = "http://localhost:3845/assets/8e206851fc807c32f57791a7dfe3c3762f38eb33.svg";

interface BlogPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function BlogPagination({ 
  currentPage = 1, 
  totalPages = 10,
  onPageChange
}: BlogPaginationProps) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    handlePageChange(1);
  };

  const handleLastPage = () => {
    handlePageChange(totalPages);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 2, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full">
      
      {/* Previous Button */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2.5 relative rounded-md shrink-0 border border-[#dddddd] hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="relative shrink-0 size-5">
            <Image alt="Previous page" className="block max-w-none size-full" src={imgLucideChevronLeft} width={16} height={16} />
          </div>
          <div className="font-['Geist:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Previous</p>
          </div>
        </button>
      </div>

      {/* Page Numbers */}
      <div className="box-border content-stretch flex flex-row gap-[11px] items-center justify-start p-0 relative shrink-0">
        
        {/* First Page / Double Left Arrow */}
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="relative shrink-0 size-5">
            <Image alt="First page" className="block max-w-none size-full" src={imgLucideChevronsLeft} width={16} height={16} />
          </div>
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 border border-[#dddddd]"
              >
                <div className="font-['Geist:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
                  <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">...</p>
                </div>
              </div>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 border transition-colors ${
                isActive
                  ? 'bg-[#fb7102] border-[#fb7102] text-white'
                  : 'border-[#dddddd] hover:bg-gray-100'
              }`}
            >
              <div className={`font-['Geist:${isActive ? 'Bold' : 'Medium'}',_sans-serif] leading-[0] not-italic relative shrink-0 text-[${isActive ? '#ffffff' : '#50576b'}] text-[${isActive ? '15px' : '14px'}] text-left text-nowrap tracking-[-0.${isActive ? '15' : '14'}px]`}>
                <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">{page}</p>
              </div>
            </button>
          );
        })}

        {/* Last Page / Double Right Arrow */}
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-3 py-2.5 relative rounded-md shrink-0 w-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="relative shrink-0 size-5">
            <Image alt="Last page" className="block max-w-none size-full" src={imgLucideChevronsRight} width={16} height={16} />
          </div>
        </button>
      </div>

      {/* Next Button */}
      <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-end justify-center min-h-px min-w-px p-0 relative shrink-0">
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2.5 relative rounded-md shrink-0 border border-[#dddddd] hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <div className="font-['Geist:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#50576b] text-[14px] text-left text-nowrap tracking-[-0.14px]">
            <p className="adjustLetterSpacing block leading-[20px] whitespace-pre">Next</p>
          </div>
          <div className="relative shrink-0 size-5">
            <Image alt="Next page" className="block max-w-none size-full" src={imgLucideChevronRight} width={16} height={16} />
          </div>
        </button>
      </div>

      <style jsx>{`
        .adjustLetterSpacing {
          letter-spacing: inherit;
        }
      `}</style>
    </div>
  );
}