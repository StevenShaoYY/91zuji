<template>
<div>
    <scroll-view scroll-y=true class="wrapper">
        <div class="header-container">
            <p class="header-p1">到期归还</p>
            <p class="header-p2">未租满1个月归还需缴纳一个月的租金</p>
        </div>
        <div class="product-detail-container">
            <order-product :product="productSub"></order-product>
        </div>
        <div class="rent-container" v-if="orderDetail.totalRentAmount">
            <div class="rent1">
                <div class="sub">本单起租日期：</div>
                <div>{{orderDetail.beginTime}}</div>
            </div>
            <div class="rent1">
                <div class="sub">本单到期日期：</div>
                <div>{{orderDetail.endTime}}</div>
            </div>
            <div class="rent1">
                <div class="sub">代缴租金总计：</div>
                <div>¥{{orderDetail.totalRentAmount.toFixed(2)}}</div>
            </div>
        </div>
        <div class="rent-container" v-if="orderDetail.totalRentAmount">
            <div class="rent1">
                <div class="sub">违约金：</div>
                <div>¥{{orderDetail.penalAmount.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">逾期未缴总计：</div>
                <div>¥{{orderDetail.overdueAmount.toFixed(2)}}</div>
            </div>
            <div class="rent1">
                <div class="sub">总需补齐资金：</div>
                <div>¥{{(orderDetail.penalAmount+orderDetail.overdueAmount).toFixed(2)}}</div>
            </div>
        </div>
        <div class="text-container">
            <p>1.我们收到货品后会检测,质检结果会同步到归还进度里,代缴金额的账号也会罗列在您个人中心的缴费计划里。</p> 
            <p style="margin-top:20rpx">2.逾期或违约,或将影响您的芝麻信用。</p>
        </div>
        <div @click="nextStep" class="startOrder">
            下一步
        </div>
    </scroll-view>
</div>
</template>

<script>
    import mixins from '../../mixins'
    import OrderProduct from '../../components/orderProduct.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'order-product': OrderProduct
        },
        data () {
            return {
                productSub: {},
                orderDetail: {},
                orderId: ''
            }
        },
        created () {
            this.orderId = this.$mp.query.id
            this.getOrderDetail()
        },
        methods: {
            getOrderDetail() {
                this.POST('api/tradeOrder/backInfo', {"orderId": this.orderId}, res => {
                    if(res.data.ok){
                        let result = res.data.result;
                        this.orderDetail = result
                        let productSub = {}
                        productSub.name = result.tradeOrderGoodsRespDTO.goodsName
                        productSub.picUrl = result.tradeOrderGoodsRespDTO.picUrl
                        productSub.descList = result.tradeOrderGoodsRespDTO.specifications
                        productSub.totalRent = result.totalRentAmount 
                        this.productSub = productSub
                    } else {
                        this.toast(res.data.msg)
                        this.back()
                    }
                });
            },
            nextStep() {
                if(this.$mp.platform == 'alipay') {
                    my.navigateTo({
                        url: `/pages/returnDeviceConfirm/index?orderId=${this.orderId}&postCode=${this.orderDetail.postCode}&address=${this.orderDetail.address}&mobile=${this.orderDetail.mobile}&receiveName=${this.orderDetail.receiveName}`
                    })
                    } else {
                    wx.navigateTo({
                        url: `/pages/returnDeviceConfirm/index?orderId=${this.orderId}&postCode=${this.orderDetail.postCode}&address=${this.orderDetail.address}&mobile=${this.orderDetail.mobile}&receiveName=${this.orderDetail.receiveName}`
                    })
                }
            },
            getOrderDetailTest() {
                    let result = {
                        "tradeOrderId": 394,
                        "isBacking": true,
                        "tradeOrderGoodsRespDTO": {
                        "goodsName": "iPhone7    国行三网通 99新",
                        "specifications": [
                            "金色",
                            "32G"
                        ],
                        "picUrl": "http://rent-mall.oss-cn-beijing.aliyuncs.com/kvpn168xxo4glnyhm2n0.png"
                        },
                        "totalRentAmount": 0.03,
                        "beginTime": "2018-07-25",
                        "endTime": "2018-10-25",
                        "totalPayAmount": 0.01,
                        "penalAmount": 0,
                        "overdueAmount": 0,
                        "totalRepayAmount": 0,
                        "receiveName": "小北",
                        "postCode": "310000",
                        "mobile": "0571-86507022",
                        "address": "杭州市萍水街 333 号御峰大厦 1922 室",
                        "shipChannel": "xumin746854",
                        "shipSn": "东风"
                    }
                    this.orderDetail = result
                    let productSub = {}
                    productSub.name = result.tradeOrderGoodsRespDTO.goodsName
                    productSub.picUrl = result.tradeOrderGoodsRespDTO.picUrl
                    productSub.descList = result.tradeOrderGoodsRespDTO.specifications
                    productSub.totalRent = result.totalRentAmount 
                    this.productSub = productSub
            }
        }
    }
</script>


<style scoped lang="scss">
    .wrapper{
        background-color: #ffffff;
        font-family:microsoft yahei;
    }
    .header-container{
        width: 750rpx;
        height: 200rpx;
        background: linear-gradient(to bottom right, #f24f18 , #ffc561);
        color: #fff;
        line-height: 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 30rpx;
        padding-left: 30rpx;
    }
    .header-container .header-p1 {
        font-weight: 700;
    }
    .product-detail-container {
        width: 692rpx;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        height: 220rpx;
        box-shadow: 2rpx 2rpx 15rpx #cccccc;
    }
    .rent-container {
        width: 692rpx;
        margin-left: 29rpx;
        font-size: 30rpx;
        padding: 20rpx 0;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 15rpx #cccccc;
    }
    .rent-container .rent1{
        height: 50rpx;
        line-height: 50rpx;
        padding: 0 30rpx;
        font-size: 30rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
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
    .text-container {
        font-size: 26rpx;
        margin: 30rpx;
    }
    .startOrder{
        color: #fff;
        background-color: #FF6F00;
        height: 80rpx;
        border-radius: 40rpx;
        text-align: center;
        width: 692rpx;
        margin-left: 29rpx;
        line-height: 80rpx;
        font-weight: 400;
        font-size: 30rpx;
        position: fixed;
        bottom: 30rpx;
    }

</style>