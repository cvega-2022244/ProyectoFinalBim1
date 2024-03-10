"use strict";

import Shop from "./shop.model.js";
import User from "../user/user.model.js";
import Product from "../product/product.model.js";

export const test = (req, res) => {
  return res.send("Hello world");
};

export const addToCart = async (req, res) => {
  try {
    let { product, quantity } = req.body;
    let idUser = req.user.id;
    let shop = await Shop.findOne({ user: idUser });

    if (!shop) shop = new Shop({ user: idUser, products: [] });

    let productos = shop.products.findIndex((item) => item.product == product);

    if (productos !== -1) {
      shop.products[productos].quantity += parseInt(quantity, 10);
    } else {
      shop.products.push({ product: product, quantity });
    }

    await shop.save();

    return res.send({ message: "Add to cart successfully", shop, productos });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error for add products" });
  }
};

export const removeShop = async (req, res) => {
  try {
    let userId = req.user.id;
    let deletedShop = await Shop.findOneAndDelete({ user: userId });
    if (!deletedShop)
      return res.status(404).send({ message: "Shop not found" });
    return res.send({ message: "Remove from cart successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error removing from shop" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    let { productId } = req.params;
    let userId = req.user.id;
    let shop = await Shop.findOne({ user: userId });

    if (!shop) {
      return res.status(404).send({ message: "Shop not found" });
    }

    let producto = shop.products.findIndex((item) => item.product == productId);

    if (producto === -1) {
      return res.status(404).send({ message: "Product not found" });
    }

    shop.products = shop.products.filter((item) => item.product != productId);

    await shop.save();

    return res.status(200).send({ message: "Product removed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error removing product" });
  }
};
