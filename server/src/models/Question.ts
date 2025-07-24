import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  Question: string;
}

const QuestionSchema: Schema = new Schema({
  Question: { type: String }
}, { strict: false });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
