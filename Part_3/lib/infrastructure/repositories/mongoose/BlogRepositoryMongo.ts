import Blog from '../../../domain/entities/Blog'
import { ID } from '../../../domain/entities/Entity'
import BlogRepository from '../../../domain/repositories/BlogRepository'
import MongooseBlog from '../../orm/mongoose/schemas/Blog'
import MongooseUserBlogPost from '../../orm/mongoose/schemas/UserBlogPost'
import BlogSTO from '../../stos/mongoose/BlogSTO'

export default class BlogRepositoryMongo implements BlogRepository {
  async persist(domainEntity: Blog, user_id: any): Promise<Blog | null> {
    const { title, description, main_image, additional_images, date_time } =
      domainEntity

    const mongooseBlog = new MongooseBlog({
      title,
      description,
      main_image,
      additional_images,
      date_time,
    })
    await mongooseBlog.save()

    const mongooseUserBlogPost = new MongooseUserBlogPost({
      blog_post_id: mongooseBlog.id,
      user_id: user_id,
    })

    await mongooseUserBlogPost.save()

    return BlogSTO(mongooseBlog)
  }

  async merge(domainEntity: Blog, user_id: any): Promise<Blog | null> {
    const { id, title, description, main_image, additional_images, date_time } =
      domainEntity

    const mongooseBlog = await MongooseBlog.findByIdAndUpdate(
      id,
      {
        title,
        description,
        main_image,
        additional_images,
        date_time,
      },
      {
        new: true,
      }
    )

    const mongooseUserBlogPost = new MongooseUserBlogPost({
      blog_post_id: id,
      user_id: user_id,
    })

    await mongooseUserBlogPost.save()

    return BlogSTO(mongooseBlog)
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseBlog.findOneAndDelete({ _id: entityId })
  }

  async get(entityId: ID): Promise<Blog | null> {
    const mongooseBlog = await MongooseBlog.findById(entityId)
    if (!mongooseBlog) return null
    return BlogSTO(mongooseBlog)
  }

  async find(): Promise<Blog[]> {
    const mongooseBlogs = await MongooseBlog.find().sort({ createdAt: -1 })
    return mongooseBlogs
      .map((mongooseBlog) => BlogSTO(mongooseBlog))
      .filter((blog: Blog | null): blog is Blog => blog != null)
  }
}
