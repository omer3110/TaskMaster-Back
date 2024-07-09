const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

async function main() {
  // Connect to database
  await connectDB();

  // MIDDLEWARES
  // parse json body in request (for POST, PUT, PATCH requests)
  app.use(express.json());
  app.use(express.static("public"));

  // allow CORS for local development (for production, you should configure it properly)
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

  //ROUTES
  const taskRoutes = require("./routes/tasks.route");
  app.use("/api/task", taskRoutes);

  const authRoutes = require("./routes/auth.route");
  app.use("/api/auth", authRoutes);

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });

  //START SERVER
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

main();
