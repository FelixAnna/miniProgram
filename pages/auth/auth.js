const app = getApp();

Page({
  data: {
    submitClicked: false
  },
  onLoad() {
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
