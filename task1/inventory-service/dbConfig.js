const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',      
  host: 'localhost',       
  database: 'shop',
  password: 'qwerty1234567',   
  port: 5432,            
});

// Функция для выполнения SQL-запросов
const query = (text, params) => pool.query(text, params);

module.exports = {
  query,
};
