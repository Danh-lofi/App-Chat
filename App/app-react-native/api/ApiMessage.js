import { apiGet } from "./ApiManager";

export const messageApi = {
  addMessage: (message) => {
    const url = "messages";
    return apiGet.post(url, message);
  },
  getMessages: (chatId) => {
    const url = `messages/${chatId}`;
    return apiGet.get(url, {});
  },
};
