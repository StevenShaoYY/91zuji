<template>
<div>
    <view class="container">
        <ul class="tab-list">
            <li v-for="(item,index) of tabList" :key="index" :class="{'active':index==activeItem}" @click="switchTab(index)">
            {{item}}
            </li>
        </ul>
        <swiper class="swiper-container" :current="activeItem" duration="300" @change="switchTabBySwiper" :style="{height:winHeight+'rpx'}" skip-hidden-item-layout="true">
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    <section class="header">
                        <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
                            <swiper-item v-for="(item, index) of goodsDetail.gallery" :key="index" :data-index="index">
                                <img class="image" :src="item" background-size="cover"/>
                            </swiper-item>
                        </swiper>
                        <div class="goods-title">{{goodsDetail.name}}</div>
                        <div class="goods-price-container">
                            <div class="rent-price">￥<span class="big-price">{{goodsDetail.rentPrice}}</span><span class="normal-font">/{{goodsDetail.periodUnit}}</span></div>
                            <div class="total-price">商品价值：￥{{goodsDetail.retailPrice}}</div>
                        </div>
                    </section>
                    <section>
                        <div class="zuling-header">租赁流程</div>
                        <div class="zuling-content">选择商品 -- 下单审核 -- 首期支付 -- 发货 -- 月付租金 -- 归还商品</div>
                        <div class="zuling-header">租期结束后可选方案</div>
                        <div class="zuling-subheader">归还</div>
                        <div class="zuling-content">支持邮寄归还</div>
                        <div class="zuling-subheader">买断</div>
                        <div class="zuling-content">支持尾款终身拥有</div>
                    </section>
                    <section>
                        <div class="zuling-header">其他说明</div>
                        <div class="zuling-subheader">收货须知</div>
                        <div class="zuling-content">身份证正反面复印件以确认本人收货，并交由快递小哥寄回本平台制定地点存档</div>
                        <div class="zuling-subheader">租金</div>
                        <div class="zuling-content">用户需按月支付租金，需开通支付宝/微信免密制度协议，平台每月将自动从支付宝/微信账号中扣除相应租金。用户也可提前主动支付剩下的租金</div>
                        <div class="zuling-subheader">买断</div>
                        <div class="zuling-content">租赁到期后可支付买断款买断该商品，买断款以下单时协议里的买断价为准。</div>
                    </section>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    <div class="img-container">
                        <img v-for="(item, index) of goodsDetail.description" :key="index" :data-index="index" class="desc-image" :src="item" background-size="cover"/>
                    </div>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true" :style="{height:winHeight+'rpx'}">
                    <div>
                    33333333333333333333333
                    </div>
                </scroll-view>
            </swiper-item>
        </swiper>
      
        <!-- <view class="comments" v-if="comment.count > 0">
            <view class="h">
            <navigator :url="'../comment/comment?valueId=' + goods.id + '&typeId=0'">
                <text class="t">评价({{comment.count > 999 ? '999+' : comment.count}})</text>
                <text class="i">查看全部</text>
            </navigator>
            </view>
            <view class="b">
            <view class="item">
                <view class="info">
                <view class="user">
                    <img :src="comment.data.avatar"/>
                    <text>{{comment.data.nickname}}</text>
                </view>
                <view class="time">{{comment.data.add_time}}</view>
                </view>
                <view class="content">
                {{comment.data.content}}
                </view>
                <view class="imgs" v-if="comment.data.pic_list.length">
                <image class="img" v-for="(item, index) of comment.data.pic_list" :key="item.id" :data-index="index" :src="item.pic_url"/>
                </view>
                <view class="spec">白色 2件</view>
            </view>
            </view>
        </view> -->
        <!-- <view class="attr-pop-box" :hidden="!openAttr">
        <view class="attr-pop">
            <view class="close" @click="closeAttr">
            <img class="icon" src="/static/images/icon_close.png"/>
            </view>
            <view class="img-info">
            <img class="img" :src="gallery[0].img_url"/>
            <view class="info">
                <view class="c">
                <view class="p">价格：￥{{goods.retail_price}}</view>
                <view class="a" v-if="productList.length">已选择：{{checkedSpecText}}</view>
                </view>
            </view>
            </view>
            <view class="spec-con">
            <view class="spec-item" v-for="(item, index) of specificationList" :key="item.specification_id" :data-index="index">
                <view class="name">{{item.name}}</view>
                <view class="values">
                <view :class="iitem.checked ? 'selected value' : 'value'" @click="clickSkuValue" v-for="(iitem, iindex) of item.valueList" :key="iitem.id" :data-value-id="iitem.id" :data-index="iindex" :data-name-id="iitem.specification_id">{{iitem.value}}</view>
                </view>
            </view>
            <view class="number-item">
                <view class="name">数量</view>
                <view class="selnum">
                <view class="cut" @click="cutNumber">-</view>
                <input :value="number" class="number" disabled="true" type="number" />
                <view class="add" @click="addNumber">+</view>
                </view>
            </view>
            </view>
        </view>
        </view> -->
        <view class="bottom-btn">
            <view class="l l-collect" >
                <img class="icon"/>
                收藏
            </view>
            <view class="c">选择规格</view>
        </view>
    </view>
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
                goodsDetail: {},
                tabList: ['商品', '详情', '评论'],
                activeItem: 0,
                detailList: [[111111111], [22222222], [333333333]],
                winHeight: '',
                openAttr:true,
                cartGoodsCount: 0,
                number: 1,
                checkedSpecText: '请选择规格数量',
                openAttr: false,
                noCollectImage: '/static/images/icon_collect.png',
                hasCollectImage: '/static/images/icon_collect_checked.png',
                collectBackImage: '/static/images/icon_collect.png'
            }
        },
        created () {
            /*
            * demo 使用假数据
            */
            let dto = {
                "id": this.$mp.query.id
            }
            console.log(this.$mp)
            if (this.$mp.platform === 'wechat') {
                wx.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR - 170;
                        this.winHeight = calc
                    }
                });
            } else {
                my.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR - 155;
                        this.winHeight = calc
                        console.log(clientHeight)
                        console.log(this.winHeight)
                    }
                });
            }
            this.POST('api/mallGoods/detail', dto, res => {
                let result = res.data.result;
                this.goodsDetail = result
                console.log(this.goodsDetail)
            });
            // this.POST('api/home/topic', '', res => {
            //     let result = res.data.result;
            //     this.topic = result
            // });
            // this.POST('/api/mallCategory/list', this.pageData, res => {
            //     let result = res.data.result;
            //     for (let item of result) {
            //         item.categoryUrl =  `/pages/catagory/index?id=${item.id}`
            //     }
            //     this.categoryList = result
            // }, );
        },
        methods: {
            switchTabBySwiper (e) {
                this.activeItem = e.detail.current
            },
            switchTab (index) {
                this.activeItem = index
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
    .iconfont {
        font-family: "iconfont" !important;
    }
    .icon-favor:before { content: "\e64c"; }
    .tab-list {
        display: flex;
        height: 70rpx;
        justify-content: space-around;
        align-items: center;
        width: 50%;
        margin-left: 25%;
    }
    .tab-list view {
        font-size: 28rpx;
        font-weight: 700;
        line-height: 35rpx;
        color: #a8a8a8;
        // border-radius: 25px;
        // width: 100px;
        display: flex;
        justify-content: center;
        padding-right: 8rpx;
        padding-bottom: 5rpx;
        // border: 0.5px solid #FFFFFF;
    }
    .tab-list .active {
        border-bottom: 5rpx solid #1a1717;
        // box-shadow: 2px 2px 10px #cccccc;
        color:#1b1b1b;
    }
    .header {
        width: 692rpx;
        // height: 700rpx;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
    }
    .goodsimgs {
        width:450rpx;
        height: 450rpx;
        margin-left: 121rpx;
        margin-top: 20rpx;
    }
    .goodsimgs .image{
        width: 450rpx;
        height: 450rpx;
        // height: 100%;
    }
    .goods-title {
        font-weight: 700;
        margin-left: 30rpx;
        margin-top: 20rpx;
    }
    .goods-price-container {
        display: flex;
        // margin-top: 20rpx;
        justify-content: space-between;
        padding: 0rpx 30rpx;
    }
    .rent-price {
        font-size: 24rpx;
        color:#FF6900;
        // line-height: 30rpx;
    }
    .rent-price .big-price {
        font-size: 50rpx;
    }
    .rent-price .normal-font {
        color: #a8a8a8;
    }
    .total-price {
        font-size: 24rpx;
        color: #a8a8a8;
        margin-top: 40rpx;
        // line-height: 45rpx;
    }
    // --ww
    // .total-price {
    //     font-size: 24rpx;
    //     color: #a8a8a8;
    //     margin-top: 30rpx;
    //     // line-height: 45rpx;
    // }
    .zuling-header {
        font-size: 28rpx;
        font-weight: 700;
        margin-left: 29rpx;
        margin-top: 40rpx;
    }
    .zuling-subheader {
        font-size: 26rpx;
        font-weight: 400;
        margin-left: 29rpx;
        margin-top: 40rpx;
    }
    .zuling-content {
        font-size: 26rpx;
        margin-left: 29rpx;
        margin-right: 29rpx;
        margin-top: 25rpx;
        color: #a8a8a8;
        line-height: 50rpx;
    }
    .bottom-btn {
        width: 100%;
        height: 100rpx;
        position: fixed;
        bottom: 0;
        background-color: #FF6900
    }
    .img-container {
        margin-top: 20rpx;
        width: 750rpx;
    }
    .desc-image {
        width: 750rpx;
        margin-top:-8rpx;
        height: 900rpx;
    }

    
</style>