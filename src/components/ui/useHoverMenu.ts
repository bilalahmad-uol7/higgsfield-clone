"use client";

import { useEffect, useRef, useState } from "react";

// Open/close behaviour shared by the header's hover menus. CSS-only
// (:hover / :focus-within) menus stay open after a client-side navigation,
// because the clicked link keeps focus and the cursor hasn't moved.
//
// Opens on hover or trigger click (click only opens: hovering already opened
// it, so a toggle would shut it on the same gesture). Closes on choosing an
// item, Escape, an outside click, the pointer leaving, or focus leaving.
export function useHoverMenu<T extends HTMLElement = HTMLDivElement>() {
  const [open, setOpen] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return {
    open,
    rootProps: {
      ref,
      onMouseEnter: () => setOpen(true),
      onMouseLeave: () => setOpen(false),
      onBlur: (e: React.FocusEvent<T>) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      },
    },
    triggerProps: {
      "aria-expanded": open,
      onClick: () => setOpen(true),
    },
    panelProps: {
      // Links navigate client-side, so nothing else would close the menu.
      onClick: (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("a, button")) setOpen(false);
      },
    },
  };
}
