function admin(req, res, next) {
    if(req.user.isAdmin === false) return res.status(403).send("Access Denied.");
    next();
}

export {admin};