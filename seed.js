// seed.js
// This script seeds the database with sample data.
// This is for development purposes only and should not be used in production.

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");

const Task = require("./models/task.model");
const User = require("./models/user.model");

const SALT_ROUNDS = 10; // Number of rounds to generate salt. 10 is recommended value

dotenv.config(); // Load environment variables

const tasks = [
  {
    title: "Prepare project presentation",
    description: "Create slides for the upcoming project presentation",
    body: "Include slides on project overview, milestones, and next steps.",
    todoList: [
      { title: "Draft slides", isComplete: false },
      { title: "Review with team", isComplete: false },
      { title: "Finalize slides", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Weekly team meeting",
    description: "Organize and conduct the weekly team meeting",
    body: "Prepare agenda, send invites, and record minutes.",
    todoList: [
      { title: "Prepare agenda", isComplete: true },
      { title: "Send invites", isComplete: true },
      { title: "Record minutes", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Code review",
    description: "Review the code submitted by the development team",
    body: "Check for code quality, adherence to standards, and potential bugs.",
    todoList: [
      { title: "Review frontend code", isComplete: false },
      { title: "Review backend code", isComplete: false },
      { title: "Provide feedback", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Client follow-up",
    description: "Follow up with the client on the recent deliverables",
    body: "Send an email and schedule a call if necessary.",
    todoList: [
      { title: "Draft email", isComplete: false },
      { title: "Send email", isComplete: false },
      { title: "Schedule call", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Update project documentation",
    description: "Ensure the project documentation is up to date",
    body: "Update the project plan, requirements, and technical documentation.",
    todoList: [
      { title: "Update project plan", isComplete: false },
      { title: "Update requirements", isComplete: false },
      { title: "Update technical docs", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Prepare financial report",
    description: "Compile and prepare the monthly financial report",
    body: "Include data on income, expenses, and profits.",
    todoList: [
      { title: "Gather financial data", isComplete: false },
      { title: "Compile report", isComplete: false },
      { title: "Review with finance team", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Team training session",
    description: "Organize a training session for the new software tool",
    body: "Prepare training materials and conduct the session.",
    todoList: [
      { title: "Prepare training materials", isComplete: false },
      { title: "Schedule session", isComplete: false },
      { title: "Conduct session", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Marketing campaign",
    description: "Plan and execute the new marketing campaign",
    body: "Develop strategy, create content, and launch campaign.",
    todoList: [
      { title: "Develop strategy", isComplete: false },
      { title: "Create content", isComplete: false },
      { title: "Launch campaign", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Product launch event",
    description: "Organize the product launch event",
    body: "Plan the event, invite guests, and prepare materials.",
    todoList: [
      { title: "Plan event", isComplete: false },
      { title: "Invite guests", isComplete: false },
      { title: "Prepare materials", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Social media updates",
    description: "Update the company's social media profiles",
    body: "Post updates, engage with followers, and monitor activity.",
    todoList: [
      { title: "Post updates", isComplete: false },
      { title: "Engage with followers", isComplete: false },
      { title: "Monitor activity", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Develop new feature",
    description: "Work on the development of a new feature",
    body: "Design, code, and test the new feature.",
    todoList: [
      { title: "Design feature", isComplete: false },
      { title: "Code feature", isComplete: false },
      { title: "Test feature", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Bug fixing",
    description: "Fix bugs reported by users",
    body: "Identify, replicate, and fix the reported bugs.",
    todoList: [
      { title: "Identify bugs", isComplete: false },
      { title: "Replicate bugs", isComplete: false },
      { title: "Fix bugs", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "Database optimization",
    description: "Optimize the database for better performance",
    body: "Analyze queries, create indexes, and optimize schema.",
    todoList: [
      { title: "Analyze queries", isComplete: false },
      { title: "Create indexes", isComplete: false },
      { title: "Optimize schema", isComplete: false },
    ],
    isPinned: false,
  },
  {
    title: "API documentation",
    description: "Write documentation for the new API",
    body: "Document endpoints, parameters, and usage examples.",
    todoList: [
      { title: "Document endpoints", isComplete: false },
      { title: "Document parameters", isComplete: false },
      { title: "Write usage examples", isComplete: false },
    ],
    isPinned: true,
  },
  {
    title: "Performance testing",
    description: "Conduct performance testing on the application",
    body: "Set up tests, run tests, and analyze results.",
    todoList: [
      { title: "Set up tests", isComplete: false },
      { title: "Run tests", isComplete: false },
      { title: "Analyze results", isComplete: false },
    ],
    isPinned: false,
  },
];

const users = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    password: "password123",
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    password: "password456",
  },
  {
    username: "omar_sidi",
    email: "omar.sidi10@gmail.com",
    password: "password789",
  },
];

async function seedDB() {
  try {
    await connectDB(); // Connect to the database
    await Task.deleteMany({});
    await User.deleteMany({});

    // const createdUsers = await User.insertMany(users);
    const createdUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, SALT_ROUNDS); // Hash password
        const user = new User({ ...u, password: hashedPassword }); // Create new user object
        await user.save(); // Save user to database
        return user; // Return the saved user object
      })
    );

    // Assign each task a user
    const tasksWithUsers = tasks.map((task, index) => {
      return {
        ...task,
        user: createdUsers[index % createdUsers.length]._id,
      };
    });

    const createdTasks = await Task.insertMany(tasksWithUsers);

    // Update users with the products they are selling
    for (let task of createdTasks) {
      await User.findByIdAndUpdate(
        task.user,
        { $push: { tasks: task._id } },
        { new: true, useFindAndModify: false }
      );
    }

    console.log("Database seeded");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}

seedDB();
