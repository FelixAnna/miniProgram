import {
  createOrder,
  updateOrderOptions,
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
    orderId: undefined,
    avaiableTypes:[
      {value:"text", name:"任意文字"},
      {value:"number", name:"数字"},
      {value:"bool", name:"是/否"},
      {value:"digit", name:"金额"},
      {value:"idcard", name:"证件号码"}
    ],
    savedOptions: [
      {id: 1, name: '加饭', type:'bool', default: false, order: 1},
      {id: 2, name: '加辣', type:'bool', default: false, order: 2}
    ],
    options: [
      {id: 1, name: '加饭', type:'bool', default: false, order: 1},
      {id: 2, name: '加辣', type:'bool', default: false, order: 2}
    ],
    selectedOption:"text",

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
    //Ensure user loaded
    if (!app.userInfo) {
      my.redirectTo({
        url: "/pages/auth/auth?page=order&id="+orderId
      });
    }else{
      this.setData({
            user: app.userInfo,
            orderId
          });
    }

    if(orderId)
    {
      my.showLoading({
        content: "订单加载中...",
        delay: "0"
      });
    
      //load order data if exists
      getOrderById(orderId)
        .then(data => {
          this.loadOrder(data); 
          my.hideLoading();
        })
        .catch(res => {
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
          my.hideLoading();
        });
    }
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

  /*** options related*/
  onOptionPanelChange(e){
    if(e[0]=='optg1'){
      this.setData({showOptions:true})
    }else{
      this.setData({showOptions:false})
    }
  },
  optionTypeName(type){
    const opType= this.data.avaiableTypes.find(element=>element.value===type);
    if(opType){
      return opType.name;
    }
    return "unknown";
  },
  optionTypeValue(name){
    const opType= this.data.avaiableTypes.find(element=>element.name===name);
    if(opType){
      return opType.value;
    }
    return "unknown";
  },
  tapUpOption(e){
    const { id } = e.target.dataset;
    
    //locate
    let currentOptionIndex = this.data.options.findIndex((op) => op.id == id);

    //exception
    if(currentOptionIndex==0){
      return;
    }

    //swap
    let newOptions=[];
    this.data.options.forEach((op, idx) => {
        if (currentOptionIndex-1 === idx) {
          const curOption=this.data.options[currentOptionIndex];
          newOptions.push(curOption, op);
        }else if(currentOptionIndex === idx){
          return;
        }else{
          newOptions.push(op);
        }
    });

    //re-order
    newOptions.forEach((op, idx) => {
        op.order=idx;
    });

    this.setData({
      options:newOptions,
      showSelectedOption: false});
  },
  tapDownOption(e){
    const { id } = e.target.dataset;
    
    //locate
    let currentOptionIndex = this.data.options.findIndex((op) => op.id === id);

    //exception
    if(currentOptionIndex===this.data.options.length-1){
      return;
    }

    //swap
    let newOptions=[];
    this.data.options.forEach((op, idx) => {
        if (currentOptionIndex === idx) {
          const curOption=this.data.options[currentOptionIndex];
          const nextOption=this.data.options[currentOptionIndex+1];
          newOptions.push(nextOption,op);
        }else if(currentOptionIndex+1 === idx){
          return;
        }else{
          newOptions.push(op);
        }
    });

    //re-order
    newOptions.forEach((op, idx) => {
        op.order=idx;
    });

    this.setData({
      options:newOptions,
      showSelectedOption: false});
  },
  tapEditOption(e) {
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
    selectedOption.typeName=this.optionTypeName(selectedOption.type);
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
    const name = e.detail.value.selectedOptionName;
    const type = e.detail.value.selectedOptionType;
    let def = e.detail.value.selectedOptionDefault;

    if(name==='' || name ===undefined){
      return;
    }

    if(type==='bool' && def!=true){
      def=false;
    }

    //upsert element
    let newOptions=this.data.options;
    if(newOptions.some((o) => o.name === name)) {
        const other_element=newOptions.find((o) => o.name === name);
        newOptions.splice(other_element.order, 1, {id: other_element.id, name, type, default: def,order:other_element.order});
      } else {
        const maxId=newOptions.length<=0?0:newOptions.reduce(( max, cur ) => Math.max( max, cur.id ), 0);
        newOptions.push({id: maxId+1,name, type, default: def, order: 9999});
      }

    //remove duplicate
    var uniqueOptions = [];
    newOptions.forEach((element, index) => {
        if(!uniqueOptions.some((o, oi) => {
          return o.name == element.name && index!=oi;
        })) {
          uniqueOptions.push(element);
        }
    });

    //re-order
    uniqueOptions.forEach((op, idx) => {
        op.order=idx;
    });

    this.setData({
      options:uniqueOptions,
      showSelectedOption: false});
  },
  onRemoveOption(e){
    const { id } = e.target.dataset;
    let newOptions=this.data.options;
    if(newOptions.some(o=>o.id===id)){
      const targetIndex=newOptions.findIndex((o) => o.id === id);
      newOptions.splice(targetIndex,1);
    }
    
    //re-order
    newOptions.forEach((op, idx) => {
        op.order=idx;
    });

    this.setData({
      options:newOptions,
      showSelectedOption: false});
  },
  onOptionTypeChange(e) {
    const selectedOption=e.detail.value;
    this.setData({selectedOption:selectedOption});
  },
  onTapRecoverOptions(){
    this.setData({
      options:this.data.savedOptions.map(x=>x),
      showSelectedOption: false});
  },
  onTapSaveOptions(){
    const newOpts=this.data.options.map(x=>x);
    if(this.data.orderId){
      //update options in DB
      this.updateOrderOptions(this.data.orderId, newOpts)
    }else{
      //new order with options in DB
      this.createOrder(newOpts)
    }

    //update saved options
    this.setData({
      savedOptions: newOpts,
      showSelectedOption: false});
  },
  /**options related end */

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
        "../../products/add/add?orderId="+this.data.orderId
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

    let summaryPrice = 0;
    this.data.productList.forEach((item, index) => {
      let optionsSummary= item.options.filter(op=>op.value)
        .map(op => {
            if(op.value === true) {
              return op.name;
            } else {
              return `${op.name}:${op.value}`;
            }
          })
        .reduce((op, current) => `${current} ${op}`,'');

      summaryPrice += parseFloat(item.price);

      const productText = `${item.name} ${item.price} `
      +`${optionsSummary ? optionsSummary : ""} `
      +`${item.remark ? "[备注：" + item.remark + "]" : ""}`;

      productListText += `${productText}\n`;
    });
    
    productListText += summaryPrice > 0 ? `\n合计：${summaryPrice}元` : "";

    //仅支持企业账号
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

  loadOrder(order) {
    const startIndex = this.data.pageSize * (this.data.pageIndex - 1);
    this.setData({
      showProduct: {},
      showModal: false,
      swipeIndex: null,

      user: app.userInfo,

      orderId: order.orderId,
      productList: order.productList,
      state: order.state,
      createdBy: order.createdBy,
      ownerName: order.ownerName,
      createdAt: moment(order.createdAt).format("lll"),

      options: order.options.map(x=>x),
      savedOptions: order.options.map(x=>x),

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

  updateOrderOptions(orderId, opts) {
    updateOrderOptions(orderId, opts)
      .then(data => {
        console.log("update options success")
      })
      .catch(res => {
        my.showToast({
          type: "fail",
          content: res,
          duration: 1500
        });
      });
  },

  createOrder(opts) {
    createOrder(opts)
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
        .map(op => {
            if(op.value === true) {
              return op.name;
            } else {
              return `${op.name}:${op.value}`;
            }
          })
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
