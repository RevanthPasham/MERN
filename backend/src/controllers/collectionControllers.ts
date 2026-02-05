import { Request, Response } from "express";
import { CollectionService } from "../services/collection.services";

const service = new CollectionService();

export const getCollections = async (req: Request, res: Response) => {
  try {
    const collections = await service.getAll();
    res.json(collections);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
