/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes to define development "kitchen sink" samples                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const koaJoyRouter = require('koa-joi-router')
const isAuth = require('../middlewares/routes_middlewares/isAuth')
const consts = require('../utils/consts')
const sectionController  = require('../controllers/section')

const router = koaJoyRouter() // router middleware for koa
router.prefix(consts.BASE_API + '/sections')

router.get('/',sectionController.getAll)
router.post('/',isAuth,sectionController.addSection);


module.exports = router
