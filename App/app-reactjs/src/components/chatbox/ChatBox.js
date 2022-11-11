import React, { useRef, useState, useEffect } from "react";
import "./chatbox.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faContactBook,
  faLocation,
  faFileAudio,
  faSearch,
  faPhone,
  faVideo,
  faCircleInfo,
  faEllipsisVertical,
  faEllipsis,
  faPaperPlane,
  faMicrophone,
  faMicrophoneSlash,
  faLink,
  faCamera,
  faPhotoFilm,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFaceSmile,
  faTrashCan,
  faFolderOpen,
} from "@fortawesome/free-regular-svg-icons";

import ChatItem from "../chatitem/ChatItem";
import { UncontrolledTooltip } from "reactstrap";
import InputAuthen from "../../components/input/InputAuthen";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import InputEmoji from "react-input-emoji";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListChat from "../listchat/ListChat";
import { io } from "socket.io-client";
import chatApi from "../../api/chatApi";
import messageApi from "../../api/messageApi";
import ProfileFriend from "./profile-friend/ProfileFriend";
import NonChatBox from "./non-chat-box/NonChatBox";
import cloudinaryApi from "../../api/cloudinaryApi";

const ChatBox = () => {
  const fileRef = useRef();
  const imgRef = useRef();

  const socket = useRef();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")).user
  );
  const [accessToken, setAccessToken] = useState(
    JSON.parse(localStorage.getItem("user")).accessToken
  );

  const friend = useSelector((state) => state.user.friend);
  console.log(friend);

  const [chatId, setChatId] = useState();
  const [messages, setMessgages] = useState([]);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState(null);
  const [ariaExpanded, setAriaExpanded] = useState("");
  const [more, setMore] = useState(false);

  const clickMore = () => {
    if (more === false) {
      setMore(true);
    } else {
      setMore(false);
    }
  };

  function handleOnEnter(text) {
    sendMessageHandle();
  }

  // Handle Event
  const [isProfileFriend, setIsProfileFriend] = useState(false);

  // // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:3001");
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  // Get the message from socket server
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
      console.log(data);
      setMessgages((messages) => [...messages, data]);
    });
  }, [receivedMessage]);

  // Get room chat
  useEffect(() => {
    const getChats = async () => {
      try {
        // Là group thì không cần setChatId
        if (friend.memberChat) {
          return;
        }
        const chat = await chatApi.getChat(user._id, friend._id);
        setChatId(chat.data._id);
      } catch (error) {
        const chat = chatApi.createChat(user._id, friend._id);
      }
    };
    getChats();
    if (friend) setChatId(friend._id);
  }, [user, friend]);

  // get all messages from chat id
  useEffect(() => {
    const getAllMessages = async (chatId) => {
      if (!chatId) {
        setChatId(null);
        return;
      }
      const messagesData = await messageApi.getMessages(chatId);
      setMessgages(messagesData.data);
    };
    getAllMessages(chatId);
  }, [chatId]);

  //
  const changeHideProfileFriendHandle = () => {
    setIsProfileFriend(!isProfileFriend);
  };
  // Change Message

  // Send Message
  const sendMessageHandle = async () => {
    // console.log(message);
    const messageSender = {
      chatId,
      senderId: user._id,
      text: message,
    };
    const data = await messageApi.addMessage(messageSender);

    const date = new Date();
    const time = `${date.getHours()}:${
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
    }`;
    if (data.status === 200) {
      let members;
      if (friend.memberChat) {
        members = friend.memberChat.filter((member) => member.id !== user._id);
      }

      if (message !== null) {
        socket.current.emit("send-message", {
          chatId,
          senderId: user._id,
          text: message,
          receiverId: friend.memberChat ? members : friend._id,
          time,
        });
      }
      // console.log(messages);
      setMessgages((messages) => [...messages, { ...messageSender, time }]);
      setMessage("");
    }
  };

  // Chagne file
  const changeFileHandle = async (e) => {
    const name = e.target.files[0].name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot);
    const type = name.substring(lastDot + 1);

    const isImg =
      type == "png" || type == "jpg" || type == "PNG" || type == "JPG"
        ? true
        : false;
    const isFileWord = type == "docx" ? true : false;
    const isFilePdf = type == "pdf" ? true : false;
    const isFilePowP = type == "pptx" ? true : false;
    const isFileExel =
      type == "xlsx" || type == "csv" || type == "xls" ? true : false;
    const messageSender = {
      chatId,
      senderId: user._id,
      text: message,
      isImg,
      isFileWord,
      isFilePdf,
      type,
      isFilePowP,
      isFileExel,
      fileName,
    };
    setMore(false);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onloadend = async () => {
      const data = await cloudinaryApi.cloudinaryUpload(
        reader.result,
        accessToken,
        chatId,
        type,
        fileName,
        isFileWord,
        isFilePdf,
        isFilePowP,
        isFileExel
      );
      console.log(data);

      const date = new Date();
      const time = `${date.getHours()}:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
      if (data.status === 200) {
        let members;
        if (friend.memberChat) {
          members = friend.memberChat.filter(
            (member) => member.id !== user._id
          );
        }

        socket.current.emit("send-message", {
          chatId,
          senderId: user._id,
          text: data.data.result.text,
          receiverId: friend.memberChat ? members : friend._id,
          isFileWord,
          isImg,
          type,
          isFilePdf,
          isFilePowP,
          isFileExel,
          time,
          fileName,
        });
      }
      // console.log(messages);
      setMessgages((messages) => [
        ...messages,
        { ...messageSender, time, text: data.data.result.text },
      ]);
      setMessage("");
    };
  };

  const changeImgHandle = (e) => {
    const name = e.target.files[0].name;
    const lastDot = name.lastIndexOf(".");

    const fileName = name.substring(0, lastDot);
    const type = name.substring(lastDot + 1).toLowerCase();
    const isImg =
      type == "png" || type == "jpg" || type == "JPG" || type == "PNG"
        ? true
        : false;
    const isFile =
      type == "docx" || type == "ptxx" || type == "pdf" ? true : false;
    const messageSender = {
      chatId,
      senderId: user._id,
      text: message,
      isImg,
      isFile,
    };
    setMore(false);
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onloadend = async () => {
      const data = await cloudinaryApi.cloudinaryUpload(
        reader.result,
        accessToken,
        chatId,
        type,
        fileName
      );

      const date = new Date();
      const time = `${date.getHours()}:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
      if (data.status === 200) {
        socket.current.emit("send-message", {
          chatId,
          senderId: user._id,
          text: data.data.result.text,
          receiverId: friend._id,
          isImg,
          isFile,
          time,
        });
      }
      console.log(fileName);
      setMessgages((messages) => [
        ...messages,
        { ...messageSender, time, text: data.data.result.text },
      ]);
      setMessage("");
    };
  };
  return (
    <div className="chatBox__container">
      {chatId ? (
        <div className={`chatBox ${!isProfileFriend ? "full" : ""}`}>
          <div className="chatBox_heading">
            <div className="chatBox_heading_left">
              <div className="chatBox_heading_left_headingImage">
                <img
                  className="chatBox_heading_left_headingImage_avt_heading"
                  src={
                    user.avatar
                      ? user.avatar
                      : "https://placeimg.com/640/480/any"
                  }
                  alt="avt"
                />
                <span className="chatBox_heading_left_headingImage_status"></span>
              </div>
              <div className="chatBox_heading_left_heading_name">
                <h3 className="chatBox_heading_left_heading_name_name">
                  {user.name ? user.name : user.username}
                </h3>
                <p className="chatBox_heading_left_heading_name_active">
                  Active
                </p>
              </div>
            </div>

            <div className="chatBox_heading_right">
              <Tippy
                content={
                  <input
                    placeholder="Nhập để tìm kiếm trong tin nhắn..."
                    className="chatBox_heading_right_searchInput"
                  ></input>
                }
                placement="bottom"
                animation="fade"
                arrow={false}
                hideOnClick="toggle"
                theme="light-border"
                trigger="click"
                appendTo="parent"
              >
                <FontAwesomeIcon className="icon_fa" icon={faSearch} />
              </Tippy>
              <FontAwesomeIcon className="icon_fa" icon={faPhone} />
              <FontAwesomeIcon className="icon_fa" icon={faVideo} />
              <FontAwesomeIcon
                className="icon_fa"
                icon={faCircleInfo}
                onClick={changeHideProfileFriendHandle}
              />
              <Tippy
                content={
                  <div className="option_Chat">
                    <a href="" className="more_option">
                      <p>Archive</p>
                      <FontAwesomeIcon
                        className="optionMore_icon"
                        icon={faFolderOpen}
                      />
                    </a>
                    <a href="" className="more_option">
                      <p>Muted</p>
                      <FontAwesomeIcon
                        href="https://www.facebook.com/"
                        className="optionMore_icon"
                        icon={faMicrophoneSlash}
                      />
                    </a>
                    <a href="https://www.youtube.com/" className="more_option">
                      <p>Delete</p>
                      <FontAwesomeIcon
                        className="optionMore_icon"
                        icon={faTrashCan}
                      />
                    </a>
                  </div>
                }
                placement="bottom"
                animation="fade"
                arrow={false}
                theme="light-border"
                trigger="click"
                appendTo="parent"
                onMount={() => setAriaExpanded("true")}
                onHide={() => setAriaExpanded("false")}
              >
                <FontAwesomeIcon
                  aria-haspopup="true"
                  aria-exponent={ariaExpanded}
                  className="icon_fa"
                  icon={faEllipsisVertical}
                />
              </Tippy>
            </div>
          </div>

          <div className="chatBox_content">
            {friend ? (
              <ListChat
                messages={messages}
                currentUser={user}
                friendUser={friend}
              />
            ) : (
              <></>
            )}
          </div>

          <div className="chatBox_footer">
            <FontAwesomeIcon
              className="icon_fa"
              onClick={clickMore}
              icon={faEllipsis}
            />
            <FontAwesomeIcon className="icon_fa" icon={faMicrophone} />
            <div className="chatBox_footer_sender">
              <InputEmoji
                value={message}
                onChange={setMessage}
                cleanOnEnter
                theme="light"
                onEnter={handleOnEnter}
                placeholder="Nhập tin nhắn của bạn..."
              />
            </div>
            <FontAwesomeIcon
              className="icon_fa chatBox_footer_send"
              icon={faPaperPlane}
              onClick={sendMessageHandle}
            />
          </div>

          <div
            className={`chatBox_modal ${more === true ? "activeModal" : " "}`}
          >
            <div className="chatBox_modal_more">
              <div className="chatBox__modal__container">
                <div className="chatBox__modal__hidden">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    ref={fileRef}
                    onChange={changeFileHandle}
                  />
                </div>
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faLink}
                  onClick={() => {
                    fileRef.current.click();
                  }}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">
                  attached
                </p>
              </div>
              <div className="chatBox__modal__container">
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faCamera}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">
                  camera
                </p>
              </div>
              <div
                className="chatBox__modal__container"
                onClick={() => {
                  imgRef.current.click();
                }}
              >
                <div className="chatBox__modal__hidden">
                  <input
                    style={{ display: "none" }}
                    type="file"
                    ref={imgRef}
                    onChange={changeImgHandle}
                  />
                </div>
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faPhotoFilm}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">
                  gallery
                </p>
              </div>
              <div>
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faFileAudio}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">audio</p>
              </div>
              <div className="chatBox__modal__container">
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faLocation}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">
                  location
                </p>
              </div>
              <div className="chatBox__modal__container">
                <FontAwesomeIcon
                  className="chatBox_modal_more_icon_fa__second"
                  icon={faContactBook}
                />
                <p className="chatBox_modal_more_name_icon_fa__second">
                  contact
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NonChatBox />
      )}
      <div className={`profile-friend ${!isProfileFriend ? "not-active" : ""}`}>
        <ProfileFriend />
      </div>
    </div>
  );
};

export default ChatBox;
