import config from "../config.js";
import validate from "./validation.js";
import { saving_goals_collection } from "./mongo/collections.js";
import { ObjectId } from "mongodb";

const saving_goals = {
  get_saving_goal_by_name: async (creator_id, name, throws = true) => {
    creator_id = creator_id.trim();
    name = name.trim();
    validate.misc.object_id(creator_id);
    validate.saving_goals.name(name);

    const collection = await saving_goals_collection();
    const saving_goal = await collection.findOne({
      name: { $regex: name, $options: "i" },
      creator: new ObjectId(creator_id),
    });
    if (saving_goal === null && throws)
      throw {
        http_code: 404,
        reason: "saving goal not found",
        trace: new Error().stack,
      };

    return saving_goal;
  },

  get_saving_goal_by_id: async (creator_id, saving_goal_id, throws = true) => {
    creator_id = creator_id.trim();
    saving_goal_id = saving_goal_id.trim();
    validate.misc.object_id(creator_id);
    validate.misc.object_id(saving_goal_id);

    const collection = await saving_goals_collection();
    const saving_goal = await collection.findOne({
      _id: new ObjectId(saving_goal_id),
      creator: new ObjectId(creator_id),
    });
    if (saving_goal === null && throws)
      throw {
        http_code: 404,
        reason: "saving goal not found",
        trace: new Error().stack,
      };

    return saving_goal;
  },

  get_saving_goals_by_creator: async (creator_id) => {
    creator_id = creator_id.trim();
    validate.misc.object_id(creator_id);

    const collection = await saving_goals_collection();
    const saving_goals = await collection
      .find({ creator: new ObjectId(creator_id) })
      .toArray();

    return saving_goals;
  },

  create_saving_goal: async (
    creator_id,
    name,
    goal_amount,
    current_amount,
    deadline,
  ) => {
    creator_id = creator_id.trim();
    name = name.trim();
    deadline = deadline.trim();
    validate.misc.object_id(creator_id);
    validate.saving_goals.name(name);
    validate.saving_goals.goal_amount(goal_amount);
    validate.saving_goals.current_amount(current_amount);
    validate.saving_goals.deadline(deadline);

    if (
      (await saving_goals.get_saving_goal_by_name(creator_id, name, false)) !==
      null
    )
      throw {
        http_code: 400,
        reason: "saving goal already exists",
        trace: new Error().stack,
      };

    const collection = await saving_goals_collection();
    const insert_info = await collection.insertOne({
      name: name,
      creator: new ObjectId(creator_id),
      goal_amount: goal_amount,
      current_amount: current_amount,
      deadline: deadline,
    });
    if (insert_info.acknowledged !== true)
      throw {
        http_code: 500,
        reason: "failed to create saving goal",
        trace: new Error().stack,
      };

    return {
      _id: insert_info.insertedId.toString(),
      name: name,
      goal_amount: goal_amount,
      current_amount: current_amount,
      deadline: deadline,
    };
  },

  update_saving_goal_amount: async (creator_id, saving_goal_id, amount) => {
    creator_id = creator_id.trim();
    saving_goal_id = saving_goal_id.trim();
    validate.misc.object_id(creator_id);
    validate.misc.object_id(saving_goal_id);
    validate.saving_goals.contribution_amount(amount);

    // Confirm the goal exists and belongs to the user
    await saving_goals.get_saving_goal_by_id(creator_id, saving_goal_id);

    const collection = await saving_goals_collection();
    const update_info = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(saving_goal_id),
        creator: new ObjectId(creator_id),
      },
      { $inc: { current_amount: amount } },
      { returnDocument: "after" },
    );
    if (update_info === null)
      throw {
        http_code: 500,
        reason: "failed to update saving goal",
        trace: new Error().stack,
      };

    return update_info;
  },

  delete_saving_goal: async (creator_id, saving_goal_id) => {
    saving_goal_id = saving_goal_id.trim();
    creator_id = creator_id.trim();
    validate.misc.object_id(saving_goal_id);
    validate.misc.object_id(creator_id);

    const collection = await saving_goals_collection();
    const delete_info = await collection.deleteOne({
      _id: new ObjectId(saving_goal_id),
      creator: new ObjectId(creator_id),
    });
    if (delete_info.acknowledged !== true)
      throw {
        http_code: 500,
        reason: "failed to delete saving goal",
        trace: new Error().stack,
      };
  },
};

export default saving_goals;
