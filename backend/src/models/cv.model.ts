import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'CV';
const COLLECTION_NAME = 'CVs';

const cvSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    templateId: {
        type: Schema.Types.ObjectId,
        ref: 'Template',
        required: true,
    },
    // Lưu trữ dữ liệu động theo fields được chọn
    content: {
        type: Map,
        of: Schema.Types.Mixed,
        required: true
        // Ví dụ: {
        //   fullName: "John Doe",
        //   email: "john@example.com",
        //   skills: ["JavaScript", "React"],
        //   experience: [{
        //     title: "Developer",
        //     company: "Tech Corp",
        //     duration: "2020-2023"
        //   }]
        // }
    },
    // Lưu trữ danh sách các field được chọn hiển thị
    selectedFields: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'inactive'],
        default: 'draft',
    },
    isPaid: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

cvSchema.index({ userId: 1, templateId: 1 });

const cvModel = model(DOCUMENT_NAME, cvSchema);

export default cvModel;

