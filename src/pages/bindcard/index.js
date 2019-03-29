import App from './index'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
    config: {
        navigationBarTitleText: '银行卡绑定',
        // "usingComponents": {
        //     "van-notice-bar": "/vant-weapp/dist/notice-bar/index"
        // }
    }
}