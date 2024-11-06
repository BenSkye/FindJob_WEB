import { model, Schema } from 'mongoose';

const DOCUMENT_NAME = 'Payment';
const COLLECTION_NAME = 'Payments';

const paymentSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        paymentCode: {
            type: Number,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

// Tạo index để tối ưu truy vấn
paymentSchema.index({ userId: 1, paymentCode: 1 });

const paymentModel = model(DOCUMENT_NAME, paymentSchema);
export { paymentModel };