import {request} from './request';

export const getApiStatus=()=>
{
  return request.get({ url: 'api/v1/test/apirunning' });
};

export const getApiProtectedStatus=()=>
{
  return request.get({ url: 'api/v1/test/protected' });
};

export const getOrderById = (id)=>{
  return request.get({ url: `api/v1/orders/${id}` });
};

export const saveOrder = (id, data)=>{
  return request.post({ url: `api/v1/orders/${id}`, data: data});
};

export const deleteOrder = (id)=>{
  return request.delete({ url: `api/v1/orders/${id}`});
}