<template>
    <div class="container">
        <ul class="tab-list">
            <li class="ta-li" v-for="(item,index) of tabList" :key="index" :class="{'active':index==activeItem}" @click="switchTab(index)">
            {{item.remark}}
            </li>
        </ul>
        <swiper class="swiper-container" :current="activeItem" duration="300" @change="switchTabBySwiper" :style="{height:winHeight+'rpx'}" skip-hidden-item-layout="true">
            <swiper-item v-for="(item,index) of detailList" :key="index">
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}" >
                    <div class="comment-container has-comment" v-if="item.data.length>0">
                        <order-card v-for="(item1, index1) of item.data" :key="index1" :data="item1"></order-card>
                    </div>
                    <div class="comment-container no-comment-container" v-if="item.data.length==0">
                        <div class="no-comment">暂无订单</div>
                    </div>
                </scroll-view>
            </swiper-item>
        </swiper>
    </div>
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
                detailList: [
                    {
                        id:'',
                        data: []
                    },
                    {
                        id:'',
                        data: []
                    },
                    {
                        id:'',
                        data: []
                    },
                ],
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
            this.getOrderByStatus(sta, this.activeItem)
        },
        methods: {
            getOrderData () {
                this.POST('api/tradeOrder/statusList', '', res => {
                    let result = res.data.result;
                    this.tabList = result
                    for(let i in this.tabList) {
                        this.detailList[i].id = this.tabList[i].status
                    }
                    this.getOrderByStatus(this.tabList[0].status, 0)
                });
            },
            getOrderByStatus(sta ,index) {
                let dto = {
                    "orderStatus": sta,
                    "pageNum": 0,
                    "pageSize": 0
                }
                this.POST('api/tradeOrder/list', dto, res => {
                    let result = res.data.result;
                    this.detailList[index].data = result
                    if (this.$mp.platform === 'alipay') {
                        my.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                    }
                });
            },
            switchTabBySwiper (e) {
                this.activeItem = e.detail.current
                let sta = this.tabList[this.activeItem].status
                this.getOrderByStatus(sta, this.activeItem)
            },
            switchTab (index) {
                this.activeItem = index
                if (this.$mp.platform === 'alipay') {
                    let sta = this.tabList[this.activeItem].status
                    this.getOrderByStatus(sta, this.activeItem)
                }
                
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