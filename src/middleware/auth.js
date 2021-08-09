import jwt from "jsonwebtoken";

function auth(req, res, next) {
    const token = req.header("x-auth-token");
    if(!token) return res.status(401).send("Access denied, no token provided")

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey)

        //this contains user_id, email and isAdmin
        req.user = decoded;
        next();
    }
    catch(error) {
        res.status(400).send("Invalid Token Provided");
    }
}

export {auth};