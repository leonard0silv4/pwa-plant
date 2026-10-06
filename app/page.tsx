"use client";

import { useEffect, useState } from "react";
import { PhotoPreview } from "@/components/capture/PhotoPreview";
import { useImagePicker } from "@/components/capture/useImagePicker";
import { Hero } from "@/components/home/Hero";
import { Notice } from "@/components/Notice";
import { ImageError, prepareImage, type PreparedImage } from "@/lib/image";
import { useOnline } from "@/lib/use-online";

type Photo = PreparedImage & { url: string };

export default function HomePage() {
  const online = useOnline();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [pickError, setPickError] = useState<string | null>(null);

  useEffect(() => () => void (photo && URL.revokeObjectURL(photo.url)), [photo]);

  const picker = useImagePicker(async (file) => {
    setPickError(null);
    setPreparing(true);
    try {
      const prepared = await prepareImage(file);
      setPhoto({ ...prepared, url: URL.createObjectURL(prepared.blob) });
    } catch (err) {
      setPickError(err instanceof ImageError ? err.message : "Não conseguimos abrir essa imagem.");
    } finally {
      setPreparing(false);
    }
  });

  return (
    <>
      {picker.inputs}
      {photo ? (
        <PhotoPreview
          src={photo.url}
          offline={!online}
          onAnalyze={() => {}}
          onRetake={() => {
            setPhoto(null);
            picker.openGallery();
          }}
        />
      ) : (
        <>
          <Hero onCamera={picker.openCamera} onGallery={picker.openGallery} disabled={preparing} />
          {pickError && (
            <div className="px-6 pt-4">
              <Notice title="Ops, essa imagem não funcionou">{pickError}</Notice>
            </div>
          )}
        </>
      )}
    </>
  );
}
