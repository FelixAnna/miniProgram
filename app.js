import { login, updateUserInfo } from "./util/api_helper";
import moment from "moment";

App({
  userInfo: null,

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) {
        return resolve(this.userInfo);
      }

      my.getAuthCode({
        scopes: ['auth_base'],
        success: authcode => {
          console.info(authcode);

          /*******Ensure userInfo got***** */
          let tokenInfo = my.getStorageSync({
            key: "botoken"
          }).data;
          if(tokenInfo ==!null && moment(tokenInfo.expiresIn).isBefore(moment().utc())){
            console.log(tokenInfo.expiresIn);
            tokenInfo =null;
          }

          if(tokenInfo === null){
            login(authcode.authCode)
              .then(data => {
                my.setStorageSync({
                  key: "botoken",
                  data: data
                });
                this.updateUser(data)
                  .then(()=>{
                    return resolve(this.userInfo)
                  })
                  .catch(res=> reject({}));
              })
              .catch(res => {
                reject({});
              });
          }else{
            this.updateUser(tokenInfo)
                .then(()=>{
                return resolve(this.userInfo);
                })
                .catch(res=> reject({}));
          }
        },
        fail: () => {
          reject({});
        }
      });
    });
  },
  updateUser(tokenInfo) {
    return new Promise((resolve, reject) => {
          //Get user info and update db
          my.getOpenUserInfo({
            success: res => {
              console.info(res);
              const response=JSON.parse(res.response).response;
              this.userInfo = { ...response, userId: tokenInfo.userId };
              if (
                this.userInfo.avatar!=undefined &&
                this.userInfo.nickName!=undefined &&
                (
                  this.userInfo.nickName !== tokenInfo.nickName ||
                  this.userInfo.avatar !== tokenInfo.avatar
                )
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
