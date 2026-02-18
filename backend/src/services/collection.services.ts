import { Collection } from "../db/models";

// Cast so TS recognizes Sequelize static methods
const CollectionModel = Collection as typeof Collection & {
  create: (values: {
    name: string;
    image_url: string;
    description?: string;
    category: string[];
  }) => Promise<InstanceType<typeof Collection>>;
  findAll: (options?: { order?: [string, string][] }) => Promise<InstanceType<typeof Collection>[]>;
  findByPk: (id: string) => Promise<InstanceType<typeof Collection> | null>;
};

export async function createCollectionService(data: {
  name: string;
  image_url: string;
  description?: string;
  category: string[];
}) {
  return CollectionModel.create({
    name: data.name,
    image_url: data.image_url,
    description: data.description ?? "",
    category: data.category,
  });
}

export async function getCategoriesService(id: string) {
  const row = await CollectionModel.findByPk(id, { attributes: ["category"] });
  return row ? [{ category: row.category }] : [];
}

export async function getAllCollectionsService() {
  return CollectionModel.findAll({
    order: [["name", "ASC"]],
  });
}

export async function getCollectionByIdService(id: string) {
  return CollectionModel.findByPk(id);
}
