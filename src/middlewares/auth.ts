
import * as dotenv from "dotenv";

dotenv.config();

import * as jose from "jose";

import crypt from "../helpers/crypt";

const auth = async (c: any, next: () => any) => {

  const authHeader = await c.req.header('authorization');

  if (!authHeader) return c.json({ error: true, data: "Authorization header not available!" });

  if (!authHeader.startsWith('Bearer')) return c.json({ error: true, data: "Not A Beader authorization header!" });

  const token = crypt.decrypt(authHeader.split(" ")[1]);

  try {

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

    const jwtVerifyData = await jose.jwtVerify(token, secret, {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
    });

    const payload: any = jwtVerifyData.payload;

    c.id = payload?.data[0]?.id ? +payload?.data[0]?.id : payload?.data[0]?.id;

    c.u_id = payload?.data[0]?.u_id ? payload?.data[0]?.u_id : 0;

    c.email = payload?.data[0]?.email;

    c.roles = payload?.data[0]?.roles;

    await next();

  } catch (error) {

    console.log(error)

    return c.json({ error: true, data: error.message });

  }

}

export default auth