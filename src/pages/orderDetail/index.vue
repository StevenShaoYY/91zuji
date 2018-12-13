<template>
<div>
    <scroll-view scroll-y=true class="wrapper">
        <div class="address-container">
            <img class="icon" src="/static/images/icon_location_address.png" alt="">
            <div class="set-text">
                <div class="text1">{{orderDetail.address}}</div>
                <div class="text2">{{orderDetail.consignee}}&nbsp&nbsp&nbsp{{orderDetail.mobile}}</div>
            </div>
        </div>
        <div class="product-detail-container">
            <order-product :product="productSub"></order-product>
        </div>
        <div class="finace-container" v-if="finace.feeType==1">
            <div>意外保障<span class="span-l">(一次性付清)</span></div>
            <div>¥{{finace.actualPrice.toFixed(2)}}</div>
        </div>
        <div class="finace-container" v-if="finace.feeType==2">
            <div>意外保障<span class="span-l">(分期支付)</span></div>
            <div>每期¥{{finace.actualPrice.toFixed(2)}}</div>
        </div>
        <div class="rent-container" v-if="orderDetail.periods">
            <div class="rent1">
                <div class="sub">总租金</div>
                <div>{{orderDetail.orderPrice.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">月租金</div>
                <div>{{orderDetail.periodPrice.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">租期</div>
                <div>共{{orderDetail.periods}}<span v-if="orderDetail.periodType==1">个月</span><span v-if="orderDetail.periodType==2">天</span><span v-if="orderDetail.periodType==3">周</span></div>
            </div>
        </div>
        <div class="rent-container" v-if="orderDetail.periods">
            <div class="rent1">
                <div class="sub">总押金</div>
                <div>{{orderDetail.deposit.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">免押金</div>
                <div>-{{orderDetail.freeDeposit.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">实付押金</div>
                <div>{{orderDetail.actualDeposit.toFixed(2)}}</div>
            </div>
            <div  class="remark-container" v-if="orderDetail.remark!=''"> 
                <div class="text">备注信息：{{orderDetail.remark}}</div>
            </div>
        </div>
        <div @click="wuliuShow" class="can-click-container wuliu">
            物流信息
            <img v-if="!wuliuFlag" class="icon" src="/static/images/btn_down_more.png" alt="">
            <img v-if="wuliuFlag" class="icon" src="/static/images/btn_up_question.png" alt="">
            <div v-if="wuliuFlag" class="click-content">
                <div v-if="orderDetail.shipChannel">{{orderDetail.shipChannel}}：{{orderDetail.shipSn}}</div>
                <div v-if="!orderDetail.shipChannel">暂无物流信息</div>
            </div>
        </div>
        <div @click="deviceShow" class="can-click-container">
            设备序列号
            <img v-if="!deviceFlag" class="icon" src="/static/images/btn_down_more.png" alt="">
            <img v-if="deviceFlag" class="icon" src="/static/images/btn_up_question.png" alt="">
            <div v-if="deviceFlag" class="click-content">
                <div v-if="orderDetail.deviceSerial&&orderDetail.deviceSerial.length>0">{{orderDetail.deviceSerial[0]}}</div>
                <div v-if="!orderDetail.deviceSerial||orderDetail.deviceSerial.length==0">没有设备信息</div>
            </div>
        </div>
        <div class="rent-container2">
            <div class="rent1">
                <div class="sub">订单编号</div>
                <div>{{orderDetail.orderSn}}</div>
            </div>
            <div class="rent1">
                <div class="sub">下单时间</div>
                <div>{{orderDetail.createTime}}</div>
            </div>
            <div class="rent1">
                <div class="sub">起租时间</div>
                <div>{{orderDetail.beginTime}}</div>
            </div>
            <div class="rent1">
                <div class="sub">到期时间</div>
                <div>{{orderDetail.endTime}}</div>
            </div>
            <div class="rent1">
                <div class="sub">租赁协议</div>
                <div><navigator url="/pages/xieyi/index" class="xieyi">《用户服务及租赁协议》</navigator></div>
            </div>
        </div>
        <div class="bottom-container">
            <div class="status-text">{{orderDetail.orderStatusRemark}}</div>
            <div class="btn-container">
                <div v-for="item of orderDetail.operationList" :key="item.id">
                    <div @click="payAtOnce" v-if="item.id==1" class="btn sty1">立即付款</div>
                    <div @click="confiremOrder" v-if="item.id==6" class="btn sty1">确认收货</div>
                    <div @click="returnOrder" v-if="item.id==3" class="btn sty1">归还设备</div>
                    <div @click="cancleOrder" v-if="item.id==2"  class="btn sty2">取消订单</div>
                    <div v-if="item.id==7" @click="payRest" class="btn sty2">缴纳余款</div>
                </div>
            </div>
        </div>
    </scroll-view>
    <pay-pop v-if="showPopFlag" :orderId="orderId" @close="closePay" @paysuccess="paySuccess" @payfail="payFail" @payunknow="payUnknow"></pay-pop>
</div>
</template>

<script>
    import mixins from '../../mixins'
    import OrderProduct from '../../components/orderProduct.vue';
    import PayPop from '../../components/payPop.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'order-product': OrderProduct,
            'pay-pop': PayPop
        },
        data () {
            return {
                productSub: {},
                finace: {},
                orderId: '',
                payInfo: {},
                orderDetail: {},
                deviceFlag: false,
                wuliuFlag: false,
                showPopFlag: false
            }
        },
        created () {
            this.orderId = this.$mp.query.id
            this.getOrderDetail()
        },
        methods: {
            paySuccess() {
                this.showPopFlag = false
                this.toast('支付成功！')
                this.redirectToAddress('/pages/orderList/index')
            },
            payFail() {
                this.showPopFlag = false
                this.toast('支付失败！请重新支付！')
                this.redirectToAddress('/pages/orderList/index')
            },
            payUnknow() {
                this.showPopFlag = false
                this.toast('支付处理中！')
                this.redirectToAddress('/pages/orderList/index')
            },
            redirectToAddress(url) {
                if(this.$mp.platform === 'alipay') {
                    my.redirectTo({
                        url: url
                    })
                } else {
                    wx.redirectTo({
                        url: url
                    })
                }
            },
            getOrderDetail() {
                this.POST('api/tradeOrder/detail', {"orderId": this.$mp.query.id}, res => {
                    let result = res.data.result;
                    this.orderDetail = result
                    let productSub = {}
                    productSub.name = result.tradeOrderGoodsRespDTO.goodsName
                    productSub.picUrl = result.tradeOrderGoodsRespDTO.picUrl
                    productSub.descList = result.tradeOrderGoodsRespDTO.specifications
                    productSub.totalRent = result.actualPrice 
                    this.productSub = productSub
                    this.finace = result.tradeOrderAttachRespDTO
                });
            },
            toast(str) {
                if(this.$mp.platform === 'alipay') {
                    my.showToast({
                        type: 'none',
                        content: str,
                        duration: 3000,
                        success: () => {
                            console.log('success')
                        },
                    });
                } else {
                    wx.showToast({
                        title: str,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            wuliuShow() {
                this.wuliuFlag = !this.wuliuFlag
            },
            deviceShow() {
                this.deviceFlag = !this.deviceFlag
            },
            payAtOnce() {
                this.showPopFlag = true
            },
            closePay() {
                this.showPopFlag = false
            },
            confiremOrder() {
                if(this.$mp.platform == 'alipay') {
                    my.confirm({
                        title: '温馨提示',
                        content: '确定要收货吗？',
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        success: (result) => {
                            this.POST('api/tradeOrder/arriveConfirm', {"orderId": this.$mp.query.id}, res => {
                                my.navigateBack({
                                    delta: 1
                                })                                
                            });
                        },
                    });
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: '确定要收货吗？',
                        confirmText: '确定',
                        cancelText: '取消',
                        success: (result) => {
                            this.POST('api/tradeOrder/arriveConfirm', {"orderId": this.$mp.query.id}, res => {
                                wx.navigateBack({
                                    delta: 1
                                })                                
                            });
                        },
                    });
                }
            },
            returnOrder() {
                if(this.$mp.platform == 'alipay') {
                    my.navigateTo({
                        url: `/pages/returnOrder/index?orderId=${this.$mp.query.id}`
                    })
                } else {
                    wx.navigateTo({
                        url: `/pages/returnOrder/index?orderId=${this.$mp.query.id}`
                    })
                }
            },
            payRest() {
                if(this.$mp.platform=='alipay'){
                my.navigateTo({
                    url: `/pages/payrest/index?id=${this.data.orderId}`
                })
                } else {
                wx.navigateTo({
                    url: `/pages/payrest/index?id=${this.data.orderId}`
                })
                }
            },
            cancleOrder() {
                if(this.$mp.platform == 'alipay') {
                    my.confirm({
                        title: '温馨提示',
                        content: '确定要取消订单吗？',
                        confirmButtonText: '取消订单',
                        cancelButtonText: '暂不需要',
                        success: (result) => {
                            if(result.confirm) {
                                this.POST('api/tradeOrder/cancel', {"orderId": this.$mp.query.id}, res => {
                                    my.navigateBack({
                                        delta: 1
                                    })                                
                                });
                            } else {
                                return
                            }
                        },
                    });
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: '确定要取消订单吗？',
                        confirmText: '取消订单',
                        cancelText: '暂不需要',
                        success: (result) => {
                            if(result.comfirm) {
                                this.POST('api/tradeOrder/cancel', {"orderId": this.$mp.query.id}, res => {
                                    wx.navigateBack({
                                        delta: 1
                                    })                                
                                });
                            } else {
                                return
                            }
                            
                        },
                    });
                }
            }
        }
    }
</script>


<style scoped lang="scss">
    .wrapper{
        background-color: #ffffff;
        font-family:microsoft yahei;
    }
    .address-container {
        width: 652rpx;
        height: 155rpx;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 15rpx #cccccc;
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .address-container .icon{
        width: 41rpx;
        height: 48rpx;
    }
    .address-container .set-text{
        width: 654rpx;
        padding: 0 20rpx;
    }
    .address-container .set-text .text1{
        font-size: 32rpx;
        line-height: 60rpx;
        color: #676767;
    }
    .address-container .set-text .text2{
        font-size: 28rpx;
        line-height: 60rpx;
        color: #9D9D9D;
    }
    .address-container .right {
       width: 17rpx;
       height: 28rpx;
    }
    .product-detail-container {
        width: 692rpx;
        margin-left: 29rpx;
        margin-top: 15rpx;
    }
    .finace-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 692rpx;
        margin-left: 29rpx;
        font-size: 30rpx;
        padding-bottom: 30rpx;
        // border-bottom: 1px solid #E7E7E7
    }
    .finace-container .span-l {
        color: #969696;
        font-size: 26rpx;
    }
    .rent-container {
        width: 692rpx;
        margin-left: 29rpx;
        font-size: 30rpx;
        padding: 20rpx 0;
        border-top: 1px solid #f9f9f9
    }
    .rent-container .rent1{
        height: 50rpx;
        line-height: 50rpx;
        font-size: 30rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .rent-container .rent1 .sub {
        color: #969696;
        font-size: 30rpx;
    }
    .rent-container .rent2-container {
        margin-top: 30rpx;
    }
    .rent-container .rent2{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        font-weight: 700;
        line-height: 50rpx;
    }
    .remark-container {
        width: 632rpx;
        border-radius: 20rpx;
        background-color: #f7f7f7;
        margin: 20rpx 0;
        font-size: 26rpx;
        padding: 30rpx 20rpx;
        height: 90rpx;
    }
    .can-click-container {
        // height: 90rpx;
        line-height: 90rpx;
        font-size: 30rpx;
        padding: 0 29rpx;
        border-bottom: 5px solid #f9f9f9;
        position: relative;
    }
    .can-click-container .icon {
        width: 27rpx;
        height: 17rpx;
        position: absolute;
        right: 29rpx;
        top: 35rpx;
    }
    .wuliu {
        border-top: 5px solid #f9f9f9;
    }
    .can-click-container .click-content {
        color: #969696;
        font-size: 25rpx;
        line-height: 30rpx;
        padding: 20rpx 0 50rpx 0;
    }
    .xieyi{
        color:#EF7000
    }
    .rent-container2 {
        width: 750rpx;
        font-size: 30rpx;
        padding: 20rpx 29rpx;
        border-top: 1px solid #f9f9f9;
        border-bottom: 5px solid #f9f9f9;
    }
    .rent-container2 .rent1{
        height: 50rpx;
        line-height: 50rpx;
        font-size: 26rpx;
        display: flex;
        flex-direction: row;
    }
    .rent-container2 .rent1 .sub {
        color: #969696;
        font-size: 26rpx;
        padding-right: 30rpx;
    }
    .bottom-container{
        height: 100rpx;
        line-height: 100rpx;
        width: 692rpx;
        margin: 0 29rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .bottom-container .status-text {
        font-size: 28rpx;
        color: #EF7000;
    }
    .bottom-container .btn-container {
        display: flex;
    }
    .bottom-container .btn-container .btn {
        font-size: 26rpx;
        line-height: 56rpx;
        margin: 22rpx 15rpx;
        padding: 0 13rpx;
        border-radius: 8rpx;
    }
    .btn-container .sty1 {
        color: #fff;
        background-color: #EF7000
    }
    .btn-container .sty2 {
        color: #757575;
        border: 1px solid #e0e0e0;
    }

</style>