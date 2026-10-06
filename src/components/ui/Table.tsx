import React from "react";
import { Loader2 } from "lucide-react";

export interface TableProps {
  headers: string[];
  children?: React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  isLoading = false,
  emptyMessage = "No records found.",
  isEmpty = false,
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#242430] bg-[#121217]">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#242430] bg-[#16161D]">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[#9D9DAE]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#242430]/60">
          {isLoading ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-[#9D9DAE]">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#E5A93C]" />
                  <span>Loading data...</span>
                </div>
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={headers.length} className="py-12 text-center text-[#6B6B7B]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
