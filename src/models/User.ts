import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: mongoose.Types.ObjectId;
  team?: mongoose.Types.ObjectId;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team' }
}, { timestamps: true });

// Exclude passwordHash when returning JSON
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export default mongoose.model<IUser>('User', UserSchema);
