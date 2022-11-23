import axiosClient from "./axiosClient";

const groupApi = {
  getGroups: (accessToken) => {
    const url = `/groupChat/getAllGroup`;
    return axiosClient
      .get(url, {
        headers: {
          x_authorization: accessToken,
        },
      })
      .then((response) => {
        return response;
      });
  },
  createGroup: (accessToken, data) => {
    const url = `/groupChat/createGroup`;
    return axiosClient.post(
      url,
      {
        nameGroupChat: data.name,
        memberChat: data.members,
        data: data.avatar,
        type: data.type,
        fileName: data.fileName,
      },
      {
        headers: {
          x_authorization: accessToken,
        },
      }
    );
  },
  deleteMemberFromGroup: (idGroup, idUserDeleted) => {
    const url = `/groupChat/deleteUserFromGroupChat`;
    return axiosClient.put(url, {
      _id: idGroup,
      idUserDeleted,
    });
  },
};

export default groupApi;
