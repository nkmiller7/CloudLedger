import users from "./dal/users.js";

const seedUsers = async () => {
  try {
    console.log("Starting database seed...");

    const seedData = [
      {
        username: "john_doe",
        password: "P@ssword123!",
        first_name: "John",
        last_name: "Doe",
      },
      {
        username: "jane_smith",
        password: "SecureP@ss456!",
        first_name: "Jane",
        last_name: "Smith",
      },
      {
        username: "mike_johnson",
        password: "MyPass789@",
        first_name: "Mike",
        last_name: "Johnson",
      },
      {
        username: "sarah_williams",
        password: "S@rah2024!",
        first_name: "Sarah",
        last_name: "Williams",
      },
      {
        username: "alex_brown",
        password: "Al3xBr0wn99!",
        first_name: "Alex",
        last_name: "Brown",
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
