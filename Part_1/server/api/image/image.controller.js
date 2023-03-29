import path from 'path'
import fs from 'fs'

export const getImage = (req, res) => {
    const __dirname = path.resolve()

    try {
        const { path: imagePath } = req.body

        if (!imagePath) throw Error('Provide valid path')

        fs.readFile(path.join(__dirname, imagePath), function (err, content) {
            if (err) {
                return res.status(404).send('Image does not exist')
            } else {
                res.sendFile(path.join(__dirname, imagePath))
            }
        })
    } catch (error) {
        res.status(404)
        res.send(error.message)
    }
}