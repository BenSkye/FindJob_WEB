import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        subCategories: [{
            name: {
                type: String,
                required: true,
            },
        }]
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Tạo index để tối ưu truy vấn
categorySchema.index({ name: 1 });

const categoryModel = model(DOCUMENT_NAME, categorySchema);
export { categoryModel };