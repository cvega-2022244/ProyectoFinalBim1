import PDFDocument from "pdfkit";
import fs from "fs";
import Invoice from "./invoice.model.js";
import Shop from "../shop/shop.model.js";

export const generateInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const shop = await Shop.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!shop || shop.products.length === 0) {
      return res.status(404).send({ message: "Shop is empty" });
    }

    const invoice = new Invoice({ user: userId, products: shop.products });
    await invoice.save();

    const doc = new PDFDocument();
    const invoicePath = `./invoices/invoice_${userId}.pdf`;

    doc.pipe(fs.createWriteStream(invoicePath));

    doc.text("Invoice", { align: "center", fontSize: 16 });
    doc.moveDown();

    let totalPrice = 0;

    shop.products.forEach((item) => {
      const product = item.product;
      const quantity = item.quantity;
      const subtotal = product.price * quantity;

      doc.text(
        `${product.name} x ${quantity} - $${product.price.toFixed(
          2
        )} each - Subtotal: $${subtotal.toFixed(2)}`
      );
      totalPrice += subtotal;
    });

    doc.moveDown();
    doc.text(`Total Price: $${totalPrice.toFixed(2)}`, {
      align: "right",
      fontSize: 14,
    });

    doc.end();

    return res.send({ message: "Invoice generated successfully", invoicePath });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Error generating invoice" });
  }
};
