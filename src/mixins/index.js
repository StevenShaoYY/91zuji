
export default {
    methods: {
        jump(to) {
            // if (this.$router) {
            //     this.$router.push(to)
            // }
        },
        GET (api, callback, type) {
            let { platform } = this.$mp || {},
                request = ()=>{}
            let url = ''
            switch(platform) {
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
                url = `http://47.100.107.204:5018/api/${api}`
            }
            request && request({
                url,
                success: callback
            })
        },
        POST(api, data, callback, type) {
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
            if (type === 'user') {
                url = `http://fanyou.rank-tech.com:7001/${api}`
            } else {
                url = `http://fanyou.rank-tech.com:5018/${api}`
                // url = `http://47.100.107.204:5018/api/${api}`
            }
            request && request({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                url,
                success: callback,
                data
            })
        }

    }
}
