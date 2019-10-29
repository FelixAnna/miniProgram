// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    selection:{
      name: "", 
      prices: [], 
      id:-1,
    },
    user: {},
    orderId: -1,
    shopId:-1,
    links: [],
  },
   onLoad(e) {
    const orderId = parseInt(e.orderId);
    const shopId = parseInt(e.shopId);

     this.getCurrentSelection();
     this.setData({
          user: app.userInfo,
          orderId,
          shopId,
          links:[
            { text: '返回订单详情', url: '../neworder/neworder?orderId='+orderId },
            { text: '返回首页', url: '../index/index' },
          ]
        });
  },
  onTitleClick(){
    // 点击标题触发
    my.alert({
      title: 'ShopId, OrderId',
      content: this.data.shopId + ', '+this.data.orderId 
    });
  },
  onShow(){
    this.getCurrentSelection();
  },
  onSubmit(e) {
    const orderKey='order-'+ this.data.orderId; // 缓存数据的key
    let order=my.getStorageSync({
      key: orderKey
    }).data||{
      orderId,
      shopId: -1,
      productList: []
    };
    
    order.productList=order.productList.concat([
      {
        productId: this.data.selection.id,
        name: e.detail.value.input_name,
        price: e.detail.value.input_price,
        rice: e.detail.value.sw_rice,
        spice: e.detail.value.sw_spice,
        remark: e.detail.value.remark,
        owner: this.data.user.nickName
      },
    ]);
    my.setStorageSync({
      key: orderKey,
      data: order, // 要缓存的数据
    });
    my.removeStorageSync({
      key: 'selection', // 缓存数据的key
    });
    my.navigateTo( {url: '../success/success?shopId='+this.data.shopId+'&orderId='+this.data.orderId,});
  },
  onReset() {
  },
  onStartSearch() {
    my.navigateTo( {url: '../search/search?orderId='+this.data.orderId+'&shopId='+this.data.shopId,});
  },
  getCurrentSelection() {
    let selection = my.getStorageSync({ key: 'selection' }).data || {
      name: "", 
      prices: [], 
      id:-1
    };
     this.setData({
      selection
    });
  }
});