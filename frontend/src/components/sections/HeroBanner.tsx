import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { getBanners } from "../../api/client";
import type { BannerDto } from "../../types";

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [index, setIndex] = useState(0);
  const [isDark, setIsDark] = useState(true); // true = image is dark → use white text
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  const list = Array.isArray(banners) ? banners : [];

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + list.length) % list.length),
    [list.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i + 1) % list.length),
    [list.length]
  );

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [list.length, next]);

  // Sample left 45% of the image to detect brightness and adapt text colors
  const analyzeImage = useCallback((img: HTMLImageElement) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = 100;
      canvas.height = 60;
      ctx.drawImage(img, 0, 0, 100, 60);
      const data = ctx.getImageData(0, 0, 45, 60).data; // left 45%
      let brightness = 0;
      const pixels = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        brightness += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
      setIsDark(brightness / pixels < 145);
    } catch {
      setIsDark(true); // fallback: dark image → white text
    }
  }, []);

  if (list.length === 0) return null;
  const banner = list[index];
  if (!banner) return null;

  // Derived classes based on detected image brightness
  const headingClass  = isDark ? "text-white"    : "text-gray-900";
  const subtitleClass = isDark ? "text-white/75"  : "text-gray-600";
  const counterClass  = isDark ? "text-white/50"  : "text-gray-500";
  const overlayFrom   = isDark ? "from-black/65"  : "from-white/80";
  const overlayVia    = isDark ? "via-black/30"   : "via-white/40";

  return (
    <section className="px-3 md:px-4 py-4 md:py-5">
      {/* Hidden canvas used only for pixel brightness sampling */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[300px] md:min-h-[440px]">

        {/* ── Full-bleed background image ── */}
        <img
          key={banner.imageUrl}
          src={banner.imageUrl}
          alt={banner.title}
          crossOrigin="anonymous"
          onLoad={(e) => analyzeImage(e.currentTarget)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500"
        />

        {/* Left-to-right gradient overlay for text readability — adapts to image brightness */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${overlayFrom} ${overlayVia} to-transparent pointer-events-none`}
        />

        {/* ── Text content — left side, above gradient ── */}
        <div className="relative z-10 flex flex-col justify-center h-full min-h-[300px] md:min-h-[440px] px-7 py-10 md:px-14 md:py-14 md:w-[50%]">
          <span className="text-xs font-bold tracking-widest uppercase text-[#f97316] mb-3 block">
            New Collection
          </span>

          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight ${headingClass}`}>
            {banner.title}
            {banner.highlight && (
              <>
                {" "}
                <span className="text-[#f97316]">{banner.highlight}</span>
              </>
            )}
          </h2>

          {banner.subtitle && (
            <p className={`mt-3 md:mt-4 text-sm md:text-base leading-relaxed max-w-xs ${subtitleClass}`}>
              {banner.subtitle}
            </p>
          )}

          <Link
            to={`/collections/${banner.collectionSlug}`}
            className="mt-6 md:mt-8 self-start inline-flex items-center gap-2 px-8 py-3 bg-black text-white text-sm font-bold tracking-wider uppercase hover:bg-gray-800 transition-colors"
          >
            {banner.cta || "Shop Now"}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {list.length > 1 && (
            <p className={`hidden md:block mt-6 text-xs font-medium tracking-wide ${counterClass}`}>
              {String(index + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
            </p>
          )}
        </div>

        {/* ── Arrow buttons ── */}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 border border-gray-200 shadow-md flex items-center justify-center hover:bg-white hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* ── Dot indicators — bottom-right ── */}
        {list.length > 1 && (
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5">
            {list.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-5 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
