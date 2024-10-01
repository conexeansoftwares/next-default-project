'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';

interface ExpandableRowProps {
  colSpan: number;
  content: React.ReactNode;
  isExpanded: boolean;
}

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  colSpan,
  content,
  isExpanded,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [content]);

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="bg-muted p-0">
        <div
          className={'overflow-hidden transition-[max-height] duration-300 ease-in-out'}
          style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0' }}
        >
          <div ref={contentRef} className="p-4">
            {content}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
