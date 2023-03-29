import express from 'express';
import blogRouter from './api/blog/router.js';
import imageRoutes from './api/image/router.js';
import tokenRoutes from './api/token/router.js';
import { middleware } from './config/middlewares.js';

const app = express();
middleware(app);

// setup the api
// How to get and add a new post
//1, To get all post from blog.json file call get api(/api/blog)
//2. To post a new blog simply send a form data request from postman with other fields such as title, description & date_time
app.use('/api/blog', blogRouter);
// Process to fetch image:-
//1. First generate token by /api/token with "path": "/images/additional_image_1_test.jpg" as a body
//2. Then pass this token to /api/image with body as "token": "eyJh"(use the one generate in previous call) & "path": "/images/additional_image_1_test.jpg"
app.use('/api/image', imageRoutes);
//This api is to generate token for a image
app.use('/api/token', tokenRoutes);

// Global Error Handling
app.use((err, req, res) => {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    console.log('the error',err.name);
    return res.status(401).send({ error: 'Invalid token' });
  }
  return res.status(500).send({ error: 'Something went wrong.' });
});

export default app;