import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Template';
const COLLECTION_NAME = 'Templates';

const templateSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    // Định nghĩa cấu trúc các field có thể có
    fields: {
        type: [{
            name: String,  // Tên field (vd: fullName, email, ...)
            label: String, // Label hiển thị
            type: {
                type: String,
                enum: ['text', 'textarea', 'array', 'number', 'image'],
            },
            required: {
                type: Boolean,
                default: false
            },
            order: Number, // Thứ tự hiển thị
            section: {     // Phân loại section
                type: String,
                enum: ['personal', 'professional', 'education', 'skills', 'experience']
            }
        }],
        required: true
    },
    // HTML template với placeholders cho các field
    htmlStructure: {
        type: String,
        required: true,
    },
    // CSS với các class và style cho từng section
    cssStyles: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

const templateModel = model(DOCUMENT_NAME, templateSchema);
export default templateModel;