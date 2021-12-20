const { isValidObjectId } = require("mongoose");
// const pick     = require('lodash').pick
const Product = require("../models/product");
const { emitErrors } = require("../utils/helpers");
const { _12_ROW_PER_PAGE } = require("../utils/consts");

const mapValueKeys = (prefix = "$") => {
  let keys = ["_id", "title", "description", "imageUrl"];
  const obj = {};
  for (let key of keys) obj[key] = prefix + key;
  return obj;
};

const setControllerPaginationLogic = async (
  req,
  res,
  paginateQuery = {},
  postedQueries = null,
  extra = null
) => {
  let query = req.query;
  if (postedQueries) {
    query = postedQueries;
  }
  const sort = { createdAt: -1 };
  if (query.sortBy && query.orderBy) {
    delete sort["createdAt"];
    sort[query.sortBy] = query.orderBy === "desc" ? -1 : 1;
  }
  const result = await Product.paginate(paginateQuery, {
    sort,
    limit: +query.limit || _12_ROW_PER_PAGE,
    page: +query.page || 1,
    populate: [
      { path: "userId", select: "name email" },
      { path: "comments", populate: { path: "userId", select: "name" } }
    ]
  });
  res.status(200).json({ ...result, extra });
};

exports.setControllerPaginationLogic = setControllerPaginationLogic;

exports.getIndex = async (req, res, next) => {
  try {
    await setControllerPaginationLogic(req, res);
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      const product = await Product.findById(id)
        .populate("userId", "-cart -password")
        .populate({
          path: "comments",
          populate: { path: "userId", select: "name email" }
        });
      res.status(200).json(product);
    } else {
      res.send(false);
    }
  } catch (e) {
    next(e);
  }
};

exports.getProductsBySection = async (req, res, next) => {
  try {
    const { section } = req.params;
    await setControllerPaginationLogic(req, res, { section });
    // res.send(result).status(200)
  } catch (error) {
    next(error);
  }
};

exports.getMostCommonProducts = async (req, res, next) => {
  try {
    const prods = await Product.aggregate([
      { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          comments: { $push: "$comments" },
          prod: { $first: "$$ROOT" },
          commentCount: { $sum: 1 }
        }
      },
      { $sort: { commentCount: -1 } },
      { $limit: 3 },
      { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          let: { cid: "$comments" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$cid"] } } },
            {
              $lookup: {
                from: "users",
                let: {
                  uid: "$userId"
                },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
                  { $project: { name: 1, email: 1 } }
                ],
                as: "userId"
              }
            },
            { $unwind: "$userId" }
          ],
          as: "comments"
        }
      },
      { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          prod: { $first: "$prod" },
          comments: { $push: "$comments" },
          commentCount: { $first: "$commentCount" }
        }
      },
      { $addFields: { "prod.comments": "$comments" } },
      {
        $lookup: {
          from: "users",
          let: { uid: "$prod.userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
            { $project: { name: 1, email: 1 } }
          ],
          as: "prod.userId"
        }
      },
      { $unwind: { path: "$prod.userId", preserveNullAndEmptyArrays: true } },
      { $sort: { commentCount: -1 } },
      { $replaceRoot: { newRoot: "$prod" } }
    ]);
    res.status(200).json(prods);
  } catch (error) {
    next(error);
  }
};

exports.getNProductsPerSection = async (req, res, next) => {
  try {
    const prods = await Product.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$section",
          prods: { $push: "$$ROOT" },
          count: { $sum: 1 }
        }
      },
      { $project: { count: 1, recent: { $slice: ["$prods", 0, 7] } } },
      { $unwind: { path: "$recent", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          "recent.comments": {
            $cond: [
              {
                $or: [
                  { $isArray: "$recent.comments" },
                  { $eq: [{ $ifNull: ["$recent.comments", 0] }, 1] }
                ]
              },
              "$recent.comments",
              []
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { uid: "$recent.userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
            { $project: { name: 1, email: 1 } }
          ],
          as: "recent.userId"
        }
      },
      { $unwind: { path: "$recent.userId", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          let: { cmnts: "$recent.comments" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$cmnts"] } } },
            {
              $lookup: {
                from: "users",
                let: { uid: "$userId" },
                pipeline: [
                  { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
                  { $project: { name: 1, email: 1 } }
                ],
                as: "userId"
              }
            },
            { $unwind: "$userId" }
          ],
          as: "recent.comments"
        }
      },
      {
        $group: {
          _id: "$_id",
          count: { $first: "$count" },
          products: { $push: "$recent" }
        }
      }
    ]);
    res.status(200).json(prods);
  } catch (error) {
    next(error);
  }
};
