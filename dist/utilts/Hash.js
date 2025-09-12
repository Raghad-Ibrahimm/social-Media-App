import { hash, compare } from "bcrypt";
export const Hash = async (plainText, saltRound = Number(process.env.SOLT_ROUND)) => {
    return hash(plainText, saltRound);
};
export const Compare = async (plainText, cipherText) => {
    return compare(plainText, cipherText);
};
