const Section = require('../models/section')
const emitErrors = require('../utils/helpers').emitErrors
exports.getAll = async (ctx,next)  => {
  try {
    await next()
    const sections = await Section.find()
    ctx.status = 200
    ctx.body = sections
    // res.status(200).send(sections)
  } catch (e) {
    emitErrors(ctx,e)
  }
}

exports.addSection = async (ctx,next) =>  {
  try {
    await next()
    const {request} = ctx
    const { name } = request.body
    const match = await Section.findOne({ name })
    if (match) throw new Error('section were found')
    const section = new Section({ name })
    ctx.status = 201
    ctx.body = await section.save()
    // res.status(201).send(await section.save())
  } catch (e) {
    emitErrors(ctx,e)
  }
}