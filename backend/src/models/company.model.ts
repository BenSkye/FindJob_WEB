import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Company';
const COLLECTION_NAME = 'Companies';

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        logo: {
            type: String, // URL của logo
            default: null
        },
        description: {
            type: String,
            default: null
        },
        companySize: {
            type: String,
            enum: ['', '1-10', '11-50', '51-200', '201-500', '500+'],
            default: null
        },
        website: {
            type: String,
            trim: true,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        address: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        facebook: {
            type: String,
            default: null
        },
        linkedin: {
            type: String,
            default: null
        },
        twitter: {
            type: String,
            default: null
        },
        taxNumber: {
            type: String,
            default: null
        },
        mainCategory: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Indexes
companySchema.index({ name: 'text', description: 'text' });

const companyModel = model(DOCUMENT_NAME, companySchema);
export { companyModel };