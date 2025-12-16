import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

dotenv.config();

const resetAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Email and password to set
        const email = 'admin@gmail.com';
        const password = 'Admin123!';
        const name = 'Admin';

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            // Update existing admin
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.name = name;
            await existingAdmin.save();
            console.log('✅ Admin credentials reset successfully!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAdmin = await Admin.create({
                name,
                email,
                password: hashedPassword
            });
            console.log('✅ New admin created successfully!');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

        await mongoose.connection.close();
        console.log('Connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting admin:', error.message);
        process.exit(1);
    }
};

resetAdmin();
