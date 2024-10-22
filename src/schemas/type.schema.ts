import { Schema, Document } from 'mongoose';

// Interface for the Type object
interface ITypeBase {
  type_id: number;
  type_name: string;
}

// Document interface
export interface IType extends Document, ITypeBase {}

// Create the Schema
const TypeSchema = new Schema<IType>(
  {
    type_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    type_name: {
      type: String,
      required: true,
    },
  },
  {
    collection: 'type',
  },
);

export { TypeSchema };
