Component({
  data: {
  },
  methods: {
    backHome() {
      my.switchTab({
        url:
          "/pages/index/index", // 需要跳转的应用内非 tabBar 的目标页面路径 ,路径后可以带参数。参数规则如下：路径与参数之间使用
        success: res => { }
      });
    },
    backHistory() {
      my.switchTab({
        url: "/pages/orders/history/history",
        success: res => { }
      });
    },
  },
});
