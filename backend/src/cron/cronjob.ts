// jobs.ts
import cron from 'node-cron';
import { userModel } from '../models/user.model'; // Adjust the path as needed

// Schedule a job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    await userModel.deleteMany({
        verify: false, // Only delete unverified accounts
        verificationTokenExpire: { $lt: now },
    });
    console.log('Deleted unverified accounts that expired');
});
