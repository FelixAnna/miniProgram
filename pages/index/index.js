import {getApiStatus} from '../../util/api_helper';
// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    orderId: (new Date()).getTime(),
    enbleRandom: true
  },
  onLoad() {
    if(!app.userInfo){
      app.getUserInfo().then(
        user => {
          this.setData({
            user,
          });
          console.log(user);
        },
        () => {
          // 获取用户信息失败
        }
      );
    }
  },
  tapCreateRandom(e){
    if(e.detail.value === true){
      let orderId=(new Date()).getTime()%100000000;
      this.setData({ orderId, enbleRandom: true});    
    }else{
      this.setData({ orderId: "", enbleRandom: false});  
    }
  },
  onOrderIdBlur(e){
    const value=e.detail.value;
    if(value === undefined || value.length===0 ){
      this.setData({ orderId: ""});  
      return;
    }
    this.setData({ orderId: value});    
  },
  onSubmit(e) {
    const value=e.detail.value;
    if(this.data.orderId>0 || this.data.orderId.length>0){
        my.navigateTo ( {url: '../neworder/neworder?orderId='+this.data.orderId,});
    }
  },
  onReset() {
    this.setData({ orderId: "", enbleRandom: false});  
  }
});