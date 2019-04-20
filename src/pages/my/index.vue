<template>
    <div class="wrapper">
        <div class="section section1">
            <img class="img" src="/static/images/bg_mine_top.png" background-size="cover" />
            <!-- <div class="avata-container" v-if="!userInfo.avatar">
                <img class="avata" src="/static/images/img_head_mine.png" background-size="cover" />
            </div> -->
            <button class="btn-img" @getuserinfo="getUserInfoFunc" open-type="getUserInfo" v-if="!userInfo.avatarUrl">
                <img class="avata" src="/static/images/img_head_mine.png" background-size="cover" />
            </button>
            <div class="avata-container" v-if="userInfo.avatarUrl">
                <img class="avata" :src="userInfo.avatarUrl" background-size="cover" />
            </div>
            <div class="text" v-if="!userInfo.nickName">
                未登录
            </div>
            <div class="text" v-if="userInfo.nickName">
                {{userInfo.nickName}}
            </div>
        </div>
        <div class="section">
            <div class="my-set-container" @click="goToUrl('/pages/realName/index')">
                <img class="icon" src="/static/images/icon_massage_mine.png" alt="">
                <div class="set-text">实名认证</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
            <div class="my-set-container" @click="goToUrl('/pages/addressManage/index')">
                <img class="icon2" src="/static/images/ic_address.png" alt="">
                <div class="set-text">地址管理</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
            <div class="my-set-container" @click="goToUrl('/pages/orderList/index')">
                <img class="icon" src="/static/images/tab_order_current.png" alt="">
                <div class="set-text">我的订单</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
            <div class="my-set-container" @click="goToUrl('/pages/mycollect/index')">
                <img class="icon" src="/static/images/icon_collect_mine.png" alt="">
                <div class="set-text">我的收藏</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
            <div class="my-set-container" @click="goToUrl('/pages/mycomment/index')">
                <img class="icon" src="/static/images/icon_comment_mine.png" alt="">
                <div class="set-text">我的评论</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
        </div>
        <div class="section">
            <div class="my-set-container" @click="goToUrl('/pages/helper/index')">
                <img class="icon" src="/static/images/icon_question_mine.png" alt="">
                <div class="set-text">帮助中心</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
            <div class="my-set-container" @click="call">
                <img class="icon" src="/static/images/icon_help_mine.png" alt="">
                <div class="set-text">联系客服</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </div>
        </div>
        <login-dialog v-if="showLogin" @close="showLogin=false"></login-dialog>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import LoginDialog from '../../components/loginDialog.vue';
    export default {
        mpType: 'page',
        mixins: [mixins],
        components: {
            'login-dialog': LoginDialog
        },
        data () {
            return {
                showLogin: false,
                userInfo: {}
            }
        },
        created () {
            if(this.$mp.platform=='alipay') {
                my.getAuthCode({
                    scopes: 'auth_user',
                    success: (res) => {
                        my.getAuthUserInfo({
                            success: (userInfo) => {
                                this.userInfo = userInfo
                            }
                        });
                    },
                });
            } else {
                wx.getSetting({
                    success: res => {
                        if (res.authSetting['scope.userInfo']) {
                            wx.getUserInfo({
                                success: (res) => {
                                    console.log(res)
                                    this.userInfo = res.userInfo
                                }
                            });
                        }
                    }
                })
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        methods: {
            getUserInfoFunc(e) {
                if(e.detail.errMsg == "getUserInfo:ok") {
                    if(!this.checkLogin()){
                        this.showLogin=true
                    }
                    this.userInfo = e.detail.userInfo
                } else {
                    this.toast('获取授权失败！')
                }
            },
            call() {
                if(this.$mp.platform == 'alipay') {
                    my.makePhoneCall({ 
                        number: '0571-86507022' 
                    })
                } else {
                    wx.makePhoneCall({
                        phoneNumber: '0571-86507022'
                    })
                }
            },
            goToUrl(url) {
                if(!this.checkLogin()){
                    this.showLogin=true
                    return
                }
                if(this.$mp.platform === 'alipay') {
                    my.navigateTo({
                        url: url
                    })
                } else {
                    wx.navigateTo({
                       url: url
                    })
                }
            },
            checkLogin() {
                if(getApp().globalData.accessToken === '') {
                    return false
                } else {
                    return true
                }
            }
        }
    }
</script>


<style scoped lang="scss">
   .wrapper{
       height:100vh;
       background-color: #fff;
       font-family:microsoft yahei;
   }
   .section {
        width: 692rpx;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
        background-color: #fff;
   }
//    .section1 {
//        height: 240rpx;
//    }
   .img {
       border-radius: 20rpx;
       width: 692rpx;
       height: 400rpx;
   }
   .avata-container {
       width: 150rpx;
       height: 150rpx;
       border-radius: 75rpx;
       background-color: #fff;
       display: flex;
       justify-content: center;
       align-items: center;
       position: absolute;
       left:300rpx;
       top:145rpx;
   }
   .avata-container .avata{
       width: 140rpx;
       height: 140rpx;
       border-radius: 75rpx;
       background-color: #fff;
   }
   .btn-img{
       width: 150rpx;
       height: 150rpx;
       border-radius: 75rpx;
       background-color: #fff;
       display: flex;
       justify-content: center;
       align-items: center;
       position: absolute;
       left:300rpx;
       top:145rpx;
       padding: 0;
   }
   .btn-img .avata{
       width: 140rpx;
       height: 140rpx;
       border-radius: 75rpx;
       background-color: #fff;
   }
   .section1 .text {
       position: absolute;
       top:310rpx;
       width: 750rpx;
       left: 0;
       text-align: center;
       font-size: 32rpx;
   }
   .my-set-container {
       height: 90rpx;
       display: flex;
       flex-direction: row;
       margin: 0 30rpx;
   }
   .my-set-container + .my-set-container {
       border-top: 1rpx solid #f6f6f6
   }
   .icon {
       width: 40rpx;
       height: 40rpx;
       margin-top: 25rpx;
       margin-right: 20rpx;
   }
   .icon2 {
       width: 40rpx;
       height: 40rpx;
       margin-top: 25rpx;
       margin-right: 20rpx;
   }
   .right {
       width: 17rpx;
       height: 28rpx;
       margin-top: 31rpx;
   }
   .set-text{
       flex:1;
       line-height: 90rpx;
       font-size: 28rpx;
   }
</style>