const app = getApp();

Page({
  data: {
    submitClicked: false,
    page: "index",
    id: undefined
  },
  onLoad(e) {
    const nodes=[
        {
          name: 'div',
          children: [{
            type: 'text',
            text: '本小程序旨在方便群组成员，好友等共同订餐，也可以辅助其它需要汇总和统计的任务。',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '1. 用户可以',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '新建订单',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '，然后',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '分享',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '给群友或好友；',
          }],
        },
        {
          name: 'div',
          children: [{
            type: 'text',
            text: '',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '2. 所有人都可以',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '打开此订单',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: ',并',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '添加商品',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '；',
          }],
        },
        {
          name: 'div',
          children: [{
            type: 'text',
            text: '',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '3. 全部编辑完成后，可以',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '提交',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '以锁定订单；',
          }],
        },
        {
          name: 'div',
          children: [{
            type: 'text',
            text: '',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '4. 然后可以',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '一键生成统计信息',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '；',
          }],
        },
        {
          name: 'div',
          children: [{
            type: 'text',
            text: '',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '5. 最后',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '手动复制',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '后可以',
          }],
        },
        {
          name: 'strong',
          children: [{
            type: 'text',
            text: '发送',
          }],
        },
        {
          name: 'span',
          children: [{
            type: 'text',
            text: '（借助通讯工具发送）给目标用户或用作其他用途。',
          }],
        },
    ]

    if(e.page){
      this.setData({
        page: e.page,
        id: e.id,
        nodes,
      })
    }else{
      this.setData({
        nodes,
      })
    }
  },
  onShow(){
    // 获取全局 app 实例
    const app2 = getApp();
    let tokenInfo = my.getStorageSync({
      key: 'botoken'
    }).data;
    if(!tokenInfo){
      return;
    }

    if (app2.userInfo) {
      my.redirectTo({
        url: this.getRedirectPage()
      });
    }
  },
  onGetAuthorize(e) {
      this.setData({submitClicked: true});
      app.getUserInfo().then(
        user => {
          console.log("start")
          console.log(user);
          console.log("end")
          my.redirectTo({
            url: this.getRedirectPage()
          });
          this.setData({submitClicked: false});
          return;
        },
        () => {/*  */
          this.setData({submitClicked: false});
          console.log("取消授权！");
        }
      );
  },
  onAuthError(){
    this.setData({submitClicked: false});
    console.log("授权失败！");
  },
  getRedirectPage(){
    if(this.data.page === "order")
    {
      return "/pages/orders/new/new?orderId="+this.data.id
    }else if(this.data.page === "history"){
      return "/pages/orders/history/history"
    }else{
      return "/pages/index/index"
    }
  }
});
