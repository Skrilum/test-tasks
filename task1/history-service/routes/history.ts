import { Router, Request, Response } from 'express';
import { query } from '../dbConfig';

const router = Router();

// Эндпоинт для записи действия в историю
router.post('/', async (req: Request, res: Response) => {
  const { product_id, shop_id, action, quantity } = req.body;
  try {
    const result = await query(
      'INSERT INTO actions_history (product_id, shop_id, action, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [product_id, shop_id, action, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Эндпоинт для получения истории с фильтрацией и пагинацией
router.get('/', async (req: Request, res: Response) => {
  const { shop_id, product_id, action, startDate, endDate, page = 1, limit = 10 } = req.query;

  let baseQuery = 'SELECT * FROM actions_history WHERE true';
  const queryParams: any[] = [];
  let paramIndex = 1;

  if (shop_id) {
    baseQuery += ` AND shop_id = $${paramIndex++}`;
    queryParams.push(shop_id);
  }
  if (product_id) {
    baseQuery += ` AND product_id = $${paramIndex++}`;
    queryParams.push(product_id);
  }
  if (action) {
    baseQuery += ` AND action = $${paramIndex++}`;
    queryParams.push(action);
  }
  if (startDate && endDate) {
    baseQuery += ` AND date BETWEEN $${paramIndex++} AND $${paramIndex++}`;
    queryParams.push(startDate, endDate);
  }

  const offset = (Number(page) - 1) * Number(limit);
  baseQuery += ` ORDER BY date DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
  queryParams.push(Number(limit), offset);

  try {
    const result = await query(baseQuery, queryParams);
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
