"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { bgMusicUrl, bgImageUrl } = useStore((state) => state.generalSettings);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format the URL. Users might accidentally type "public/" because that's where they put the file.
  // In Next.js, the 'public' folder maps to the root directory '/'.
  const formatUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    let cleanUrl = url.replace(/^public\//, '');
    cleanUrl = cleanUrl.replace(/^\//, ''); // Remove leading slash if any
    return `/${cleanUrl}`;
  };

  useEffect(() => {
    if (bgMusicUrl) {
      const finalUrl = formatUrl(bgMusicUrl);

      if (!audioRef.current) {
        audioRef.current = new Audio(finalUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2; // Volumen bajito para no molestar los audios del juego
      } else if (audioRef.current.src !== window.location.origin + finalUrl) {
        audioRef.current.src = finalUrl;
      }

      const tryPlay = async () => {
        try {
          if (audioRef.current && audioRef.current.paused) {
            await audioRef.current.play();
          }
        } catch {
          // Navegador bloqueó autoplay
        }
      };

      tryPlay();

      const handleInteraction = () => {
        tryPlay();
        // Una vez que funciona, no necesitamos seguir escuchando clics para la música base
        window.removeEventListener('click', handleInteraction);
      };

      window.addEventListener('click', handleInteraction);

      return () => {
        window.removeEventListener('click', handleInteraction);
      };
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, [bgMusicUrl]);

  return (
    <>
      {bgImageUrl && (
        <div
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${formatUrl(bgImageUrl)})` }}
        />
      )}
      {children}
    </>
  );
}
