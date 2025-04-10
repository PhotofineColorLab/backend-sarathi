import mongoose, { Schema, Document } from 'mongoose';

export type ProductDimension = 'Bag' | 'Bundle' | 'Box' | 'Carton' | 'Coils' | 'Dozen' | 'Ft' | 'Gross' | 'Kg' | 'Mtr' | 'Pc' | 'Pkt' | 'Set' | 'Not Applicable';

export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
  dimension?: ProductDimension;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  dimension: {
    type: String,
    enum: ['Bag', 'Bundle', 'Box', 'Carton', 'Coils', 'Dozen', 'Ft', 'Gross', 'Kg', 'Mtr', 'Pc', 'Pkt', 'Set', 'Not Applicable'],
    default: 'Pc'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt timestamp before saving
ProductSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IProduct>('Product', ProductSchema); 