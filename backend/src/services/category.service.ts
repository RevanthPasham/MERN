import { Category } from "../db/models";
import type { CategoryCreationAttributes } from "../db/models/category.model";

const CategoryModel = Category as typeof Category & {
  findAll: (opts?: any) => Promise<InstanceType<typeof Category>[]>;
  create: (values: CategoryCreationAttributes) => Promise<InstanceType<typeof Category>>;
  findByPk: (id: string) => Promise<InstanceType<typeof Category> | null>;
};

export async function list() {
  return CategoryModel.findAll({
    order: [["name", "ASC"]],
  });
}

export async function create(body: CategoryCreationAttributes) {
  return CategoryModel.create(body);
}

export async function getById(id: string) {
  return CategoryModel.findByPk(id);
}
