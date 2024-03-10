import { Schema, model } from "mongoose";

const invoiceSchema = Schema({
  user: {
    type: Schema.ObjectId,
    ref: "user",
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
    },
  ],
});

export default model("Invoice", invoiceSchema);
