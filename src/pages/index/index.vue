<template>
    <div class="wrapper">
        <yx-slider :imageList="YXBanners" ></yx-slider>
        <scroll-view scroll-x="true" class="category-scroll">
            <navigator class="item" :url="item.categoryUrl" v-for="item of categoryList" :key="item.id">
                <img class="img" :src="item.iconUrl" background-size="cover" />
                <text class="text">{{item.name}}</text>
            </navigator>
        </scroll-view>
        <section class="hot-wrapper" v-for="item of topic" :key="item.id" >
           <topic :topic="item"></topic>
        </section>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import YXSlider from '../../components/YXSlider.vue';
    import Topic from '../../components/topic.vue';
    export default {
        mpType: 'page',
        mixins: [mixins],
        components: {
            'yx-slider': YXSlider,
            'topic': Topic
        },
        data () {
            return {
                YXBanners: [],
                categoryList: [],
                goodsList:[],
                topic: [],
                showLoading: 'hide',
                pageData: {
                    "pageNum": 1,
                    "pageSize": 10
                },
                scrollX: true
            }
        },
        created () {
            this.POST('api/home/ad', '', res => {
                let result = res.data.result;
                this.YXBanners = result
            });
            this.POST('api/home/topic', '', res => {
                let result = res.data.result;
                for (let item of result) {
                    item.topicMore = `/pages/category/index?id=${item.id}&type=topic`
                    for (let goods of item.goodsList) {
                        goods.goodsDetailUrl = `/pages/goodsDetail/index?id=${goods.id}`
                    }
                }
                this.topic = result
            });
            this.POST('api/mallCategory/list', this.pageData, res => {
                let result = res.data.result;
                for (let item of result) {
                    item.categoryUrl =  `/pages/category/index?id=${item.id}&type=category`
                }
                this.categoryList = result
            }, );
        },
        methods: {
        }
    }
</script>


<style scoped lang="scss">
    .wrapper {
        background-color: #ffffff;
        font-family:microsoft yahei;
    }
    .category-scroll {
        // display: flex;
        height: 214rpx;
        margin-top: 19rpx;
        background-color: #F9F9F9;
        width: 750rpx;
        white-space:nowrap;
        // flex-direction: row;
        // align-items: center;
        // flex-wrap: nowrap;
    }
    .category-scroll .item{
        width: 187.5rpx;
        height: 214rpx;
        // display: flex;
        // flex-direction: column;
        // justify-content: center;
        // align-items: center;
        display: inline-block;
    }
    .category-scroll .img {
        width: 100rpx;
        height: 100rpx;
        display: block;
        margin: 0 auto;
        margin-top:30rpx;
        margin-bottom: 12rpx;
    }
    .category-scroll .text {
        width: 187.5rpx;
        display: block;
        font-size: 24rpx;
        text-align: center;
        line-height: 1;
        color: #333;
    }
</style>