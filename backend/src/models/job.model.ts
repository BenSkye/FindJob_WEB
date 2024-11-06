import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Job';
const COLLECTION_NAME = 'Jobs';

const jobSchema = new Schema(
    {
        employerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        images: [{
            type: Array, // URL của hình ảnh
        }],
        requirements: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        salary: {
            min: {
                type: Number,
            },
            max: {
                type: Number,
            },
            negotiable: {
                type: Boolean,
                default: false,
            },
        },
        benefits: [{
            type: String,
            required: true,
        }],
        location: {
            type: String,
            required: true,
        },
        jobType: {
            type: String,
            enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'published', 'closed', 'expired'],
            default: 'draft',
        },
        isPay: {
            type: Boolean,
            default: false,
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: 'Payment',
        },
        applications: [{
            type: Schema.Types.ObjectId,
            ref: 'Application',
        }],
        expiryDate: {
            type: Date,
            required: true,
        },
        category: {
            mainCategory: {
                type: Schema.Types.ObjectId,
                ref: 'Category',
                required: true
            },
            subCategory: {
                type: String, // lưu name của subCategory
                required: true
            }
        },
        isHot: {
            type: Boolean,
            default: false, //job đang gấp cần tìm người ứng tuyển nhanh
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Indexes để tối ưu tìm kiếm
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ employerId: 1, status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ 'location.city': 1 });
jobSchema.index({ expiryDate: 1 });

const jobModel = model(DOCUMENT_NAME, jobSchema);
export { jobModel };