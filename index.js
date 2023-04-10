const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const path = require("path");
const cors = require("cors");
const PORT = process.env.PORT || 8800;
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.BASE_URL : ``;
// const BASE_URL = process.env.NODE_ENV === 'dev' ? process.env.BASE_URL : ``;
dotenv.config();


mongoose.connect(
  `${process.env.MONGO_URL}`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);


//cors
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
app.use(`${BASE_URL}/api/auth`, authRoute);
app.use(`${BASE_URL}/api/users`, userRoute);
app.use(`${BASE_URL}/api/posts`, postRoute);


app.get("/", (req, res) => {
  res.send("Welcome to Homepage");
})

app.get("/users", (req, res) => {
  res.send("Welcome to Future");
})

app.listen(PORT, () => {
  console.log("Backend server is running!");
});

