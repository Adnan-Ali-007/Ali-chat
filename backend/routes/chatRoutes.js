const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../controllers/chatContoller");

const router = express.Router();

router.route("/").post(protect, accessChat); //inside controllers wqorking on this
router.route("/").get(protect, fetchChats); //get chats
router.route("/group").post(protect, createGroupChat);//creation of group
router.route("/rename").put(protect, renameGroup);//renaming chat group
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);// add to group

module.exports = router;