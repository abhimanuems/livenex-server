import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import { Server } from "socket.io";
import { spawn } from "child_process";
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected!"));
import authRouter from "../src/routes/auth.js";
import service from "../src/routes/services.js";
import adminRouter from "../src/routes/admin.js";
import { verifyToken } from "../src/middileware/authmiddileware.js";
import {
  youtubeSettings,
  facebookSettings,
  inputSettings,
} from "../src/Controllers/ffmpeg.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "*",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", service);
app.use("/admin", adminRouter);


// const io = new Server(process.env.WSPORT || 3100, {
//   cors: {
//     origin: "*",
//   },
// });
// io.use(verifyToken);
// io.on("connection", (socket) => {
//   const rtmpUrlYoutube = socket.handshake.query.rtmpUrlYoutube;
//   const rtmpUrlfb = socket.handshake.query.rtmUrlFaceBook;
//   console.log("socket handshake ",socket.handshake.query);
//   const ffmpegInput = inputSettings.concat(
//     youtubeSettings(rtmpUrlYoutube),
//     facebookSettings(rtmpUrlfb)
//   );
//   const ffmpeg = spawn("ffmpeg", ffmpegInput);

//   ffmpeg.on("start", (command) => {
//     console.log("FFmpeg command:", command);
//   });

//   ffmpeg.on("close", (code, signal) => {
//     console.log(
//       "FFmpeg child process closed, code " + code + ", signal " + signal
//     );
//   });

//   ffmpeg.stdin.on("error", (e) => {
//     console.log("FFmpeg STDIN Error", e);
//   });

//   ffmpeg.stderr.on("data", (data) => {
//     console.log("FFmpeg STDERR:", data.toString());
//   });

//   socket.on("message", (msg) => {
//     ffmpeg.stdin.write(msg);
//   });

//   socket.conn.on("close", (e) => {
//     console.log("kill: SIGINT");
//     ffmpeg.kill("SIGINT");
//   });
// });


app.listen(process.env.PORTNUMBER, () =>
  console.log(`server started at ${process.env.PORTNUMBER}`)
);
