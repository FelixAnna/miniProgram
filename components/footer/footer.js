Component({
  data: {
    current_page: undefined
  },
  didMount() {
    let page=undefined;
    if(getCurrentPages().length>0){
      page=getCurrentPages()[getCurrentPages().length-1].__proto__.route
    }
    this.setData({
      current_page: JSON.stringify(page)
    });
  },
  didUpdate(prevProps, prevData) {
    let page=undefined;
    if(getCurrentPages().length>0){
      page=getCurrentPages()[getCurrentPages().length-1].__proto__.route
    }
    this.setData({
      current_page: JSON.stringify(page)
    });
  },
  methods: {
    backHome() {
      my.redirectTo({
        url:
          "/pages/index/index", // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        success: res => { }
      });
    },
    backHistory() {
      my.redirectTo({
        url: "/pages/orders/history/history",
        success: res => { }
      });
    },
    backOrder(){
      my.navigateBack();
    }
  },
});
