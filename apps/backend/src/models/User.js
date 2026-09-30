const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // never returned by default - login asks for it explicitly with .select('+password')
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    lastLoginAt: this.lastLoginAt,
  };
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
