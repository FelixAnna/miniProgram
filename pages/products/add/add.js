import { getOrderById, addOrderItem } from "../../../util/api_helper";

// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    selection: {
      name: "",
      prices: [],
      id: -1
    },
    user: {},
    links: [],
    showDialog: false,
    submitClicked: false
  },
  onLoad(e) {
    const orderId = e.orderId;
    const shopId = parseInt(e.shopId);

    this.getCurrentSelection();
    this.setData({
      user: app.userInfo,
      orderId,
      shopId
    });
  },
  onTitleClick() {
    // 点击标题触发
    /*my.alert({
      title: "ShopId, OrderId",
      content: this.data.shopId + ", " + this.data.orderId
    });*/
  },
  onShow() {
    this.getCurrentSelection();
  },
  onSubmit(e) {
    this.setData({submitClicked: true});
    if (
      e.detail.value.input_name !== undefined &&
      e.detail.value.input_name.length > 0 &&
      e.detail.value.input_price !== undefined &&
      e.detail.value.input_price > 0
    ) {
      const newOrderItem = {
        orderId: this.data.orderId,
        productId: this.data.selection.id,
        name: e.detail.value.input_name,
        price: e.detail.value.input_price,
        remark: e.detail.value.remark,
        options: [
          {
            name: "加饭",
            value: e.detail.value.sw_rice
          },
          {
            name: "加辣",
            value: e.detail.value.sw_spice
          }
        ]
      };

      addOrderItem(newOrderItem)
        .then(res => {
          my.removeStorageSync({
            key: "selection" // 缓存数据的key
          });

          my.redirectTo({
            url:
              "../success/success?shopId=" +
              this.data.shopId +
              "&orderId=" +
              this.data.orderId
          });

          this.setData({
            submitClicked: false
          });
        })
        .catch(error => {
          my.redirectTo({
            url:
              "../failed/failed?shopId=" +
              this.data.shopId +
              "&orderId=" +
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
  onStartSearch() {
    my.navigateTo({
      url:
        "../search/search?orderId=" +
        this.data.orderId +
        "&shopId=" +
        this.data.shopId
    });
  },
  onDialogTap() {
    this.setData({
      showDialog: false
    });
  },
  getCurrentSelection() {
    let selection = my.getStorageSync({ key: "selection" }).data || {
      name: "",
      prices: [],
      id: -1
    };
    this.setData({
      selection
    });
  }
});
