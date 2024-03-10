"use strict";

import { Router } from "express";
import {
  addToCart,
  deleteProduct,
  removeShop,
  test,
} from "./shop.controller.js";
import { validateJwt } from "../middlewares/validate.jwt.js";

const api = Router();

api.get("/test", test);
api.post("/add", [validateJwt], addToCart);
api.delete("/remove", [validateJwt], removeShop);
api.delete("/removeP/:productId", [validateJwt], deleteProduct);

export default api;
