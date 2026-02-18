import { Category } from "../db/models";

// Cast so TS recognizes Sequelize static methods (avoids importing "sequelize" here)
const CategoryModel = Category as typeof Category & {
  findOne: (args: { where: { slug: string } }) => Promise<InstanceType<typeof Category> | null>;
  create: (args: { name: string; slug: string; parentId: string | null }) => Promise<InstanceType<typeof Category>>;
};

interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string | null;
}

export const createCategory = async (data: CreateCategoryInput) => {
  const exists = await CategoryModel.findOne({ where: { slug: data.slug } });

  if (exists) {
    throw new Error("Category slug already exists");
  }

  return CategoryModel.create({
    name: data.name,
    slug: data.slug,
    parentId: data.parentId ?? null,
  });
};
