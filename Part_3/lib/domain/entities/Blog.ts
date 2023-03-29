import Entity, { ID } from './Entity'

export default class Blog extends Entity {
  title: string
  description: string
  main_image: string
  additional_images?: Array<string>
  date_time: string

  constructor({
    id,
    title,
    description,
    main_image,
    additional_images,
    date_time,
  }: {
    id?: ID
    title: string
    description: string
    main_image: string
    additional_images?: Array<string>
    date_time: string
  }) {
    super({ id })
    this.title = title
    this.description = description
    this.main_image = main_image
    this.additional_images = additional_images
    this.date_time = date_time
  }
}
