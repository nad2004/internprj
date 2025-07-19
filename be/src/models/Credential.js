import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    type: String,
    enum: ['local', 'google'],
    required: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  providerUserId: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// đảm bảo mỗi (provider, providerUserId) là duy nhất
CredentialSchema.index({ provider: 1, providerUserId: 1 }, { unique: true, sparse: true });

export default mongoose.model('Credential', CredentialSchema);
