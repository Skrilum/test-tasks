const express = require('express');
const app = express();
const productsRoutes = require('./routes/products'); 
const stocksRoutes = require('./routes/stocks');    

app.use(express.json());

// Подключение маршрутов с префиксом
app.use('/products', productsRoutes); 
app.use('/stocks', stocksRoutes);    

// Запуск сервера
app.listen(3000, () => {
  console.log('Inventory Service запущен на порту 3000');
});