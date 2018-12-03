<template>
    <view class="container">
        <ul class="tab-list">
            <li class="ta-li" v-for="(item,index) of tabList" :key="index" :class="{'active':index==activeItem}" @click="switchTab(index)">
            {{item.remark}}
            </li>
        </ul>
        <swiper class="swiper-container" :current="activeItem" duration="300" @change="switchTabBySwiper" :style="{height:winHeight+'rpx'}" skip-hidden-item-layout="true">
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    <!-- <div class="comment-container has-comment" v-if="commentList.length>0">
                        <comment-card v-for="(item, index) of commentList" :key="index" :commentItem="item"></comment-card>
                    </div>
                    <div class="comment-container no-comment-container" v-if="commentList.length==0">
                        <div class="no-comment">暂无评论</div>
                    </div> -->
                </scroll-view>
            </swiper-item>
        </swiper>
</template>

<script>
    import mixins from '../../mixins'
    import OrderCard from '../../components/orderCard.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins],
        components: {
            'order-card': OrderCard
        },
        data () {
            return {
                tabList: [],
                activeItem: 0,
                detailList: {},
                winHeight: ''
            }
        },
        created () {
            if (this.$mp.platform === 'wechat') {
                wx.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR - 110;
                        this.winHeight = calc
                    }
                });
            } else {
                my.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR - 110;
                        this.winHeight = calc
                    }
                });
            }
            this.getOrderData()
        },
        onPullDownRefresh() {
            let sta = this.tabList[this.activeItem].status
            this.getOrderByStatus(sta)
        },
        methods: {
            getOrderData () {
                this.POST('api/tradeOrder/statusList', '', res => {
                    let result = res.data.result;
                    this.tabList = result
                    this.getOrderByStatus(this.tabList[0].status)
                });
            },
            getOrderByStatus(sta) {
                let dto = {
                    "orderStatus": sta,
                    "pageNum": 0,
                    "pageSize": 0
                }
                this.POST('api/tradeOrder/list', dto, res => {
                    let result = res.data.result;
                    this.detailList[sta] = result
                    if (this.$mp.platform === 'alipay') {
                        my.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                    }
                });
            },
            switchTabBySwiper (e) {
                console.log(11111)
                this.activeItem = e.detail.current
                let sta = this.tabList[this.activeItem].status
                this.getOrderByStatus(sta)
            },
            switchTab (index) {
                console.log(2222)
                this.activeItem = index
                // let sta = this.tabList[this.activeItem].status
                // this.getOrderByStatus(sta)
            }
        }
    }
</script>


<style scoped lang="scss">
    .wrapper{
        background-color: #fff;
        font-family:microsoft yahei;
    }
    .tab-list {
        display: flex;
        height: 80rpx;
        justify-content: space-around;
        align-items: center;
        width: 692rpx;
        margin-left: 29rpx;
        margin-top: 10rpx;
    }
    .tab-list .ta-li {
        font-size: 28rpx;
        line-height: 80rpx;
        color: #a8a8a8;
        border-radius: 40rpx;
        width: 200rpx;
        display: flex;
        justify-content: center;
        border: 1rpx solid #FFFFFF;
    }
    .tab-list .active {
      border: 1rpx solid #f6f6f6;
      box-shadow: 4rpx 4rpx 20rpx #cccccc;
      color:#1b1b1b;
    }
    .swiper-container {
        width: 692rpx;
        margin-left: 29rpx;
    }
</style>