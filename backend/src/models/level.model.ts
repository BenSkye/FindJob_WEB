import { model, Schema } from "mongoose";

const DOCUMENT_NAME = 'Level';
const COLLECTION_NAME = 'Levels';

const levelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// Tạo index để tối ưu truy vấn
levelSchema.index({ name: 1 });

const levelModel = model(DOCUMENT_NAME, levelSchema);
export { levelModel };
