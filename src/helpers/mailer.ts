// D:\PROJECTS\BACKEND\evolve\src\helpers\mailer.ts
import User from "../models/userModel";
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ emailType, userId }: any) => {
    try {
        // create a hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 });
        }

        // Return the hashed token or any other necessary data
        return { hashedToken };

    } catch (error: any) {
        throw new Error(error.message);
    }
};
