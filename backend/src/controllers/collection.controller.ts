import { Request, Response, NextFunction } from "express";
import {
  createCollectionService,
  getAllCollectionsService,
  getCollectionByIdService,
} from "../services/collection.services";
import { createCollectionSchema, collectionIdSchema } from "../utils/validation";

export const createCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createCollectionSchema.parse(req.body);
    const collection = await createCollectionService(validatedData);
    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const collections = await getAllCollectionsService();
    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

export const getCollectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = collectionIdSchema.parse(req.params);
    const collection = await getCollectionByIdService(id);
    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }
    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};
