const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel"); // Ensure User model is imported

// Function to send a message
const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed in request");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        // Create the new message
        let message = await Message.create(newMessage);
        
        // Populate the sender and chat fields
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name pic email",
        });

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });

        // Send the message back as the response
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

// Function to get all messages in a chat
const allMessages = expressAsyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate(
            "sender",
            "name pic email"
        );

        res.json(messages); // Send back the messages as a response
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { sendMessage, allMessages };
