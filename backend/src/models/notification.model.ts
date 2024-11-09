import { model, Schema } from "mongoose";

const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'Notifications';

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

const notificationModel = model(DOCUMENT_NAME, notificationSchema);

export default notificationModel;
