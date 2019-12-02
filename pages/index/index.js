import {getApiStatus} from '../../util/api_helper';
import {getShortcode, getRandomShortcode} from '../../util/shortcode';
// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},
    orderId: undefined,
    enbleRandom: true
  },
  onLoad() {
    if(!app.userInfo){
      app.getUserInfo().then(
        user => {
          this.setData({
            user,
            orderId: getShortcode(user.userId)+"@"+getRandomShortcode()
          });
          console.log(user);
        },
        () => {
          // 获取用户信息失败
        }
      );
    }else{
      this.setData({
        orderId: getShortcode(this.data.user.userId)+"@"+getRandomShortcode()
      });
    }
  },
  tapCreateRandom(e){
    if(e.detail.value === true){
      let orderId=getShortcode(this.data.user.userId)+"@"+getRandomShortcode();
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