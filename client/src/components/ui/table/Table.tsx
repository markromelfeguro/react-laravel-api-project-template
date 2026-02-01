import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";
import { MaterialIcon, Button } from '../../ui';
import { Select } from '../forms/Select';

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLTableRowElement>; 
}

interface TableCellProps {
  children?: ReactNode;
  colSpan?: number;
  isHeader?: boolean;
  className?: string;
  sortKey?: string;
  currentSort?: { key: string; direction: 'asc' | 'desc' };
  onSort?: (key: string) => void;
}

interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalResults?: number;
  pageSize?: number;
}

export const Table: FC<TableProps> = ({ children, className = "" }) => {
  return (
    
    <div className="relative overflow-hidden rounded-3xl border border-border shadow-main bg-surface">
      <div className="overflow-x-auto">
        <table className={`w-full text-sm text-left rtl:text-right border-collapse ${className}`}>
          {children}
        </table>
      </div>
    </div>
  );
};

export const TableHeader: FC<TableHeaderProps> = ({ children, className = "" }) => {
  return (
    <thead className={`
      text-nowrap text-xs uppercase tracking-widest sticky top-0 z-10
      bg-surface text-main-text border-b border-border
      ${className}
    `}>
      {children}
    </thead>
  );
};

export const TableBody: FC<TableBodyProps> = ({ children, className = "" }) => {
  return (
    <tbody className={`bg-surface divide-y divide-border/50 ${className}`}>
      {children}
    </tbody>
  );
};

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = "", onClick, ...props }, ref) => (
    <tr 
      ref={ref} 
      onClick={onClick}
      className={`
        transition-all duration-200
        ${onClick ? 'cursor-pointer hover:bg-main-bg/50' : ''} 
        ${className}
      `} 
      {...props}
    >
      {children}
    </tr>
  )
);

export const TableCell: FC<TableCellProps> = ({
  children,
  colSpan,
  isHeader,
  className = "",
  sortKey, 
  currentSort,
  onSort,
}) => {
  const CellTag = isHeader ? "th" : "td";

  const isSortable = isHeader && sortKey && onSort;
  const isActive = currentSort?.key === sortKey;
  
  return (
    <CellTag 
      colSpan={colSpan} 
      onClick={() => isSortable && onSort(sortKey)}
      className={`
        px-6 py-4 whitespace-nowrap transition-colors
        ${isHeader ? 'font-black uppercase italic tracking-widest text-[10px]' : 'text-main-text font-medium'} 
        ${isSortable ? 'cursor-pointer hover:bg-main-bg select-none group' : ''}
        ${isActive ? 'text-primary' : ''}
        ${className}
      `}>
      <div className="flex items-center gap-2">
        {children}
        {isSortable && (
          <div className="flex flex-col transition-opacity">
            <MaterialIcon 
              iconName={isActive && currentSort?.direction === 'desc' ? "arrow_drop_down" : "arrow_drop_up"} 
              size={18} 
              className={isActive ? "text-primary" : "text-muted/40"}
            />
          </div>
        )}
      </div>
    </CellTag>
  );
};

export const TableFooter: React.FC<TableFooterProps> = ({ children, className = "" }) => {
  return (
    <tfoot className={`bg-main-bg/30 border-t border-border ${className}`}>
      {children}
    </tfoot>
  );
};

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalResults,
  pageSize = 10,
}) => {
  const startRange = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalResults || 0);

  const getPageNumbers = () => {
    const pages = [];
    const showMax = 3;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > showMax + 1) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - showMax) pages.push("...");

      pages.push(totalPages);
    }
    return pages;
  };

  const pageSizeOptions = [
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-4 bg-main-bg/30 border-t border-border gap-4">
      
      {/* Left Side: Page Size & Info */}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase italic tracking-widest text-muted">Show</span>
          <div className="w-20">
            <Select
              value={pageSize.toString()}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              options={pageSizeOptions}
              className="py-1 text-sm rounded-xl"
            />
          </div>
        </div>

        <div className="text-[10px] font-black uppercase italic tracking-widest text-muted">
          Showing <span className="text-primary">{startRange}</span> to{" "}
          <span className="text-primary">{endRange}</span> of{" "}
          <span className="text-primary">{totalResults}</span> entries
        </div>
      </div>

      {/* Right Side: Navigation & Jump-to-Page */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2! rounded-xl">
          <MaterialIcon iconName="chevron_left" size={20} />
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-2 text-muted font-bold">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`
                    min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black italic transition-all
                    ${currentPage === page 
                      ? 'bg-primary text-surface shadow-main scale-110 z-10' 
                      : 'bg-surface border border-border text-main-text hover:bg-main-bg'}
                  `}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2! rounded-xl"
        >
          <MaterialIcon iconName="chevron_right" size={20} />
        </Button>
      </div>
    </div>
  );
};