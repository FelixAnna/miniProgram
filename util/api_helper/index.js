import { request } from "./request";

/**************Test Api************** */
export const getApiStatus = () => {
  return request.get({ url: "test/running" });
};

/*********Login & user mangenent***************/
export const login = code => {
  return request.get({ url: `auth/login/alipay?code=${code}` });
};

export const updateUserInfo = (nickName, photo) => {
  return request.post({
    url: `users/alipay?name=${encodeURIComponent(
      nickName
    )}&photo=${encodeURIComponent(photo)}`
  });
};
export const getUserInfo = code => {
  return request.get({ url: `users/alipay/info` });
};

/******************order managenent *************/
export const getOrderById = id => {
  return request.get({ url: `orders?orderId=${encodeURIComponent(id)}` });
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
    url: `orders/${id}/options`,
    data: {
      options
    }
  });
};


export const removeOrder = id => {
  //as not support delete for now
  return request.post({ url: `orders/remove?orderId=${encodeURIComponent(id)}` });
};

export const lockOrder = id => {
  //as not support delete for now
  return request.post({ url: `orders/${encodeURIComponent(id)}/lock` });
};

export const unlockOrder = id => {
  //as not support delete for now
  return request.post({ url: `orders/${encodeURIComponent(id)}/unlock` });
};
export const getOrders = (page, size, start, end) => {
  //as not support delete for now
  return request.get({
    url: `orders/list?page=${page}&size=${size}&startDate=${start}&endDate=${end}`
  });
};

/******************order's product managenent *************/
export const addOrderItem = data => {
  return request.post({ url: `orders/items`, data: data });
};

export const removeOrderItem = id => {
  //as not support delete for now
  return request.post({ url: `orders/items/remove?orderItemId=${id}` });
};
