import {baseURL,timeout} from './config.js'

export default function(options) {
 return new Promise((resolve,reject) => {
  wx.request({
    url: baseURL + options.url,
    method: options.method || 'get',
    timeout: timeout,
    data: options.data || null,
    success: (res) => {
      resolve(res.data)
    },
    fail: (err) => {
      reject(err)
    }
  })
 })
}