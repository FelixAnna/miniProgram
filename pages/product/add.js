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
    showDialog: false
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
            { text: '首页', url: '../index/index' },
            { text: '订单详情', url: '../neworder/neworder?orderId='+orderId },
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
    if(e.detail.value.input_name !== undefined && e.detail.value.input_name.length>0
    && e.detail.value.input_price !== undefined && e.detail.value.input_price>0){
      const orderKey='order-'+ this.data.orderId; // 缓存数据的key
      let order=my.getStorageSync({
        key: orderKey
      }).data||{
        orderId,
        shopId: -1,
        productList: [],
        state: 1
      };
      
      if(order.state!=1){
        my.redirectTo({url: '../failed/failed?shopId='+this.data.shopId+'&orderId='+this.data.orderId});
        return;
      }

      let maxId = 0;
      if(order.productList.length>0){
          maxId = order.productList.reduce(
                    (max, character) => (character.id > max ? character.id : max),
                    order.productList[0].id
                  );
      }
      order.productList=order.productList.concat([
        {
          id: maxId+1,
          productId: this.data.selection.id,
          name: e.detail.value.input_name,
          price: e.detail.value.input_price,
          rice: e.detail.value.sw_rice,
          spice: e.detail.value.sw_spice,
          remark: e.detail.value.remark,
          owner: this.data.user.nickName,
          avatar: this.data.user.avatar
        },
      ]);

      my.setStorageSync({
        key: orderKey,
        data: order, // 要缓存的数据
      });
      my.removeStorageSync({
        key: 'selection', // 缓存数据的key
      });

      my.redirectTo( {url: '../success/success?shopId='+this.data.shopId+'&orderId='+this.data.orderId,});
    }else{
      this.setData({
        showDialog: true,
      });
      return;
    }
  },
  onReset() {
  },
  onStartSearch() {
    my.navigateTo( {url: '../search/search?orderId='+this.data.orderId+'&shopId='+this.data.shopId,});
  },
  onDialogTap() {
    this.setData({
      showDialog: false,
    });
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