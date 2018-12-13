export default {
    methods: {
        jump(to) {
            // if (this.$router) {
            //     this.$router.push(to)
            // }
        },
        GET(api, callback, type) {
            let { platform } = this.$mp || {},
                request = () => {}
            let url = ''
            switch (platform) {
                case 'wechat':
                    request = wx && wx.request
                    break;
                case 'alipay':
                    request = my && my.httpRequest
                    break;
                case 'swan':
                    request = swan && swan.request
                    break;
                default:
                    break;
            }
            if (type === 'user') {
                url = `http://fanyou.rank-tech.com:7001/${api}`
            } else {
                url = `http://fanyou.rank-tech.com/api/${api}`
            }
            request && request({
                url,
                success: callback
            })
        },
        POST(api, data, callback, type) {
            var appInstance = getApp()
            let globalData = appInstance.globalData;
            let accToken = globalData.accessToken
            let {
                platform
            } = this.$mp || {},
                request = () => {}
            let url = ''
            switch (platform) {
                case 'wechat':
                    request = wx && wx.request
                    break;
                case 'alipay':
                    request = my && my.httpRequest
                    break;
                case 'swan':
                    request = swan && swan.request
                    break;
                default:
                    break;
            }
            //生产环境
            // let baseUrl = 'https://fanyou.rank-tech.com:7002'
            //开发环境
            let baseUrl = 'https://prod2.fanyoutech.com:7002'
            // let baseUrl = 'http://192.168.0.220:9999'
            if (type === 'user') {
                url = `${baseUrl}/user/${api}`
            } else {
                url = `${baseUrl}/mall/${api}`
            }
            request && request({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'ACCESS_TOKEN': accToken
                },
                header: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'ACCESS_TOKEN': accToken
                },
                url,
                success: callback,
                fail: (cb) => {
                    if (this.$mp.platform === 'alipay') {
                        my.showToast({
                            type: 'none',
                            content: '网络请求失败！',
                            duration: 3000,
                            success: () => {
                                console.log('success')
                            },
                        });
                    } else {
                        wx.showToast({
                            title: '网络请求失败！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                },
                data: JSON.stringify(data)
            })
        },
        uploadFile(api, fileType, fileName, filePath, formData,callback, type) {
            var appInstance = getApp()
            let globalData = appInstance.globalData;
            let accToken = globalData.accessToken
            let {
                platform
            } = this.$mp || {},
                request = () => { }
            let url = ''
            switch (platform) {
                case 'wechat':
                    request = wx && wx.uploadFile
                    break;
                case 'alipay':
                    request = my && my.uploadFile
                    break;
                case 'swan':
                    request = swan && swan.uploadFile
                    break;
                default:
                    break;
            }
            //生产环境
            // let baseUrl = 'https://fanyou.rank-tech.com:7002'
            //开发环境
            let baseUrl = 'https://prod2.fanyoutech.com:7002'
            // let baseUrl = 'http://192.168.0.220:9999'
            if (type === 'user') {
                url = `${baseUrl}/user/${api}`
            } else {
                url = `${baseUrl}/mall/${api}`
            }
            request && request({
                header: {
                    'ACCESS_TOKEN': accToken
                },
                url,
                filePath,
                fileType, 
                fileName, 
                formData,
                success: callback,
                fail: (cb) => {
                    if (this.$mp.platform === 'alipay') {
                        my.showToast({
                            type: 'none',
                            content: '网络请求失败！',
                            duration: 3000,
                            success: () => {
                                console.log('success')
                            },
                        });
                    } else {
                        wx.showToast({
                            title: '网络请求失败！',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
        }

    }
}