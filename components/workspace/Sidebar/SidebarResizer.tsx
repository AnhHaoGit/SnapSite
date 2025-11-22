"use client";

import { Dispatch, SetStateAction } from "react";

export default function SidebarResizer({
  sidebarRef,
  setWidth,
}: {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  setWidth: Dispatch<SetStateAction<number>>;
}) {
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!sidebarRef.current) return;
    const newWidth = e.clientX;
    if (newWidth > 180 && newWidth < 500) {
      setWidth(newWidth);
    }
  };

  const stopResize = () => {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  return (
    <div
      onMouseDown={startResizing}
      className="absolute top-0 right-0 h-full w-1 cursor-col-resize group"
    >
      <div className="w-full h-full bg-transparent group-hover:bg-neutral-600/30 transition-colors" />
    </div>
  );
}
