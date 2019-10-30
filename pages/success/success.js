// API-DEMO page/component/message/message.js
Page({
  data: {
    title: "下单成功",
    subTitle: "商品已加入订单列表，请等待管理员统一提交。",
    messageButton: {
      mainButton: {
        buttonText: "继续下单"
      },
      subButton: {
        buttonText: "返回列表"
      }
    },
    orderId: -1,
    shopId: -1
  },
  onLoad(e) {
    const orderId = parseInt(e.orderId);
    const shopId = parseInt(e.shopId);
    this.setData({
      orderId,
      shopId
    })
  },

  buyAgain() {
    my.redirectTo({
      url: '../new/new?shopId='+this.data.shopId+'&orderId='+this.data.orderId, // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: (res) => {
        
      },
    });
  },
  gotoList(){
    my.redirectTo({
      url: '../neworder/neworder?orderId='+this.data.orderId+'&random='+Math.random(), // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: (res) => {
        
      },
    });
  }
});