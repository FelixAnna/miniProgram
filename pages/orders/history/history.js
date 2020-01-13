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
    displayList: [],
    user: {},

    startDate:null,
    endDate:null,
    displayDateRange: "所有时间",
    showDatePicker: false,

    itemRight: [{ type: "delete", text: "删除" }],
    swipeIndex: null,

    pageCount: 0,
    pageSize: 3,
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
    this.loadOrders(false, () => my.hideLoading());
  },
  onShow(){
    my.showTabBar({
        animation: true
    });
  },
  onPullDownRefresh() {
    this.loadOrders(true, () => my.stopPullDownRefresh({
      success(res) {
         my.showToast({
          type: 'success',
          content: '刷新成功',
          duration: 3000
        });
      }
    }));
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
    if(index>=this.data.pageCount) index=this.data.pageCount;
    if(index === 0) index=1;
    this.setData({
      pageIndex: index,
      pagedList: this.data.displayList.slice((index-1)*this.data.pageSize, index*this.data.pageSize),
    });
  },

  loadOrders(force, callback) {
    if(!force) {
        var data = my.getStorageSync({
            key: 'history'
          }).data;
          if(data!==null){
            this.renderData(data);
            callback();
            return;
          }
    }

    return getOrders(1, 300, moment(this.data.startDate).format("YYYY-MM-DD"), moment(this.data.endDate).format("YYYY-MM-DD"))
      .then(data => {
        my.setStorage({
          key: 'history',
          data: data
        });

        this.renderData(data);
      })
      .catch(res => {
        this.handleError(res);
      }).finally(() => {
          callback();
      });
  },
  handleError(res){
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
              my.switchTab({
                url: "/pages/index/index"
              });
            }
          }
        });
        this.setData({ list: [] });
  },
  renderData(data)
  {
        let orders = data.orders;
        orders.forEach((item, index) => {
          item.formattedCreatedDate = moment(item.createdAt).format("lll");
        });

        const pageCount = Math.ceil(data.totalCount / this.data.pageSize);
        const pageIndex=this.data.pageIndex > pageCount ? pageCount : this.data.pageIndex;
        this.setData({
          swipeIndex: null,
          user: app.userInfo,
          pageCount: pageCount,
          list: orders,
          displayList: orders,
          pageIndex: pageIndex
            
        });
        this.onTabPage(pageIndex);
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
              this.setData({
                list: this.data.list.filter(item=> item.orderId!==orderId)
              });
              this.refresh();
              my.hideLoading();
            })
            .catch(res => console.log("删除失败！"));
        }
      }
    });
  },
  startSetDate(){
    this.setData({showDatePicker:true})
  },
  clearDate(){
    if(this.data.startDate === null){
      return;
    }

    this.setData({
        startDate:null,
        endDate:null,
        displayDateRange: "所有时间",
        showDatePicker:false
      });
      this.refresh();
  },
  handleSelect([startDate, endDate]) {
    this.setData({
        startDate,
        endDate,
        displayDateRange: moment(startDate).format('ll')+' ~ '+moment(endDate).format('ll'),
        showDatePicker:false
      });

      this.refresh();
  },

  refresh(){
    let displayList = this.data.list;
    if(this.data.startDate!=null){
      const start=moment(this.data.startDate).startOf('date');
      const end=moment(this.data.endDate).startOf('date').add(1,'d');

      displayList = this.data.list
                    .filter((item) => 
                      moment(item.createdAt)>= start
                      && moment(item.createdAt)< end
                    );
    }
    const pageCount = Math.ceil(displayList.length / this.data.pageSize);
    let pageIndex=this.data.pageIndex > pageCount ? pageCount : this.data.pageIndex;

    this.setData({
      swipeIndex: null,
      pageCount: pageCount,
      displayList,
      pageIndex: pageIndex
    });
    this.onTabPage(pageIndex);
  },
});
