const baseUrl='https://sl.schroders.com';
const app = getApp();

export const request = (params) =>
{
  const {url, method, data, dataType, headers, complete} = params;
  const requestUrl=`${baseUrl}/${url}`;
  
  return new Promise((resolve, reject) => {
    console.log("TCL: request -> requestUrl ", requestUrl)
    my.request({
      url: requestUrl,
      method: method || 'GET',
      dataType: dataType || 'json',
      data: data || {},
      headers: headers||{username: encodeURIComponent(app.userInfo.nickName)},
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