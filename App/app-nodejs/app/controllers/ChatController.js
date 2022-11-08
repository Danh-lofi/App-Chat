import ChatModel from "../models/chatModel.js";

const ChatController = {
  // POST
  createChat: async (req, res) => {
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // GET /chat
  userChats: async (req, res) => {
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  findChat: async (req, res) => {
    console.log(req.params);
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.senderId, req.params.recieverId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default ChatController;
