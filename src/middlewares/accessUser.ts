import * as dotenv from "dotenv";

dotenv.config();

const accessUser = async (c: any, next: () => any) => {

    const id = c?.id ? c?.id : 0;

    const u_id = c?.u_id ? c?.u_id : '';

    const email = c?.email ? c?.email : '';

    const roles = c?.roles ? JSON.parse(c?.roles) : [];

    const accessRoles = [
        "SUPERADMIN",
        "ADMIN",
        "MANAGER",
        "SALE",
        "SALETEAMLEADER",
    ];

    try {

        const accessArray = roles.map((role: string) => accessRoles.includes(role)).find((value: boolean) => value === true);

        if (!accessArray) return c.json({ error: true, data: "Unauthorized role!" });

        c.id = id;

        c.u_id = u_id;

        c.email = email;

        c.roles = roles;

        await next();

    } catch (error) {

        console.log(error);

        return c.json({ error: true, data: error });
    }

}

export default accessUser