import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faTrash,
  faUserGroup,
  faBan,
  faDownload,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { faKeycdn } from "@fortawesome/free-brands-svg-icons";
import "./ProfileGroup.scss";
import { useDispatch, useSelector } from "react-redux";
import { modalSliceAction } from "../../../store/modalSlice";
import groupApi from "../../../api/groupApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { groupAction } from "../../../store/groupSlice";
import { io } from "socket.io-client";

const ProfileGroup = (props) => {
  const { images, files } = props;

  // Socket
  const socket = useRef();
  socket.current = io("ws://localhost:3001");
  // socket.current = io("ws://app-chat-node.onrender.com/");

  //
  // State
  const [listMember, setListMember] = useState([]);
  const [totalMember, setTotalMember] = useState();
  const [newAdminGroup, setNewAdminGroup] = useState();
  //
  // Token
  const accessToken = JSON.parse(localStorage.getItem("user")).accessToken;
  //
  // Redux
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  let memberForStore = useSelector((state) => state.group.memberGroup);
  const groupInfo = useSelector((state) => state.group.group);

  // effect
  useEffect(() => {
    // if()
    setNewAdminGroup(groupInfo.adminGroup);
    setListMember(groupInfo.memberInfoChat);
    setTotalMember(groupInfo.memberInfoChat.length);
  }, [groupInfo.memberInfoChat]);
  //
  if (!groupInfo._id) return;
  //

  const {
    nameGroupChat,
    imgGroupChat,
    memberChat,
    memberInfoChat,
    adminGroup,
    _id,
  } = groupInfo;

  // Event
  const addMemberHandle = () => {
    // idGroupChat, listIdUserInGroup
    const action = {
      idGroupChat: _id,
      listIdUserInGroup: memberChat,
    };
    dispatch(modalSliceAction.setOpenAddFriendToGroup(action));
  };

  // X??a th??nh vi??n
  // Th??ng b??o
  const deleteFriendFromGroupHandle = (idUserDeleted) => {
    const confirm = {
      title: "X??a th??nh vi??n",
      content: "B???n ch???c ch???n x??a th??nh vi??n?",
      onConfirm: async () => {
        try {
          const data = await groupApi.deleteMemberFromGroup(_id, idUserDeleted);

          if (data.status === 200) {
            toast.success("X??a th??nh c??ng");
            // const listMemberNew = memberInfoChat.filter(
            //   (member) => member._id !== idUserDeleted
            // );

            const listMemberNew = listMember.filter(
              (member) => member._id !== idUserDeleted
            );
            // Set l???i th??nh vi??n
            setListMember(listMemberNew);
            // Set l???i s??? l?????ng
            setTotalMember(totalMember - 1);

            // Socket cho c??c user
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

  // R???i nh??m
  const leaveGroupHandle = () => {
    /* [INPUT]: AccessToken, groupId, newAdminId
      - N???u l?? admin hi???n b???ng danh s??ch nh?????ng quy???n admin
      - Kh??ng l?? admin hi???n modal x??c nh???n
      - Kh??ng nh?????ng quy???n gi???i t??n nh??m
    */
    const groupId = groupInfo._id;

    // L?? admin
    if (user._id === newAdminGroup) {
      dispatch(
        modalSliceAction.setOpenFranchiesAdmin({ isOpen: true, groupInfo })
      );
    }
    // Kh??ng l?? admin
    else {
      const confirmHanlde = () => {
        groupApi.leaveGroup(accessToken, groupId);
      };

      const title = "Tho??t nh??m";
      const content = "B???n ch???c ch???n tho??t nh??m";
      const isConfirm = true;

      const confirm = {
        title,
        content,
        onConfirm: confirmHanlde,
        isOpenConfirm: isConfirm,
      };
      dispatch(modalSliceAction.setOpenConfirm(confirm));
      // Render l???i list group
      dispatch(groupAction.setIdGroupDeleted(groupId));
    }
  };
  // Nh?????ng quy???n admin
  const franchiesAdminGroupHandle = (newAdminId) => {
    const groupId = groupInfo._id;
    const confirmHanlde = () => {
      groupApi.franchiesAdmin(groupId, newAdminId);
      setNewAdminGroup(newAdminId);
    };

    const title = "Chuy???n tr?????ng nh??m";
    const content = "B???n ch???c ch???n chuy???n nh??m";
    const isConfirm = true;

    const confirm = {
      title,
      content,
      onConfirm: confirmHanlde,
      isOpenConfirm: isConfirm,
    };
    dispatch(modalSliceAction.setOpenConfirm(confirm));
    // Render l???i list group
  };
  // Render
  // Danh s??ch th??nh vi??n
  const ListFriend = listMember.map((member) => {
    if (member._id === user._id) {
    }
    return (
      <div className="tag_member" key={member._id} id={member._id}>
        <div className="left_tag">
          <img src={member.avatar} alt="avatar"></img>
          <p className="name_member">{member.name}</p>
        </div>
        {member._id === newAdminGroup ? (
          <div class="tag_member__container">
            <FontAwesomeIcon
              title="Tr?????ng nh??m"
              className="icon tag_member__lead"
              icon={faKey}
            />
            <span> Tr?????ng nh??m</span>
          </div>
        ) : adminGroup === user._id ? (
          <div>
            <FontAwesomeIcon
              title="Nh?????ng tr?????ng nh??m"
              className="icon tag_member__franchies"
              icon={faKeycdn}
              onClick={() => franchiesAdminGroupHandle(member._id)}
            />
            <FontAwesomeIcon
              title="X??a kh???i nh??m"
              className="icon"
              icon={faTrash}
              onClick={() => deleteFriendFromGroupHandle(member._id)}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    );
  });
  return (
    <div className="profile_friend_container">
      <ToastContainer />
      <div className="profile_friend_container__header">
        <h2>Th??ng tin nh??m</h2>
      </div>
      <div className="infor">
        <div className="img_div">
          <div className="contain_img">
            <img className="avt_friend" src={imgGroupChat} alt={""}></img>
          </div>
        </div>
        <p className="friend_name">{nameGroupChat}</p>
        <div className="contain_btn">
          <div className="btn" onClick={leaveGroupHandle}>
            <FontAwesomeIcon className="icon" icon={faRightFromBracket} />
            <p>R???i nh??m</p>
          </div>
          <div className="btn" onClick={addMemberHandle}>
            <FontAwesomeIcon className="icon" icon={faUserGroup} />
            <p>Th??m th??nh vi??n</p>
          </div>
          <div className="btn">
            <FontAwesomeIcon className="icon" icon={faBan} />
            <p>Ch???n</p>
          </div>
        </div>
        <div className="contain_title_friend">
          <div className="contain_title_friend__member">
            <p>Th??nh vi??n nh??m</p>
            <span>{totalMember} th??nh vi??n</span>
          </div>
          <div className="contain_list_tag">{ListFriend}</div>
        </div>
        <div className="contain_media_friend">
          <p>Media</p>
          <div className="contain_media">
            {images
              ? images.map((image) => (
                  <div className="media" key={image._id}>
                    <img src={image.text} alt=""></img>
                  </div>
                ))
              : ""}
          </div>
          {/* <div className="contain_media">
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
          </div> */}
        </div>
        <div className="contain_files_friends">
          <p>File ???? g???i</p>
          {files
            ? files.map((file) => (
                <a href={file.text} className="file_contain" key={file._id}>
                  <div className="file">
                    <div className="file_infor">
                      <p className="file_name">
                        {file.fileName}.{file.type}
                      </p>
                      {/* <p className="size_name">1.50MB</p> */}
                    </div>
                    <div className="file_action">
                      <FontAwesomeIcon className="icon" icon={faDownload} />
                      <FontAwesomeIcon className="icon" icon={faTrash} />
                    </div>
                  </div>
                </a>
              ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default ProfileGroup;
