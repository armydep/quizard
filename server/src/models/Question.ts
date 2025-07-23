import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  question: string;
  keywords: string[];
}

const QuestionSchema: Schema = new Schema({
  question: { type: String, required: true },
  keywords: { type: [String], required: true },
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
