const middleware = {
    auth: (req, res, next) => {
        if (req.session.user_id === undefined) {
            return res.status(401).json({ reason: "unauthorized" });
        }
        next();
    },
};

export default middleware;