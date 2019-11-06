Page({
  data: {
  },
  onLoad(e) {
    const orderId = e.orderId;
    const shopId = parseInt(e.shopId);
    this.setData({
      orderId,
      shopId,
    });
  },
  backHome() {
    my.redirectTo( {url: '../index/index'});
  },
  backOrder() {
    my.redirectTo( {url: '../neworder/neworder?shopId='+this.data.shopId+'&orderId='+this.data.orderId,});
  }
});