import { useState, useEffect } from "react";
import { getCollections } from "../services/CollectionServices";
import CollectionsCard from "../components/collections/CollectionsCard";

const Collections = () => {
  const [collectionsData, setCollectionsData] = useState([]);

  useEffect(() => {
    getCollections()
      .then(setCollectionsData)
      .catch(console.error);
  }, []);

  return (
    <section className="px-4 py-4">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Shop By Collection
      </h2>

      {/* MOBILE: horizontal scroll | DESKTOP: grid */}
      <div className="
        flex gap-4 overflow-x-auto no-scrollbar
        sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
        sm:overflow-x-hidden
      ">
        {collectionsData.map(item => (
          <CollectionsCard
            key={item._id}
            imageUrl={item.imageUrl}
            name={item.name}
          />
        ))}
      </div>
    </section>
  );
};

export default Collections;
