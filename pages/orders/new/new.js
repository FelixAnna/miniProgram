import {
  createOrder,
  getOrderById,
  removeOrder,
  lockOrder,
  unlockOrder,
  removeOrderItem
} from "../../../util/api_helper";
import moment from "moment";
// 获取全局 app 实例
const app = getApp();
// 特征检测
my.canIUse('page.events.onBack');
// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},

    //order
    shopId: -1,
    orderId: "",
    avaiableTypes:[
      {value:"text", name:"任意文字"},
      {value:"number", name:"数字"},
      {value:"bool", name:"是/否"},
      {value:"digit", name:"金额"},
      {value:"idcard", name:"证件号码"}
    ],
    options: [
      {id: 1, name: '选项1', type:'number', default: '10'},
      {id: 2, name: '选项2', type:'bool', default: 'false'},
      {id: 3, name: '选项3', type:'text', default: ''},
      {id: 4, name: '选项4', type:'digit', default: '9.9'},
      {id: 5, name: '选项5', type:'idcard', default: '123X'},
    ],
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
    enableRandom: false,

    productListText: "",
    showCopyText: false,

    itemRight:  [{ type: 'delete', text: '删除' }],
    swipeIndex: null
  },
  onLoad(e) {
    moment.locale('zh-CN');
    const orderId = e.orderId;
    my.showLoading({
      content: "订单加载中...",
      delay: "0"
    });
    //Ensure user loaded
    if (!app.userInfo) {
      my.redirectTo({
        url: "/pages/auth/auth?page=order&id="+orderId
      });
    }else{
      this.setData({
            user: app.userInfo,
          });
    }
    //load order data if exists
    getOrderById(orderId)
      .then(data => {
        this.loadOrder(data); 
        my.hideLoading();
      })
      .catch(res => {
        if (res.status === 404) {
          //enable auto create if not exists
          //let shopId = (new Date().getTime() * -1) % 100000000;
          this.setData({ orderId });
          //this.createOrder(orderId);
        } else {
          my.confirm({
              title: '抱歉',
              content: '数据加载失败！',
              confirmButtonText: '重新加载',
              cancelButtonText: '返回首页',
              success: (result) => {
                if(result.confirm){
                  my.reLaunch({
                    url: "../../orders/new/new?orderId=" + orderId
                  })
                }else{
                  my.redirectTo({
                  url: "../../index/index"
                })
                }
              }
          });
          this.setData({ orderId });
        }
        my.hideLoading();
      });
  },
  onPullDownRefresh() {
    this.getOrder(this.data.orderId, () => my.stopPullDownRefresh({
      success(res) {
         my.showToast({
          type: 'success',
          content: '刷新成功',
          duration: 3000
        });
      }
    }));
  },
  events: {
    onBack(e){
      e.preventDefault();
      // 页面返回时触发
     my.redirectTo({
        url: "/pages/index/index"
      });
    }
  },
  tapOption(e) {
    const { id } = e.target.dataset;
    let selectedOption;
    this.data.options.forEach((op, idx) => {
        if (op.id == id) {
          selectedOption = op;
          return;
        }

        if(selectedOption !== undefined){
          return;
        }
    });
    console.log(selectedOption);
    this.setData({
      selectedOption,
      showSelectedOption: true});
  },
  tapNewOption(e) {
    const emptyOption= {id: -1, name:"", type:"text", default:""};
    this.setData({
      selectedOption:emptyOption,
      showSelectedOption: true});
  },
  onHiddenOption(e){
    this.setData({showSelectedOption: false});
  },
  onUpsertOption(e){
    const id = this.data.selectedOption.id;
    const name = e.detail.value.selectedOptionName;
    const type = e.detail.value.selectedOptionType;
    const def = e.detail.value.selectedOptionDefault;

    if(name==='' || name ===undefined){
      return;
    }

    let newOptions=this.data.options;
    let maxIndex=1;
    let index;
    let opt;
    newOptions.forEach((op, idx) => {
      if (op.name == name) {
        console.log(name);
        index = idx;
        opt=op;
      }

      if(maxIndex<=op.id){
        maxIndex=op.id;
      }
    });

    if(index>=0)
    {
      newOptions.splice(index, 1, {id: opt.id, name, type, default: def});
    }else{
      newOptions.unshift({id: maxIndex+1,name, type, default: def});
    }

    var uniqueOptions = [];
    newOptions.forEach((element, index) => {
        if(!uniqueOptions.some((other_element, other_index) => {
          return other_element.name == element.name && index!=other_index;
        })) {
          uniqueOptions.push(element);
        }
    });

    this.setData({
      selectedOption:{id: -1, name:"", type:"text", default:""},
      options:uniqueOptions,
      showSelectedOption: false});
  },
  onRemoveOption(e){
    const { id } = e.target.dataset;
    let index;
    let newOptions=this.data.options;
    newOptions.forEach((op, idx) => {
        if (op.id == id) {
          index = idx;
          return;
        }

        if(index !== undefined){
          return;
        }
    });
    console.log(index);
    newOptions.splice(index, 1);
    this.setData({
      options:newOptions,
      showSelectedOption: false});
  },
  tapSkip(e) {
    let shopId = (new Date().getTime() * -1) % 100000000;
    this.setData({ shopId });
    this.createOrder(this.data.orderId, shopId);
  },
  saveShopId(e) {
    // 修改全局数据
    const shopId = e.detail.value;
    if (shopId === "" || shopId === undefined || shopId == -1) {
      return;
    }

    this.setData({ shopId });
    this.createOrder(this.data.orderId, shopId);
  },

  onTabPage(index) {
    const startIndex = this.data.pageSize * (index - 1);
    this.setData({
      pageIndex: index,
      currentPagedList: this.formatOrderItem(
        this.data.productList.slice(startIndex, startIndex + this.data.pageSize)
      )
    });
  },

  openDetails(e) {
    const { id } = e.target.dataset;
    let currentOrderItem = this.data.productList.find(function(element) {
        return element.orderItemId === id;
      });
    currentOrderItem.formattedCreatedDate=moment(currentOrderItem.createdAt).format("lll");
    this.setData({
      showModal: true,
      showProduct: currentOrderItem
    });
  },

  onRightItemClick(e) {
    const { type } = e.detail;
    if (type === 'delete') {
      const itemId=e.extra;
      this.deleteOrderItem(itemId);
    }
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
    });
  },

  hiddenModel() {
    this.setData({
      showProduct: {},
      showModal: false
    });
  },

  onTapAppendMore(e) {
    my.navigateTo({
      url:
        "../../products/add/add?orderId=" +
        this.data.orderId +
        "&shopId=" +
        this.data.shopId
    });
  },

  onSubmit(e) {
    this.setData({lockUnlockClicked:true});
    if (this.data.state === 1)
      lockOrder(this.data.orderId).then(res => {
        this.setData({
          state: 2,
          lockUnlockClicked:false
        });
        console.log(`订单已提交.`);
      });
    else
      unlockOrder(this.data.orderId).then(res => {
        this.setData({
          state: 1,
          lockUnlockClicked:false
        });
        console.log(`订单已撤回.`);
      });
  },
  onTapCopy(e) {
    let productListText = "";
    let options = [];

    let riceCount = 0;
    let spiceCount = 0;

    let summaryPrice = 0;
    this.data.productList.forEach((item, index) => {
      item.options.forEach((op, idx) => {
        if (!op.value) {
          return;
        }
        if (options[op.name] === undefined) {
          options[op.name] = 1;
        } else {
          options[op.name] += 1;
        }
      });
      spiceCount += item.spice ? 1 : 0;
      riceCount += item.rice ? 1 : 0;

      summaryPrice += parseFloat(item.price);
      const productText = `${item.name} ${item.price} ${
        item.remark ? "[备注：" + item.remark + "]" : ""
      }`;
      if (index === 0) {
        productListText += `${productText}`;
      } else {
        productListText += `\n${productText}`;
      }
    });
    productListText += `\n`;
    options.forEach((op, idx) => {
      productListText += options[op] > 0 ? `${op}*${options[op]}\t` : "";
    });
    var sortKeys = Object.keys(options).sort();
    for (var key in sortKeys) {
      productListText +=
        options[sortKeys[key]] > 0
          ? `${sortKeys[key]}*${options[sortKeys[key]]}\t`
          : "";
    }
    productListText += summaryPrice > 0 ? `\n合计：${summaryPrice}元` : "";

    my.setClipboard({
      text: productListText
    });

    this.setData({
      productListText,
      showCopyText: !this.data.showCopyText
    });
  },
  onTapProductDelete(e) {
    this.deleteOrderItem(this.data.showProduct.orderItemId);
  },
  deleteOrderItem(orderItemId){
    my.confirm({
      content: "确定删除当前商品吗？",
      success: res => {
        if (res.confirm) {
          removeOrderItem(orderItemId)
            .then(data => {
              this.getOrder(this.data.orderId, ()=>my.showToast({
                type: "success",
                content: "删除成功！",
                duration: 1500
              }));
              
            })
            .catch(res =>
              my.showToast({
                type: "fail",
                content: "删除失败！",
                duration: 1500
              })
            );
        }
      }
    });
  },
  onTapDelete(e) {
    my.confirm({
      content: "确定删除当前订单吗？",
      success: res => {
        if (res.confirm) {
          removeOrder(this.data.orderId)
            .then(data =>  my.redirectTo({
                  url: "../deleted/deleted"
                }))
            .catch(res => console.log("删除失败！"));
        }
      }
    });
  },

  closeNoticeClick() {
    this.setData({
      cleanShow: false
    });
  },

  onShareAppMessage() {
    return {
      title: "群订单统计邀请",
      desc: "请点击本链接以参与编辑，随后一键生成汇总信息，复制后可轻松分享。",
      path: "/pages/orders/new/new?orderId=" + this.data.orderId
    };
  },
  onReset() {},

  loadOrder(order) {
    const startIndex = this.data.pageSize * (this.data.pageIndex - 1);
    this.setData({
      showProduct: {},
      showModal: false,
      swipeIndex: null,

      user: app.userInfo,

      orderId: order.orderId,
      shopId: order.shopId,
      productList: order.productList,
      state: order.state,
      createdBy: order.createdBy,
      ownerName: order.ownerName,
      createdAt: moment(order.createdAt).format("lll"),

      currentPagedList: this.formatOrderItem(
        order.productList.slice( startIndex,
                    startIndex + this.data.pageSize)
      ),
      pageCount: Math.ceil(order.productList.length / this.data.pageSize)
    });
  },

  getOrder(orderId, callback) {
    getOrderById(orderId)
      .then(data => {
        this.loadOrder(data);
        callback();
      })
      .catch(res => {
        my.showToast({
          type: "fail",
          content: res,
          duration: 1500
        });
      });
  },

  createOrder(orderId) {
    createOrder(orderId, this.data.shopId)
      .then(data => {
        data.productList = data.productList || [];
        this.loadOrder(data);
      })
      .catch(res => {
        my.showToast({
          type: "fail",
          content: res,
          duration: 1500
        });
      });
  },
  formatOrderItem(productList) {
    productList.forEach(item => {
      let validOptions = item.options
        .filter(op => op.value)
        .map(op => op.name)
        .reduce((op, current) => `${current} ${op}`,'');
      if (item.remark) {
        validOptions += `\t备注：${item.remark}`;
      }
      console.log(validOptions);
      item.validOptions = validOptions;
      return item;
    });

    return productList;
  }
});
