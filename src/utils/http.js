/**
 * @description 封装请求
 * @name http
 */
import md5 from './md5'
import { Notification, MessageBox, Message } from 'element-ui'

// 缓存队列
let cacheMap = new Map()
/**
 * @description 检查请求是否被缓存
 * @param {String} key 每个请求唯一的md5码
 * @param {String} type DEFAULT|GET|POST 三种axios调用方式
 * @param {Object} data 配置信息
 */
let checkCache = function (key, type, data) {
    let { url, params, config } = data
    let cache = config.cache
    let timeout = config.timeout
    if (!cache || !cacheMap.has(key)) {
        // log输出只是为了回头查bug用
        // console.log(
        //     `[UTILS.HTTP] 正在发送最新请求[${key}](${type}) => `,
        //     url || config.url
        // )
        switch (type) {
            case 'GET':
                cacheMap.set(key, {
                    promise: get(url, config),
                })
                break
            case 'POST':
                cacheMap.set(key, {
                    promise: post(url, params),
                })
                break
            case 'JSONP':
                cacheMap.set(key, {
                    promise: new Promise((resolve, reject) => {
                        // 防止函数名冲突
                        let funcName = `jsonp${Date.now()}`
                        let time = null,
                            scriptNode
                        // 定义callback
                        window[funcName] = function (data) {
                            if (timeout) clearTimeout(time)
                            resolve(data)
                            // 很重要的性能优化点
                            // 清除本次请求产生的回调函数和script标签
                            delete window[funcName]
                            document.body.removeChild(scriptNode)
                        }
                        // 创建script标签
                        scriptNode = document.createElement('script')
                        // 给script标签添加src属性
                        scriptNode.src = `${url}?callback=${funcName}`
                        // 发出请求
                        document.body.appendChild(scriptNode)
                        time = setTimeout(() => {
                            reject('Network Error! TIMEOUT')
                        }, timeout)
                        // 失败
                        scriptNode.onerror = function (err) {
                            reject(err)
                        }
                    }),
                })
                break
            default:
                return Promise.reject(new TypeError('未知的请求方式'))
        }
        cacheMap
            .get(key)
            .promise.catch((e) => {
                console.error(`[UTILS.HTTP] <<< ERROR >>>`, e)
                cacheMap.delete(key)
                console.log(`[UTILS.HTTP] 删除缓存[${key}]!`)
            })
            .finally(() => {
                // console.log(`[UTILS.HTTP] 请求[${key}]结束!`)
            })
    } else {
        // log输出只是为了回头查bug用
        // console.log(`[UTILS.HTTP] 使用缓存[${key}]! => ${url || config.url}`)
    }
    return cacheMap.get(key).promise
}

/**
 * @description 封装http
 * @param {Object} config 配置项
 */
let http = function (config = {}) {
    let { method, url, data } = config
    let key
    if (method.toUpperCase() === 'GET') {
        // get 请求只看url和cache参数来判断是否缓存
        key = md5('GET' + url)
    } else {
        // post 请求
        // 先不排查data内部的格式，理论上传的都是string和number，就算有json内部也一样
        let paramStr = ''
        if (
            Object.prototype.toString.call(data) == '[object URLSearchParams]'
        ) {
            paramStr = data.toString()
        } else {
            paramStr = JSON.stringify(data)
        }
        key = md5('POST' + url + paramStr)
    }
    return checkCache(key, 'DEFAULT', {
        config,
    })
}

/**
 * @description 封装get(url, config)
 * @param {String} url 请求地址
 * @param {Object} config 配置项
 */
http.get = function (url, config = {}) {
    let paramStr = ''
    if (config.params) {
        // 这逻辑就不应该加
        console.warn(
            `[UTILS.HTTP] <<< WARNING >>> GET Request with params! url:${url}`
        )
        paramStr = JSON.stringify(config.params)
    }
    return checkCache(md5('GET' + url + paramStr), 'GET', {
        url,
        config,
    })
}

/**
 * @description 封装post(url, params, config)
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 配置项
 */
http.post = function (url, params, config = {}) {
    let paramStr = ''
    if (Object.prototype.toString.call(params) == '[object URLSearchParams]') {
        paramStr = params.toString()
    } else {
        paramStr = JSON.stringify(params)
    }
    return checkCache(md5('POST' + url + paramStr), 'POST', {
        url,
        params,
        config,
    })
}

/**
 * @description jsonp请求
 * @param {String} url 请求地址
 * @param {Object} params 请求参数
 * @param {Object} config 配置项
 */
http.jsonp = function (url, params, config = {}) {
    return checkCache(md5('JSONP' + url), 'JSONP', {
        url,
        params,
        config,
    })
}

/**
 * @description 模拟jquery.ajax请求
 * @param {Object} config 请求配置
 *      config.url 请求地址
 *      config.data 请求参数
 */
http.postAjax = http.ajax = (config) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    resolve(xhr.response)
                } else {
                    reject(`xhr.status => ${xhr.status}`)
                }
            } else {
                reject(`xhr.readyState => ${xhr.readyState}`)
            }
        }
        xhr.open('POST', config.url, true) // 如果后台接收的是json格式数据，需要这样设置请求头
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(config.data))
    })
}

// 暴露缓存队列
http.cacheMap = cacheMap

// TODO. 需要增加自动清空缓存队列的功能

// TODO. 需要增减手动清空缓存队列的功能

export const get = (url) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)

        xhr.setRequestHeader(
            'Accept',
            'application/json, text/javascript, */*; q=0.01'
        )
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        resolve(JSON.parse(this.responseText), this)
                    } catch (error) {
                        resolve(this.responseText)
                    }
                } else {
                    var resJson = {
                        code: this.status,
                        response: this.response,
                    }
                    reject(resJson, this)
                }
            }
        }

        // 根据状态status处理相应错误监听
        xhr.addEventListener('load', statusCheck)

        xhr.send()
    })
}

function _addParam(key, value) {
    // If value is a function, invoke it and return its value
    value =
        Object.prototype.toString.call(value) === 'Function'
            ? value()
            : value == null
            ? ''
            : value
    return encodeURIComponent(key) + '=' + encodeURIComponent(value)
}

/* 封装的原生post请求 */
export const post = (url, data) => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', url, true)

        xhr.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded; charset=utf-8'
        )
        xhr.setRequestHeader(
            'Accept',
            'application/json, text/javascript, */*; q=0.01'
        )
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    try {
                        resolve(JSON.parse(this.responseText), this)
                    } catch (error) {
                        resolve(this.responseText)
                    }
                } else {
                    var resJson = {
                        code: this.status,
                        response: this.response,
                    }
                    reject(resJson, this)
                }
            }
        }

        let postDataArr = []
        for (var key in data) {
            postDataArr.push(_addParam(key, data[key]))
        }

        // 根据状态status处理相应错误监听
        xhr.addEventListener('load', statusCheck)

        xhr.send(postDataArr.join('&').replace(/%20/g, '+'))
    })
}

/**
 * @description 状态检测（错误信息拦截器）
 * @param {Event} reqEvent
 */
const statusCheck = (reqEvent) => {
    if (reqEvent.currentTarget.status !== 200) {
        let connectPerson = ''
        if (reqEvent.currentTarget.status === 500) {
            connectPerson = '请联系后端开发！'
        } else if (reqEvent.currentTarget.status === 401) {
            connectPerson = '当前未登录或登录过期，请登录！'
            tip('当前未登录或登录过期，请登录！', 401)
        } else if (reqEvent.currentTarget.status === 403) {
            connectPerson = '您的账户没有权限，请联系项目组人员！'
            tip('您的账户没有权限，请联系项目组人员！', 403)
        } else if (reqEvent.currentTarget.status === 404) {
            connectPerson = '当前请求无法访问，请联系运维组人员！'
            tip('当前请求无法访问，请联系运维组人员！', 404)
        }
        if (reqEvent.currentTarget.status !== 501) {
            let errMsg = `请求发生错误，错误的url：${reqEvent.currentTarget.responseURL}，错误信息：${reqEvent.currentTarget.responseText}  ${connectPerson}`;
                console.error(errMsg);
            // Notification.error({
            //     title: `请求发生错误`,
            //     dangerouslyUseHTMLString: true,
            //     message: `<h5>错误的url：</h5>
            //      <div>${reqEvent.currentTarget.responseURL}</div>
            //      <h5>错误信息：</h5>
            //      <div>${reqEvent.currentTarget.responseText}  ${connectPerson}</div>`,
            // })
        } else {
            console.log(
                '接口501了，现在501的请求接口不再弹出右侧的框，可在catch里拿到信息'
            )
        }
    } else {
        try {
            let responseText = reqEvent.currentTarget.responseText
            responseText = JSON.parse(responseText)
            if (
                !(
                    Array.isArray(responseText.data) &&
                    !!responseText.data[0] &&
                    Object.prototype.toString.call(responseText.data[0]) ===
                        '[object Object]'
                )
            ) {
                let errMsg = `请求返回格式非通用格式,错误的url：${reqEvent.currentTarget.responseURL}，返回格式：${reqEvent.currentTarget.responseText}`;
                console.error(errMsg);
                // Notification.error({
                //     title: `请求返回格式非通用格式`,
                //     dangerouslyUseHTMLString: true,
                //     message: `<h5>错误的url：</h5>
                //    <div>${reqEvent.currentTarget.responseURL}</div>
                //    <h5>返回格式：</h5>
                //    <div>${reqEvent.currentTarget.responseText}</div>`,
                // })
            }
        } catch (error) {
            let errMsg = `请求返回数据解析错误，错误的url：${reqEvent.currentTarget.responseURL}，错误信息：${error}，返回格式：${reqEvent.currentTarget.responseText}`;
                console.error(errMsg);
            // Notification.error({
            //     title: `请求返回数据解析错误`,
            //     dangerouslyUseHTMLString: true,
            //     message: `<h5>错误的url：</h5>
            //    <div>${reqEvent.currentTarget.responseURL}</div>
            //    <h5>错误信息：</h5>
            //    <div>${error}</div>
            //    <h5>返回格式：</h5>
            //    <div>${reqEvent.currentTarget.responseText}</div>`,
            // })
        }
    }
}

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg, status) => {
    if (status === 401 || status === 403)
        MessageBox.alert(msg, '警告', {
            confirmButtonText: '确定',
            type: 'warning',
        }).then(() => {
            if (window != top) {
                top.open(
                    '/login?toUrl=/index.html',
                    'loginPopupWindow',
                    'top=200,left=400,width=370,height=335,directories=no,menubar=no,toolbar=no'
                )
            } else {
                window.open(
                    '/login?toUrl=/index.html',
                    'loginPopupWindow',
                    'top=200,left=400,width=370,height=335,directories=no,menubar=no,toolbar=no'
                )
            }
        })
}

export default http
