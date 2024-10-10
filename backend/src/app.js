const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*", credentials: true }));

// // Serve static files from the dist directory
// app.use(express.static(path.join(__dirname, "dist")));

// // For SPA, serve index.html for unmatched routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

app.use(express.json({ limit: "900mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
const userRouter = require("./routes/user.routes.js");
const videoRouter = require("./routes/video.routes.js");
const tweetRouter = require("./routes/tweet.routes.js");
const commentRouter = require("./routes/comment.routes.js");
const likeRouter = require("./routes/like.routes.js");
const subscriptionRouter = require("./routes/subscription.routes.js");
const playlistRouter = require("./routes/playlist.routes.js");
const dashboardRouter = require("./routes/dashboard.routes.js");
const healthcheckRouter = require("./routes/healthcheck.routes.js");

const testRouter = require("./routes/test.routes.js");

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use("/api/v1/test", testRouter);

module.exports = app;
