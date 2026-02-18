import { MongoClient } from "mongodb";
import config from "../../config.js";

const get_collection = (name) => {
    let collection = undefined;
    return async () => {
        if (collection === undefined) {
            const connection = await MongoClient.connect(config.mongo.uri);
            const db = connection.db(config.mongo.database_name);
            collection = await db.collection(name);
        }
        return collection;
    };
};

export const users_collection = get_collection("users");
export const categories_collection = get_collection("categories");
