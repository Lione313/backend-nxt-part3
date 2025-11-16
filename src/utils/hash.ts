import bcrypt from "bcryptjs";

/**
 * Hashea una contraseña
 * @param password string
 * @returns string hashed
 */
export const hash = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

/**
 * Compara contraseña plain con hashed
 * @param password string
 * @param hashed string
 * @returns boolean
 */
export const compare = async (password: string, hashed: string): Promise<boolean> => {
    return bcrypt.compare(password, hashed);
};
