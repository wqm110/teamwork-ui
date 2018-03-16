/**
 * Created by vilson on 2017/5/8.
 */
import axios from "axios"
import * as utils from './utils'
import {Message,Notice,LoadingBar} from 'iview'
import config from '../../assets/js/config'

// let globalXHR = {},
//     goErrorPage = redirect => {
//         if (redirect) {
//             window.location = 'http://localhost:8090/#/login'
//         }
//     }
const NODE_ENV = config.NODE_ENV
const PROD_URL = config.PROD_URL
const WEB_URL = config.WEB_URL
let baseUrl = ''
if (NODE_ENV === 'production') {
  baseUrl = PROD_URL
}

class Ajax {
  constructor(opt = {}) {
    this.url = opt.url || ''
    this.baseURL = opt.baseURL || baseUrl
    this.url = utils.getApiUrl(this.url)
    this.headers = opt.headers ||
      {
        'Token': null === utils.getStore('token') ? '' : utils.getStore('token'),
        'Menu': 'ss',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    this.options = {
      url: this.url,
      baseURL: this.baseURL || '',
      method: opt.method || 'get',
      data: opt.data || {},
      headers: this.headers,
      before: opt.before, ////请求前回调
      success: opt.success, //请求成功回调
      fail: opt.fail, //请求成功，服务器返回异常回调
      catch: opt.catch || opt.fail, //请求失败回调
      cache: opt.cache || false,
      redirect: opt.redirect || false
    }
  }

  create(options = this.options) {
    let self = this,
      settings = {
        baseURL: options.baseURL,
        url: options.url,
        method: options.method,
        headers: options.headers,
      }
    if (options.method === 'get') {
      settings.params = options.data
    } else {
      settings.data = options.data
    }

    let instance = axios.create(settings) //实例化axios

    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      options = self.options
      if (typeof options.before === 'function') {
        options.before(config)
      }
      return config
    }, function (error) {
      return Promise.reject(error);
    })

    //请求快捷方式
    if (options.method === 'get') {
      instance.get(options.url).then(function (response) {
        self.handleSuccess(response, options)
      }).catch(function (response) {
        options = self.options
        if (typeof options.catch === 'function') {
          options.catch(response)
        }
      })
    } else if (options.method === 'delete') {
      instance.delete(options.url).then(function (response) {
        self.handleSuccess(response, options)
      }).catch(function (response) {
        options = self.options
        if (typeof options.catch === 'function') {
          options.catch(response)
        }
      })
    } else if (options.method === 'post') {
      const querystring = require('querystring')
      instance.post(options.url, querystring.stringify(settings.data)).then(function (response) {
        self.handleSuccess(response, options)
      }).catch(function (response) {
        options = self.options
        if (typeof options.catch === 'function') {
          options.catch(response)
        }
      })
    } else if (options.method === 'put') {
      instance.put(options.url, settings.data).then(function (response) {
        self.handleSuccess(response, options)
      }).catch(function (response) {
        options = self.options
        if (typeof options.catch === 'function') {
          options.catch(response)
        }
      })
    }
    return instance
  }

  handleSuccess(response, options = this.options) {
    // LoadingBar.finish()
    let self = this
    if (this.options.method === 'jsonp') {
      response = response.body
    }
    response = response.data
    if (response.ret > 0) { // 请求成功
      if (response.ret < 300) { // 正常请求
        // goErrorPage(options.redirect && !response.data.data);
        if (typeof options.success === 'function') {
          options.success(response)
          // local.save(response, self.url + '|' + options.method);
        }
      } else { //客户端或服务器端异常
        LoadingBar.finish()
        if (typeof options.fail === 'function') {
          options.fail(response)
        }
        if (response.ret === 499 || response.ret === 401) { //未登录
          Message.destroy()
          Message.warning('登录超时，请重新登录')
          setTimeout(function () {
            if (options.baseURL !== '') {
              window.location = WEB_URL + '/#/login'
            } else {
              window.location = 'http://192.168.1.183:8090/#/login'
            }
          }, 0)
        } else if (response.ret < 500) {
          Notice.warning({
            title: '请求错误 ' + response.ret,
            desc: response.msg,
            duration: 5
          })
          // Message.warning({
          //   content: response.msg,
          //   duration: 5
          // })
        } else {
          Notice.warning({
            title: '请求错误 ' + response.ret,
            desc: '路径：' + self.url + '，' +
            response.msg || '未知错误，请联系管理员或稍后重试' +
            '。',
            duration: 5
          })
          // Message.warning(
          //   {
          //     content: '路径 ' +
          //     self.url +
          //     ' 出现错误（' +
          //     response.ret +
          //     '）：' +
          //     response.msg || '未知错误，请联系管理员或稍后重试' +
          //     '。',
          //     duration: 5
          //   }
          // )
        }
        // goErrorPage(options.redirect);
      }
    } else {
      if (typeof options.fail === 'function') {
        options.fail(response)
      }
      Notice.warning({
        title: '请求错误 ' + response.ret,
        desc:  '路径 ' +
        self.url +
        ' 出现错误，请联系管理员或稍后重试。',
        duration: 5
      })
      // Message.warning(
      //   '路径 ' +
      //   self.url +
      //   ' 出现错误，请联系管理员或稍后重试。',
      //   5
      // )
      // goErrorPage(options.redirect);
    }
  }
}

export {Ajax as Ajax}
