// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
  },
   onLoad() {
     app.getUserInfo().then(
      user => {
        this.setData({
          user,
        });
        console.log(user)
      },
      () => {
        // 获取用户信息失败
      }
    );
  },
  onSubmit(e) {
    const value=e.detail.value;
    /*my.alert({
      content: `数据：${JSON.stringify(e.detail.value)}`,
    });*/
    console.log(`数据：${JSON.stringify(value)}`);
    my.navigateTo( {url: '../neworder/neworder?orderId='+value.orderId,});
  },
  onReset() {
  }
});