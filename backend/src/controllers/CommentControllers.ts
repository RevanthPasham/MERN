import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../src/models/CommentModel";
import { User } from "../src/models/User";

// ---- Types ----
interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

interface AddCommentBody {
  comment: string;
  star: number;
}

interface ProductParams {
  productId: string;
}

// ---- Controllers ----

export const addComment = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.params as ProductParams;

    if (!req.user?.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.userId;
    const { comment, star } = req.body as AddCommentBody;

    const created = await Comment.create({
      productId,
      userId,
      comment,
      star,
    });

    return res.status(200).json({
      success: true,
      message: "Comment added",
      data: created,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getComments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.params as ProductParams;

    const result = await Comment.find({ productId }).populate(
      "userId",
      "name picture"
    );

    return res.status(200).json({ data: result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getSummary = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.params as ProductParams;

    const comment = await Comment.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$star" },
          totalRating: { $sum: 1 },
        },
      },
    ]);

    if (comment.length === 0) {
      return res.status(200).json({
        avgRating: 0,
        totalRating: 0,
      });
    }

    return res.json({
      avgRating: Number(comment[0].avgRating.toFixed(1)),
      totalRating: comment[0].totalRating,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
