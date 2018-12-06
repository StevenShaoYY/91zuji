<template>
<div>
    <scroll-view scroll-y=true class="wrapper">
        <div class="header-container">
            <p class="header-p2">归还须知：</p>
            <p class="header-p2">1.请务必备好纸条，写明：下单手机号、订单号；</p>
            <p class="header-p2">2.将纸条附在需要归还的设备上；</p>
            <p class="header-p2">3.须将收到的货品，包含所有附赠配件一并归还；</p>
        </div>
        <div class="rent-container">
            <div class="warn-text">*请按照以下地址发货（拒收到付件）</div>
            <div class="rent1">
                <div class="sub">收件人：</div>
                <div>{{receiveName}}</div>
            </div>
            <div class="rent1">
                <div class="sub">邮政编码：</div>
                <div>{{postCode}}</div>
            </div>
            <div class="rent1">
                <div class="sub">手机号码：</div>
                <div>{{mobile}}</div>
            </div>
            <div class="rent1">
                <div class="sub">收货地址：</div>
                <div>{{address}}</div>
            </div>
        </div>
        <div class="rent-container">
            <div class="rent2">
                <div class="sub">物流公司</div>
                <div><input class="sub-input" type="text" v-model="returnData.shipChannel" placeholder="请填写物流公司"></div>
            </div>
            <div class="rent2">
                <div class="sub">运单编号</div>
                <div><input class="sub-input" type="text" v-model="returnData.shipSn" placeholder="请填写运单编号"></div>
            </div>
        </div>
        <div class="text-container">
            <p>建议顺丰保价，降低运输风险</p> 
        </div>
        <div @click="returnOrder" class="startOrder">
            确认归还
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
                orderId: '',
                postCode:'',
                address:'',
                mobile:'',
                receiveName:'',
                returnData: {
                    shipChannel: '',
                    shipSn: ''
                }
            }
        },
        created () {
            console.log(this.$mp)
            this.orderId = this.$mp.query.id
            this.postCode = this.$mp.query.postCode
            this.address = this.$mp.query.address
            this.mobile = this.$mp.query.mobile
            this.receiveName = this.$mp.query.receiveName
        },
        methods: {
            returnOrder() {
                if(this.returnData.shipChannel==='') {
                    this.toast('请填写快递公司！')
                    return
                }
                if(this.returnData.shipSn==='') {
                    this.toast('请填写快递单号！')
                    return
                }
                let dto = {
                    ...returnData,
                    "orderId": this.orderId
                }
                this.POST('api/tradeOrder/back', dto, res => {
                    let result = res.data.result;
                    if (result){
                        this.nextStep()
                    } else {
                        this.toast('归还失败！请重新尝试！')
                    }
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
            nextStep() {
                if(this.$mp.platform == 'alipay') {
                    my.redirectTo({
                        url: '/pages/orderList/index'
                    })
                    } else {
                    wx.redirectTo({
                        url: '/pages/orderList/index'
                    })
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
    .header-container{
        width: 750rpx;
        height: 300rpx;
        background: linear-gradient(to bottom right, #f24f18 , #ffc561);
        color: #fff;
        line-height: 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 26rpx;
        padding-left: 30rpx;
    }
    .rent-container {
        width: 692rpx;
        margin-left: 29rpx;
        font-size: 26rpx;
        padding: 20rpx 0;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 15rpx #cccccc;
    }
    .rent-container .warn-text{
        color:#39bbff;
        line-height: 60rpx;
        font-size: 26rpx;
        margin-left: 30rpx;
    }
    .rent-container .rent1{
        height: 50rpx;
        line-height: 50rpx;
        padding: 0 30rpx;
        font-size: 26rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .rent-container .rent2{
        height: 60rpx;
        line-height: 60rpx;
        padding: 0 30rpx;
        font-size: 26rpx;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
    }
    .rent-container .rent2 .sub {
        color: #797979;
        font-size: 26rpx;
    }
    .rent-container .rent2 .sub-input {
        font-size: 26rpx;
        padding: 0 40rpx;
    }
    .rent-container .rent1 .sub {
        color: #969696;
        font-size: 30rpx;
    }
    .text-container {
        font-size: 26rpx;
        margin: 30rpx;
        color: #FF6F00;
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