import fs from 'fs'
import path from 'path'
import { validations } from '../../helper/validations.js'

export const addBlog = async (req, res) => {
    const __dirname = path.resolve()
    try {
        let blogData = fs.readFileSync(path.join(__dirname, '/blogs.json'))
        let blogs = JSON.parse(blogData)

        const { title, description, image_names, date_time } = req.body

        const blogBody = {
            title: title,
            description: description,
            main_image: image_names.main_image[0],
            date_time: date_time ,
        }

        image_names.additional_images.length
            ? (blogBody.additional_images = image_names.additional_images)
            : ''

        await validations.blog.validateAsync(blogBody) //throws error if validation fails

        let reference = ('00000' + parseInt(blogs.length + 1)).slice(-5)
        blogBody.reference = reference
        blogBody.date_time =  Number(date_time)
        blogs.push(blogBody)

        fs.writeFile(
            path.join(__dirname, '/blogs.json'),
            JSON.stringify(blogs, null, 2),
            (err) => {
                if (err) throw err
            }
        )

        res.json(blogBody)
    } catch (error) {
        res.status(400)
        res.send('Something went wrong - ' + error.message)
    }
}

export const getAllBlog = (req, res) => {
    const __dirname = path.resolve()

    try {
        let blogData = fs.readFileSync(path.join(__dirname, '/blogs.json'))
        let blogs = JSON.parse(blogData)

        blogs.forEach((item) => {
            let lowerCaseTitle = item.title.toLowerCase()
            let titleSlug = lowerCaseTitle.split(' ').join('_')
            item.title_slug = titleSlug

            let isoDate = new Date(item.date_time).toISOString()
            item.date_time = isoDate
        })

        res.send(blogs)
    } catch (error) {
        res.status(400)
        res.json('Something went wrong - ' + error.message)
    }
}
