const { isValidObjectId } = require('mongoose')
// const pick     = require('lodash').pick
const Product = require('../models/product');
const { emitErrors } = require('../utils/helpers')
const {_12_ROW_PER_PAGE} = require('../utils/consts')


const mapValueKeys = (prefix = '$') => {
  let keys = ['_id', 'title', 'description', 'imageUrl']
  const obj = {}
  for (let key of keys)
    obj[key] = prefix + key
  return obj
}


const setControllerPaginationLogic = async (ctx, paginateQuery = {},postedQueries = null) => {
  let query = ctx.query
  if (postedQueries) {
    query = postedQueries
  } 
  const sort = {};
  if (query.sortBy && query.orderBy)
    sort[query.sortBy] = query.orderBy === 'desc' ? -1 : 1;
  const result = await Product.paginate(paginateQuery,
    {
      sort,
      limit: +query.limit || _12_ROW_PER_PAGE,
      page: +query.page || 1
    }
  );
  ctx.status = 200;
  ctx.body = result;
}

exports.setControllerPaginationLogic = setControllerPaginationLogic

exports.getIndex = async (ctx, next) => {
  try {
    await next()
    await setControllerPaginationLogic(ctx)
  } catch (error) {
    emitErrors(ctx, error)
  }

};


exports.getProduct = async (ctx, next) => {
  try {
    await next()
    const { params } = ctx
    const {id} = params;
    if (isValidObjectId(id)) {
      const product = await Product.findById(id)
        .populate('userId', '-cart -password')
        .populate({
          path: 'comments',
          populate: { path: 'userId', select: 'name email' }
        })
      ctx.status = 200
      ctx.body = product
      // res.send(product).status(200)
    } else {
      ctx.body = false
    }
  } catch (e) {
    emitErrors(ctx, e)
  }
}

exports.getProductsBySection = async (ctx, next) => {
  try {
    await next()
    const section = ctx.params.section;
    await setControllerPaginationLogic(ctx, {section});
    // res.send(result).status(200)
  } catch (error) {
    emitErrors(ctx, error)
  }
};

exports.getMostCommonProducts = async (ctx, next) => {
  try {
    await next()
    const prods = await Product.aggregate([
      { $unwind: "$comments" },
      { $group: { _id: mapValueKeys(), commentsCount: { $sum: 1 } } },
      { $project: { ...mapValueKeys('$_id.'), commentsCount: 1, } },
      { $sort: { commentsCount: -1 } },
      { $limit: 3 },
    ])
    ctx.status = 200
    ctx.body = prods
  } catch (error) {
    emitErrors(ctx, error)
  }
}

