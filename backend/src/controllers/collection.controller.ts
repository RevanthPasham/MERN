import { Request, Response } from "express";
import { createCollectionService, getCategoriesService } from "../services/collection.service";

export async function createCollection(req: Request, res: Response) {
  try {
    await createCollectionService(req.body);
    res.status(201).json({ message: "collection created" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const data = await getCategoriesService(req.params.id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
