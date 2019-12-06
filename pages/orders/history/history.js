import {
  getOrders,
  removeOrder,
  lockOrder,
  unlockOrder
} from "../../../util/api_helper";
const app = getApp();

Page({
  data: {
    list: [],
    user: {},

    itemRight:  [{ type: 'delete', text: '删除' }],
    swipeIndex: null,

    pageCount: 0,
    pageSize: 5,
    pageIndex: 1
  },
  onLoad() {
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
    this.getOrders()
      .finally(() => my.hideLoading());
  },
  openDetails(e) {
    const { id } = e.target.dataset;
    my.redirectTo({
      url: "/pages/orders/new/new?orderId=" + id
    });
  },

  onRightItemClick(e) {
    const { type } = e.detail;
    if (type === 'delete') {
      const itemId=e.extra;
      this.deleteOrder(itemId);
    }
  },
  onSwipeStart(e) {
    this.setData({
      swipeIndex: e.index,
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

  getOrders(){
    return getOrders(this.data.pageIndex, this.data.pageSize)
      .then(data => 
      {
        const pageCount=Math.ceil(data.totalCount / this.data.pageSize);
        this.setData({
          user: app.userInfo,
          pageCount: pageCount,
          list: data.orders,
          pageIndex: this.data.pageIndex>pageCount?pageCount:this.data.pageIndex
        });
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
                    url: "/pages/orders/history/history"
                  })
                }else{
                  my.redirectTo({
                  url: "/pages/index/index"
                })
                }
              }
          });
          this.setData({ list:[] });
      });
  },
  deleteOrder(orderId){
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
});
