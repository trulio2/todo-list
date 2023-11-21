import * as Joi from '@hapi/joi'

export const configValidationSchema = Joi.object({
  MONGO_URL: Joi.string().required(),
  PORT: Joi.number().required(),
})
