/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes to define development "kitchen sink" samples                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const koaRouter = require('koa-router')
const consts = require('../utils/consts')
const productController = require('../controllers/products')

const router = koaRouter({
  prefix: consts.BASE_API
}) // router middleware for koa

router.get('/products',productController.getIndex)
router.get('/products/:id',productController.getProduct)
router.get('/products/section/:section',productController.getProductsBySection)
router.get('/products/stats/common',productController.getMostCommonProducts)
// router.post()
module.exports = router.routes()
