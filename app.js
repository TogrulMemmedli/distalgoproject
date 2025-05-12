const express = require('express');
const cors = require('cors');

const { sequelize } = require('./config/database'); 

const router = require('./routes');

const logger = require('./middlewares/logger');
const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');
// const seedDatabase = require('./seed');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();

app.use(logger); 
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Welcome to Movie API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background: #f7f7f7;
              padding: 40px;
              text-align: center;
            }
            h1 {
              color: #333;
            }
            a {
              display: block;
              margin: 10px 0;
              font-size: 18px;
              color: #007BFF;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Welcome to the Movie API</h1>
          <p>This is REST API example for managing movies and genres</p>
          <a href="/api-docs">Swagger API Documentation</a>
          <a href="/api/v1/movies">View All Movies</a>
          <a href="/api/v1/genres">View All Genres</a>
        </body>
      </html>
    `);
  });
  
const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'This is a sample REST API documentation',
      },
    },
    apis: ['./routes/*.js'], 
  };
  
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  

app.use(notFoundMiddleware); 
app.use(errorHandlerMiddleware); 




 
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        await sequelize.sync({ force: false });
        console.log('Database synchronized!');

        // await seedDatabase();
        // console.log('Database seeded');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
