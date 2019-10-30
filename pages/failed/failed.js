Page({
  data: {

  },
  onLoad(e) {
    const orderId = parseInt(e.orderId);
    const shopId = parseInt(e.shopId);
    this.setData({
      orderId,
      shopId,
    });
  },
  backHome() {
    my.navigateTo( {url: '../index/index'});
  },
  backOrder() {
    my.navigateTo( {url: '../success/success?shopId='+this.data.shopId+'&orderId='+this.data.orderId,});
  }
});