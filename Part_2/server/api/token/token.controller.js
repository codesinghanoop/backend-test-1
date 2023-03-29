import jwt from 'jsonwebtoken'

const generateToken = (path) => {
    return jwt.sign({ path }, 'anoop124', {
        expiresIn: '300s',
    })
}

export const getToken = (req, res) => {
    try {
        const { path } = req.body
        if (path) {
            res.json({
                token: generateToken(path),
            })
        } else {
            throw new Error('Provide a valid path')
        }
    } catch (error) {
        res.status(400)
        res.send(error.message)
    }
}