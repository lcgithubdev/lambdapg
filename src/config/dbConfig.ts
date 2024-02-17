import * as dotenv from "dotenv";

dotenv.config();

import pg from "pg";

const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
        ca: `-----BEGIN CERTIFICATE-----
        MIICAzCCAamgAwIBAgIRAM8yiqV9xg5BwuODMMuzr3YwCgYIKoZIzj0EAwIwRTEO
        MAwGA1UEChMFdGVtYm8xFDASBgNVBAsTC2VuZ2luZWVyaW5nMR0wGwYDVQQDExRk
        YXRhLTEudXNlMS50ZW1iby5pbzAeFw0yMzEyMTkxODMxMjVaFw0yNDAzMTgxODMx
        MjVaMEUxDjAMBgNVBAoTBXRlbWJvMRQwEgYDVQQLEwtlbmdpbmVlcmluZzEdMBsG
        A1UEAxMUZGF0YS0xLnVzZTEudGVtYm8uaW8wWTATBgcqhkjOPQIBBggqhkjOPQMB
        BwNCAARtP1Kx2rxDmGkwWFmqw0snJZyMfrBs1Fejhsg+3X+qQGFHmFJ4rKrKbpt/
        uqF4GTbryQNtCfG8o86oZGglMLsjo3oweDAOBgNVHQ8BAf8EBAMCAqQwDwYDVR0T
        AQH/BAUwAwEB/zAdBgNVHQ4EFgQUqTbXl+W22irBuFjMkT5HYIB5CtowNgYDVR0R
        BC8wLYIVZGF0YS0xLnVzZTEuY29yZWRiLmlvghRkYXRhLTEudXNlMS50ZW1iby5p
        bzAKBggqhkjOPQQDAgNIADBFAiBZt4KYjjb/bcf+vaGm7CL6QZ8sCU2Vh3NfzMXS
        ABVhhQIhAO50nPA4c/nzJpa0MNnzsMP1uKXke1HrST9K2T8nxpkr
        -----END CERTIFICATE-----
        `,
    },
};

const pool = new pg.Pool(config, 3, true);

pool.on('connect', () => console.log('pool connected!'));

pool.on('acquire', () => console.log('pool acquired!'));

pool.on('error', () => console.log('pool error!'));

export default pool