const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')

const authRouter = require('./routers/authRouter');
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


app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
   res.json({ message: 'hello From server' })
})

app.listen(process.env.PORT, () => {
   console.log(`server is listining on port ${process.env.PORT}...`)
})
