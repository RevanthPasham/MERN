import { Category } from "../db/models";

// Cast so TS recognizes Sequelize static methods (avoids importing "sequelize" here)
const CategoryModel = Category as typeof Category & {
  findAll: (args: { order: [string, string][] }) => Promise<InstanceType<typeof Category>[]>;
};

export const getCategories = async () => {
  return CategoryModel.findAll({
    order: [["created_at", "DESC"]],
  });
};
