import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollections } from "../../api/client";
import { PLACEHOLDER_COLLECTION } from "../../utils/placeholder";
import type { CollectionListItem } from "../../types";

export default function CollectionsSection() {
  const [collections, setCollections] = useState<CollectionListItem[]>([]);

  useEffect(() => {
    getCollections()
      .then(setCollections)
      .catch(() => setCollections([]));
  }, []);

  if (collections.length === 0) return null;

  return (
    <section className="px-4 md:px-8 py-8 md:py-10 max-w-7xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-6">
        Shop by Collection
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {collections.map((col) => (
          <Link
            key={col.id}
            to={`/collections/${col.slug}`}
            className="group block rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-gray-400 transition-colors"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={col.bannerImage || PLACEHOLDER_COLLECTION}
                alt={col.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600">
                {col.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
