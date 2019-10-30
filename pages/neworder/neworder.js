// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    shopId:-1,
    orderId: -1,
    productList: [],
    pageIndex: 1,
    pageSize: 3,
    currentPagedList: [],
    pageCount: 0,
    showProduct: {},
    showModal: false
  },
  onLoad(e) {
    const orderId = parseInt(e.orderId);
    let order=this.getOrder(orderId);

    const startIndex=1;
    const pageCount=Math.ceil(order.productList.length/this.data.pageSize);
    this.setData({
        user: app.userInfo,
        orderId,
        shopId: order.shopId,
        productList: order.productList,
        currentPagedList: order.productList.slice(0, this.data.pageSize),
        pageCount,
        state: order.state
      });
    my.setStorageSync({
      key: 'order-'+this.data.orderId, // 缓存数据的key
      data: order});
  },

  saveShopId(e){
// 修改全局数据
    const shopId = e.detail.value;
    this.setData({ shopId});
    my.setStorageSync({
      key: 'order-'+this.data.orderId, // 缓存数据的key
      data: {
        shopId,
        orderId: this.data.orderId,
        productList: this.data.productList,
        state: this.data.state
      }, // 要缓存的数据
    });
  },
  
  onTapAppendMore(e){
    my.navigateTo( {url: '../new/new?orderId='+this.data.orderId+'&shopId='+this.data.shopId,});
  },

  onTabPage(index){
    const startIndex=this.data.pageSize*(index-1);
    this.setData({
      pageIndex:index,
      currentPagedList: this.data.productList.slice(startIndex, startIndex+this.data.pageSize)
      });
  },

  openDetails(e){
    const { id } = e.target.dataset;
    this.setData({
      showModal:  true,
      showProduct: this.data.productList.find(function(element) {
        return element.id === id;
      }),
    })
  },

  hiddenModel(){
    this.setData({
      showProduct:{},
      showModal:false
    });
  },

  onSubmit(e) {
    let order=this.getOrder(this.data.orderId);

    if(order.state ===1)
      order.state=2;
    else
      order.state=1;

    my.setStorageSync({
      key: 'order-'+this.data.orderId, // 缓存数据的key
      data: order});
    
    this.setData({
      state:  order.state
    })

    if(order.state ===1)
      console.log(`订单已锁定.`);
    else
      console.log(`订单已解锁.`);
    
  },
  onReset() {
  },

  getOrder(orderId){
    let order=my.getStorageSync({
      key: 'order-'+orderId, // 缓存数据的key
    }).data||{
      orderId: orderId,
      shopId: -1,
      productList: [],
      state: 1
    };

    order.productList=order.productList||[];
    return order;
  }
});