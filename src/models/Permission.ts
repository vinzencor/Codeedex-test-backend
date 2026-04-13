import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  name: string; // e.g., 'user:create', 'user:read', 'role:update'
  description?: string;
  module: string; // e.g., 'Users', 'Roles', 'Teams'
}

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  module: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IPermission>('Permission', PermissionSchema);
