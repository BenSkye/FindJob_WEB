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
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    level: {
        type: Schema.Types.ObjectId,
        ref: 'Level',
        required: true,
    },
    jobTitle: {
        type: String,
        required: true,
    },
    jobType: {
        type: Schema.Types.ObjectId,
        ref: 'JobType',
        required: true,
    },
    jobDescription: {
        type: String,
        required: true,
    },
    skills: {
        type: [String],
        required: true,
    },
    experiences: {
        type: [String],
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    salaryExpectation: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// Tạo index để tối ưu truy vấn
cvSchema.index({ userId: 1 });

const cvModel = model(DOCUMENT_NAME, cvSchema);

export default cvModel;

