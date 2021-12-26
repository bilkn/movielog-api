require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MovieRouter, AuthRouter } = require("./routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.get("/", (req, res) => {
  res.status(200).send({ success: true, message: "Succesful!" });
});

app.use("/api", AuthRouter);
app.use("/api", MovieRouter);
