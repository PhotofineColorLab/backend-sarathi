import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'invoice' | 'dispatched' | 'dc';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  paymentCondition: 'immediate' | 'days15' | 'days30';
  dispatchDate?: Date;
  scheduledDate?: Date;
  orderImage?: string;
  isPaid: boolean;
  paidAt?: Date;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const OrderSchema = new Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['pending', 'invoice', 'dispatched', 'dc'],
    default: 'pending'
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
  assignedTo: { type: String, default: null },
  paymentCondition: { 
    type: String, 
    enum: ['immediate', 'days15', 'days30'],
    default: 'immediate'
  },
  dispatchDate: { type: Date },
  scheduledDate: { type: Date },
  orderImage: { type: String },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date }
});

// Update the updatedAt timestamp before saving
OrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<IOrder>('Order', OrderSchema); 