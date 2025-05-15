const app = require('./app');
const { sequelize } = require('./config/database'); 

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');

        await sequelize.sync({ force: false });
        console.log('Database synchronized!');

        app.listen(PORT, ()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }    
}

startServer();
