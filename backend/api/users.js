import { Router } from "express";
import users from "../dal/users.js";
import validate from "../dal/validation.js";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        validate.routes.users.register(req.body);

        const user = await users.create_user(
            req.body.username,
            req.body.password,
            req.body.first_name,
            req.body.last_name,
        );

        return res.status(201).json(user);
    } catch (error) {
        if (
            typeof error === "object" &&
            error.http_code !== undefined &&
            error.reason !== undefined &&
            error.trace !== undefined
        ) {
            return res.status(error.http_code).json({ reason: error.reason });
        } else {
            return res.status(500).json({ reason: "internal server error" });
        }
    }
});

router.post("/login", async (req, res) => {
    try {
        validate.routes.users.login(req.body);

        const user = await users.login_user(
            req.body.username,
            req.body.password,
        );
        req.session.user_id = user._id;
        req.session.username = user.username;

        return res.status(200).json(user);
    } catch (error) {
        if (
            typeof error === "object" &&
            error.http_code !== undefined &&
            error.reason !== undefined &&
            error.trace !== undefined
        ) {
            return res.status(error.http_code).json({ reason: error.reason });
        } else {
            return res.status(500).json({ reason: "internal server error" });
        }
    }
});

export default router;
