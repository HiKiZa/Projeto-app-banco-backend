import dotenv from 'dotenv';

dotenv.config({ path: 'env '});
export const PORT = process.env;
export const JWT_SEGREDO = process.env.JWT_SEGREDO!