const app = getApp();

Page({
  data: {
    submitClicked: false,
    page: "index",
    id: undefined
  },
  onLoad(e) {
    if(e.page){
      this.setData({
        page: e.page,
        id: e.id
      })
    }
  },
  onShow(){
    // 获取全局 app 实例
    const app2 = getApp();
    if (app2.userInfo) {
      my.redirectTo({
        url: this.getRedirectPage()
      });
    }
  },
  onSubmit(e) {
      this.setData({submitClicked: true});
      app.getUserInfo().then(
        user => {
          console.log(user);
          my.redirectTo({
            url: this.getRedirectPage()
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
  getRedirectPage(){
    if(this.data.page === "order")
    {
      return "/pages/orders/new/new?orderId="+this.data.id
    }else if(this.data.page === "history"){
      return "/pages/orders/history/history"
    }else{
      return "/pages/index/index"
    }
  }
});
