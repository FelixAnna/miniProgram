import { getOrderById, addOrderItem } from "../../../util/api_helper";

// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    options:[
      {id: 1, name: '加饭', type:'bool', default: false, order: 1},
      {id: 2, name: '加辣', type:'bool', default: false, order: 2}
    ],
    user: {},
    showDialog: false,
    submitClicked: false
  },
  onLoad(e) {
    const orderId = e.orderId;

    this.getCurrentOptions();
    this.setData({
      user: app.userInfo,
      orderId
    });
  },
  onShow() {
    this.getCurrentOptions();
  },
  onSubmit(e) {
    if(this.data.submitClicked === true){
      return;
    }
    
    this.setData({submitClicked: true});
    if (
      e.detail.value.input_name &&
      e.detail.value.input_price > 0
    ) {
      const optionField=[];
      console.log(e.detail.value);
      Object.keys(e.detail.value).map(key => {
        if(!key.startsWith("op_")){
          return;
        }

        const opId=parseInt(key.substr(3));
        let op=this.data.options.find(x=>x.id == opId);
        
        optionField.push({name: op.name, value: e.detail.value[key]});
      });
      
      const newOrderItem = {
        orderId: this.data.orderId,
        name: e.detail.value.input_name,
        price: e.detail.value.input_price,
        remark: e.detail.value.remark,
        options: optionField
      };

      addOrderItem(newOrderItem)
        .then(res => {
          my.redirectTo({
            url:
              "../success/success?orderId=" +
              this.data.orderId
          });

          this.setData({
            submitClicked: false
          });
        })
        .catch(error => {
          my.redirectTo({
            url:
              "../failed/failed?orderId=" +
              this.data.orderId
          });

          this.setData({
            submitClicked: false
          });
        });
        //not supported in iphone 11
        /*.finally(res=>{
          this.setData({
            submitClicked: false
          });
        });*/
        
    } else {
      this.setData({
        showDialog: true, submitClicked: false
      });
      return;
    }
  },
  onReset() {},
  onDialogTap() {
    this.setData({
      showDialog: false
    });
  },
  getCurrentOptions() {
    let options = my.getStorageSync({ key: `options-${this.data.orderId}` }).data || [
      {id: 1, name: '加饭', type:'bool', default: false, order: 1},
      {id: 2, name: '加辣', type:'bool', default: false, order: 2}
    ];
    this.setData({
      options
    });
  }
});
