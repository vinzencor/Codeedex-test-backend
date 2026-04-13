import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string; // e.g., 'CREATE_USER', 'DELETE_ROLE', 'UPDATE_TEAM'
  actor: mongoose.Types.ObjectId; // User who performed the action
  target?: mongoose.Types.ObjectId; // Entity that was affected (User ID, Role ID, etc.)
  targetModel?: string; // e.g., 'User', 'Role', 'Team'
  details?: any; // Additional context (e.g., changes made)
}

const AuditLogSchema: Schema = new Schema({
  action: { type: String, required: true },
  actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: Schema.Types.Mixed }, // Mixed type to allow various IDs or generic objects
  targetModel: { type: String },
  details: { type: Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
