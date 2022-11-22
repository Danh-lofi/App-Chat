import MessageModel from "../models/messageModel.js";

const MessageController = {
  addMessage: async (req, res) => {
    const {
      chatId,
      senderId,
      text,
      isImg,
      type,
      fileName,
      isFileWord,
      isFilePdf,
      isFilePowP,
      isFileExel,
    } = req.body;

    const message = new MessageModel({
      chatId,
      senderId,
      text,
      isImg,
      type,
      fileName,
      isFileWord,
      isFilePdf,
      isFilePowP,
      isFileExel,
    });
    try {
      const result = await message.save();
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getMessages: async (req, res) => {
    const { chatId } = req.params;
    console.log(chatId);
    try {
      const result = await MessageModel.find({ chatId });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default MessageController;
