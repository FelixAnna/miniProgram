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
          const tokenInfo=my.getStorageSync({
            key: 'tokenInfo', // 缓存数据的key
          }).data;

          if(tokenInfo===null) {
            login(authcode.authCode).then(data=>{
              my.setStorageSync({
                key: "tokenInfo",
                data: data, // 要缓存的数据
              });
            }).catch((res)=>{
              reject({});
            });
          }

          my.getAuthUserInfo({
            success: res => {
              this.userInfo = {...res, userId: tokenInfo.userId};

              //Update nickName & avatar when not match
              if(res.nickName !== tokenInfo.nickName || res.avatar !== tokenInfo.avatar ){
                updateUserInfo(res.nickName, res.avatar).then(res=> {
                  console.log("username & avatar updated.");
                }).catch(res=>{
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
