import axiosClient from "./axiosClient";

const friendApi = {
  getFriend: (accessToken) => {
    const url = `/friend`;
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
};

export default friendApi;