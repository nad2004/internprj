import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seq: { type: Number, default: 0 },
});
export default mongoose.model('Counter', CounterSchema);
