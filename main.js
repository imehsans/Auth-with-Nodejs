const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');



const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
// const postsRouter = require('./routers/postsRouter');
// const usersRouter = require('./routers/usersRouter');

const app = express();

app.use(express.json());
app.use(cors())
app.use(helmet())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URI).then(() => {
   console.log('db connected')
}).catch((err) => {
   console.log("DB connection error", err)
})

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: "Node Auth API",
         version: "1.0.0   ",
         description: "Node js Auth API project for MongoDB",
      },
      servers: [
         {
            url: 'http://localhost:8000/',
            description: 'Local server'
         }
      ]

   },
   apis: ['./routers/*.js']
}
const specs = swaggerJSDOC(options);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

app.use('/api/auth', authRouter)
app.use('/api/', userRouter)

app.get('/', (req, res) => {
   res.json({ message: 'hello From server' })
})

app.listen(process.env.PORT, () => {
   console.log(`server is listining on port ${process.env.PORT}...`)
})
