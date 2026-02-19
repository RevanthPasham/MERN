import { Collection } from "../db/models";
import type { CollectionCreationAttributes } from "../db/models/collection.model";

const CollectionModel = Collection as typeof Collection & {
  findAll: (opts?: any) => Promise<InstanceType<typeof Collection>[]>;
  create: (values: CollectionCreationAttributes) => Promise<InstanceType<typeof Collection>>;
  findByPk: (id: string) => Promise<InstanceType<typeof Collection> | null>;
};

export async function list() {
  return CollectionModel.findAll({
    order: [["name", "ASC"]],
    where: { isActive: true },
  });
}

export async function create(body: CollectionCreationAttributes) {
  return CollectionModel.create(body);
}

export async function getById(id: string) {
  return CollectionModel.findByPk(id);
}
