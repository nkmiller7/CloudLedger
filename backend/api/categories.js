import { Router } from "express";
import middleware from "./middleware.js";
import categories from "../dal/categories.js";

const router = Router();

router.get("/", middleware.auth, async (req, res) => {
    try {
        const categories_list = await categories.get_categories_by_creator(req.session.user_id);

        return res.status(200).json(categories_list);
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