import { getApiStatus, unlockOrder } from "../../util/api_helper";
import { getShortcode, getRandomShortcode } from "../../util/shortcode";

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    title: "创建订单",
    orderId: undefined,
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
        orderId:
          getRandomShortcode()
      });
    }
  },

  tapCreateRandom(e) {
    if (e.detail.value === true && this.data.user.userId!=undefined) {
      let orderId =
        getRandomShortcode();
      this.setData({ orderId, enbleRandom: true, title:"创建订单" });
    } else {
      this.setData({ orderId: "", enbleRandom: false, title:"打开订单" });
    }
  },
  onOrderIdBlur(e) {
    const value = e.detail.value;
    if (value === undefined || value.length === 0) {
      this.setData({ orderId: "" });
      return;
    }
    this.setData({ orderId: value });
  },
  onSubmit(e) {
    this.setData({submitClicked: true});
    const value = e.detail.value.orderId;
    if(value !==undefined && value !== this.data.orderId)
    {
      my.redirectTo({
        url: "../orders/new/new?orderId=" + value
      });
      this.setData({submitClicked: false});
      return;
    }

    if (this.data.orderId > 0 || this.data.orderId.length > 0) {
      my.redirectTo({
        url: "../orders/new/new?orderId=" + this.data.orderId
      });
    }
    this.setData({submitClicked: false});
  },
  onReset() {
    this.setData({ orderId: "", enbleRandom: false });
  }
});
