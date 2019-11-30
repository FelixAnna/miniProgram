import {login, updateUserInfo} from './util/api_helper';
App({
  userInfo: null,

  getUserInfo() {
    return new Promise((resolve, reject) => {
      if (this.userInfo) resolve(this.userInfo);

      my.getAuthCode({
        scopes: ['auth_user'],
        success: authcode => {
          console.info(authcode);
         
          /*******Ensure userInfo got***** */
          const tokenInfo=my.getStorageSync({
            key: 'tokenInfo', 
          }).data;

          login(authcode.authCode).then(data=>{
            my.setStorageSync({
              key: "tokenInfo",
              data: data,
            });
          }).catch((res)=>{
            reject({});
          });
          
          my.getAuthUserInfo({
            success: res => {
              this.userInfo = {...res, userId: tokenInfo.userId};
               if(this.userInfo.nickName !== tokenInfo.nickName || this.userInfo.avatar !== tokenInfo.avatar ){
                updateUserInfo(this.userInfo.nickName, this.userInfo.avatar).then(res=> {
                  console.log("username & avatar updated.");
                }).catch(error=>{
                  console.log(error);
                });
              }
              resolve(this.userInfo);
            },
            fail: () => {
              reject({});
            },
          });
        },
        fail: () => {
          reject({});
        },
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
    console.log('app hide');
  },
  onError(error) {
    // 小程序执行出错时
    console.log(error);
  },
});
