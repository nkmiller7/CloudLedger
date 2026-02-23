import config from "../config.js";
import validate from "./validation.js";
import { categories_collection } from "./mongo/collections.js";
import { ObjectId } from "mongodb";

const categories = {
    get_category_by_name: async (name, throws = true) => {
        name = name.trim();
        validate.categories.name(name);

        const collection_category = await categories_collection();
        const category = await collection_category.findOne({
            name: { $regex: name, $options: "i" },
        });
        if (category === null && throws)
            throw {
                http_code: 404,
                reason: "category not found",
                trace: console.trace(),
            };

        return category;
    },

    get_categories_by_creator: async (creator_id) => {
        creator_id = creator_id.trim();
        validate.misc.object_id(creator_id);

        const collection_category = await categories_collection();
        const categories = await collection_category
            .find({ creator: new ObjectId(creator_id) })
            .toArray();

        return categories;
    },

    create_category: async (creator_id, name) => {
        name = name.trim();
        creator_id = creator_id.trim();
        validate.categories.name(name);
        validate.misc.object_id(creator_id);
        if ((await categories.get_category_by_name(name, false)) !== null)
            throw {
                http_code: 400,
                reason: "category already exists",
                trace: console.trace(),
            };

        const category_collection = await categories_collection();
        const insert_info = await category_collection.insertOne({
            name: name,
            creator: new ObjectId(creator_id),
        });
        if (insert_info.acknowledged !== true)
            throw {
                http_code: 500,
                reason: "failed to create category",
                trace: console.trace(),
            };
            
        return {
            _id: insert_info.insertedId.toString(),
            name: name,
        };
    },
};

export default categories;
