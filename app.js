import { login, updateUserInfo } from "./util/api_helper";
import moment from "moment";

App({
  userInfo: null,

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ["auth_user"],
        success: authcode => {
          console.info(authcode);

          /*******Ensure userInfo got***** */
          let tokenInfo = my.getStorageSync({
            key: "tokenInfo"
          }).data;
          if(tokenInfo ==!null && moment(tokenInfo.expiresIn).isBefore(moment().utc())){
            console.log(tokenInfo.expiresIn);
            tokenInfo =null;
          }

          if(tokenInfo === null){
            login(authcode.authCode)
              .then(data => {
                my.setStorageSync({
                  key: "tokenInfo",
                  data: data
                });

                tokenInfo = data;

                my.getAuthUserInfo({
                  success: res => {
                    console.info(res);
                    this.userInfo = { ...res, userId: tokenInfo.userId };
                    if (
                      this.userInfo.nickName !== tokenInfo.nickName ||
                      this.userInfo.avatar !== tokenInfo.avatar
                    ) {
                      updateUserInfo(this.userInfo.nickName, this.userInfo.avatar)
                        .then(res => {
                          console.log("username & avatar updated.");
                        })
                        .catch(error => {
                          console.log(error);
                        });
                    }
                    resolve(this.userInfo);
                  },
                  fail: () => {
                    reject({});
                  }
                });
              })
              .catch(res => {
                reject({});
              });
          } else {
            resolve(tokenInfo);
          }
        },
        fail: () => {
          reject({});
        }
      });
    });
  },
  onLaunch(options) {
    // 第一次打开
    console.log(options.query);
    // {number:1}
    console.log(options.path);
  },
  onShow(options) {
    // 第一次打开
    console.log(options.query);
    // {number:1}
    console.log(options.path);
    // x/y/z
  },
  onHide() {
    // 进入后台时
    console.log("app hide");
  },
  onError(error) {
    // 小程序执行出错时
    console.log(error);
  }
});
