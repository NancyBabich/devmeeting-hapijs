const Joi = require('joi')

exports.id = Joi.number().integer().positive().required()

exports.product = Joi.object({
  id: exports.id,
  name: Joi.string().alphanum().trim().min(2).required(),
  description: Joi.string().trim().min(3).required(),
  price: Joi.number().integer().min(0).required()
})

exports.products = Joi.array().items(exports.product)

exports.error = Joi.object({
  statusCode: Joi.number(),
  error: Joi.string(),
  message: Joi.string()
})

exports.any = Joi.any()
