import * as dotenv from "dotenv";

dotenv.config();

import crypto from "crypto";

const hashKey = crypto.createHash('sha256');
hashKey.update(process.env.ENCRYPTION_KEY as string);
const key = hashKey.digest('hex').substring(0, 32);

const hashIv = crypto.createHash('sha256');
hashIv.update(process.env.ENCRYPTION_KEY as string);
const iv = hashIv.digest('hex').substring(0, 16);

const crypt = {
    encrypt: (value = '') => {
        const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
        const encrypted = cipher.update(value, 'utf-8', 'base64') + cipher.final('base64');
        return Buffer.from(encrypted, 'utf-8').toString('base64');
    },

    decrypt: (value = '') => {
        const encrypted = Buffer.from(value, 'base64').toString('utf-8');
        const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
        return decipher.update(encrypted, 'base64', 'utf-8') + decipher.final('utf-8');
    }
}

export default crypt