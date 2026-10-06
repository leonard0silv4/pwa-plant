"use client";

import { useRef } from "react";
import { ACCEPTED_TYPES } from "@/lib/image";

const accept = ACCEPTED_TYPES.join(",") + ",image/*";

/**
 * Hidden native file inputs driven by custom buttons.
 * `capture="environment"` opens the rear camera on mobile; desktop falls back to a file dialog.
 */
export function useImagePicker(onPick: (file: File) => void) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so picking the same file again still fires `change`.
    e.target.value = "";
    if (file) onPick(file);
  };

  const inputs = (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept={accept}
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleChange}
      />
      <input
        ref={galleryRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={handleChange}
      />
    </>
  );

  return {
    inputs,
    openCamera: () => cameraRef.current?.click(),
    openGallery: () => galleryRef.current?.click(),
  };
}
