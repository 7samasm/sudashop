const pick = require('lodash').pick
const bcrypt = require('bcryptjs');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');

const emitErrors = require('../../utils/helpers').emitErrors
const User = require('../../models/user')

exports.signUp = async (ctx, next) => {
  try {
    await next()
    const {response,request} = ctx
    // get body values
    const body = pick(request.body, ['name', 'email', 'password'])
    // hashing password
    const hashedPass = await bcrypt.hash(body.password, 10)
    // mutate body's password whith hashedPass
    body.password = hashedPass
    const user = new User(body);
    // res.status(201).send(await user.save())
    ctx.status = 201
    response.body = await user.save()
  } catch (e) {
    emitErrors(ctx,e)
  }
}

exports.login = async (ctx, next) => {
  try {
    await next()
    const {request,invalid} = ctx
    // get requested email and password
    const { email, password } = pick(request.body, ['email', 'password'])
    // check if inputs are valid
    if (invalid) throw new Error(invalid.body.msg.toString())
    // get user by requested email and check if its found
    const user = await User.findOne({ email })
    if (!user) {
      const error = new Error('A user with this email could not be found.');
      error.statusCode = 401;
      throw error;
    }
    /*
      compare requested plain password whith user hashed pass 
      which i get from db and check it they're equil
    */
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Wrong password!');
      error.statusCode = 401;
      throw error;
    }
    // sign new token
    const token = jwt.sign(
      {
        name: user.name,
        userId: user._id.toString()
      },
      'someSecret',
      { expiresIn: '72h' }
    );
    
    ctx.body = { token, userId: user._id.toString() } 
    ctx.status = 200
    // res.status(200).json({ token, userId: user._id.toString() });
  } catch (e) {
    emitErrors(ctx,e)
  }
};


exports.getUser = async (ctx,next) => {
  try {
    await next()
    const {req} = ctx
    const user = await User.findOne({ _id: req.userId }, 'name email status');
    ctx.status = 200
    ctx.body = {user}
  } catch (error) {
    emitErrors(ctx,error)
  }
}
