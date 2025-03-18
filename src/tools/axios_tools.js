import axios from 'axios'

let baseURL = process.env.REACT_APP_BASE_URL || process.env.REACT_APP_DEFAULT_BASE_URL;
console.log(`base url:\t` + baseURL);
export const request = axios.create({
    //根据运行环境来选择相应接口地址
    baseURL: baseURL,
    timeout: 6000, //设置超时
});

/*------------- 拦截器---------*/
// 请求拦截器
request.interceptors.request.use(function (config) {
    return config
}, function (err) {
    return Promise.reject(err)
})

// 响应拦截器
request.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (!error.response || !error.response.status) {
        return Promise.reject(error);
    }
    const status = error.response.status;
    console.err(status);
    return Promise.reject(error);
});