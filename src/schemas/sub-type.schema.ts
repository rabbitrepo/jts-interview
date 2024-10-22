import { Schema, Document } from 'mongoose';

// Interface for the SubType object
interface ISubTypeBase {
  sub_type_id: number;
  type_id: number;
  sub_type_name: string;
}

// Document interface
export interface ISubType extends Document, ISubTypeBase {}

// Create the Schema
const SubTypeSchema = new Schema<ISubType>(
  {
    sub_type_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    type_id: {
      type: Number,
      required: true,
      index: true,
    },
    sub_type_name: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'sub_type',
  },
);

export { SubTypeSchema };
