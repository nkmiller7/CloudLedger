import config from "../config.js";
import validate from "./validation.js";
import { users_collection } from "./mongo/collections.js";
import bcrypt from "bcryptjs";

const users = {
    get_user_by_username: async (username, throws = true) => {
        username = username.trim();
        validate.users.username(username);

        const collection = await users_collection();
        const user = await collection.findOne({
            username: { $regex: username, $options: "i" },
        });
        if (user === null && throws)
            throw {
                http_code: 404,
                reason: "user not found",
                trace: console.trace(),
            };

        return user;
    },

    create_user: async (username, password, first_name, last_name) => {
        username = username.trim();
        first_name = first_name.trim();
        last_name = last_name.trim();
        validate.users.username(username);
        validate.users.password(password);
        validate.users.first_name(first_name);
        validate.users.last_name(last_name);
        if ((await users.get_user_by_username(username, false)) !== null)
            throw {
                http_code: 400,
                reason: "username already exists",
                trace: console.trace(),
            };

        const user_collection = await users_collection();
        const insert_info = await user_collection.insertOne({
            username: username,
            password: await bcrypt.hash(password, config.bcrypt.salt_rounds),
            first_name: first_name,
            last_name: last_name,
        });
        if (insert_info.acknowledged !== true)
            throw {
                http_code: 500,
                reason: "failed to create user",
                trace: console.trace(),
            };

        return {
            _id: insert_info.insertedId.toString(),
            username: username,
            first_name: first_name,
            last_name: last_name,
        };
    },

    login_user: async (username, password) => {
        username = username.trim();
        validate.users.username(username);
        validate.users.password(password);
        
        const user = await users.get_user_by_username(username, false);
        if (user === null) {
            throw {
                http_code: 401,
                reason: "invalid username or password",
                trace: console.trace(),
            };
        }
        const password_match = await bcrypt.compare(password, user.password);
        if (!password_match) {
            throw {
                http_code: 401,
                reason: "invalid username or password",
                trace: console.trace(),
            };
        }
        
        return {
            _id: user._id.toString(),
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        };
    },
};

export default users;
