import {request} from './request';

export const getApiStatus=()=>
{
  return request.get({ url: 'test/apirunning' });
};

export const getApiProtectedStatus=()=>
{
  return request.get({ url: 'test/protected' });
};

/*********Login***************/
export const login = (code)=>{
  return request.get({ url: `auth/login/alipay?code=${code}`});
};

/******************order manage *************/
export const getOrderById = (id)=>{
  return request.get({ url: `orders/${id}` });
};

export const saveOrder = (id, data)=>{
  return request.post({ url: `orders/${id}`, data: data});
};

export const deleteOrder = (id)=>{
  return request.delete({ url: `orders/${id}`});
}

/******************order's product manage *************/
export const addOrderProduce = (id, data)=>{
  return request.post({ url: `orders/${id}/products/add`, data: data});
};

export const deleteOrderProduct = (id, productId)=>{
  return request.delete({ url: `orders/${id}/products/${productId}`});
}