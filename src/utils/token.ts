import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const generateToken = (payload: any) => {

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY Is Not Defined In Environment Variables File!");
    }

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
    );

    return token;

}

const verifyToken = (token: string) => {

    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY Is Not Defined In Environment Variables File!");
    }

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        return verifiedToken;
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new Error("Invalid Token");
        }
        if (error instanceof TokenExpiredError) {
            throw new Error("Token Expired");
        }
        throw new Error("Token Verification Failed");
    }

}

export {
    generateToken,
    verifyToken
};