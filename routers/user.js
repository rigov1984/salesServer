const express = require("express");
const UserController = require("../controllers/user");
//middelware
const multipart = require("connect-multiparty");

const md_auth = require("../middlewares/authenticated");
const md_upload_Avatar = multipart({ uploadDir: "./uploads/avatar" })

const api = express.Router();

api.post("/sign-up", UserController.signUp);
api.post("/sign-in", UserController.signIn);
api.get("/users", [md_auth.ensureAuth], UserController.getUsers);//le estamos pasando el midelware que indica que esta url es solo para usuarios registrados
api.get("/users-active", [md_auth.ensureAuth], UserController.getUsersActive);
api.put("/upload-avatar/:id", [md_auth.ensureAuth, md_upload_Avatar], UserController.uploadAvatar);//tiene 2 middleware
api.get("/get-avatar/:avatarName", UserController.getAvatar);
api.put("/update-user/:id", [md_auth.ensureAuth], UserController.updateUser);
api.put("/activate-user/:id", [md_auth.ensureAuth], UserController.activateUser);
api.delete("/delete-user/:id", [md_auth.ensureAuth], UserController.deleteUser);
api.post("/sign-up-admin", [md_auth.ensureAuth], UserController.signUpAdmin);

module.exports = api;
