import React from "react";
import "./chatbox.scss";
const ChatBox = () => {
  let isTrue = true;
  return isTrue ? (
    <div className="chatbox">
      <div className="chatbox__container">
        <div className="chatbox__logo">
          <div className="chatbox__logo__background">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path d="M8.5,18l3.5,4l3.5-4H19c1.103,0,2-0.897,2-2V4c0-1.103-0.897-2-2-2H5C3.897,2,3,2.897,3,4v12c0,1.103,0.897,2,2,2H8.5z M7,7h10v2H7V7z M7,11h7v2H7V11z"></path>
            </svg>
          </div>
        </div>
        <div className="chatbox__slogan">
          <h3>Chào mừng bạn đã đến với Suar Chat</h3>
          <span>Thoải mái nhắn tin miễn phí với bạn bè</span>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ChatBox;
