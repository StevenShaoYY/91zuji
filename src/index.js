import App from './App'
import Vue from 'vue'
import VHtmlPlugin from '@megalo/vhtml-plugin'

Vue.use(VHtmlPlugin)

const app = new Vue(App)

app.$mount()

export default {
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: [
            'pages/index/index',
            'pages/finaceques/index',
            'pages/category/index',
            'pages/my/index',
            'pages/goodsDetail/index',
            'pages/helper/index',
            'pages/mycollect/index',
            'pages/mycomment/index',
            'pages/addressManage/index',
            'pages/placeOrder/index',
            'pages/xieyi/index',
            'pages/orderDetail/index',
            'pages/orderList/index',
            'pages/returnDevice/index',
            'pages/returnDeviceConfirm/index',
            'pages/realName/index',
            'pages/payrest/index',
            'pages/bindcard/index',
        ],
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '凡有e租',
            defaultTitle: '凡有e租',
            navigationBarTextStyle: 'black'
        },
        tabBar: {
            color: '#dddddd',
            textColor: '#dddddd',
            selectedColor: '#222222',
            backgroundColor: '#ffffff',
            list: [{
                    pagePath: 'pages/index/index',
                    iconPath: 'static/images/tab_home_normal.png',
                    selectedIconPath: 'static/images/tab_home_current.png',
                    text: '首页'
                },
                {
                    pagePath: 'pages/my/index',
                    iconPath: 'static/images/tab_mine_normal.png',
                    selectedIconPath: 'static/images/tab_mine_current.png',
                    text: '我的'
                }
            ],
            items: [{
                    pagePath: 'pages/index/index',
                    icon: 'static/images/tab_home_normal.png',
                    activeIcon: 'static/images/tab_home_current.png',
                    name: '首页'
                },
                {
                    pagePath: 'pages/my/index',
                    icon: 'static/images/tab_mine_normal.png',
                    activeIcon: 'static/images/tab_mine_current.png',
                    name: '我的'
                }
            ]
        }
    }
}