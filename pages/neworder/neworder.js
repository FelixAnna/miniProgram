import {
  createOrder,
  getOrderById,
  removeOrder,
  lockOrder,
  unlockOrder,
  removeOrderItem
} from "../../util/api_helper";
import moment from "moment";
// 获取全局 app 实例
const app = getApp();

// API-DEMO page/component/form/form.js
Page({
  data: {
    user: {},

    //order
    shopId: -1,
    orderId: "",
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

    testop: op => this.test(op)
  },
  onLoad(e) {
    const orderId = e.orderId;
    my.showLoading({
      content: "订单加载中...",
      delay: "0"
    });
    //Ensure user loaded
    if (!app.userInfo) {
      app.getUserInfo().then(
        user => {
          this.setData({
            user
          });
          console.log(user);
        },
        () => {
          // 获取用户信息失败
        }
      );
    }

    //load order data if exists
    getOrderById(orderId)
      .then(data => this.loadOrder(data))
      .catch(res => {
        if (res.status === 404) {
          //enable auto create if not exists
          let shopId = (new Date().getTime() * -1) % 100000000;
          this.setData({ orderId, shopId });
          this.createOrder(orderId);
        } else {
          this.setData({ orderId });
        }
      })
      .finally(() => my.hideLoading());
  },

  events: {
    onBack() {
      // 页面返回时触发
      my.navigateTo({ url: "../index/index" });
    }
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
    moment.locale('zh-CN');
    currentOrderItem.formattedCreatedDate=moment(currentOrderItem.createdAt).format("LLLL");
    this.setData({
      showModal: true,
      showProduct: currentOrderItem
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
        "../product/add?orderId=" +
        this.data.orderId +
        "&shopId=" +
        this.data.shopId
    });
  },

  onSubmit(e) {
    if (this.data.state === 1)
      lockOrder(this.data.orderId).then(res => {
        this.setData({
          state: 2
        });
        console.log(`订单已锁定.`);
      });
    else
      unlockOrder(this.data.orderId).then(res => {
        this.setData({
          state: 1
        });
        console.log(`订单已解锁.`);
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
    my.confirm({
      content: "确定删除当前商品吗？",
      success: res => {
        if (res.confirm) {
          removeOrderItem(this.data.showProduct.orderItemId)
            .then(data => {
              this.getOrder(this.data.orderId);
              const startIndex = this.data.pageSize * (this.data.pageIndex - 1);
              this.setData({
                showProduct: {},
                showModal: false,
                currentPagedList: this.formatOrderItem(
                  this.data.productList.slice(
                    startIndex,
                    startIndex + this.data.pageSize
                  )
                )
              });
              my.showToast({
                type: "success",
                content: "删除成功！",
                duration: 1500
              });
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
            .then(data => console.log("删除成功！"))
            .catch(res => console.log("删除失败！"));

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

          setTimeout(() => {
            this.closeNoticeClick();
          }, 3000);
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
      title: "订单分享",
      desc: "请点击进入购物，完成后一键生成团队订单，并发送给商家。",
      path: "pages/neworder/neworder?orderId=" + this.data.orderId
    };
  },
  onReset() {},

  loadOrder(order) {
    this.setData({
      user: app.userInfo,

      orderId: order.orderId,
      shopId: order.shopId,
      productList: order.productList,
      state: order.state,
      createdBy: order.createdBy,
      createdAt: order.createdAt,

      currentPagedList: this.formatOrderItem(
        order.productList.slice(0, this.data.pageSize)
      ),
      pageCount: Math.ceil(order.productList.length / this.data.pageSize)
    });
  },

  getOrder(orderId) {
    getOrderById(orderId)
      .then(data => {
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
