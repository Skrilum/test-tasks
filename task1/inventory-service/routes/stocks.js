const express = require('express');
const db = require('../dbConfig');
const axios = require('axios'); // Для отправки событий в history-service
const router = express.Router();

// Эндпоинт для создания остатка
router.post('/', async (req, res) => {
  const { product_id, shop_id, quantity_on_shelf, quantity_in_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO stocks (product_id, shop_id, quantity_on_shelf, quantity_in_order) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, shop_id, quantity_on_shelf, quantity_in_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинт для увеличения остатка
router.patch('/increase', async (req, res) => {
  const { product_id, shop_id, amount } = req.body;
  try {
    const result = await db.query(
      'UPDATE stocks SET quantity_on_shelf = quantity_on_shelf + $1 WHERE product_id = $2 AND shop_id = $3 RETURNING *',
      [amount, product_id, shop_id]
    );
    // Отправка события в history-service
    await axios.post('http://localhost:4000/history', {
      product_id,
      shop_id,
      action: 'увеличение остатка',
      quantity: amount,
    });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Эндпоинт для уменьшения остатка
router.patch('/decrease', async (req, res) => {
    const { product_id, shop_id, amount } = req.body;
    try {
      const result = await db.query(
        'UPDATE stocks SET quantity_on_shelf = quantity_on_shelf - $1 WHERE product_id = $2 AND shop_id = $3 RETURNING *',
        [amount, product_id, shop_id]
      );
  
      // Отправка события в history-service
      await axios.post('http://localhost:4000/history', {
        product_id,
        shop_id,
        action: 'уменьшение остатка',
        quantity: amount,
      });
  
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Эндпоинт для фильтрации остатков
router.get('/', async (req, res) => {
  const { plu, shop_id, quantity_on_shelf_min, quantity_on_shelf_max, quantity_in_order_min, quantity_in_order_max } = req.query;

  let baseQuery = `
    SELECT stocks.*, products.plu 
    FROM stocks 
    JOIN products ON stocks.product_id = products.product_id
    WHERE true
  `;
  const queryParams = [];
  let paramIndex = 1;

  if (plu) {
    baseQuery += ` AND products.plu = $${paramIndex++}`;
    queryParams.push(plu);
  }
  if (shop_id) {
    baseQuery += ` AND stocks.shop_id = $${paramIndex++}`;
    queryParams.push(shop_id);
  }
  if (quantity_on_shelf_min && quantity_on_shelf_max) {
    baseQuery += ` AND stocks.quantity_on_shelf BETWEEN $${paramIndex++} AND $${paramIndex++}`;
    queryParams.push(quantity_on_shelf_min, quantity_on_shelf_max);
  }
  if (quantity_in_order_min && quantity_in_order_max) {
    baseQuery += ` AND stocks.quantity_in_order BETWEEN $${paramIndex++} AND $${paramIndex++}`;
    queryParams.push(quantity_in_order_min, quantity_in_order_max);
  }

  try {
    const result = await db.query(baseQuery, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
