import debounce from '/util/debounce';
const productList= [
  {
    category: '盖浇饭',
    products: [
      { name: '猪脚饭', thumb: '/assets/products/icon_API.png', prices:[15,18,20,25], id: 10000001},
      { name: '珠尔凡', thumb: '/assets/products/icon_API_HL.png', prices:[15,18,20,25], id: 10000002},
      { name: '其他饭', thumb: '/assets/products/icon_API.png', prices:[15,18,20,25], id: 10000003},
      { name: '蜗牛饭', thumb: '/assets/products/icon_API_HL.png', prices:[15,18,20,25], id: 10000004},
      { name: '牛肉饭', thumb: '/assets/products/icon_API.png', prices:[15,18,20,25], id: 10000005},
      { name: '番茄饭', thumb: '/assets/products/icon_API_HL.png', prices:[15,18,20,25], id: 10000006},
      { name: '大米饭', thumb: '/assets/products/icon_API.png', prices:[15,18,20,25], id: 10000007},
      { name: '螃蟹饭', thumb: '/assets/products/icon_API_HL.png', prices:[15,18,20,25], id: 10000008}
    ]
  },
  {
    category: '面条',
    products: [
      { name: '番茄面', thumb: '/assets/products/icon_component.png', prices:[15,18,20,25], id: 10000201},
      { name: '猪脚面', thumb: '/assets/products/icon_component_HL.png', prices:[15,18,20,25], id: 10000202},
      { name: '蜗牛面', thumb: '/assets/products/icon_component.png', prices:[15,18,20,25], id: 10000203},
      { name: '大米面', thumb: '/assets/products/icon_component_HL.png', prices:[15,18,20,25], id: 10000204},
      { name: '螃蟹面', thumb: '/assets/products/icon_component.png', prices:[15,18,20,25], id: 10000205},
      { name: '牛肉面', thumb: '/assets/products/icon_component_HL.png', prices:[15,18,20,25], id: 10000206},
      { name: '注释面', thumb: '/assets/products/icon_component.png', prices:[15,18,20,25], id: 10000207}
    ]
  }
]
const hotProductList=[
  { name: '猪脚饭', thumb: '/assets/icon_API.png', prices:[15,18,20,25], id: 10000001},
  { name: '牛肉面', thumb: '/assets/icon_component_HL.png', prices:[15,18,20,25], id: 10000206},
  { name: '牛肉饭', thumb: '/assets/icon_API.png', prices:[15,18,20,25], id: 10000005}
];

Page({
  data: {
    value: '',
    history: my.getStorageSync({ key: 'searchHistory' }).data || [],
    hot: [],
    suggestions: [],
  },
  onLoad(e) {
    const orderId = parseInt(e.orderId);
    const shopId = parseInt(e.shopId);

    //productList=productList;
    //hotProductList=hotProductList;

    this.setData({
      history: my.getStorageSync({ key: 'searchHistory' }).data,
      hot: hotProductList,
      suggestions: productList,
      shopId: shopId,
      orderId
    });

    this.onInput = debounce(this.onInput.bind(this), 400);
    my.setNavigationBar({
      borderBottomColor: '#fff',
    });
  },
  clear() {
    my.confirm({
      content: '确定删除相关历史？',
      success: (res) => {
        if (res.confirm) {
          my.removeStorage({
            key: 'searchHistory',
            success: function(){
              console.log("历史记录已删除。");
            },
            fail: function(){
              console.log("删除失败！");
            }
          });
          this.setData({
            history: [],
          });
        }
      },
    })
  },
  onInput(keyword) {
    this.setData({
      value: keyword,
    });
    const regExp = /[A-Za-z]/;
    if (keyword === '' || (regExp.test(keyword) && keyword.length === 1)) {
      this.setData({
        suggestions: []
      });
      return;
    }
    const results = [];
    for (let i = 0; i < productList.length; i++) {
      const categoryItem={
            category: productList[i].category, 
            products: []
          }
       for (let j = 0; j < productList[i].products.length; j++) {
          if (productList[i].products[j].name.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) != -1) {
            categoryItem.products.push(productList[i].products[j]);
          }
       }
      if(categoryItem.products.length>0){
        results.push(categoryItem)
      }
    }

    this.setData({ suggestions: results })
  },
  onClear() {
    this.setData({
      value: '',
    });
  },
  onCancel() {
    this.setData({
      suggestions: productList,
      value: '',
    });
    my.navigateBack();
  },
  onPullDownRefresh(e){
    // 页面下拉时触发。e.from的值是“code”表示startPullDownRefresh触发的事件；值是“manual”表示用户下拉触发的下拉事件
    console.log('触发下拉刷新的类型', e.from);
  },
  onItemTap({ name }) {
    this.setData({
      value: name,
    });

    this.onInput(name);
  },
  onListItemTap(e) {
    const { name, id, prices } = e.target.dataset;
    this.addToHistory(name);
    this.saveSelection({ name, id, prices});
    my.navigateBack({url: '../product/add?orderId='+this.data.orderId+'&shopId='+this.data.shopId});
  },
  saveSelection(value) {
    let selection = my.getStorageSync({ key: 'selection' }).data || {};
    selection=value || {};
    my.setStorageSync({
        key: 'selection',
        data: selection,
    });
  },
  addToHistory(keyword) {
    const searchHistory = my.getStorageSync({ key: 'searchHistory' }).data || [];
    let index = -1;

    for (let i = 0; i < searchHistory.length; i++) {
      if (searchHistory[i].name === keyword) {
        index = i;
        break;
      }
    }

    let history = [];

    if (searchHistory.length >= 8) {
      if (index === -1) {
        history = [{ name: keyword }, ...searchHistory.slice(0, 7)];
      } else {
        searchHistory.splice(index, 1).slice(0, 7)
        history = [{ name: keyword }, ...searchHistory];
      }
    } else {
      if (index === -1) {
        history = [{ name: keyword }, ...searchHistory];
      } else {
        searchHistory.splice(index, 1) 
        history = [{ name: keyword }, ...searchHistory];
      }
    }

    my.setStorageSync({
      key: 'searchHistory',
      data: history,
    });

    this.setData({
      history,
    })
  }
});