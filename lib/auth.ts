import { betterAuth } from "better-auth";


export const auth = betterAuth({
    database: {
        provider: "pg",
    },
    emailAndPassword: {
        enabled: true,
    },
});