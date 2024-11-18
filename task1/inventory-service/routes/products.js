const express = require('express');
const db = require('../dbConfig'); 
const router = express.Router();

// Эндпоинт для создания товара
router.post('/', async (req, res) => {
  const { plu, name } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
      [plu, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинт для фильтрации товаров
router.get('/', async (req, res) => {
  const { name, plu } = req.query;

  let baseQuery = 'SELECT * FROM products WHERE true';
  const queryParams = [];
  let paramIndex = 1;

  if (name) {
    baseQuery += ` AND name ILIKE $${paramIndex++}`;
    queryParams.push(`%${name}%`);
  }
  if (plu) {
    baseQuery += ` AND plu = $${paramIndex++}`;
    queryParams.push(plu);
  }

  try {
    const result = await db.query(baseQuery, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
