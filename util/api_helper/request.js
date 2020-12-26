const baseUrl = "https://bo-app-apm.azure-api.net";
const app = getApp();

const apim_header_key = "Ocp-Apim-Subscription-Key";
const apim_header_value_restricted = "6834f3f9fd104027b18281c76eb806d6";
const apim_header_value_open = "619db91697ef4711b9eb3addff802a49";

export const request = params => {
  const { url, method, data, dataType, headers, complete, open } = params;
  const requestUrl = `${baseUrl}/${url}`;
  let new_headers = headers || {};
  if(open) {
    new_headers[apim_header_key] = apim_header_value_open;
  } else {
    const tokenInfo = my.getStorageSync({
      key: "botoken" // 缓存数据的key
    }).data;
    const accesstoken = `Bearer ${encodeURIComponent(
      tokenInfo == undefined ? "" : tokenInfo.token
    )}`;
    new_headers["Authorization"] = accesstoken;
    new_headers[apim_header_key] = apim_header_value_restricted;
  }

  return new Promise((resolve, reject) => {
    console.log("TCL: request -> requestUrl ", requestUrl);
    my.request({
      url: requestUrl,
      method: method || "GET",
      dataType: dataType || "json",
      data: data || {},
      headers: new_headers,
      success: res => {
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
    method: "POST"
  };

  return request(newParams);
};

/**
 * request get 的快捷调用
 */
request.get = params => {
  const newParams = {
    ...params,
    method: "GET"
  };

  return request(newParams);
};

/**
 * request get 的快捷调用
 */
request.delete = params => {
  const newParams = {
    ...params,
    method: "DELETE"
  };

  return request(newParams);
};
