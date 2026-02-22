import { useState, useEffect } from "react";
import HeroBanner from "../components/sections/HeroBanner";
import BestSellers from "../components/sections/BestSellers";
import CollectionsSection from "../components/sections/CollectionsSection";
import { getBanners, getProducts } from "../api/client";

export default function Home() {
  const [dataFailed, setDataFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBanners(), getProducts()])
      .then(([banners, products]) => {
        if (
          (!banners || banners.length === 0) &&
          (!products || products.length === 0)
        ) {
          setDataFailed(true);
        }
      })
      .catch(() => setDataFailed(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-[50vh]">
      {loading && (
        <div className="py-12 text-center text-gray-500">
          Loading...
        </div>
      )}
      {dataFailed && !loading && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center">
          <p className="text-amber-800 text-sm">
            Failed to load data from the API. Ensure the backend is running at{" "}
            <code className="bg-amber-100 px-1 rounded">
              {import.meta.env.VITE_API_URL || "http://localhost:4000/api"}
            </code>
            .
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 text-sm font-medium text-amber-800 underline"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && <HeroBanner />}
      {!loading && <BestSellers />}
      {!loading && <CollectionsSection />}
    </main>
  );
}
