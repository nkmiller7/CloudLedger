import { Router } from "express";
import middleware from "./middleware.js";
import saving_goals from "../dal/saving_goals.js";
import validate from "../dal/validation.js";

const router = Router();

router.get("/", middleware.auth, async (req, res) => {
  try {
    const saving_goals_list = await saving_goals.get_saving_goals_by_creator(
      req.session.user_id,
    );

    return res.status(200).json(saving_goals_list);
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
    validate.misc.object_id(req.params.id);

    const saving_goal = await saving_goals.get_saving_goal_by_id(
      req.session.user_id,
      req.params.id,
    );

    return res.status(200).json(saving_goal);
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
    validate.routes.saving_goals.create_saving_goal(req.body);

    const saving_goal = await saving_goals.create_saving_goal(
      req.session.user_id,
      req.body.name,
      req.body.goal_amount,
      req.body.current_amount,
      req.body.deadline,
    );

    return res.status(201).json(saving_goal);
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

router.patch("/:id", middleware.auth, async (req, res) => {
  try {
    validate.misc.object_id(req.params.id);
    validate.routes.saving_goals.add_contribution(req.body);

    const updated_goal = await saving_goals.update_saving_goal_amount(
      req.session.user_id,
      req.params.id,
      req.body.amount,
    );

    return res.status(200).json(updated_goal);
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

router.delete("/:id", middleware.auth, async (req, res) => {
  try {
    validate.misc.object_id(req.params.id);

    await saving_goals.delete_saving_goal(req.session.user_id, req.params.id);

    return res.status(204).json({ reason: "success" });
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
