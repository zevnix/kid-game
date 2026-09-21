"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useRef, useState } from "react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { bgMusicUrl, bgImageUrl } = useStore((state) => state.generalSettings);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Intentar reproducir música cuando exista URL y el usuario haya interactuado
  useEffect(() => {
    if (bgMusicUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(bgMusicUrl.startsWith('http') ? bgMusicUrl : `/${bgMusicUrl.replace(/^\//, '')}`);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2; // Volumen bajito para no molestar los audios del juego
      } else {
        audioRef.current.src = bgMusicUrl.startsWith('http') ? bgMusicUrl : `/${bgMusicUrl.replace(/^\//, '')}`;
      }

      const tryPlay = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch {
          // El navegador bloqueó el autoplay. Se necesita interacción primero.
          setIsPlaying(false);
        }
      };

      tryPlay();

      // Añadir listener global por si falló el autoplay
      const handleInteraction = () => {
        if (!isPlaying) {
          tryPlay();
        }
      };

      window.addEventListener('click', handleInteraction);
      return () => {
        window.removeEventListener('click', handleInteraction);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      };
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgMusicUrl, isPlaying]);

  return (
    <>
      {bgImageUrl && (
        <div
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${bgImageUrl.startsWith('http') ? bgImageUrl : `/${bgImageUrl.replace(/^\//, '')}`})` }}
        />
      )}
      {children}
    </>
  );
}
