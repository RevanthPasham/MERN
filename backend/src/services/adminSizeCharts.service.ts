import { Category, SizeChart } from "../db/models";
import type { SizeChartCreationAttributes } from "../db/models/sizeChart.model";

export interface SizeChartWithCategory {
  id: string | null;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  imageUrl: string | null;
  description: string | null;
}

export async function listSizeCharts(): Promise<SizeChartWithCategory[]> {
  const categories = await (Category as any).findAll({
    order: [["name", "ASC"]],
    include: [
      {
        model: SizeChart,
        as: "sizeChart",
        required: false,
      },
    ],
  });
  return categories.map((c: any) => {
    const sc = c.sizeChart;
    return {
      id: sc?.id ?? null,
      categoryId: c.id,
      categoryName: c.name,
      categorySlug: c.slug,
      imageUrl: sc?.imageUrl ?? null,
      description: sc?.description ?? null,
    };
  });
}

export async function getByCategoryId(categoryId: string): Promise<SizeChartWithCategory | null> {
  const category = await (Category as any).findByPk(categoryId, {
    include: [{ model: SizeChart, as: "sizeChart", required: false }],
  });
  if (!category) return null;
  const sc = category.sizeChart;
  return {
    id: sc?.id ?? null,
    categoryId: category.id,
    categoryName: category.name,
    categorySlug: category.slug,
    imageUrl: sc?.imageUrl ?? null,
    description: sc?.description ?? null,
  };
}

export async function upsertSizeChart(
  categoryId: string,
  body: { imageUrl?: string | null; description?: string | null }
): Promise<SizeChartWithCategory> {
  const category = await (Category as any).findByPk(categoryId);
  if (!category) throw new Error("Category not found");
  const existing = await SizeChart.findOne({ where: { categoryId } });
  if (existing) {
    await existing.update({
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
      description: body.description !== undefined ? body.description : existing.description,
    });
    const out = await getByCategoryId(categoryId);
    if (!out) throw new Error("Category not found");
    return out;
  }
  const attrs: SizeChartCreationAttributes = {
    categoryId,
    imageUrl: body.imageUrl ?? null,
    description: body.description ?? null,
  };
  await SizeChart.create(attrs);
  const out = await getByCategoryId(categoryId);
  if (!out) throw new Error("Category not found");
  return out;
}
