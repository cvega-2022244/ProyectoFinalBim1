'use strict';

import express from 'express';
import { validateJwt, isAdmin } from '../middlewares/validate.jwt.js';
import { test, register, login, update, deleteU, defaultAdmin } from './user.controller.js';

const api = express.Router();

api.get('/test', [validateJwt, isAdmin], test);
api.put('/update/:id', [validateJwt], update);
api.delete('/delete/:id', [validateJwt], deleteU);
api.post('/register', register);
api.post('/login', login);

api.get('/createDefaultAdmin', async (req, res) => {
  await defaultAdmin();
  res.send('Default admin created!');
});

export default api;
