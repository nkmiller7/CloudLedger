import { Router } from "express";
import middleware from "./middleware.js";
import categories from "../dal/categories.js";
import validate from "../dal/validation.js";

const router = Router();

router.get("/", middleware.auth, async (req, res) => {
    try {
        const categories_list = await categories.get_categories_by_creator(
            req.session.user_id,
        );

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

router.get("/:id", middleware.auth, async (req, res) => {
    try {
        await validate.misc.object_id(req.params.id);

        const category = await categories.get_category_by_id(
            req.session.user_id,
            req.params.id,
        );

        return res.status(200).json(category);
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

router.post("/", middleware.auth, async (req, res) => {
    try {
        await validate.routes.categories.create(req.body);

        const category = await categories.create_category(
            req.session.user_id,
            req.body.name,
        );

        return res.status(201).json(category);
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

router.post("/:id/expense", middleware.auth, async (req, res) => {
    try {
        await validate.routes.categories.create_expense(req.body);

        const expense = await categories.create_expense(
            req.session.user_id,
            req.params.id,
            req.body.amount,
            req.body.description,
            req.body.date,
            req.body.payment_method,
            req.body.frequency,
        );

        return res.status(201).json(expense);
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
