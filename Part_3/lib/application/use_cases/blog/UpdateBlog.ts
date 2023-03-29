import BlogValidator from '../../../domain/validators/BlogValidator'
import { ServiceLocator } from '../../../infrastructure/config/service-locator'
import GetBlog from './GetBlog'

export default async (blogData: any, serviceLocator: ServiceLocator) => {
  const { blogRepository } = serviceLocator
  let blog = await GetBlog(blogData.id, serviceLocator)
  if (blog == null) throw new Error('Unknown ID')
  blog = { ...blog, ...blogData }
  await BlogValidator.tailor('update').validateAsync(blog)
  return blogRepository!.merge(blog, blogData.user_id)
}
