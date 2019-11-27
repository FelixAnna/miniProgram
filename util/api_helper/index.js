import {request} from './request';

/**************Test Api************** */
export const getApiStatus=()=>
{
  return request.get({ url: 'test/running' });
};

/*********Login & user mangenent***************/
export const login = (code)=>{
  return request.get({ url: `auth/login/alipay?code=${code}`});
};

export const updateUserInfo = (nickName, photo)=>{
  return request.post({url: `users/alipay?name=${nickName}&photo=${photo}`})
}
export const getUserInfo = (code)=>{
  return request.get({ url: `users/alipay/info`});
};

/******************order managenent *************/
export const getOrderById = (id)=>{
  return request.get({ url: `orders?orderId=${id}` });
};

export const createOrder = (id, shopId)=>{
  return request.post({ url: `orders`, 
  data: {
    orderId: id,
    shopId: shopId
  }
});
};

export const removeOrder = (id)=>{
  //as not support delete for now
  return request.post({ url: `orders/remove?orderId=${id}`});
}

export const lockOrder = (id)=>{
  //as not support delete for now
  return request.post({ url: `orders/${id}/lock`});
}

export const unlockOrder = (id)=>{
  //as not support delete for now
  return request.post({ url: `orders/${id}/unlock`});
}
export const getOrders = (id, page, size)=>{
  //as not support delete for now
  return request.get({ url: `orders/list?orderId=${id}&page=${page}&size=${size}`});
}

/******************order's product managenent *************/
export const addOrderItem = (id, data)=>{
  return request.post({ url: `orders/items`, 
  data: {
    "orderId": "string",
    "productId": 0,
    "name": "string",
    "price": 0,
    "remark": "string",
    "options": [
      {
        "name": "string",
        "value": true
      }
    ]
  }
});
};

export const removeOrderItem = (id)=>{
  //as not support delete for now
  return request.post({ url: `orders/items/remove?orderItemId=${id}`});
}