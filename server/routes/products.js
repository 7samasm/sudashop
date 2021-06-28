/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes to define development "kitchen sink" samples                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const express = require('express')
const productController = require('../controllers/products')

const router = express.Router()
router.get('/products',productController.getIndex)
router.get('/products/:id',productController.getProduct)
router.get('/products/section/:section',productController.getProductsBySection)
router.get('/products/stats/common',productController.getMostCommonProducts)
// router.post()
module.exports = router
