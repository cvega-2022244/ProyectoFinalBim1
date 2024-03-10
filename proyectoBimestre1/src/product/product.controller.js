'use strict'

import Product from './product.model.js'
import Category from '../category/category.model.js'

export const test = (req, res) => {
    return res.send('Hello world');
};

export const createProduct = async (req, res) => {
    try {
        let data = req.body;
        let product = new Product(data);
        await product.save();
        return res.send({ message: 'Product created successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating product', err });
    }
};

export const updateProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found or not updated' });
        }
        return res.send({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedProduct = await Product.findByIdAndDelete(id);
        console.log('Antes del if',deleteProduct.name)
        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found or not deleted' });
        }
        return res.send({ message: `Product deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting product' });
    }
};

export const listProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', ['name']);

        if (products.length === 0) {
            return res.status(404).send({ message: 'Products not found' });
        }
        return res.send({ message: 'Products found', products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error listing products' });
    }
};


export const searchProduct = async (req, res) => {
    try {
        let { search } = req.body;
        let product = await Product.find({
            name: { $regex: new RegExp(search, 'i') }
        }).populate('category', ['name']);

        if (product.length === 0) {
            return res.status(404).send({ message: 'Product not found.' });
        }

        return res.send({ message: 'Products found', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error when searching for product.' });
    }
};


export const productsByCategory = async(req, res)=>{
    try {
        let idCategory = req.params.id
        console.log(idCategory);
        let category = await Category.findOne({_id: idCategory})
        if(!category) return res.status(404).send({message: 'Category not found'})
        console.log(category);
        let products = await Product.find({category: idCategory}, {category: 0})
        if(products.length === 0) return res.status(404).send({message: 'Products not found'})
        return res.send({message: 'Products found ', products})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error to list'})
    }
}