/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes to define development "kitchen sink" samples                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const koaJoyRouter = require('koa-joi-router')
const isAuth = require('../middlewares/routes_middlewares/isAuth')
const consts = require('../utils/consts')
const {userController} = require('../controllers/user')


const joi = koaJoyRouter.Joi
const router = koaJoyRouter() // router middleware for koa
router.prefix(consts.BASE_API + '/admin')

const productValidateBody = {
  title : joi.string().trim().max(20).min(4).required(),
  price : joi.number().positive().not().empty(),
  description : joi.string().trim().required(),
  imageUrl : joi.string().trim().required(),
  section :  joi.string().trim().required()
}

// cart
router.get('/cart',isAuth,userController.getCart)
router.post('/cart',isAuth,userController.postCart)
router.delete('/cart/:productId',isAuth,userController.deleteCartItem)

//comments
router.post('/comment',isAuth,userController.postComment)

// products

router.route({
  method : 'post',
  path : '/add-product',
  validate : {
    type : 'multipart',
  },
  handler : [isAuth,userController.postAddProduct]
})

router.route({
  method : 'put',
  path : '/edit-product',
  validate : {
    type : 'multipart',
  },
  handler : [isAuth,userController.putEditProduct]
})

router.post('/delete-product',isAuth,userController.deleteProduct)
router.get('/products',isAuth,userController.getUserProducts);
router.get('/products/:id',isAuth,userController.getUserProduct);

// auth

router.get('/user',isAuth,userController.getUser)

router.route({
  method: 'post',
  path: '/signup',
  validate: {
    body: {
      name : joi.string().max(30).required(),
      email : joi.string().lowercase().email().required(),
      password : joi.string().max(100).required()
    },
    type : 'json',
  },
  handler : userController.signUp
})
router.route({
  method: 'post',
  path: '/login',
  validate: {
    body: {
      email : joi.string().lowercase().email().required(),
      password : joi.string().max(100).min(6).required()
    },
    type : 'json',
    continueOnError : true
  },
  handler : userController.login,
})


module.exports = router
