import mongoose from 'mongoose'
import { Schema } from 'mongoose'

const schema = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    blog_post_id: { type: Schema.Types.ObjectId, ref: 'Blog' },
  },
  { timestamps: true }
)

schema.set('toObject', { virtuals: true })
schema.set('toJSON', { virtuals: true })

export default mongoose.model('UserBlogPost', schema)
