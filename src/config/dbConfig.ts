import * as dotenv from "dotenv";

dotenv.config();

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL as string,
    {
        ssl: false,
        max: 10,
        max_lifetime: 60 * 30,
        idle_timeout: 60 * 10,
        connect_timeout: 30,
        prepare: true,
        // onnotice: (e) => {
        //     //console.log(e)
        // },
        // onparameter: (key: any, value: any) => {
        //     //console.log(key),
        //     //    console.log(value)
        // },
        // debug: (connection, query, params, types) => {
        //     //console.log(connection),
        //     //    console.log(query)
        //     //console.log(params),
        //      //   console.log(types)
        // }

    })
export default sql