import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';
// Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
    {
        key: {
            type: String,
            require: true,
            unique: true
        },
        status: {
            type: Boolean,
            default: true
        },
        permissions: {
            type: [String],
            require: true,
            enum: ['all', 'member', 'admin', 'shop']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);
//Export the model
const apiKeyModel = model(DOCUMENT_NAME, apiKeySchema);
export { apiKeyModel };
