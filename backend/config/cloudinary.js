import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

/**
 * Startup sanity-check for Cloudinary credentials. Won't crash the server
 * (so the API still boots for non-upload routes), but logs a loud warning
 * the moment the values look wrong — exactly the situation where an
 * "Invalid api_key <cloud-name>" error means the dashboard env is swapped.
 */
const validateCloudinaryEnv = () => {
    const issues = [];

    if (!cloudName) issues.push('CLOUDINARY_CLOUD_NAME is not set');
    if (!apiKey) issues.push('CLOUDINARY_API_KEY is not set');
    if (!apiSecret) issues.push('CLOUDINARY_API_SECRET is not set');

    // The api_key is a numeric token (typically 15+ digits).
    // The cloud_name is short alphanumeric — never purely numeric.
    if (apiKey && !/^\d{10,}$/.test(apiKey)) {
        issues.push(
            `CLOUDINARY_API_KEY="${apiKey}" doesn't look like an API key ` +
            `(should be 10+ digits). Check that you didn't paste the cloud name here.`
        );
    }
    if (cloudName && /^\d{10,}$/.test(cloudName)) {
        issues.push(
            `CLOUDINARY_CLOUD_NAME="${cloudName}" looks like an API key. ` +
            `Check that you didn't swap CLOUD_NAME and API_KEY.`
        );
    }

    if (issues.length) {
        console.warn('\n⚠️  Cloudinary configuration warnings:');
        issues.forEach((msg) => console.warn('   •', msg));
        console.warn('   Uploads will fail until these are fixed on the host environment.\n');
    } else {
        console.log(`✅ Cloudinary configured for cloud "${cloudName}"`);
    }
};

validateCloudinaryEnv();

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

export default cloudinary;
