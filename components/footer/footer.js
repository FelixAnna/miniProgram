Component({
  data: {
    current_page: JSON.stringify(getCurrentPages()[getCurrentPages().length-1].__proto__.route)
  },
  methods: {
    backHome() {
      if(current_page.indexOf('index')>0){
        return;
      }
      my.redirectTo({
        url:
          "/pages/index/index", // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        success: res => { }
      });
    },
    backHistory() {
      if(current_page.indexOf('history')>0){
        return;
      }

      my.redirectTo({
        url: "/pages/orders/history/history",
        success: res => { }
      });
    },
  },
});
