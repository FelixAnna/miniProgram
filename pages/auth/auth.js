const app = getApp();

Page({
  data: {
    submitClicked: false
  },
  onLoad() {
  },
  onShow(){
    // 获取全局 app 实例
    const app2 = getApp();
    if (app2.userInfo) {
      my.redirectTo({
        url: "/pages/index/index"
      });
    }
  },
  onSubmit(e) {
      this.setData({submitClicked: true});
      app.getUserInfo().then(
        user => {
          console.log(user);
          my.navigateTo({
            url: "/pages/index/index"
          });
          this.setData({submitClicked: false});
          return;
        },
        () => {/*  */
          this.setData({submitClicked: false});
          console.log("取消授权！");
        }
      );
  },
});
