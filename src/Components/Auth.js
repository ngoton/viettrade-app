import { AsyncStorage,Alert } from "react-native";

export const USER_KEY = "userid_logined";

export const onSignOut = () => AsyncStorage.clear();

export const getDataStorage = (key) => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key)
      .then(res => {
        resolve(res);
      })
      .catch(err => reject(err));
  });
};

export const isSignedIn = () => {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(USER_KEY)
      .then(id => {
        if (id !== null) {
          const url = `https://viet-trade.org/api/checklockuser/?id=${id}`;
          fetch(url)
            .then(res => res.json())
            .then(res => {
              if (res.data.user_lock==1) {
                resolve(false);
              }
              else{
                AsyncStorage.setItem('role_logined', res.data.role);
                resolve(true);
              }
            })
          
        } else {
          resolve(false);
        }
      })
      .catch(err => reject(err));
  });
};

