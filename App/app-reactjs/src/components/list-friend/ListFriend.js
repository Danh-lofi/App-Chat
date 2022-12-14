import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import friendApi from "../../api/friendApi";
import { userActions } from "../../store/userSlice";
import UserChat from "../userchat/UserChat";

const ListFriend = (props) => {
  const { user, activeChatFavou, onChangeActiveChat } = props;
  // State
  const [listFriend, setListFriend] = useState([]);

  //
  // Token
  const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;

  // Redux
  const dispatch = useDispatch();
  const userAccept = useSelector((state) => state.friend.userAccept);
  //

  // Event
  const changeActiveFriendHandle = (index) => {
    onChangeActiveChat(index);
    const friendActive = listFriend.find((friend) => friend._id === index);
    dispatch(userActions.setFriend(friendActive));
  };

  useEffect(() => {
    props.changeLoading();
    const getListFriends = async () => {
      const data = await friendApi.getFriend(accessToken);
      props.changeLoading();
      setListFriend(data.data.listFriend);
    };
    getListFriends();
    props.changeLoading();
  }, []);

  // Set lại list khi có user chấp nhận lời mời kết bạn
  useEffect(() => {
    console.log(userAccept);
    setListFriend((friends) => [...friends, userAccept]);
  }, [userAccept]);

  // Render list
  const List = listFriend.map((friend, index) => {
    return (
      <div
        key={index}
        className={`divIndex ${
          friend._id === activeChatFavou ? "active_userChat" : ""
        }`}
        onClick={() => changeActiveFriendHandle(friend._id)}
      >
        <UserChat
          isOnline
          linkImage={friend.avatar}
          nameImage={friend.name ? friend.name : friend.username}
        />
      </div>
    );
  });

  return <div>{List}</div>;
};

export default ListFriend;
