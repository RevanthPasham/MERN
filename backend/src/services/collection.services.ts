import { insertCollection, getCollectionCategories, getAllCollections, getCollectionById } from "../db/models";

export async function createCollectionService(data: { name: string; image_url: string; description?: string; category: string[] }) {
  return insertCollection({
    name: data.name,
    image_url: data.image_url,
    description: data.description ?? "",
    category: data.category,
  });
}

export async function getCategoriesService(id: string) {
  return getCollectionCategories(id);
}

export async function getAllCollectionsService() {
  return getAllCollections();
}

export async function getCollectionByIdService(id: string) {
  return getCollectionById(id);
}
