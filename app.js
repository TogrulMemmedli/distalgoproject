const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database'); 
const router = require('./routes');
const logger = require('./middlewares/logger');
const errorHandlerMiddleware = require('./middlewares/errorHandler.middleware');
const notFoundMiddleware = require('./middlewares/notFound.middleware');

const app = express();

app.use(logger); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

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
        // console.log('Database seeded (if empty).');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
