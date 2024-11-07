import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Subscription';
const COLLECTION_NAME = 'Subscriptions';

const subscriptionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'expired', 'cancelled'],
            default: 'active',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        history: [
            {
                paymentId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Payment',
                },
                endDate: Date
            }
        ]
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Tạo index để tối ưu truy vấn
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

const subscriptionModel = model(DOCUMENT_NAME, subscriptionSchema);
export { subscriptionModel };