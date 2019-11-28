const baseUrl='http://localhost:59422';
const app = getApp();

export const request = (params) =>
{
  const {url, method, data, dataType, headers, complete} = params;
  const requestUrl=`${baseUrl}/${url}`;
  const tokenInfo=my.getStorageSync({
    key: 'tokenInfo', // 缓存数据的key
  }).data;
  const accesstoken=`Bearer ${encodeURIComponent(tokenInfo==undefined?"":tokenInfo.token)}`;

  return new Promise((resolve, reject) => {
    console.log("TCL: request -> requestUrl ", requestUrl)
    my.request({
      url: requestUrl,
      method: method || 'GET',
      dataType: dataType || 'json',
      data: data || {},
      headers: headers||{Authorization: accesstoken},
      success: (res) => {
        if (res.status === 200) {
            const { data } = res;
            resolve(data);
          } else {
            reject(res);
          }
      },
      fail: function(res) {
        reject(res);
      },
      complete: function(res) {
        if (complete) {
          complete(res);
        }
      }
    });
  });
};


/**
 * request post 的快捷调用
 */
request.post = params => {
  const newParams = {
    ...params,
    method: 'POST',
  };

  return request(newParams);
};

/**
 * request get 的快捷调用
 */
request.get = params => {
  const newParams = {
    ...params,
    method: 'GET',
  };

  return request(newParams);
};

/**
 * request get 的快捷调用
 */
request.delete = params => {
  const newParams = {
    ...params,
    method: 'DELETE',
  };

  return request(newParams);
};