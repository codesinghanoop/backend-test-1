import Blog from '../../../domain/entities/Blog'

export default (schemaEntity: any): Blog | null => {
  if (!schemaEntity) return null
  return new Blog({
    id: schemaEntity.id,
    title: schemaEntity.title,
    description: schemaEntity.description,
    date_time: schemaEntity.date_time,
    main_image: schemaEntity.main_image,
    additional_images: schemaEntity.additional_images,
  })
}
