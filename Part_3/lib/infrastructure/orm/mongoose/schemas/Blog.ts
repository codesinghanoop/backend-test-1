import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    title: String,
    description: String,
    main_image: String,
    additional_images: {
      type: Array<String>,
      default: [],
    },
    date_time: String,
  },
  { timestamps: true }
)

schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

export default mongoose.model('Blog', schema)
