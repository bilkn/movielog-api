require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MovieRouter } = require("./routes");

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
app.use("/api", MovieRouter);
