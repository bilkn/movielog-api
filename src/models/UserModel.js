const mongoose = require("mongoose");
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/test");
}

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
