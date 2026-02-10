import { Request, Response, NextFunction } from "express";
import { createProductService, getProductByIdService, getAllProductsService, updateProductService } from "../services/product.service";
import { createProductSchema, updateProductSchema, getProductsQuerySchema, productIdSchema } from "../utils/validation";
import { getPaginationParams } from "../utils/pagination";

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await createProductService(validatedData);
    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productIdSchema.parse(req.params);
    const product = await getProductByIdService(id);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = getProductsQuerySchema.parse(req.query);
    const pagination = getPaginationParams(queryParams.page, queryParams.limit || 10);
    const result = await getAllProductsService(pagination, queryParams.category, queryParams.search);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = productIdSchema.parse(req.params);
    const validatedData = updateProductSchema.partial().parse(req.body);
    const product = await updateProductService(id, validatedData);
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
