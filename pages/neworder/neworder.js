// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},

    //order
    shopId:-1,
    orderId: -1,
    productList: [],
    state: 1,
    createdBy: null,
    createdAt: null,

    pageIndex: 1,
    pageSize: 5,
    currentPagedList: [],
    pageCount: 0,

    showProduct: {},
    showModal: false,

    cleanShow: false,
  },
  onLoad(e) {
    const orderId = parseInt(e.orderId);

    //Ensure user loaded
    if(!app.userInfo){
      app.getUserInfo().then(
          user => {
            this.setData({
              user,
            });
            console.log(user)
          },
          () => {
            // 获取用户信息失败
          }
        );
    }

    //load order data if exists
    let order=this.getOrder(orderId);
    if(order){
      this.loadOrder(order);
    }else{
      this.setData({ orderId});
    }
  },

   events:{
    onBack(){
      // 页面返回时触发
      my.navigateTo( {url: '../index/index'});
    },
   },
  tapSkip(e){
    let shopId=(new Date()).getTime() * -1;
    this.setData({ shopId});    
    const order= this.createOrder(this.data.orderId);
    this.saveOrder(order);
    this.loadOrder(order);
  },
  saveShopId(e){
    // 修改全局数据
    const shopId = e.detail.value;
    if(shopId==="" || shopId ===undefined){
      return;
    }
    
    this.setData({ shopId});
    const order= this.createOrder(this.data.orderId);
    this.saveOrder(order);
    this.loadOrder(order);
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

  onTapAppendMore(e){
    my.navigateTo( {url: '../product/add?orderId='+this.data.orderId+'&shopId='+this.data.shopId,});
  },

  onSubmit(e) {
    let order=this.getOrder(this.data.orderId) || this.createOrder(this.data.orderId);

    if(order.state ===1)
      order.state=2;
    else
      order.state=1;

    //update order state in cache
    this.saveOrder(order);
    
    this.setData({
      state:  order.state
    })

    if(order.state === 2)
      console.log(`订单已锁定.`);
    else
      console.log(`订单已解锁.`);
    
  },
  onTapProductDelete(e){
     my.confirm({
      content: '确定删除当前商品吗？',
      success: (res) => {
        if (res.confirm) {
          let order=this.getOrder(this.data.orderId);
          const selectedId=this.data.showProduct.id;
          let remainingProductList=[];
          order.productList.forEach(function(element) {
            if(element.id !== selectedId){
              remainingProductList.push(element);
            }
          });
          order.productList=remainingProductList;

          this.saveOrder(order);
          this.loadOrder(order);

          const startIndex=this.data.pageSize*(this.data.pageIndex-1);
          this.setData({
            showProduct: {},
            showModal: false,
            currentPagedList: this.data.productList.slice(startIndex, startIndex+this.data.pageSize)
          });
        }
      },
    });
  },
  onTapDelete(e) {
     my.confirm({
      content: '确定删除当前订单吗？',
      success: (res) => {
        if (res.confirm) {
          my.removeStorage({
            key: 'order-'+this.data.orderId, // 缓存数据的key
            success: function(){
            },
            fail: function(){
              console.log("删除失败！");
            }
          });

          this.setData({
                shopId: -1,
                productList: [],
                state: 1,
                createdBy: null,
                createdAt: null,

                pageIndex: 1,
                pageSize: 5,
                currentPagedList: [],
                pageCount: 0,

                showProduct: {},
                showModal: false,

                cleanShow: true
              });

          setTimeout(
            ()=>{
              this.closeNoticeClick()
            }
            ,3000);
        }
      },
    });
  },

  closeNoticeClick(){
    this.setData({
      cleanShow: false
    })
  },

  onShareAppMessage() {
    return {
      title: '订单分享',
      desc: '请点击进入购物，完成后一键生成团队订单，并发送给商家。',
      path: 'pages/neworder/neworder?orderId='+this.data.orderId,
    };
  },

  onReset() {
  },

  loadOrder(order){
      this.setData({
        user: app.userInfo,

        orderId: order.orderId,
        shopId: order.shopId,
        productList: order.productList,
        state: order.state,
        createdBy: order.createdBy,
        createdAt: order.createdAt,

        currentPagedList: order.productList.slice(0, this.data.pageSize),
        pageCount: Math.ceil(order.productList.length/this.data.pageSize)
      });
  },

  getOrder(orderId){
    let order=my.getStorageSync({
      key: 'order-'+orderId, // 缓存数据的key
    }).data;

    return order;
  },

  createOrder(orderId){
    let newOrder = {
      orderId: orderId,
      shopId: this.data.shopId,
      productList: this.data.productList,
      state: this.data.state,
      createdBy: app.userInfo.nickName,
      createdAt: new Date()
    };

    newOrder.productList=newOrder.productList||[];
    return newOrder;
  },

  saveOrder(order){
    my.setStorageSync({
      key: 'order-'+order.orderId, // 缓存数据的key
      data: order});
  }
});