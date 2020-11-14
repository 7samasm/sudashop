const products = require('./products')
const user = require('./user')
const section = require('./section')

module.exports = (app) => {
  app.use(products)
  app.use(user.middleware())
  app.use(section.middleware())

  // if (consts.SHOW_EXAMPLES === true) {
  //   app.use(examples)
  // }
}
