import App from './index'
import Vue from 'vue'

const app = new Vue( App )

app.$mount()

export default {
    config: {
        navigationBarTitleText: '订单列表', 
        pullRefresh: true,
        enablePullDownRefresh: true
        // "usingComponents": {
        //     "van-notice-bar": "/vant-weapp/dist/notice-bar/index"
        // }
    }
}