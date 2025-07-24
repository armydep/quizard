import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  Question: string;
  QuestionId: number,
  Answer: string,
  Comments: string,
  _likes?: number;
  _dislikes?: number;
  _showCounter?: number;
}

const QuestionSchema: Schema = new Schema({
  Question: { type: String },
  QuestionId: { type: Number },
  Answer: { type: String },
  Comments: { type: String },
  _likes: { type: Number, default: 0 },
  _dislikes: { type: Number, default: 0 },
  _showCounter: { type: Number, default: 0 },
}, { strict: false });

export default mongoose.model<IQuestion>('Question', QuestionSchema);
