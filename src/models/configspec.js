import mongoose from 'mongoose';
 
const configspecSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    locale: {
      type: String,
      required: true,
    },
    feeEntity: {
      type: String,
      required: true,
    },
    entityProperty: {
      type: String,
      required: true,
    },
    feeType: {
      type: String,
      required: true,
    },
    feeValue: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
 
const Configspec = mongoose.model('Configspec', configspecSchema);
 
export default Configspec;
