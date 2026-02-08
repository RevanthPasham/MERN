import { insertCollection, getCollectionCategories } from "../db/models";

export async function createCollectionService(data: any) {
  return insertCollection({
    name: data.name,
    image_url: data.image_url,
    description: data.description,
    category: data.category
  });
}

export async function getCategoriesService(id: string) {
  return getCollectionCategories(id);
}
