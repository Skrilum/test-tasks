import express from 'express';
import historyRoutes from './routes/history';

const app = express();
app.use(express.json());

// Подключаем маршруты для истории
app.use('/history', historyRoutes);

app.listen(4000, () => {
  console.log('History Service запущен на порту 4000');
});
