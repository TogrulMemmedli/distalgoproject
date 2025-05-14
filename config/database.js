const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize({
    host: process.env.DB_HOST,
    dialect: 'postgres',
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
    logging: false, 
  });

  const connectDatabase = async () => {
    try {
      await sequelize.authenticate();
      console.log('Database connected!');
      await syncDatabase();
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(1); 
    }
  };
  
  const syncDatabase = async () => {
    try {
      await sequelize.sync({ force: false }); 
      console.log('Database synchronized!');
    } catch (err) {
      console.error('Error during syncing database:', err);
    }
  };
  

module.exports = {
    sequelize,
    connectDatabase,
  };
