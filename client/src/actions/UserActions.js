const logIn = "LOG_IN";
const logOut = "LOG_OUT";
const firebaseToken = "FIREBASE_TOKEN";

export const AC_logIn = userInfo => ({
  type: logIn,
  userInfo
});

export const AC_logOut = () => ({
  type: logOut
});
export const AC_set_firebaseToken = firebaseToken => ({
  type: firebaseToken,
  firebaseToken
});
