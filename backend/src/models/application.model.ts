import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Application';
const COLLECTION_NAME = 'Applications';

const applicationSchema = new Schema(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true,
        },
        candidateId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        employerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'],
            default: 'pending',
        },
        resume: {
            url: {
                type: String,
                required: true,
            },
            name: String,
            email: String,
            phone: String,
        },
        coverLetter: {
            type: String,
            trim: true,
            default: null,
        },
        isReadByCandidate: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Tạo các index
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true }); // Mỗi ứng viên chỉ được ứng tuyển 1 lần
applicationSchema.index({ employerId: 1, status: 1 });
applicationSchema.index({ candidateId: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

const applicationModel = model(DOCUMENT_NAME, applicationSchema);
export { applicationModel };