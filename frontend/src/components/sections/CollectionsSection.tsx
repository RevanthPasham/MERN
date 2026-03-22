import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../../api/client";
import { PLACEHOLDER_COLLECTION } from "../../utils/placeholder";
import type { CollectionListItem } from "../../types";

export default function CollectionsSection() {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getCollections()
      .then((c) => setCollections(Array.isArray(c) ? c : []))
      .catch(() => setCollections([]))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;
  if (collections.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">

        {/* ── Centered title ── */}
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8 md:mb-10">
          View All Collections
        </h2>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {collections.map((col) => (
            <Link
              key={col.id}
              to={`/collections/${col.slug}`}
              className="group flex flex-col items-center text-center"
            >
              {/* ── Name label above image ── */}
              <div className="mb-2.5 px-1">
                <h3 className="text-sm md:text-base font-extrabold text-gray-900 leading-tight line-clamp-1 group-hover:text-[#1e3a5f] transition-colors">
                  {col.name}{" "}
                  <span className="text-[10px] md:text-xs font-normal text-gray-400 tracking-wide">
                    Collection
                  </span>
                </h3>
              </div>

              {/* ── Image ── */}
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-50 border border-gray-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                <img
                  src={col.bannerImage || PLACEHOLDER_COLLECTION}
                  alt={col.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* ── View all link ── */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-7 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] text-sm font-bold tracking-wide rounded-full hover:bg-[#1e3a5f] hover:text-white transition-all duration-200"
          >
            Browse All Collections
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Combo Offers ── */}
        <div className="mt-12 md:mt-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Left — title block */}
            <div className="flex items-center justify-center md:justify-start gap-4 px-8 py-8 md:py-10 md:w-56 md:border-r border-gray-200 bg-white flex-shrink-0">
              <p className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase leading-tight tracking-tight text-center md:text-left">
                COMBO<br />OFFERS
              </p>
            </div>

            {/* Right — offer cards */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {[
                { qty: 2, off: 175, code: "GEEK175" },
                { qty: 3, off: 300, code: "GEEK300" },
                { qty: 5, off: 500, code: "GEEK500" },
              ].map((offer) => (
                <div
                  key={offer.code}
                  className="flex flex-col items-center justify-center gap-3 px-6 py-7 md:py-9 text-center"
                >
                  <p className="text-xs md:text-sm font-bold text-[#1e3a5f] uppercase tracking-widest">
                    Buy Any {offer.qty} Products
                  </p>
                  <p className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-none">
                    ₹{offer.off}{" "}
                    <span className="text-base md:text-lg font-semibold text-gray-500">Flat Off</span>
                  </p>
                  <div className="mt-1 px-4 py-1.5 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                    <p className="text-xs font-bold tracking-widest text-gray-600 uppercase">
                      CODE : {offer.code}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
