import { Router } from 'express';
import { generateInvoice } from './invoice.controller.js';
import { validateJwt } from '../middlewares/validate.jwt.js';

const invoiceRouter = Router();

invoiceRouter.get('/generateInvoice', [validateJwt], generateInvoice);

export default invoiceRouter;