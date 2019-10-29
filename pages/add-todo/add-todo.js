const app = getApp();

Page({
  data: {
    inputName: '',
    inputPrice: '',
  },
  onLoad() {
    this.setData({
          user: app.userInfo,
        });
  },
  saveName(e) {
    this.setData({
      inputName: e.detail.value
    });
  },
  savePrice(e) {
    this.setData({
      inputPrice: e.detail.value
    });
  },

  add() {
    if(this.data.inputPrice>0 
      && this.data.inputName!==undefined 
      && this.data.inputName.length>0)
      {
        app.todos = app.todos.concat([
          {
            userId: this.data.user.nickName,
            name: this.data.inputName,
            price: this.data.inputPrice,
            compeleted: false,
          },
        ]);

        this.setData({
          inputName: '',
          inputPrice: ''
        });
      }
  }
});
