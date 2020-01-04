// API-DEMO page/component/message/message.js
Page({
  data: {
    title: "删除成功",
    subTitle: "订单已删除, 5秒后返回首页。",
    messageButton: {
      mainButton: {
        buttonText: "返回首页"
      },
      subButton: {
        buttonText: "历史记录"
      }
    },
    waitSec: 5,
    backEvent: () => my.redirectTo({
        url: "/pages/index/index"
      })
  },
  
  onLoad(e) {
    setTimeout(() => {
      this.data.backEvent()
    }, this.data.waitSec*1000)

    for(var i =0; i<this.data.waitSec;i++){
      const n=i;
      setTimeout(()=>{
        this.setData({
          subTitle: `订单已删除, ${this.data.waitSec-n}秒后返回首页。`
        });
      }, i*1000);
    }
  },

  backHome() {
    this.setData({
      backEvent: ()=>{}
    });
    my.redirectTo({
      url:
        "/pages/index/index", // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: res => { }
    });
  },
  gotoList() {
    this.setData({
      backEvent: ()=>{}
    });
    my.redirectTo({
      url:
        "/pages/orders/history/history", // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
      success: res => { }
    });
  }
});
