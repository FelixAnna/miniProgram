import { getApiStatus, unlockOrder } from "../../util/api_helper";
import { getShortcode, getRandomShortcode } from "../../util/shortcode";

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    title: "创建订单",
    enbleRandom: true,
    submitClicked: false
  },
  onLoad() {
    
  },

  onShow(){
    // 获取全局 app 实例
    const app = getApp();
    if (!app.userInfo) {
      my.redirectTo({
        url: "/pages/auth/auth"
      });
    } else {
      this.setData({
        user: app.userInfo,
      });
    }
  },

  tapCreateRandom(e) {
    if (e.detail.value === true ) {
      this.setData({ enbleRandom: true, title:"创建订单" });
    } else {
      this.setData({ enbleRandom: false, title:"打开订单" });
    }
  },
  onSubmit(e) {
    this.setData({submitClicked: true});
    const value = e.detail.value.orderId;
    if(this.data.enbleRandom)
    {
      my.redirectTo({
        url: "../orders/new/new"
      });
    }else{
      if (value === undefined || value.length === 0) {
        console.log("Invalid input");
      }else{
          my.redirectTo({
          url: "../orders/new/new?orderId=" + value
        });
      }
    }

    this.setData({submitClicked: false});
  }
});
