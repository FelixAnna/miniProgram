import { getApiStatus, unlockOrder } from "../../util/api_helper";
import { getShortcode, getRandomShortcode } from "../../util/shortcode";
// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    title: "创建订单",
    orderId: undefined,
    enbleRandom: true
  },
  onLoad() {
    if (!app.userInfo) {
      app.getUserInfo().then(
        user => {
          this.setData({
            user,
            orderId: getShortcode(user.userId) + "@" + getRandomShortcode()
          });
          console.log(user);
        },
        () => {
          // 获取用户信息失败
        }
      );
    } else {
      this.setData({
        user: app.userInfo,
        orderId:
          getShortcode(app.userInfo.userId) + "@" + getRandomShortcode()
      });
    }
  },
  tapCreateRandom(e) {
    if (e.detail.value === true && this.data.user.userId!=undefined) {
      let orderId =
        getShortcode(this.data.user.userId) + "@" + getRandomShortcode();
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
    const value = e.detail.value.orderId;
    if(value !==undefined && value !== this.data.orderId)
    {
      my.navigateTo({
        url: "../orders/new/new?orderId=" + value
      });
      return;
    }

    if (this.data.orderId > 0 || this.data.orderId.length > 0) {
      my.navigateTo({
        url: "../orders/new/new?orderId=" + this.data.orderId
      });
    }
  },
  onReset() {
    this.setData({ orderId: "", enbleRandom: false });
  }
});
