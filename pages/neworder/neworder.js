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
    let order=my.getStorageSync({
      key: 'order-'+orderId, // 缓存数据的key
    }).data||{
      orderId,
      shopId: -1,
      productList: []
    };

    order.productList=order.productList||[];
    const startIndex=1;
    const pageCount=Math.ceil(order.productList.length/this.data.pageSize);
    this.setData({
        user: app.userInfo,
        orderId,
        shopId: order.shopId,
        productList: order.productList,
        currentPagedList: order.productList.slice(0, this.data.pageSize),
        pageCount
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
        productList: this.data.productList
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
        return element.productId === id;
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
    const value=e.detail.value;
    /*my.alert({
      content: `数据：${JSON.stringify(e.detail.value)}`,
    });*/
    console.log(`数据：${JSON.stringify(value)}`);
    
  },
  onReset() {
  }
});