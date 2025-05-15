const express = require('express');
const cors = require('cors');
require('dotenv').config();
const favicon = require('serve-favicon');
const path = require("path")

const { sequelize } = require('./config/database'); 
const router = require('./routes/v2');
const routerv1 = require('./routes/v1');

const logger = require("./middlewares/log");
const errorHandler = require("./middlewares/errorHandler")

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger)
app.use(errorHandler)

app.get("/", (req, res)=>{
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const swaggerOptionsV1 = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation V1',
      version: '1.0.0',
      description: 'This is a sample REST API documentation',
    },
  },
  apis: [path.join(__dirname, './routes/v1/*.js')],
};

const swaggerOptionsV2 = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation V2',
      version: '2.0.0',
      description: 'This is a sample REST API documentation',
    },
  },
  apis: [path.join(__dirname, './routes/v2/*.js')],
};

  
const swaggerSpecV1 = swaggerJSDoc(swaggerOptionsV1);
const swaggerSpecV2 = swaggerJSDoc(swaggerOptionsV2);

app.use('/api-docs/v1', swaggerUi.serveFiles(swaggerSpecV1), swaggerUi.setup(swaggerSpecV1));
app.use('/api-docs/v2', swaggerUi.serveFiles(swaggerSpecV2), swaggerUi.setup(swaggerSpecV2));

app.use('/api/v2', router);
app.use('/api/v1', routerv1);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

module.exports = app;
