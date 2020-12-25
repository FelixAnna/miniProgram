import { request } from "./request";


const restricted_headers = [{"Ocp-Apim-Subscription-Key": "6834f3f9fd104027b18281c76eb806d6"}];
const unrestricted_headers = [{"Ocp-Apim-Subscription-Key": "619db91697ef4711b9eb3addff802a49"}];
/**************Test Api************** */
export const getApiStatus = () => {
  return request.get({ 
    url: "bo-app-test/test/running", 
    headers: unrestricted_headers
  });
};

/*********Login & user mangenent***************/
export const login = code => {
  return request.get({ 
    url: `bo-app-auth/auth/login/alipay?code=${code}`, 
    headers: unrestricted_headers 
  });
};

export const updateUserInfo = (nickName, photo) => {
  return request.post({
    url: `bo-app-user/users/alipay?name=${encodeURIComponent(
      nickName
    )}&photo=${encodeURIComponent(photo)}`, 
    headers: restricted_headers
  });
};
export const getUserInfo = code => {
  return request.get({ 
    url: `bo-app-user/users/alipay/info`, 
    headers: restricted_headers 
  });
};

/******************order managenent *************/
export const getOrderById = id => {
  return request.get({ 
    url: `bo-app-order/orders/${encodeURIComponent(id)}`, 
    headers: restricted_headers 
  });
};

export const createOrder = (options) => {
  return request.post({
    url: `bo-app-order/orders`,
    data: {
      options
    }, 
    headers: restricted_headers
  });
};

export const updateOrderOptions = (id, options) => {
  return request.post({
    url: `bo-app-order/orders/${id}`,
    data: {
      options
    }, 
    headers: restricted_headers
  });
};


export const removeOrder = id => {
  //as not support delete for now
  return request.delete({ 
    url: `bo-app-order/orders/${encodeURIComponent(id)}`, 
    headers: restricted_headers
  });
};

export const lockOrder = id => {
  return request.post({ 
    url: `bo-app-order/orders/${encodeURIComponent(id)}/lock`, 
    headers: restricted_headers 
  });
};

export const unlockOrder = id => {
  //as not support delete for now
  return request.post({ 
    url: `bo-app-order/orders/${encodeURIComponent(id)}/unlock`, 
    headers: restricted_headers 
  });
};
export const getOrders = (page, size, start, end) => {
  //as not support delete for now
  return request.get({    
    url: `bo-app-order/orders/list?page=${page}&size=${size}&startDate=${start}&endDate=${end}`, 
    headers: restricted_headers
  });
};

/******************order's product managenent *************/
export const addOrderItem = data => {
  return request.post({ 
    url: `bo-app-order/order-items`, 
    data: data , 
    headers: restricted_headers});
  };

export const removeOrderItem = id => {
  //as not support delete for now
  return request.delete({ 
    url: `bo-app-order/order-items/${id}`
    , headers: restricted_headers
  });
};
