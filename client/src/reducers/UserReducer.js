const initialState = {
  userInfo: undefined
};
const reducer = (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case "LOG_IN":
      newState.userInfo = action.userInfo;
      break;
    case "LOG_OUT":
      newState.userInfo = undefined;
      break;
    case "FIREBASE_TOKEN":
      newState.firebaseToken = action.firebaseToken;
      break;
  }

  return newState;
};
export default reducer;
