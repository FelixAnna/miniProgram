import { request } from "./request";


/**************Test Api************** */
export const getApiStatus = () => {
  return request.get({ 
    url: "test/running", 
    open: true
  });
};

/*********Login & user mangenent***************/
export const login = code => {
  return request.post({ 
    url: `auth/alipay/login?code=${code}`, 
    open: true
  });
};

export const updateUserInfo = (nickName, photo) => {
  return request.post({
    url: `users/alipay?name=${encodeURIComponent(
      nickName
    )}&photo=${encodeURIComponent(photo)}`
  });
};
export const getUserInfo = code => {
  return request.get({ 
    url: `users/alipay/info`
  });
};

/******************order managenent *************/
export const getOrderById = id => {
  return request.get({ 
    url: `orders/${encodeURIComponent(id)}`
  });
};

export const createOrder = (options) => {
  return request.post({
    url: `orders`,
    data: {
      options
    }
  });
};

export const updateOrderOptions = (id, options) => {
  return request.post({
    url: `orders/${id}`,
    data: {
      options
    }
  });
};


export const removeOrder = id => {
  //as not support delete for now
  return request.delete({ 
    url: `orders/${encodeURIComponent(id)}`
  });
};

export const getOrders = (page, size, start, end) => {
  //as not support delete for now
  let url=`orders?page=${page}&size=${size}`;
  if(start) url+=`&startDate=${start}`
  if(end) url+=`&endDate=${end}`
  return request.get({    
    url
  });
};


export const lockOrder = id => {
  return request.post({ 
    url: `orders/${encodeURIComponent(id)}/lock`
  });
};

export const unlockOrder = id => {
  //as not support delete for now
  return request.post({ 
    url: `orders/${encodeURIComponent(id)}/unlock`
  });
};

/******************order's product managenent *************/
export const addOrderItem = data => {
  return request.post({ 
    url: `order-items`, 
    data: data
  });
};

export const removeOrderItem = id => {
  //as not support delete for now
  return request.delete({ 
    url: `order-items/${id}`
  });
};
