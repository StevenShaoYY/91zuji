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
                <scroll-view scroll-y="true">
                    <section class="header">
                        <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
                            <swiper-item v-for="(item, index) of goodsDetail.gallery" :key="index" :data-index="index">
                                <img :src="item" background-size="cover"/>
                            </swiper-item>
                        </swiper>
                        <div>{{goodsDetail.name}}</div>
                        <div>
                            <div>￥{{goodsDetail.rentPrice}}/{{goodsDetail.periodUnit}}</div>
                            <div>商品价值：￥{{goodsDetail.retailPrice}}</div>
                        </div>
                    </section>
                    <section>
                        <div>租赁流程</div>
                        <div>选择商品 -- 下单审核 -- 首期支付 -- 发货 -- 月付租金 -- 归还商品</div>
                    </section>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true">
                    <div>
                    222222222222222
                    </div>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view scroll-y="true">
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
        <!-- <view class="bottom-btn">
            <view class="l l-collect" @click="addCannelCollect">
                <img class="icon" :src="collectBackImage"/>
            </view>
            <view class="l l-cart">
                <view class="box">
                    <text class="cart-count">{{cartGoodsCount}}</text>
                    <img @click="openCartPage" class="icon" src="/static/images/ic_menu_shoping_nor.png"/>
                </view>
            </view>
            <view class="c">立即购买</view>
        </view> -->
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
                        const calc = clientHeight * rpxR - 100;
                        this.winHeight = calc
                    }
                });
            } else {
                my.getSystemInfo({
                    success: res => {
                        console.log(res)
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR - 100;
                        this.winHeight = calc
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
        height: 50px;
        justify-content: space-around;
        align-items: center;
        width: 90%;
    }
    .tab-list li {
        font-size: 14px;
        line-height: 40px;
        color: #a8a8a8;
        border-radius: 25px;
        width: 100px;
        display: flex;
        justify-content: center;
        border: 0.5px solid #FFFFFF;
    }
    .tab-list .active {
        border: 0.5px solid #f6f6f6;
        box-shadow: 2px 2px 10px #cccccc;
        color:#1b1b1b;
    }
    .swiper-container {
        width: 94%;
    }
    .container {
        margin-bottom: 100rpx;
    }

    .goodsimgs {
        width: 750rpx;
        height: 750rpx;
    }

    .goodsimgs image {
        width: 750rpx;
        height: 750rpx;
        background-color: #eee;
    }


    
</style>