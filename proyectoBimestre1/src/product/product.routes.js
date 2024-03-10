'use strict'

import { Router } from 'express'
import { createProduct, deleteProduct, listProducts, productsByCategory, searchProduct, test, updateProduct } from './product.controller.js'
import { validateJwt, isAdmin } from '../middlewares/validate.jwt.js'


const api = Router()

api.get('/test', test)
api.post('/create', [validateJwt], [isAdmin],createProduct)
api.put('/update/:id', [validateJwt], [isAdmin],updateProduct)
api.delete('/delete/:id', [validateJwt], [isAdmin],deleteProduct)
api.post('/search', [validateJwt],searchProduct)
api.get('/list', [validateJwt],listProducts)
api.get('/productByCategory/:id',[validateJwt], productsByCategory)

export default api