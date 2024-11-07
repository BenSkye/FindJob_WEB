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
    htmlStructure: {
        type: String,
        required: true,
    },
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