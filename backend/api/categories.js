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
  //   console.log("[POST /api/categories] req.session:", req.session);
  //   console.log("[POST /api/categories] req.body:", req.body);
  try {
    await validate.routes.categories.create_category(req.body);

    const category = await categories.create_category(
      req.session.user_id,
      req.body.name,
    );

    return res.status(201).json(category);
  } catch (error) {
    console.error("[POST /api/categories] Error:", error);
    if (
      typeof error === "object" &&
      error.http_code !== undefined &&
      error.reason !== undefined &&
      error.trace !== undefined
    ) {
      return res
        .status(error.http_code)
        .json({ reason: error.reason, details: error });
    } else {
      return res
        .status(500)
        .json({ reason: "internal server error", details: error });
    }
  }
});

router.delete("/:id", middleware.auth, async (req, res) => {
  try {
    await validate.misc.object_id(req.params.id);

    await categories.delete_category(req.session.user_id, req.params.id);

    return res.status(204).send();
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
    console.log("[POST /api/categories/:id/expense] req.session:", req.session);
    console.log("[POST /api/categories/:id/expense] req.body:", req.body);
    await validate.routes.categories.create_expense(req.body);

    const expense = await categories.create_expense(
      req.session.user_id,
      req.params.id,
      req.body.amount,
      req.body.description,
      req.body.transaction_date,
      req.body.payment_method,
      req.body.frequency,
    );

    return res.status(201).json(expense);
  } catch (error) {
    console.error("[POST /api/categories/:id/expense] Error:", error);
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

router.delete(
  "/:category_id/expense/:expense_id",
  middleware.auth,
  async (req, res) => {
    try {
      await validate.misc.object_id(req.params.category_id);
      await validate.misc.object_id(req.params.expense_id);

      await categories.delete_expense(
        req.session.user_id,
        req.params.category_id,
        req.params.expense_id,
      );

      return res.status(204).send();
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
  },
);

export default router;
