<template>
    <div class="wrapper">
        <div class="select-all" @click="clickSelectAll">
            <div  :class="{'selected':selectAll,'not-select':!selectAll} "></div>
            <div class="select-all-text">全选</div>
        </div>
        <scroll-view scroll-y=true class="main-wrapper">
            <div @click="selcetNeedPay($event)" :data-index='index' v-for="(item, index) in orderPlanList" :key="index" class="pay-item" :class="{'needntpay':item.status,'needpay':!item.status} ">
                <div v-if="item.status==0" class="icon-container">
                   <div :class="{'selected':item.selected,'not-select':!item.selected} "></div>
                </div>
                <div class="text-container">
                    <div class="item-text">
                        <div>
                            {{item.periodNum}}/{{orderPlanList.length}}期
                        </div>
                        <div style="font-size:32rpx" v-if="item.status==1">已缴清</div>
                        <div style="font-size:32rpx" v-if="item.status==0">待缴费</div>
                    </div>
                    <div class="item-text">
                        <div class="price-text">{{item.actualRepayAmount}}</div>
                        <div class="gray">{{item.repayDate}}</div>
                    </div>
                </div>
            </div>
        </scroll-view>
        <div class="botton-btn" @click='payAtOnce'>立即缴费<span v-if="needPayMoney!=0">({{needPayMoney}})</span></div>
        <payrest v-if="showPopFlag" :orderId="orderId" :planList="selectPlan" @close="closePay" @paysuccess="paySuccess" @payfail="payFail" @payunknow="payUnknow"></payrest>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import Payrest from '../../components/payrest.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'payrest': Payrest
        },
        data () {
            return {
                orderPlanList: [],
                selectAll: false,
                needPayMoney: 0,
                orderId: '',
                selectPlan: [],
                showPopFlag: false
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        created () {
            if(this.$mp.query.id) {
                this.orderId = this.$mp.query.id
            }
            this.getPayList()
            // this.getTEstList()
        },
        onPullDownRefresh() {
            this.getPayList()
        },
        methods: {
            payAtOnce() {
                this.selectPlan = []
                for(let item of this.orderPlanList) {
                    if (!item.status) {
                        if(item.selected){
                            this.selectPlan.push(item.id)
                        }
                    }
                }
                if(this.selectPlan.length <=0 ) {
                    this.toast('请先选择付款项！')
                    return 
                }
                this.showPopFlag = true
            },
            selcetNeedPay(e) {
                let index = e.target.dataset.index
                if (!this.orderPlanList[index].status) {
                    this.orderPlanList[index].selected = !this.orderPlanList[index].selected
                    if(this.orderPlanList[index].selected==false) {
                        this.needPayMoney = this.needPayMoney - this.orderPlanList[index].repayAmount
                    } else {
                        this.needPayMoney = this.needPayMoney + this.orderPlanList[index].repayAmount
                    }
                }
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
            closePay() {
                this.showPopFlag = false
            },
            paySuccess() {
                this.showPopFlag = false
                this.toast('支付成功！')
                // this.redirectToAddress('/pages/orderList/index')
                this.backPage(1)
            },
            payFail() {
                this.showPopFlag = false
                this.toast('支付失败！请重新支付！')
                this.backPage(1)
                // this.redirectToAddress('/pages/orderList/index')
            },
            payUnknow() {
                this.showPopFlag = false
                this.toast('支付处理中！')
                this.backPage(1)
                // this.redirectToAddress('/pages/orderList/index')
            },
            clickSelectAll() {
                this.selectAll = !this.selectAll
                this.needPayMoney = 0
                for(let item of this.orderPlanList) {
                    if (!item.status) {
                        item.selected = this.selectAll
                        if(this.selectAll){
                            this.needPayMoney = this.needPayMoney+item.repayAmount
                        } else {
                            this.needPayMoney = 0
                        }
                    }
                }
            },
            getPayList() {
                let commentDto = {
                    "orderId": this.orderId
                }
                this.POST('orderPlan/list', commentDto, res => {
                    let result = res.data.result;
                    for (let i  of result) {
                        i.selected = false
                        i.repayAmount = parseInt(i.repayAmount)
                    }
                    this.orderPlanList = result;
                    if (this.$mp.platform === 'alipay') {
                        my.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                    }
                });
            },
            getTEstList() {
                let result = [
                    {
                    "id": 268,
                    "orderId": 515,
                    "userId": 1224,
                    "periodNum": 1,
                    "repayAmount": 0.02,
                    "attachRepayAmount": null,
                    "overdueAmount": null,
                    "actualRepayAmount": 0.02,
                    "repayDate": "2018-12-16 12点之前缴清",
                    "payAmount": 0.03,
                    "payDate": "2018-12-13 16:05:22",
                    "status": 1,
                    "isOverdue": 0
                    }
                ]
                for (let i  of result) {
                    i.selected = false
                }
                this.orderPlanList = result;
            }
        }
    }
</script>


<style scoped lang="scss">
    .wrapper {
        font-family:microsoft yahei;
        width: 750rpx;
        background-color: #fff;
        font-size: 28rpx;
    }
    .select-all{
        display: flex;
        flex-direction: row;
        margin: 0 29rpx;
        padding: 20rpx 0;
    }
    .select-all .select-all-text {
        padding-left: 10rpx;
    }
    .selected{
        width: 36rpx;
        height: 36rpx;
        border-radius: 18rpx;
        background-color: #EF6700;
    }
    .not-select{
        width: 32rpx;
        height: 32rpx;
        border-radius: 16rpx;
        border: 1px solid #ccc;
    }
    .main-wrapper{
        width: 692rpx;
        margin-left: 29rpx;
        height: calc(100vh - 220rpx);
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
    }
    .needntpay {
        color: #cccccc
    }
    .pay-item{
        width: 612rpx;
        margin: 0 20rpx;
        padding: 20rpx 0rpx;
        display: flex;
    }
    .icon-container{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 40rpx 0 0;
    }
    .pay-item + .pay-item {
        border-top: 1px solid #ccc;
    }
    .price-text{
        font-weight: 400;
        font-size: 38rpx;
    }
    .text-container{
        flex:auto;
    }
    .item-text {
        display: flex;
        justify-content: space-between;
        line-height: 60rpx;
    }
    .gray{
        color: #cccccc;
    }
    .botton-btn {
        color: #fff;
        background-color: #FF6F00;
        height: 80rpx;
        border-radius: 40rpx;
        text-align: center;
        width: 692rpx;
        line-height: 80rpx;
        font-weight: 400;
        font-size: 30rpx;
        bottom: 30rpx;
        left: 29rpx;
        position: absolute;
    }
</style>