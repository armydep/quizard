import mongoose, { Schema, Document } from 'mongoose';

export interface IUsersQuestions extends Document {
  userId?: string;
  trackId?: string;
  questionId: number;
  starttime?: Date;
  endtime?: Date;
  iscorrect?: boolean;
  points?: number;
  tries?: number;
}

const UsersQuestionsSchema: Schema = new Schema({
  userId: { type: String },
  trackId: { type: String },
  questionId: { type: Number, required: true },
  starttime: { type: Date },
  endtime: { type: Date },
  iscorrect: { type: Boolean },
  points: { type: Number },
  tries: { type: Number, default: 0 },
});

export default mongoose.model<IUsersQuestions>('UsersQuestions', UsersQuestionsSchema);
