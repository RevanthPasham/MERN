import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBanners } from "../../api/client";
import type { BannerDto } from "../../types";

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerDto[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getBanners()
      .then(setBanners)
      .catch(() => setBanners([]));
  }, []);

  const list = Array.isArray(banners) ? banners : [];
  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);

  if (list.length === 0) return null;

  const banner = list[index];
  if (!banner) return null;

  return (
    <section className="relative bg-gray-100 overflow-hidden">
      <div className="grid md:grid-cols-2 min-h-[360px] md:min-h-[420px]">
        <div
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        />
        <div className="flex flex-col justify-center px-4 py-8 md:px-12 bg-white">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
            {banner.title}{" "}
            <span className="text-orange-500 underline decoration-wavy underline-offset-2">
              {banner.highlight}
            </span>{" "}
            {banner.subtitle}
          </h2>
          <Link
            to={`/collections/${banner.collectionSlug}`}
            className="mt-4 inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gray-800 text-white rounded-full font-medium hover:bg-gray-900 text-sm md:text-base"
          >
            {banner.cta}
          </Link>
        </div>
      </div>
      {list.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-gray-800" : "w-1.5 bg-gray-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
