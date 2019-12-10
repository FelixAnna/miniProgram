import {
  getOrders,
  removeOrder,
  lockOrder,
  unlockOrder
} from "../../../util/api_helper";
import moment from "moment";
const app = getApp();

Page({
  data: {
    list: [],
    user: {},

    startDate:null,
    endDate:null,
    displayDateRange: null,
    showDatePicker: false,

    itemRight: [{ type: "delete", text: "删除" }],
    swipeIndex: null,

    pageCount: 0,
    pageSize: 5,
    pageIndex: 1
  },
  onLoad() {
    moment.locale("zh-CN");
    my.showLoading({
      content: "列表加载中...",
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
    this.getOrders().finally(() => my.hideLoading());
  },
  openDetails(e) {
    const { id } = e.target.dataset;

    my.confirm({
      title: "跳转确认",
      content: `确定要打开订单:${id}吗？`,
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      success: result => {
        if (result.confirm) {
          my.redirectTo({
            url: "/pages/orders/new/new?orderId=" + id
          });
        }
      }
    });
  },

  onRightItemClick(e) {
    const { type } = e.detail;
    if (type === "delete") {
      const itemId = e.extra;
      this.deleteOrder(itemId);
    }
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index
    });
  },

  onTabPage(index) {
    my.showLoading({
      content: "列表加载中...",
      delay: "0"
    });
    this.setData({
      pageIndex: index
    });

    this.getOrders().finally(() => my.hideLoading());
  },

  getOrders() {
    return getOrders(this.data.pageIndex, this.data.pageSize, moment(this.data.startDate).format("YYYY-MM-DD"), moment(this.data.endDate).format("YYYY-MM-DD"))
      .then(data => {
        let orders = data.orders;
        orders.forEach((item, index) => {
          item.formattedCreatedDate = moment(item.createdAt).format("lll");
        });
        const pageCount = Math.ceil(data.totalCount / this.data.pageSize);
        this.setData({
          swipeIndex: null,
          user: app.userInfo,
          pageCount: pageCount,
          list: orders,
          pageIndex:
            this.data.pageIndex > pageCount ? pageCount : this.data.pageIndex
        });
      })
      .catch(res => {
        if(res.status === 404){
          this.setData({
            swipeIndex: null,
            user: app.userInfo,
            pageCount: 0,
            list: [],
            pageIndex:1
          });
          return;
        }
        my.confirm({
          title: "抱歉",
          content: "数据加载失败！",
          confirmButtonText: "重新加载",
          cancelButtonText: "返回首页",
          success: result => {
            if (result.confirm) {
              my.reLaunch({
                url: "/pages/orders/history/history"
              });
            } else {
              my.redirectTo({
                url: "/pages/index/index"
              });
            }
          }
        });
        this.setData({ list: [] });
      });
  },
  deleteOrder(orderId) {
    my.confirm({
      content: "确定删除当前订单吗？",
      success: res => {
        if (res.confirm) {
          removeOrder(orderId)
            .then(data => {
              my.showLoading({
                content: "列表加载中...",
                delay: "0"
              });

              this.getOrders().finally(() => my.hideLoading());
            })
            .catch(res => console.log("删除失败！"));
        }
      }
    });
  },
  startSetDate(){
    this.setData({showDatePicker:true})
  },
  handleSelect([startDate, endDate]) {
    this.setData({
      startDate,
      endDate,
      displayDateRange: moment(startDate).format('ll')+' ~ '+moment(endDate).format('ll'),
      showDatePicker:false
      });
      this.onTabPage(this.data.pageIndex);
  },
});
