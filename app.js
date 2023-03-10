require('dotenv').config();
require('express-async-errors');

// additional security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
// convert date
// const moment = require('moment');
// const formattedDate = moment().format('L'); 

// routers
const authRouter = require('./routes/auth');
const auditsRouter = require('./routes/audits');


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP 100 requests per windowMs
}));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());


// app.get('/', (req, res) => {
//   res.send('<h1>Audits API</h1><a href="/api-docs">Documentation</a>');
// });
app.use(express.static('public'))


// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/audits', authenticateUser, auditsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();