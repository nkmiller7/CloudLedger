import config from "../config.js";
import validate from "./validation.js";
import { categories_collection } from "./mongo/collections.js";
import { AuthMechanism, ObjectId } from "mongodb";

const categories = {
    get_category_by_name: async (creator_id, name, throws = true) => {
        creator_id = creator_id.trim();
        name = name.trim();
        validate.misc.object_id(creator_id);
        validate.categories.name(name);

        const collection_category = await categories_collection();
        const category = await collection_category.findOne({
            name: { $regex: name, $options: "i" },
            creator: new ObjectId(creator_id),
        });
        if (category === null && throws)
            throw {
                http_code: 404,
                reason: "category not found",
                trace: console.trace(),
            };

        return category;
    },

    get_category_by_id: async (creator_id, category_id, throws = true) => {
        creator_id = creator_id.trim();
        category_id = category_id.trim();
        validate.misc.object_id(creator_id);
        validate.misc.object_id(category_id);

        const collection_category = await categories_collection();
        const category = await collection_category.findOne({
            _id: new ObjectId(category_id),
            creator: new ObjectId(creator_id),
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
        if (
            (await categories.get_category_by_name(creator_id, name, false)) !==
            null
        )
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

    create_expense: async (
        creator_id,
        category_id,
        amount,
        description,
        transaction_date,
        payment_method,
        frequency,
    ) => {
        category_id = category_id.trim();
        description = description.trim();
        transaction_date = transaction_date.trim();
        payment_method = payment_method.trim();
        frequency = frequency.trim();
        validate.misc.object_id(category_id);
        validate.expenses.amount(amount);
        validate.expenses.description(description);
        validate.expenses.transaction_date(transaction_date);
        validate.expenses.payment_method(payment_method);
        validate.expenses.frequency(frequency);

        const category_collection = await categories_collection();
        const update_info = await category_collection.updateOne(
            {
                _id: new ObjectId(category_id),
                creator: new ObjectId(creator_id),
            },
            {
                $push: {
                    expenses: {
                        _id: new ObjectId(),
                        amount: amount,
                        description: description,
                        transaction_date: transaction_date,
                        payment_method: payment_method,
                        frequency: frequency,
                    },
                },
            },
        );
        if (update_info.acknowledged !== true)
            throw {
                http_code: 500,
                reason: "failed to create expense",
                trace: console.trace(),
            };

        return {
            _id: update_info.upsertedId.toString(),
            amount: amount,
            description: description,
            transaction_date: transaction_date,
            payment_method: payment_method,
            frequency: frequency,
        };
    },

    delete_category: async (creator_id, category_id) => {
        category_id = category_id.trim();
        creator_id = creator_id.trim();
        validate.misc.object_id(category_id);
        validate.misc.object_id(creator_id);

        const category_collection = await categories_collection();
        const delete_info = await category_collection.deleteOne({
            _id: new ObjectId(category_id),
            creator: new ObjectId(creator_id),
        });
        if (delete_info.acknowledged !== true)
            throw {
                http_code: 500,
                reason: "failed to delete category",
                trace: console.trace(),
            };
    },

    delete_expense: async (creator_id, category_id, expense_id) => {
        category_id = category_id.trim();
        expense_id = expense_id.trim();
        creator_id = creator_id.trim();
        validate.misc.object_id(category_id);
        validate.misc.object_id(expense_id);
        validate.misc.object_id(creator_id);

        const category_collection = await categories_collection();
        const update_info = await category_collection.updateOne(
            {
                _id: new ObjectId(category_id),
                creator: new ObjectId(creator_id),
            },
            {
                $pull: {
                    expenses: {
                        _id: new ObjectId(expense_id),
                    },
                },
            },
        );
        if (update_info.acknowledged !== true)
            throw {
                http_code: 500,
                reason: "failed to delete expense",
                trace: console.trace(),
            };
    },
};

export default categories;
