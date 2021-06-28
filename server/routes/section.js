/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Routes to define development "kitchen sink" samples                                           */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
const express = require('express')
const isAuth = require('../middlewares/routes_middlewares/isAuth')
const sectionController  = require('../controllers/section')

const router = express.Router() // router middleware for koa

router.get('/',sectionController.getAll)
router.post('/',isAuth,sectionController.addSection);


module.exports = router
