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
    todoList: [
      { title: "Draft slides", isComplete: false, dueDate: "2023-07-10" },
      { title: "Review with team", isComplete: false, dueDate: "2023-07-12" },
      { title: "Finalize slides", isComplete: false, dueDate: "2023-07-14" },
    ],
    isPinned: true,
    assignedTo: "john_doe",
  },
  {
    title: "Weekly team meeting",
    description: "Organize and conduct the weekly team meeting",
    todoList: [
      { title: "Prepare agenda", isComplete: true, dueDate: "2023-07-01" },
      { title: "Send invites", isComplete: true, dueDate: "2023-07-01" },
      { title: "Record minutes", isComplete: false, dueDate: "2023-07-02" },
    ],
    isPinned: false,
    assignedTo: "jane_smith",
  },
  {
    title: "Code review",
    description: "Review the code submitted by the development team",
    todoList: [
      {
        title: "Review frontend code",
        isComplete: false,
        dueDate: "2023-07-05",
      },
      {
        title: "Review backend code",
        isComplete: false,
        dueDate: "2023-07-06",
      },
      { title: "Provide feedback", isComplete: false, dueDate: "2023-07-07" },
    ],
    isPinned: false,
    assignedTo: "omersidi",
  },
  {
    title: "Client follow-up",
    description: "Follow up with the client on the recent deliverables",
    todoList: [
      { title: "Draft email", isComplete: false, dueDate: "2023-07-08" },
      { title: "Send email", isComplete: false, dueDate: "2023-07-09" },
      { title: "Schedule call", isComplete: false, dueDate: "2023-07-10" },
    ],
    isPinned: true,
    assignedTo: "john_doe",
  },
  {
    title: "Update project documentation",
    description: "Ensure the project documentation is up to date",
    todoList: [
      {
        title: "Update project plan",
        isComplete: false,
        dueDate: "2023-07-15",
      },
      {
        title: "Update requirements",
        isComplete: false,
        dueDate: "2023-07-16",
      },
      {
        title: "Update technical docs",
        isComplete: false,
        dueDate: "2023-07-17",
      },
    ],
    isPinned: false,
    assignedTo: "jane_smith",
  },
  {
    title: "Prepare financial report",
    description: "Compile and prepare the monthly financial report",
    todoList: [
      {
        title: "Gather financial data",
        isComplete: false,
        dueDate: "2023-07-20",
      },
      { title: "Compile report", isComplete: false, dueDate: "2023-07-21" },
      {
        title: "Review with finance team",
        isComplete: false,
        dueDate: "2023-07-22",
      },
    ],
    isPinned: true,
    assignedTo: "omersidi",
  },
  {
    title: "Team training session",
    description: "Organize a training session for the new software tool",
    todoList: [
      {
        title: "Prepare training materials",
        isComplete: false,
        dueDate: "2023-07-23",
      },
      { title: "Schedule session", isComplete: false, dueDate: "2023-07-24" },
      { title: "Conduct session", isComplete: false, dueDate: "2023-07-25" },
    ],
    isPinned: false,
    assignedTo: "john_doe",
  },
  {
    title: "Marketing campaign",
    description: "Plan and execute the new marketing campaign",
    todoList: [
      { title: "Develop strategy", isComplete: false, dueDate: "2023-07-26" },
      { title: "Create content", isComplete: false, dueDate: "2023-07-27" },
      { title: "Launch campaign", isComplete: false, dueDate: "2023-07-28" },
    ],
    isPinned: false,
    assignedTo: "jane_smith",
  },
  {
    title: "Product launch event",
    description: "Organize the product launch event",
    todoList: [
      { title: "Plan event", isComplete: false, dueDate: "2023-07-29" },
      { title: "Invite guests", isComplete: false, dueDate: "2023-07-30" },
      { title: "Prepare materials", isComplete: false, dueDate: "2023-07-31" },
    ],
    isPinned: true,
    assignedTo: "omersidi",
  },
  {
    title: "Social media updates",
    description: "Update the company's social media profiles",
    todoList: [
      { title: "Post updates", isComplete: false, dueDate: "2023-08-01" },
      {
        title: "Engage with followers",
        isComplete: false,
        dueDate: "2023-08-02",
      },
      { title: "Monitor activity", isComplete: false, dueDate: "2023-08-03" },
    ],
    isPinned: false,
    assignedTo: "john_doe",
  },
  {
    title: "Develop new feature",
    description: "Work on the development of a new feature",
    todoList: [
      { title: "Design feature", isComplete: false, dueDate: "2023-08-04" },
      { title: "Code feature", isComplete: false, dueDate: "2023-08-05" },
      { title: "Test feature", isComplete: false, dueDate: "2023-08-06" },
    ],
    isPinned: true,
    assignedTo: "jane_smith",
  },
  {
    title: "Bug fixing",
    description: "Fix bugs reported by users",
    todoList: [
      { title: "Identify bugs", isComplete: false, dueDate: "2023-08-07" },
      { title: "Replicate bugs", isComplete: false, dueDate: "2023-08-08" },
      { title: "Fix bugs", isComplete: false, dueDate: "2023-08-09" },
    ],
    isPinned: false,
    assignedTo: "omersidi",
  },
  {
    title: "Database optimization",
    description: "Optimize the database for better performance",
    todoList: [
      { title: "Analyze queries", isComplete: false, dueDate: "2023-08-10" },
      { title: "Create indexes", isComplete: false, dueDate: "2023-08-11" },
      { title: "Optimize schema", isComplete: false, dueDate: "2023-08-12" },
    ],
    isPinned: false,
    assignedTo: "john_doe",
  },
  {
    title: "API documentation",
    description: "Write documentation for the new API",
    todoList: [
      { title: "Document endpoints", isComplete: false, dueDate: "2023-08-13" },
      {
        title: "Document parameters",
        isComplete: false,
        dueDate: "2023-08-14",
      },
      {
        title: "Write usage examples",
        isComplete: false,
        dueDate: "2023-08-15",
      },
    ],
    isPinned: true,
    assignedTo: "jane_smith",
  },
  {
    title: "Performance testing",
    description: "Conduct performance testing on the application",
    todoList: [
      { title: "Set up tests", isComplete: false, dueDate: "2023-08-16" },
      { title: "Run tests", isComplete: false, dueDate: "2023-08-17" },
      { title: "Analyze results", isComplete: false, dueDate: "2023-08-18" },
    ],
    isPinned: false,
    assignedTo: "omersidi",
  },
  {
    title: "Design new website layout",
    description: "Create a modern and responsive design for the new website",
    todoList: [
      {
        title: "Research design trends",
        isComplete: false,
        dueDate: "2023-07-11",
      },
      { title: "Create wireframes", isComplete: false, dueDate: "2023-07-13" },
      { title: "Develop prototypes", isComplete: false, dueDate: "2023-07-15" },
    ],
    isPinned: true,
    assignedTo: "michael_brown",
  },
  {
    title: "SEO optimization",
    description: "Improve website SEO to increase organic traffic",
    todoList: [
      { title: "Conduct SEO audit", isComplete: false, dueDate: "2023-07-17" },
      { title: "Optimize keywords", isComplete: false, dueDate: "2023-07-19" },
      { title: "Update meta tags", isComplete: false, dueDate: "2023-07-21" },
    ],
    isPinned: false,
    assignedTo: "linda_white",
  },
  {
    title: "User feedback analysis",
    description: "Analyze user feedback to improve the product",
    todoList: [
      { title: "Collect feedback", isComplete: false, dueDate: "2023-07-23" },
      { title: "Analyze data", isComplete: false, dueDate: "2023-07-25" },
      { title: "Implement changes", isComplete: false, dueDate: "2023-07-27" },
    ],
    isPinned: true,
    assignedTo: "sarah_jones",
  },
  {
    title: "Cloud migration",
    description: "Migrate the on-premise servers to the cloud",
    todoList: [
      { title: "Plan migration", isComplete: false, dueDate: "2023-07-29" },
      {
        title: "Setup cloud infrastructure",
        isComplete: false,
        dueDate: "2023-07-31",
      },
      { title: "Migrate data", isComplete: false, dueDate: "2023-08-02" },
    ],
    isPinned: false,
    assignedTo: "michael_brown",
  },
  {
    title: "Customer support training",
    description: "Train the support team on the new ticketing system",
    todoList: [
      {
        title: "Prepare training materials",
        isComplete: false,
        dueDate: "2023-08-04",
      },
      { title: "Conduct training", isComplete: false, dueDate: "2023-08-06" },
      {
        title: "Evaluate performance",
        isComplete: false,
        dueDate: "2023-08-08",
      },
    ],
    isPinned: true,
    assignedTo: "linda_white",
  },
  {
    title: "Content marketing strategy",
    description: "Develop a content marketing strategy for the next quarter",
    todoList: [
      { title: "Research topics", isComplete: false, dueDate: "2023-08-10" },
      {
        title: "Create content calendar",
        isComplete: false,
        dueDate: "2023-08-12",
      },
      { title: "Write blog posts", isComplete: false, dueDate: "2023-08-14" },
    ],
    isPinned: false,
    assignedTo: "sarah_jones",
  },
  {
    title: "Data security audit",
    description: "Conduct an audit to ensure data security compliance",
    todoList: [
      {
        title: "Review security policies",
        isComplete: false,
        dueDate: "2023-08-16",
      },
      {
        title: "Conduct vulnerability assessment",
        isComplete: false,
        dueDate: "2023-08-18",
      },
      {
        title: "Implement security measures",
        isComplete: false,
        dueDate: "2023-08-20",
      },
    ],
    isPinned: true,
    assignedTo: "omersidi",
  },
  {
    title: "Mobile app development",
    description: "Develop the mobile application for the product",
    todoList: [
      {
        title: "Define requirements",
        isComplete: false,
        dueDate: "2023-08-22",
      },
      { title: "Design UI/UX", isComplete: false, dueDate: "2023-08-24" },
      { title: "Develop app", isComplete: false, dueDate: "2023-08-26" },
    ],
    isPinned: false,
    assignedTo: "michael_brown",
  },
  {
    title: "Backend API development",
    description: "Develop the backend API for the new feature",
    todoList: [
      { title: "Design API", isComplete: false, dueDate: "2023-08-28" },
      { title: "Develop endpoints", isComplete: false, dueDate: "2023-08-30" },
      { title: "Test API", isComplete: false, dueDate: "2023-09-01" },
    ],
    isPinned: true,
    assignedTo: "linda_white",
  },
  {
    title: "Project retrospective",
    description: "Conduct a retrospective for the recently completed project",
    todoList: [
      { title: "Gather feedback", isComplete: false, dueDate: "2023-09-03" },
      { title: "Analyze outcomes", isComplete: false, dueDate: "2023-09-05" },
      {
        title: "Document lessons learned",
        isComplete: false,
        dueDate: "2023-09-07",
      },
    ],
    isPinned: false,
    assignedTo: "sarah_jones",
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
    username: "omersidi",
    email: "omar.sidi10@gmail.com",
    password: "1234",
  },
  {
    username: "michael_brown",
    email: "michael.brown@example.com",
    password: "password789",
  },
  {
    username: "linda_white",
    email: "linda.white@example.com",
    password: "password101",
  },
  {
    username: "sarah_jones",
    email: "sarah.jones@example.com",
    password: "password102",
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
