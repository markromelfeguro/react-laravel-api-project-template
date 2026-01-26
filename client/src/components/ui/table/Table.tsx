import React from "react";
import type { FC, ReactNode, MouseEventHandler } from "react";

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
    /* Clean separation using your theme's divide color */
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
}) => {
  const CellTag = isHeader ? "th" : "td";
  
  return (
    <CellTag 
      colSpan={colSpan} 
      className={`
        px-6 py-4 whitespace-nowrap
        ${isHeader ? 'font-bold' : 'text-main-text font-medium'} 
        ${className}
      `}>
      {children}
    </CellTag>
  );
};