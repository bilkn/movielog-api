require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { MovieRouter, UserRouter } = require("./routes");

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  // TODO: CHANGE THE LIMIT!
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(limiter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send({ success: true, message: "Succesful!" });
});

app.use("/api/user", UserRouter);
app.use("/api", MovieRouter);
