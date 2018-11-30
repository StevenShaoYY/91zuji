import App from './index'
import Vue from 'vue'

const app = new Vue( App )

app.$mount()

export default {
    config: {
        navigationBarTitleText: '我的收藏',
        // "usingComponents": {
        //     "van-notice-bar": "/vant-weapp/dist/notice-bar/index"
        // }
    }
}