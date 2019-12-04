// 获取全局 app 实例
const app = getApp();

Page({
  // 声明页面数据
  data: {},
  // 监听生命周期回调 onLoad
  onLoad() {
    // 获取用户信息并存储数据
    this.setData({
      user: app.userInfo
    });
  },
  // 监听生命周期回调 onShow
  onShow() {
    // 设置全局数据到当前页面数据
    this.setData({ todos: app.todos });
  },
  onShareAppMessage() {
    return {
      title: "线下点餐",
      desc: "成员分别进入也页面提交，一键生成团队订单",
      path: "pages/search/search?shopId=123"
    };
  },
  // 事件处理函数
  onTodoChanged(e) {
    // 修改全局数据
    const checkedTodos = e.detail.value;
    app.todos = app.todos.map(todo => ({
      ...todo,
      completed: checkedTodos.indexOf(todo.name) > -1
    }));
    this.setData({ todos: app.todos });
  },

  addTodo() {
    // 进行页面跳转
    my.navigateTo({ url: "../add-todo/add-todo" });
  }
});
