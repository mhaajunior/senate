"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControlled({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  // ฟังก์ชันช่วยสร้าง array หน้าแบบมี ... (ellipsis) ถ้าจำนวนหน้ามาก
  function getPageNumbers(): (number | "ellipsis")[] {
    const delta = 2; // จำนวนหน้าที่แสดงรอบๆ หน้า current
    const range: (number | "ellipsis")[] = [];

    let left = Math.max(2, currentPage - delta);
    let right = Math.min(totalPages - 1, currentPage + delta);

    if (left > 2) {
      range.push(1, "ellipsis");
    } else {
      for (let i = 1; i < left; i++) {
        range.push(i);
      }
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("ellipsis", totalPages);
    } else {
      for (let i = right + 1; i <= totalPages; i++) {
        range.push(i);
      }
    }

    // กรณีพิเศษถ้า totalPages <= 1 ให้แสดงแค่ 1 หน้า
    if (totalPages <= 1) return [1];
    return range;
  }

  const pages = getPageNumbers();

  return (
    <Pagination aria-label="Table navigation">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault();
                  if (page !== currentPage) onPageChange(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
