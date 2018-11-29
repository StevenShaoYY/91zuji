<template>
    <div class="wrapper">
        <div>
            <img class="img" src="/static/images/bg_mine_top.png" background-size="cover" />
            <div>
                <img class="avata" src="/static/images/img_head_mine.png" background-size="cover" />
            </div>
            <div>
                未登录
            </div>
        </div>
        <div>
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/icon_massage_mine.png" alt="">
                <div>身份信息</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/tab_order_current.png" alt="">
                <div>我的订单</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/icon_collect_mine.png" alt="">
                <div>我的收藏</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/icon_comment_mine.png" alt="">
                <div>我的评论</div>
                <img class="right" src="/static/images/btn_next_mine.png" alt="">
            </navigator>
        </div>
        <div>
            <navigator class="my-set-container">
                <img class="icon" src="/static/images/icon_question_mine.png" alt="">
                <div>帮助中心</div>
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
   }
</style>