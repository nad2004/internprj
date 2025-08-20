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
  // Chỉ local mới cần passwordHash
  passwordHash: {
    type: String,
    required: function () { return this.provider === 'local'; },
    default: undefined,      // đừng lưu null
  },
  providerUserId: {
    type: String,
    required: function () { return this.provider === 'google'; },
    set: v => (v == null || v === '' ? undefined : v), // không lưu null/""
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Chỉ unique khi provider = 'google' và providerUserId là string
CredentialSchema.index(
  { provider: 1, providerUserId: 1 },
  {
    name: 'uniq_google_providerUserId',
    unique: true,
    partialFilterExpression: {
      provider: 'google',
      providerUserId: { $type: 'string' },
    },
  }
);

export default mongoose.models.Credential
  || mongoose.model('Credential', CredentialSchema);
