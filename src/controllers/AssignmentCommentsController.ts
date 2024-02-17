import * as dotenv from "dotenv";

dotenv.config();

import zod from "zod";

import * as jose from "jose";

import pool from "../config/dbConfig";

import crypt from "../helpers/crypt";

class AssignmentCommentsController {
    sql: any
    constructor() {


    }

    addComment = async (c: any) => {

        try {

            const reqBody = await c.req.json();

            const assignment_id = reqBody.assignment_id ? (typeof reqBody.assignment_id == "string") ? reqBody.assignment_id.trim().toUpperCase() : reqBody.assignment_id : reqBody.assignment_id;

            const user_id = reqBody.user_id;

            const comment = reqBody.comment ? (typeof reqBody.comment == "string") ? reqBody.comment.trim() : reqBody.comment : reqBody.comment;

            const website_name = reqBody.website_name ? (typeof reqBody.website_name == "string") ? reqBody.website_name.trim().toLowerCase() : reqBody.website_name : reqBody.website_name;

            const reqBodyData = { assignment_id, user_id, comment, website_name }

            const zodObj = zod.object({
                assignment_id: zod.string(),
                user_id: zod.number().int(),
                comment: zod.string(),
                website_name: zod.string().max(100),
            });

            zodObj.parse(reqBodyData);

            process.env.TZ = 'Asia/kolkata';

            const date = new Date().getTime();

            const result = await sql`SELECT comment_id, website_name FROM assignmentcomments WHERE assignment_id = ${assignment_id} AND user_id = ${user_id} AND website_name = ${website_name}`;

            if(result.length !== 0) return c.json({ error: true, data: 'Assignment comment aleady exist!' });

            const resultRows = await sql`INSERT INTO public.assignmentcomments (comment_id, assignment_id, user_id, comment, website_name) VALUES (${date}, ${assignment_id}, ${user_id}, ${comment}, ${website_name})`;

            if(resultRows.count === 0 ) return c.json({ error: true, data: 'Unable to add assignment comment!' });

            return c.json({ error: false, data: 'Assignment comment added successfully!', comment_id: date });

        } catch (error) {

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }
        }

    }

    getComment = async (c: any) => {

        try {

            const reqBody = await c.req.json();

            const assignment_id = reqBody.assignment_id ? (typeof reqBody.assignment_id == "string") ? reqBody.assignment_id.trim().toUpperCase() : reqBody.assignment_id : reqBody.assignment_id;

            const offset = typeof reqBody.offset === 'undefined' ? 0 : reqBody.offset;

            const limit = typeof reqBody.limit === 'undefined' ? Number.MAX_SAFE_INTEGER : reqBody.limit;

            const website_name = reqBody.website_name ? (typeof reqBody.website_name == "string") ? reqBody.website_name.trim().toLowerCase() : reqBody.website_name : reqBody.website_name;

            const reqBodyData = { assignment_id, offset, limit, website_name }

            const zodObj = zod.object({
                assignment_id: zod.string().max(100),
                offset: zod.number().int().optional(),
                limit: zod.number().int().optional(),
                website_name: zod.string().max(100),
            });

            zodObj.parse(reqBodyData);

            const result: any = await sql`SELECT * FROM assignmentcomments WHERE assignment_id = ${assignment_id} AND website_name = ${website_name} OFFSET ${offset} LIMIT ${limit}`;

            if (result.length === 0) return c.json({ error: true, data: "No assignment comment found!" });

            return c.json({ error: false, data: result });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }
        }

    }

    getComments = async (c: any) => {

        try {

            const reqBody = await c.req.json();

            const assignment_ids = reqBody.assignment_ids;

            const offset = typeof reqBody.offset === 'undefined' ? 0 : reqBody.offset;

            const limit = typeof reqBody.limit === 'undefined' ? Number.MAX_SAFE_INTEGER : reqBody.limit;

            const website_name = reqBody.website_name ? (typeof reqBody.website_name == "string") ? reqBody.website_name.trim().toLowerCase() : reqBody.website_name : reqBody.website_name;

            const reqBodyData = { assignment_ids, offset, limit, website_name }

            const zodObj = zod.object({
                assignment_ids: zod.array(zod.string().max(100)),
                offset: zod.number().int().optional(),
                limit: zod.number().int().optional(),
                website_name: zod.string().max(100),
            });

            zodObj.parse(reqBodyData);

            const result: any = await sql`SELECT * FROM assignmentcomments WHERE assignment_id IN (${assignment_ids}) AND website_name = ${website_name} OFFSET ${offset} LIMIT ${limit}`;

            if (result.length === 0) return c.json({ error: true, data: "No assignment comment found!" });

            return c.json({ error: false, data: result });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }

        }

    }

    createTable = async (c: any) => {

        try {

            const client = await pool.connect();

            const createTableawait = await client.query(`
            DROP TABLE IF EXISTS public.assignmentcomments;

            CREATE TABLE IF NOT EXISTS public.assignmentcomments
            (
                "comment_id" bigint NULL,
                "assignment_id" text COLLATE pg_catalog."default" NOT NULL,
                "user_id" bigint NOT NULL,
                "comment" text COLLATE pg_catalog."default" NULL,
                "status" int NOT NULL DEFAULT '1'::int,	
                "created_at" timestamp without time zone NOT NULL DEFAULT LOCALTIMESTAMP(0),
                "updated_at" timestamp without time zone NOT NULL DEFAULT LOCALTIMESTAMP(0),
                "deleted_at" timestamp NULL,
                "website_name" text COLLATE pg_catalog."default" NULL
            )
            TABLESPACE pg_default;
            
            ALTER TABLE IF EXISTS public.assignmentcomments
                    OWNER to "postgres"`);

                    //const a = await client.query(`SELECT * FROM pg_catalog.pg_tables;`)

            return c.json({ error: false, data: `Table assignmentcomments created successfully!`, createTableawait });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }

        }

    }

    dropTable = async (c: any) => {

        try {

            const dropTable = await sql`DROP TABLE IF EXISTS public.assignmentcomments`;

            return c.json({ error: false, data: `Table assignmentcomments deleted successfully!`, dropTable });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }

        }

    }

    getKey = async (c: any) => {

        try {

            const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

            const reqBody = await c.req.json();

            const email = reqBody.email ? (typeof reqBody.email == "string") ? reqBody.email.trim().toLowerCase() : reqBody.email : reqBody.email;

            const password = reqBody.password ? (typeof reqBody.password == "string") ? reqBody.password.trim() : reqBody.password : reqBody.password;

            const reqBodyData = { email, password }

            const zodObj = zod.object({
                email: zod.string().email().max(100),
                password: zod.string().max(100),
            });

            zodObj.parse(reqBodyData);

            const response = await fetch(process.env.AUTH_USERS as string, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(reqBodyData)

            });

            const responseData = await response.json();

            if (responseData?.error) return c.json({ error: true, data: responseData?.data });

            const data = responseData?.data;

            if (data.length == 0) return c.json({ error: true, data: "User account not found!" });

            if (data[0].status == 0) return c.json({ error: true, data: "User account is not active!" });

            if (data[0].ban_status == 1) return c.json({ error: true, data: "User account is banned!" });

            if (data[0].ban_by != 0) return c.json({ error: true, data: `User account is banned by user id: ${data[0].ban_by}` });

            if (!data[0].deleted_at == null) return c.json({ error: true, data: "User account marked deleted!" });

            const jwt = await new jose.SignJWT({ data: [data[0]] })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setIssuer(process.env.ISSUER as string)
                .setAudience(process.env.AUDIENCE as string)
                .sign(secret)

            return c.json({ error: false, data: crypt.encrypt(jwt) });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }

        }

    }

    test = async (c: any) => {

        try {

            const result = await sql`SELECT NOW()`;

            const a = await sql`SELECT pid, usename, state
            FROM pg_stat_activity;`

            return c.json({ error: false, data: result, a });

        } catch (error) {

            console.log(error);

            if (error.issues) {

                const zodErrorData = JSON.parse(error.message).map((errorMessage: any) => {

                    if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

                })

                return c.json({ error: true, data: zodErrorData[0]?.message });

            } else {

                console.log(error.message.fields);

                if (error.message?.fields) return c.json({ error: true, data: error.message.fields?.message });

                if (error.message.fields) return c.json({ error: true, data: error.message.fields?.message });

                return c.json({ error: true, data: error.message });

            }

        }

    }

}

export default AssignmentCommentsController