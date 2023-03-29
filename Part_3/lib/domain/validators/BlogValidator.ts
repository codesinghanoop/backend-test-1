import joi from 'joi'

const blogSchema = joi
  .object({
    title: joi
      .string()
      .pattern(/^[a-zA-Z0-9\s]*$/)
      .min(5)
      .max(50)
      .required(),
    description: joi.string().max(500).required(),
    main_image: joi.string().required(),
    additional_images: joi.array().items(joi.string()).max(5),
    date_time: joi.date().timestamp('unix').min(Date.now()).required(),
  })
  .unknown()

export default blogSchema