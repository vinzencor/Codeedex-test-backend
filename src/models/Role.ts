import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string;
  description?: string;
  permissions: mongoose.Types.ObjectId[];
  scope: 'SELF' | 'TEAM' | 'GLOBAL'; // Controls whose data this role can access/modify
}

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  scope: { type: String, enum: ['SELF', 'TEAM', 'GLOBAL'], default: 'SELF' }
}, { timestamps: true });

export default mongoose.model<IRole>('Role', RoleSchema);
