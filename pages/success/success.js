// API-DEMO page/component/message/message.js
Page({
  data: {
    title: "添加成功",
    subTitle: "商品已加入订单列表，请等待管理员统一提交。",
    messageButton: {
      mainButton: {
        buttonText: "继续添加"
      },
      subButton: {
        buttonText: "查看订单"
      }
    },
    orderId: "",
    shopId: -1
  },
  onLoad(e) {
    const orderId = e.orderId;
    const shopId = parseInt(e.shopId);
    this.setData({
      orderId,
      shopId
    });
  },

  buyAgain() {
    my.redirectTo({
      url:
        "../product/add?shopId=" +
        this.data.shopId +
        "&orderId=" +
        this.data.orderId, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: res => {}
    });
  },
  gotoList() {
    my.redirectTo({
      url:
        "../neworder/neworder?orderId=" +
        this.data.orderId +
        "&random=" +
        Math.random(), // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: res => {}
    });
  }
});
