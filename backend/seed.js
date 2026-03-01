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
            name: "Groceries",
            expenses: [
              {
                amount: 120.50,
                description: "Weekly grocery shopping",
                transaction_date: "2024-02-01T12:00:00.000Z",
                payment_method: "debit_card",
                frequency: "weekly",
              },
              {
                amount: 45.00,
                description: "Bought snacks",
                transaction_date: "2024-02-08T12:00:00.000Z",
                payment_method: "cash",
                frequency: "one_time",
              },
            ],
          },
          {
            name: "Utilities",
            expenses: [
              {
                amount: 75.99,
                description: "Monthly electricity bill",
                transaction_date: "2024-02-05T12:00:00.000Z",
                payment_method: "credit_card",
                frequency: "monthly",
              },
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
                amount: 60.00,
                description: "Dinner at Italian restaurant",
                transaction_date: "2024-02-03T18:30:00.000Z",
                payment_method: "credit_card",
                frequency: "one_time",
              },
            ],
          },
          {
            name: "Fitness",
            expenses: [
              {
                amount: 40.00,
                description: "Monthly gym membership",
                transaction_date: "2024-02-01T09:00:00.000Z",
                payment_method: "debit_card",
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
                amount: 25.00,
                description: "Gas refill",
                transaction_date: "2024-02-02T10:00:00.000Z",
                payment_method: "debit_card",
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
                amount: 30.00,
                description: "Purchased novels",
                transaction_date: "2024-02-10T14:00:00.000Z",
                payment_method: "credit_card",
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
                payment_method: "credit_card",
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
              const createdCategory = await categories.create_category(
                createdUser._id,
                cat.name,
              );
              console.log(`Added category: ${createdCategory.name}`);

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
                    console.log(`Added expense: ${exp.description}`);
                  } catch (expErr) {
                    console.log(
                      `Failed to add expense '${exp.description}':`,
                      expErr && expErr.reason ? expErr.reason : expErr,
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
