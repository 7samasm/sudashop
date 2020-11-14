const auth    = require('./auth')
const cart    = require('./cart')
const comment = require('./comment')
const product = require('./product')

const userController = {
    ...auth,
    ...cart,
    ...comment,
    ...product
}


module.exports = {
    userController
}