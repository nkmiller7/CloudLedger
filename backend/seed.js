import users from "./dal/users.js";
import categories from "./dal/categories.js";
import { MongoClient } from "mongodb";
import config from "./config.js";

const seedUsers = async () => {
    try {
        const client = await MongoClient.connect(config.mongo.uri);
        const db = client.db(config.mongo.database_name);
        await db.dropDatabase();
        await client.close();
        console.log("Database dropped before seeding.");
    } catch (dropErr) {
        console.error("Failed to drop database:", dropErr);
        process.exit(1);
    }
    try {
        console.log("Starting database seed...");

        const seedData = [
            {
                username: "john_doe",
                password: "P@ssword123!",
                first_name: "John",
                last_name: "Doe",
                categories: [
                    {
                        name: "Rent",
                        expenses: [
                            { amount: 1800.00, description: "Monthly apartment rent", transaction_date: "2026-01-01T09:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                            { amount: 1800.00, description: "Monthly apartment rent", transaction_date: "2026-02-01T09:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                            { amount: 1800.00, description: "Monthly apartment rent", transaction_date: "2026-03-01T09:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                            { amount: 1800.00, description: "Monthly apartment rent", transaction_date: "2026-04-01T09:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                        ],
                    },
                    {
                        name: "Utilities",
                        expenses: [
                            { amount: 215.00, description: "Electricity gas and water bill", transaction_date: "2026-01-05T12:00:00.000Z", payment_method: "credit", frequency: "monthly" },
                            { amount: 195.00, description: "Electricity gas and water bill", transaction_date: "2026-02-05T12:00:00.000Z", payment_method: "credit", frequency: "monthly" },
                            { amount: 178.00, description: "Electricity gas and water bill", transaction_date: "2026-03-05T12:00:00.000Z", payment_method: "credit", frequency: "monthly" },
                            { amount: 188.00, description: "Electricity gas and water bill", transaction_date: "2026-04-05T12:00:00.000Z", payment_method: "credit", frequency: "monthly" },
                        ],
                    },
                    {
                        name: "Groceries",
                        expenses: [
                            { amount: 385.00, description: "Monthly grocery haul", transaction_date: "2026-01-12T12:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                            { amount: 420.00, description: "Monthly grocery haul", transaction_date: "2026-02-10T12:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                            { amount: 395.00, description: "Monthly grocery haul", transaction_date: "2026-04-12T12:00:00.000Z", payment_method: "debit", frequency: "monthly" },
                        ],
                    },
                    {
                        name: "Dining Out",
                        expenses: [
                            { amount: 285.00, description: "Valentines dinner and drinks", transaction_date: "2026-02-14T19:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 195.00, description: "Dinner with friends", transaction_date: "2026-03-15T19:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 240.00, description: "Birthday dinner outing", transaction_date: "2026-04-19T19:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                        ],
                    },
                    {
                        name: "Clothing",
                        expenses: [
                            { amount: 345.00, description: "Winter clothing haul", transaction_date: "2026-01-18T14:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 380.00, description: "Spring wardrobe refresh", transaction_date: "2026-04-10T14:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                        ],
                    },
                    {
                        name: "Video Games",
                        expenses: [
                            { amount: 499.99, description: "New gaming console purchase", transaction_date: "2026-01-20T10:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 69.99, description: "New game release", transaction_date: "2026-03-08T10:00:00.000Z", payment_method: "debit", frequency: "one_time" },
                        ],
                    },
                    {
                        name: "Home Decor",
                        expenses: [
                            { amount: 245.00, description: "Home supplies and decor", transaction_date: "2026-01-25T11:00:00.000Z", payment_method: "debit", frequency: "one_time" },
                            { amount: 380.00, description: "New kitchen appliance", transaction_date: "2026-02-22T11:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 1299.00, description: "Portable hot tub", transaction_date: "2026-03-20T11:00:00.000Z", payment_method: "credit", frequency: "one_time" },
                            { amount: 195.00, description: "Outdoor furniture", transaction_date: "2026-04-16T11:00:00.000Z", payment_method: "debit", frequency: "one_time" },
                        ],
                    },
                    {
                        name: "Transportation",
                        expenses: [
                            { amount: 350.00, description: "Car repair and service", transaction_date: "2026-02-10T09:00:00.000Z", payment_method: "debit", frequency: "one_time" },
                            { amount: 185.00, description: "Car maintenance and oil change", transaction_date: "2026-03-12T09:00:00.000Z", payment_method: "debit", frequency: "one_time" },
                        ],
                    },
                ],
            },
            {
                username: "jane_smith",
                password: "SecureP@ss456!",
                first_name: "Jane",
                last_name: "Smith",
                categories: [
                    {
                        name: "Dining Out",
                        expenses: [
                            {
                                amount: 60.0,
                                description: "Dinner at Italian restaurant",
                                transaction_date: "2024-02-03T18:30:00.000Z",
                                payment_method: "credit",
                                frequency: "one_time",
                            },
                        ],
                    },
                    {
                        name: "Fitness",
                        expenses: [
                            {
                                amount: 40.0,
                                description: "Monthly gym membership",
                                transaction_date: "2024-02-01T09:00:00.000Z",
                                payment_method: "debit",
                                frequency: "monthly",
                            },
                        ],
                    },
                ],
            },
            {
                username: "mike_johnson",
                password: "MyPass789@",
                first_name: "Mike",
                last_name: "Johnson",
                categories: [
                    {
                        name: "Transport",
                        expenses: [
                            {
                                amount: 25.0,
                                description: "Gas refill",
                                transaction_date: "2024-02-02T10:00:00.000Z",
                                payment_method: "debit",
                                frequency: "weekly",
                            },
                        ],
                    },
                ],
            },
            {
                username: "sarah_williams",
                password: "S@rah2024!",
                first_name: "Sarah",
                last_name: "Williams",
                categories: [
                    {
                        name: "Books",
                        expenses: [
                            {
                                amount: 30.0,
                                description: "Purchased novels",
                                transaction_date: "2024-02-10T14:00:00.000Z",
                                payment_method: "credit",
                                frequency: "one_time",
                            },
                        ],
                    },
                ],
            },
            {
                username: "alex_brown",
                password: "Al3xBr0wn99!",
                first_name: "Alex",
                last_name: "Brown",
                categories: [
                    {
                        name: "Entertainment",
                        expenses: [
                            {
                                amount: 15.99,
                                description: "Streaming service subscription",
                                transaction_date: "2024-02-01T00:00:00.000Z",
                                payment_method: "credit",
                                frequency: "monthly",
                            },
                        ],
                    },
                ],
            },
        ];

        for (const userData of seedData) {
            try {
                const createdUser = await users.create_user(
                    userData.username,
                    userData.password,
                    userData.first_name,
                    userData.last_name,
                );
                console.log(`Created user: ${createdUser.username}`);

                // Add categories and expenses for the user
                if (userData.categories && userData.categories.length > 0) {
                    for (const cat of userData.categories) {
                        try {
                            const createdCategory =
                                await categories.create_category(
                                    createdUser._id,
                                    cat.name,
                                );
                            console.log(
                                `Added category: ${createdCategory.name}`,
                            );

                            if (cat.expenses && cat.expenses.length > 0) {
                                for (const exp of cat.expenses) {
                                    try {
                                        await categories.create_expense(
                                            createdUser._id,
                                            createdCategory._id,
                                            exp.amount,
                                            exp.description,
                                            exp.transaction_date,
                                            exp.payment_method,
                                            exp.frequency,
                                        );
                                        console.log(
                                            `Added expense: ${exp.description}`,
                                        );
                                    } catch (expErr) {
                                        console.log(
                                            `Failed to add expense '${exp.description}':`,
                                            expErr && expErr.reason
                                                ? expErr.reason
                                                : expErr,
                                        );
                                    }
                                }
                            }
                        } catch (catErr) {
                            console.log(
                                `Failed to add category '${cat.name}': ${catErr.reason}`,
                            );
                        }
                    }
                }
            } catch (error) {
                console.log(
                    `Failed to create user ${userData.username}: ${error.reason}`,
                );
            }
        }

        console.log("Database seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedUsers();
