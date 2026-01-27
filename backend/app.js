import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
// Path verified: using your "error.js" file
import { errorMiddleware } from "./middlewares/error.js"; 
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();

// Load config
config({ path: "./config/config.env" });

// FINAL CORS HANDSHAKE - No more checking needed
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile/curl)
      if (!origin) return callback(null, true);
      
      // Trust ANY Vercel link or local testing
      if (origin.includes(".vercel.app") || origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Database Connection
dbConnection();

// Error Middleware (This is correctly placed at the end)
app.use(errorMiddleware);

export default app;