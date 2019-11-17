import {request} from './request';

export const getApiStatus=()=>
{
  return request.get({ url: 'api/v1/test/apirunning' });
};

export const getApiProtectedStatus=()=>
{
  return request.get({ url: 'api/v1/test/protected' });
};

/*********Login***************/
export const login = (code)=>{
  return request.post({ url: `api/v1/auth?code=${code}`});
};

/******************order manage *************/
export const getOrderById = (id)=>{
  return request.get({ url: `api/v1/orders/${id}` });
};

export const saveOrder = (id, data)=>{
  return request.post({ url: `api/v1/orders/${id}`, data: data});
};

export const deleteOrder = (id)=>{
  return request.delete({ url: `api/v1/orders/${id}`});
}

/******************order's product manage *************/
export const addOrderProduce = (id, data)=>{
  return request.post({ url: `api/v1/orders/${id}/products/add`, data: data});
};

export const deleteOrderProduct = (id, productId)=>{
  return request.delete({ url: `api/v1/orders/${id}/products/${productId}`});
}