import jwt from "jsonwebtoken";
export const generateToken = async ({ payload, signature, option }) => {
    return jwt.sign(payload, signature, option);
};
export const verfiyToken = async ({ token, signature }) => {
    return jwt.verify(token, signature);
};
