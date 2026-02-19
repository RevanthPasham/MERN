import { Product } from "../db/models";
import type { ProductCreationAttributes } from "../db/models/product.model";

const ProductModel = Product as typeof Product & {
  findAll: (opts?: any) => Promise<InstanceType<typeof Product>[]>;
  create: (values: ProductCreationAttributes) => Promise<InstanceType<typeof Product>>;
  findByPk: (id: string, opts?: any) => Promise<InstanceType<typeof Product> | null>;
};

export async function list() {
  return ProductModel.findAll({
    order: [["title", "ASC"]],
    where: { isActive: true },
  });
}

export async function create(body: ProductCreationAttributes) {
  return ProductModel.create(body);
}

export async function getById(id: string) {
  return ProductModel.findByPk(id);
}
