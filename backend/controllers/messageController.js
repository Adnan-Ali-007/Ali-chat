const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel"); // Ensure Chat model is imported

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
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

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
