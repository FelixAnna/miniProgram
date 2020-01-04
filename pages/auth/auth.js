const app = getApp();

Page({
  data: {},
  onLoad() {
  },
  onSubmit(e) {
      app.getUserInfo().then(
        user => {
          console.log(user);
          my.navigateTo({
            url: "/pages/index/index"
          });
          return;
        },
        () => {/*  */
          console.log("取消授权！");
        }
      );
  },
});
