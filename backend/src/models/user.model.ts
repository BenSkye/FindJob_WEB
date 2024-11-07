import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';
// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    roles: {
      type: Array,
      default: [],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      default: null
    },
    verificationToken: {
      type: String,
      default: '',
    },
    passwordResetToken: {
      type: String,
      default: '',

    },
    passwordResetExpire: {
      type: Date,
    },
    verificationTokenExpire: {
      type: Date,
    },
    googleId: { type: String },
    authType: { type: String, enum: ['local', 'google'], default: 'local' },
    avatar: { type: String },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);
//Export the model
const userModel = model(DOCUMENT_NAME, userSchema);
export { userModel };
