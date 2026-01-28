import { useEffect, useRef } from 'react';
import { useMatches } from 'react-router-dom';

interface RouteHandle {
  breadcrumb?: string;
}

interface RouteMatch {
  handle: RouteHandle;
  [key: string]: any; 
}

export const useTabNotification = (count: number) => {
  const matches = useMatches();
  const originalFavicon = useRef<string | null>(null);

  useEffect(() => {

    const currentMatch = [...matches]
      .reverse()
      .find((m) => (m.handle as RouteHandle)?.breadcrumb) as RouteMatch | undefined;

    const baseTitle = currentMatch?.handle?.breadcrumb || "MRF Core";

    document.title = count > 0 ? `(${count}) ${baseTitle}` : baseTitle;

    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!favicon) return;

    if (!originalFavicon.current) {
      originalFavicon.current = favicon.href;
    }

    const img = new Image();
    img.src = originalFavicon.current;
    img.crossOrigin = "anonymous"; 

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(img, 0, 0);

        if (count > 0) {
          const radius = canvas.width * 0.20;
          ctx.beginPath();
          ctx.arc(canvas.width - radius, radius, radius, 0, 2 * Math.PI);
          ctx.fillStyle = '#ff0000';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          favicon.href = canvas.toDataURL('image/png');
        } else {
          favicon.href = originalFavicon.current!;
        }
      }
    };
  }, [count, matches]);
};