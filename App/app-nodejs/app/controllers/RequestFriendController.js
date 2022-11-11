import RequestFriendModel from "../models/requestFriend.js";
import UserModel from "../models/User.js";
const RequestFriendController = {
  getListRequest: async (req, res, next) => {
    console.log("Get List Requets: ");

    const id = req.params.id;
    const listRequest = await RequestFriendModel.find({ receiverId: id });
    // List request

    // Chuyển đổi list requets thành user
    // Mảng chứa list id người gửi
    const listReceiverId = [];
    listRequest.forEach((request) => {
      console.log("request: " + request._id);
      listReceiverId.push({
        id: request.receiverId,
        idRequest: request._id.toString(),
      });
    });
    console.log("Array List Requets: ");

    console.log(listReceiverId);
    req.listIdUser = listReceiverId;

    next();
    // Gửi chuyển cho userController response cho client
  },
  acceptFriend: async (req, res) => {
    const idRequest = req.body.idRequest;
    console.log(idRequest);
    const listId = await RequestFriendModel.findOne({ _id: idRequest });
    console.log(listId);
    const senderId = listId.senderId;
    const receiverId = listId.receiverId;
    res.send(senderId + "+" + receiverId);
    try {
      const Result1 = await UserModel.findOneAndUpdate(
        { _id: senderId },
        { $push: { friends: { id: receiverId } } }
      );
      const Result2 = await UserModel.findOneAndUpdate(
        { _id: receiverId },
        { $push: { friends: { id: senderId } } }
      );
      await RequestFriendModel.deleteOne({ _id: idRequest });
    } catch (error) {
      console.log("loi");
    }
  },
  //tu choi ne
  declineFriend: async (req, res) => {
    const idRequest = req.body.idRequest;
    await RequestFriendModel.deleteOne({ _id: idRequest });
  },
  sendRequestFriend: async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    console.log("Send Request Friend: ");
    console.log(senderId);
    console.log(receiverId);
    console.log("End send");

    const request = new RequestFriendModel({ senderId, receiverId });
    try {
      const a = await request.save();
      send.status(200).send({ message: "success" });
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

export default RequestFriendController;
