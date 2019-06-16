import Axios from "axios";
//const path = "http://localhost:3000/api/";
const path = "https://overflow-lirten-hub.herokuapp.com/api/";
export const get = urlInput => {
  let url = path + urlInput;
  return Axios.get(url, {
    headers: { Authorization: localStorage.getItem("jwtToken") }
  }).then(response => {
    console.log(response);
    return response.data.data;
  });
};

const postData = (url = ``, data = {}) => {
  return Axios({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("jwtToken")
    }
  });
};

export const post = (urlInput, req) => {
  let url = path + urlInput;
  return postData(url, req);
};

export const put = (urlInput, req) => {
  let url = path + urlInput;
  return putData(url, req);
};
const putData = (url = ``, data = {}) => {
  return Axios({
    method: "put",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("jwtToken")
    }
  });
};
export const del = (urlInput, req) => {
  const url = path + urlInput;
  return deleteData(url, req);
};
const deleteData = (url = ``, data = {}) => {
  return Axios({
    method: "delete",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("jwtToken")
    }
  });
};
