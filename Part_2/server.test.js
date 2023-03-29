import { app } from './server/server.js'
import request from 'supertest'
import path from 'path'

const __dirname = path.resolve()
const imagePath = path.join(__dirname, '/images')

describe('Add blog post succeeded Test', () => {
    it('Add Blog should return the added blog that matches the request', async () => {
        const expResponse = {
            reference: '00005',
            title: 'The 5th Blog',
            description: 'Description for the 5th blog',
            date_time: 1675344691725,
            main_image: 'images/main_image-1675344691725.jpg',
        }
        const response = await request(app)
            .post('/api/blog/new')
            .attach('main_image', imagePath + '/main_image_1_test.jpg')
            .field({
                title: 'The 5th Blog',
                description: 'Description for the 5th blog',
                date_time: 1675344691725
            })
        expect(JSON.parse(response.text)).toEqual(expResponse)
    })
})

describe('Add blog post failed Tests', () => {
    describe('Add partial blog post fields', () => {
        it('Request sent without required field description should return error ', async () => {
            const expResponse =
                'Something went wrong - "description" is required'
            const response = await request(app)
                .post('/api/blog/new')
                .attach('main_image', imagePath + '/main_image_1_test.jpg')
                .field({
                    title: 'The 6th Blog',
                    date_time: 1675344693400
                })
                console.log('response---',response.text);
            expect(response.text).toEqual(expResponse)
        })
    })

    describe('Add full blog post fields with title that has special characters', () => {
        it('Request with special character title will respond saying not matching pattern', async () => {
            const expResponse =
                'Something went wrong - "title" with value "The 6th - Blog" fails to match the required pattern: /^[a-zA-Z0-9\\s]*$/'
            const response = await request(app)
                .post('/api/blog/new')
                .attach('main_image', imagePath + '/main_image_1_test.jpg')
                .field({
                    title: 'The 6th - Blog',
                    description: 'Description for the 6th blog',
                    date_time: 1675344691725
                })
            expect(response.text).toEqual(expResponse)
        })
    })

    describe('Add full blog post fields with ISO date_time', () => {
        it('Request sent in other date will say invalid format', async () => {
            const expResponse =
                'Something went wrong - "date_time" must be in timestamp or number of seconds format'
            const response = await request(app)
                .post('/api/blog/new')
                .attach('main_image', imagePath + '/main_image_1_test.jpg')
                .field({
                    title: 'The 6th Blog',
                    description: 'Description for the 6th blog',
                    date_time: '2023-02-02T15:47:04.093Z'
                })
            expect(response.text).toEqual(expResponse)
        })
    })
})

describe('Add blog post then Get all blog posts successful Test',()=>{
    it('Adds valid blog and checks its added', async ()=>{

        let isoDate = new Date(1675354132196).toISOString()
        
        const expResponse = {
            reference: '00006',
            title: 'The 6th Blog',
            description: 'Description for the 6th blog',
            date_time: isoDate,
            main_image: 'images/main_image-1675354132196.jpg',
            title_slug: "the_6th_blog"
        }

        const response = await request(app)
            .post('/api/blog/new')
            .attach('main_image', imagePath + '/main_image_1_test.jpg')
            .field({
                title: 'The 6th Blog',
                description: 'Description for the 6th blog',
                date_time: '1675354132196'
            })

        const getBlogs = await request(app).get('/api/blog')

        const allBlogs = JSON.parse(getBlogs.text)
        const lastBlog = allBlogs[allBlogs.length - 1]

        expect(lastBlog).toEqual(expResponse)
    });
})

describe('Add blog post then Get all blog posts failed Test',()=>{
    it('Adds invalid blog and checks its not added', async ()=>{

        let isoDate = new Date(1675354132196).toISOString()
        
        const initialBlogs = await request(app).get('/api/blog')
        const allInitialBlogs = JSON.parse(initialBlogs.text)

        const response = await request(app)
                .post('/api/blog/new')
                .attach('main_image', imagePath + '/main_image_1_test.jpg')
                .field({
                    title: 'The 6th Blog',
                    date_time: 1675344693400
                })

        const finalBlogs = await request(app).get('/api/blog')
        const allFinalBlogs = JSON.parse(finalBlogs.text)

        expect(allInitialBlogs.length).toEqual(allFinalBlogs.length)
    });
})

describe('Get token from Generate token API and send to Get image by token API successful Test',()=>{
    it('Test api to acces image and check if header is image type', async () => {
        
        const response = await request(app)
            .post('/api/token')
            .send({
                path: 'images/main_image_1_test.jpg'
            })

        const token = JSON.parse(response.text).token
        const imageResponse = await request(app)
        .get('/api/image')
        .send({
            path: 'images/main_image_1_test.jpg',
            token:token
        });
        console.log('token--',imageResponse.text);

        expect(imageResponse.headers['content-type']).toEqual('image/jpeg')
    })
})

describe('Get token from Generate token API and send to Get image by token API failed Test',()=>{
    it('Testing image with different path should give token response',async ()=>{

        const expResponse =
                'Unauthorized, token failed - Invalid token'

        const response = await request(app)
            .post('/api/token')
            .send({
                path: 'images/main_image_1_test.jpg'
            })

        const token = JSON.parse(response.text).token

        const imageResponse = await request(app)
        .get('/api/image')
        .send({
            path: 'images/main_image_2_test.jpg',
            token:token
        });

        expect(imageResponse.text).toEqual(expResponse)
    })
})