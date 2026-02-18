import { Request, Response } from "express";
import { getCategories } from "../services/category.get";

export const getCategoriesController = async (_: Request, res: Response) => {
  try {
    const categories = await getCategories();
    res.json(categories);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
