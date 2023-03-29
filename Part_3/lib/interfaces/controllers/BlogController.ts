import { Request, Response } from 'express'
import { ValidationError } from 'joi'
import CreateBlog from '../../application/use_cases/blog/CreateBlog'
import DeleteBlog from '../../application/use_cases/blog/DeleteBlog'
import GetAllBlogs from '../../application/use_cases/blog/GetAllBlogs'
import GetBlog from '../../application/use_cases/blog/GetBlog'
import UpdateBlog from '../../application/use_cases/blog/UpdateBlog'
import Blog from '../../domain/entities/Blog'
import { ServiceLocator } from '../../infrastructure/config/service-locator'

export default {
  async getAllBlogs(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!

    // Treatment
    const blogs = await GetAllBlogs(serviceLocator)

    // Output
    const output = blogs.map((blog: Blog) =>
      serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    )
    return response.json(output)
  },

  async getBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!

    // Input
    const blogId = request.params.id

    // Treatment
    let blog = null
    try {
      blog = await GetBlog(blogId, serviceLocator)
    } catch (err) {
      console.log(err)
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: 'Not Found' })
    }
    const output = serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    return response.json(output)
  },

  async createBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!

    // Input
    const user_id = request.userId
    let data = request.body
    data = {
      title: data.title,
      description: data.description,
      main_image: data.main_image,
      additional_images: data.additional_images,
      date_time: data.date_time,
      user_id: user_id,
    }

    // Treatment
    let blog = null
    let error = null
    try {
      blog = await CreateBlog(data, serviceLocator)
    } catch (err: unknown) {
      if (err instanceof ValidationError) {
        error = err.details[0].message
      } else if (err instanceof Error) {
        // 'Error occurred while creating blog'
        error = err.message
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error })
    }
    const output = serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    return response.status(201).json(output)
  },

  async updateBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!

    // Input
    const user_id = request.userId;
    const blogId = request.params.id
    const inputData = request.body
    const data: any = {
      id: blogId,
      user_id: user_id
    }
    const acceptedFields: string[][] = [
      ['title'],
      ['description'],
      ['main_image', 'mainImage'],
      ['additional_images', 'additionalImages'],
      ['date_time', 'dateTime'],
    ]
    acceptedFields.forEach((acceptedField) => {
      if (inputData[acceptedField[0]] === undefined) return
      data[acceptedField.length > 1 ? acceptedField[1] : acceptedField[0]] =
        inputData[acceptedField[0]]
    })

    // Treatment
    let blog = null
    let error = null
    try {
      blog = await UpdateBlog(data, serviceLocator)
    } catch (err) {
      if (err instanceof ValidationError) {
        error = err.details[0].message
      } else if (err instanceof Error) {
        // 'Error occurred while creating blog'
        error = err.message
      }
    }

    // Output
    if (!blog) {
      return response.status(400).json({ message: error })
    }
    const output = serviceLocator.blogSerializer.serialize(blog, serviceLocator)
    return response.json(output)
  },

  async deleteBlog(request: Request, response: Response) {
    // Context
    const serviceLocator: ServiceLocator = request.serviceLocator!

    // Input
    const toDeleteBlogId = request.params.id

    // ---------------------------------------------
    // THIS IS HOW TO ACCESS blogId FROM AccessToken
    // ---------------------------------------------
    // const userId = request.userId;
    // ---------------------------------------------
    // ---------------------------------------------

    // Treatment
    let blog = null
    try {
      blog = await DeleteBlog(toDeleteBlogId, serviceLocator)
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err)
      }
    }

    // Output
    if (!blog) {
      return response.status(404).json({ message: 'Not Found' })
    }
    return response.json({ deletedId: toDeleteBlogId })
  },
}
