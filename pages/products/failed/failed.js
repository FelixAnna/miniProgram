Page({
  data: {},
  onLoad(e) {
    const orderId = e.orderId;
    this.setData({
      orderId
    });
  },
  backHome() {
    my.redirectTo({ url: "../../index/index" });
  },
  backOrder() {
    my.redirectTo({
      url:
        "../../orders/new/new?orderId=" +
        this.data.orderId
    });
  }
});
