<template>
    <div class="wrapper">
        <div class="section section1">
            <img class="img" src="/static/images/bg_mine_top.png" background-size="cover" />
            <div class="avata-container">
                <img class="avata" src="/static/images/img_head_mine.png" background-size="cover" />
            </div>
            <div class="text">
                未登录
            </div>
        </div>
        <div class="section">
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/icon_massage_mine.png" alt="">
                <div class="set-text">实名认证</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container" url="/pages/addressManage/index">
                <img class="icon2" src="/static/images/address.png" alt="">
                <div class="set-text">地址管理</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container" url="/pages/orderList/index">
                <img class="icon" src="/static/images/tab_order_current.png" alt="">
                <div class="set-text">我的订单</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container" url="/pages/mycollect/index">
                <img class="icon" src="/static/images/icon_collect_mine.png" alt="">
                <div class="set-text">我的收藏</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container" url="/pages/mycomment/index">
                <img class="icon" src="/static/images/icon_comment_mine.png" alt="">
                <div class="set-text">我的评论</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
        </div>
        <div class="section">
            <navigator class="my-set-container" url="/pages/helper/index">
                <img class="icon" src="/static/images/icon_question_mine.png" alt="">
                <div class="set-text">帮助中心</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
        </div>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    // import Topic from '../../components/topic.vue';
    export default {
        mpType: 'page',
        mixins: [mixins],
        // components: {
        //     'yx-slider': YXSlider,
        //     'topic': Topic
        // },
        data () {
            return {
            }
        },
        created () {
            /*
            * demo 使用假数据
            */
            // this.POST('api/home/ad', '', res => {
            //     let result = res.data.result;
            //     this.YXBanners = result
            // });
        },
        methods: {
            
        }
    }
</script>


<style scoped lang="scss">
   .wrapper{
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
       width: 50rpx;
       height: 50rpx;
       margin-top: 20rpx;
       margin-right: 15rpx;
       margin-left: -5rpx;
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