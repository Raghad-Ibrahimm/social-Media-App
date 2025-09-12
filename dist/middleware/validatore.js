import { appErr } from "../utilts/classError.js";
export const validtion = (schema) => {
    return (req, res, next) => {
        const validtionErrs = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const result = schema[key].safeParse(req[key]);
            if (!result?.success) {
                validtionErrs.push(result.error);
            }
        }
        if (validtionErrs.length) {
            throw new appErr(JSON.parse(validtionErrs), 400);
        }
        next();
    };
};
