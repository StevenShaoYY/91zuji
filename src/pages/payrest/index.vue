<template>
    <div class="wrapper">
        <div class="select-all">
            <div  :class="{'selected':selectAll,'not-select':!selectAll} "></div>
            <div class="select-all-text">全选</div>
        </div>
        <div class="main-wrapper">
            <div v-for="(item, index) in orderPlanList" :key="index" class="pay-item" :class="{'needntpay':item.status,'needpay':!item.status} ">
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
        </div>
        <div class="botton-btn">立即缴费{{needPayMoney}}</div>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import CommentCard2 from '../../components/commentCard2.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'comment-card2': CommentCard2
        },
        data () {
            return {
                orderPlanList: [],
                orderPlanList: '',
                selectAll: true
            }
        },
        created () {
            // this.orderId = this.$mp.query.id
            // this.getPayList()
            this.getTEstList()
        },
        onPullDownRefresh() {
            this.getPayList()
        },
        methods: {
            getPayList() {
                let commentDto = {
                    "orderId": this.orderId
                }
                this.POST('orderPlan/list', commentDto, res => {
                    let result = res.data.result;
                    for (let i  of result) {
                        i.selected = false
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
    },
    {
      "id": 269,
      "orderId": 515,
      "userId": 1224,
      "periodNum": 2,
      "repayAmount": 0.02,
      "attachRepayAmount": null,
      "overdueAmount": null,
      "actualRepayAmount": 0.02,
      "repayDate": "2019-01-16 12点之前缴清",
      "payAmount": null,
      "payDate": null,
      "status": 0,
      "isOverdue": 0
    },
    {
      "id": 270,
      "orderId": 515,
      "userId": 1224,
      "periodNum": 3,
      "repayAmount": 0.02,
      "attachRepayAmount": null,
      "overdueAmount": null,
      "actualRepayAmount": 0.02,
      "repayDate": "2019-02-16 12点之前缴清",
      "payAmount": null,
      "payDate": null,
      "status": 0,
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
        margin: 20rpx 29rpx;
    }
    .select-all .select-all-text {
        padding-left: 10rpx;
    }
    .selected{
        width: 20rpx;
        height: 20rpx;
        border-radius: 10rpx;
        margin-top: 3rpx;
        background-color: #EF6700;
    }
    .not-select{
        width: 20rpx;
        height: 20rpx;
        margin-top: 3rpx;
        border-radius: 10rpx;
        border: 1px solid #ccc;
    }
    .main-wrapper{
        width: 692rpx;
        margin-left: 29rpx;
        height: calc(100vh - 200rpx);
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