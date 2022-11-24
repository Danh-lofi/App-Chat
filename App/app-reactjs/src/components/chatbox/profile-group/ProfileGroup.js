import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faTrash,
  faUserGroup,
  faBan,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import "./ProfileGroup.scss";
import { useDispatch, useSelector } from "react-redux";
import { modalSliceAction } from "../../../store/modalSlice";
import groupApi from "../../../api/groupApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { groupAction } from "../../../store/groupSlice";
import { io } from "socket.io-client";

const ProfileGroup = () => {
  // Socket
  const socket = useRef();
  socket.current = io("ws://localhost:3001");
  //
  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  let memberForStore = useSelector((state) => state.group.memberGroup);

  // set lại list không chứa bản thân
  // memberForStore = memberForStore.filter((member) => member._id !== user._id);
  // Tổng thành viên
  const [totalMember, setTotalMember] = useState(memberForStore.length);

  // State
  const [memberInfoChat, setMemberInfoChat] = useState(memberForStore);

  // Set lại effect List
  useEffect(() => {
    console.log("List mới sau khi xóa:");
    console.log(memberForStore);
    setMemberInfoChat(memberForStore);
    setTotalMember(memberForStore.length);
  }, [memberForStore]);
  //

  const groupInfo = useSelector((state) => state.user.group);
  if (!groupInfo) return;

  //
  const { nameGroupChat, imgGroupChat, memberChat, adminGroup, _id } =
    groupInfo;
  //

  // Event
  const addMemberHandle = () => {
    dispatch(modalSliceAction.setOpen(true));
  };

  // Xóa thành viên
  // Thông báo
  const deleteFriendFromGroupHandle = (idUserDeleted) => {
    const confirm = {
      title: "Xóa thành viên",
      content: "Bạn chắc chắn xóa thành viên?",
      onConfirm: async () => {
        try {
          const data = await groupApi.deleteMemberFromGroup(_id, idUserDeleted);
          console.log(data);
          if (data.status === 200) {
            toast.success("Xóa thành công");
            const listMemberNew = memberInfoChat.filter(
              (member) => member._id !== idUserDeleted
            );
            // Set lại thành viên
            setMemberInfoChat(listMemberNew);
            // Set lại số lượng
            setTotalMember(totalMember - 1);

            // Socket cho các user
            socket.current.emit("delete-member-group", {
              listMember: memberInfoChat,
              idUserDelete: idUserDeleted,
              idGroupDelete: _id,
              idHost: adminGroup,
            });
          }
        } catch (error) {}
      },
      isOpenConfirm: true,
    };
    dispatch(modalSliceAction.setOpenConfirm(confirm));
  };
  // Render

  // Danh sách thành viên
  const ListFriend = memberInfoChat.map((member) => {
    if (member._id === user._id) {
    }
    return (
      <div className="tag_member" key={member._id} id={member._id}>
        <div className="left_tag">
          <img src={member.avatar} alt="avatar"></img>
          <p className="name_member">{member.name}</p>
        </div>
        {member._id === adminGroup ? (
          <span> Trưởng nhóm</span>
        ) : adminGroup === user._id ? (
          <FontAwesomeIcon
            title="Xóa khỏi nhóm"
            className="icon"
            icon={faTrash}
            onClick={() => deleteFriendFromGroupHandle(member._id)}
          />
        ) : (
          ""
        )}
      </div>
    );
  });
  return (
    <div className="profile_friend_container">
      <ToastContainer />
      <div className="header">
        <h2>Thông tin nhóm</h2>
      </div>
      <div className="infor">
        <div className="img_div">
          <div className="contain_img">
            <img className="avt_friend" src={imgGroupChat} alt={""}></img>
          </div>
        </div>
        <p className="friend_name">{nameGroupChat}</p>
        <div className="contain_btn">
          <div className="btn">
            <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
            <p>Rời nhóm</p>
          </div>
          <div className="btn" onClick={addMemberHandle}>
            <FontAwesomeIcon className="icon" icon={faUserGroup} />
            <p>Thêm thành viên</p>
          </div>
          <div className="btn">
            <FontAwesomeIcon className="icon" icon={faBan} />
            <p>Chặn</p>
          </div>
        </div>
        <div className="contain_title_friend">
          <div className="contain_title_friend__member">
            <p>Thành viên nhóm</p>
            <span>{totalMember} thành viên</span>
          </div>
          <div className="contain_list_tag">{ListFriend}</div>
        </div>
        <div className="contain_media_friend">
          <p>Media</p>
          <div className="contain_media">
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
            <div className="media">
              <img src={imgGroupChat} alt=""></img>
            </div>
          </div>
        </div>
        <div className="contain_files_friends">
          <p>File đã gửi</p>
          <div className="file_contain">
            <div className="file">
              <div className="file_infor">
                <p className="file_name">tailieu.docs</p>
                <p className="size_name">1.50MB</p>
              </div>
              <div className="file_action">
                <FontAwesomeIcon className="icon" icon={faDownload} />
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </div>
            </div>
          </div>
          <div className="file_contain">
            <div className="file">
              <div className="file_infor">
                <p className="file_name">tailieu.docs</p>
                <p className="size_name">1.50MB</p>
              </div>
              <div className="file_action">
                <FontAwesomeIcon className="icon" icon={faDownload} />
                <FontAwesomeIcon className="icon" icon={faTrash} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileGroup;
