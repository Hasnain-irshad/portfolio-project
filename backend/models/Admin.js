import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  console.log('DEBUG: Hashing password for:', this.email);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  console.log('DEBUG: Password hashed successfully');
});

// Method to compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  console.log('DEBUG: Comparing password for:', this.email);
  console.log('DEBUG: Stored hash starts with:', this.password ? this.password.substring(0, 10) : 'MISSING');
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  console.log('DEBUG: Match result:', isMatch);
  return isMatch;
};

export default mongoose.model("Admin", adminSchema);
