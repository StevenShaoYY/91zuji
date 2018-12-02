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
            /*
            * demo 使用假数据
            */
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
            jumpWeb (_url) {
                // const url = this.$getConfig().bundleUrl;
                // navigator.push({
                //     url: util.setBundleUrl(url, 'page/webview.js?weburl='+_url) ,
                //     animated: "true"
                // });
            },
            onloading () {
                // modal.toast({ message: 'loading', duration: 0.3 })
                // this.showLoading = 'show';
                // setTimeout(() => {
                //     this.goodsList.push(...this.recommend.goods1);
                //     this.showLoading = 'hide'
                // }, 300)
            },
            onloadmore () {
                // modal.toast({ message: 'loading', duration: 0.3 })
                // setTimeout(() => {
                //     this.goodsList.push(...this.recommend.goods1);
                // }, 100)
            },
            loadingDown(){
                // this.goodsList =[];
                // this.goodsList.push(...this.recommend.goods2);
                // this.goodsList.push(...this.recommend.goods1);
            }
        }
    }
</script>


<style scoped lang="scss">
    @font-face {
        font-family: 'iconfont';  
        src: url('https://at.alicdn.com/t/font_404010_f29c7wlkludz33di.eot');
        src: url('https://at.alicdn.com/t/font_404010_f29c7wlkludz33di.eot?#iefix') format('embedded-opentype'),
        url('https://at.alicdn.com/t/font_404010_f29c7wlkludz33di.woff') format('woff'),
        url('https://at.alicdn.com/t/font_404010_f29c7wlkludz33di.ttf') format('truetype'),
        url('https://at.alicdn.com/t/font_404010_f29c7wlkludz33di.svg#iconfont') format('svg');
    }
    .wrapper {
        background-color: #ffffff;
        font-family:microsoft yahei;
    }
    .iconfont {
        font-family: "iconfont" !important;
    }
    .icon-favor:before { content: "\e64c"; }
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