const jwt = require('jsonwebtoken')
const emitErrors = require('../../utils/helpers').emitErrors
const User = require('../../models/user')

const isAuth = async (ctx, next) => {
  try {
    const {request} = ctx
    const authHeader = request.get('x-Auth');
    if (!authHeader) {
      const error = new Error('No auth header dedected.');
      error.statusCode = 401;
      throw error;
    }
    const token = authHeader;
    let decodedToken;

    decodedToken = jwt.verify(token, 'someSecret')

    if (!decodedToken.hasOwnProperty('userId')) {
      const error = new Error('Not authenticated.');
      error.statusCode = 401;
      throw error;
    }
    const user = await User.findById(decodedToken.userId)
    if(!user) throw new Error('Not authenticated invalid user id')

    ctx.req.userId = decodedToken.userId;
    ctx.app.context.userId = decodedToken.userId;
    return next()
  } catch (error) {
    emitErrors(ctx,error)
  }
};

module.exports = isAuth
