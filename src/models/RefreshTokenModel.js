const mongoose = require("mongoose");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/test");
}

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  blacklisted: {
    type: Boolean,
    default: false,
  },
});

const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshTokenModel;
