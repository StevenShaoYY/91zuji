<template>
<div>
    <scroll-view scroll-y=true class="wrapper">
        <div @click="goToAddress" class="address-container">
            <img class="icon" src="/static/images/icon_location_address.png" alt="">
            <div class="set-text">
                <div class="text1">{{address.full_region}}{{address.address}}</div>
                <div class="text2">{{address.name}}&nbsp&nbsp&nbsp{{address.mobile}}</div>
            </div>
            <img class="right" src="/static/images/btn_next_mine.png" alt="">
        </div>
        <div class="product-detail-container">
            <order-product :product="productSub"></order-product>
        </div>
        <div class="finace-container" v-if="finace.feeType==1">
            <div>意外保障<span class="span-l">(一次性付清)</span></div>
            <div>¥{{finace.amount}}</div>
        </div>
        <div class="finace-container" v-if="finace.feeType==2">
            <div>意外保障<span class="span-l">(分期支付)</span></div>
            <div>每期¥{{finace.amount}}</div>
        </div>
        <div class="rent-container">
            <div class="rent1">
                <div>租赁期数</div>
                <div>¥{{rentPrice.price}}<span class="sub-span">×{{rentPrice.specification}}</span></div>
            </div>
            <div class="rent2-container">
                <div class="rent2">月租金:¥{{rentPrice.price}}</div>
                <div class="rent2">首期支付:¥{{rentPrice.price+finace.amount}}</div>
            </div>
        </div>
        <div class="remark-container"> 
            <input class="text" type="text" v-model= "submitInfo.remark" placeholder="请输入备注信息...">
        </div>
        <div class="emergency-container">
            <div class="title">紧急联系人信息</div>
            <div class="input-emergency-container">
                <input class="input" type="text" v-model= "submitInfo.emergencyPhone" placeholder="电话">
            </div>
            <div class="input-emergency-container">
                <input class="input" type="text" v-model= "submitInfo.emergencyName" placeholder="姓名">
            </div>
            <div class="input-emergency-container">
                <input class="input" type="text" v-model= "submitInfo.emergencyRelation" placeholder="关系">
            </div>
        </div>       
    </scroll-view>
    <div class="bottom-container">
        <div class="text"><span>点击确认下单代表已同意</span><navigator url="/pages/xieyi/index" class="xieyi">《用户服务及租赁协议》</navigator></div>
        <div @click="submit" class="botton-btn">确认下单</div>
    </div>
    <div class="pay-container" v-if="showPay">
        <div class="pay-main">
            <div class="cot-1">
                确认付款
                <img @click="closePay" class="icon-cloce" src="/static/images/btn_close_popup.png"/>
            </div>
            <div class="cot-2">
                <div class="text1">¥{{payInfo.amount}}</div>
                <div class="text2">{{payInfo.note}}</div>
            </div>
            <div class="cot-3" v-if="$mp.platform=='alipay'">
                <img class="icon-zfb" src="/static/images/icon_zhifubao_pay.png"/>
                <div class="text">支付宝</div>
                <img class="icon-check" src="/static/images/btn_choose_pay.png"/>
            </div>
            <div class="cot-3" v-if="$mp.platform=='wechat'">
                <img class="icon-zfb" src="/static/images/icon_wechat_pay.png"/>
                <div class="text">微信</div>
                <img class="icon-check" src="/static/images/btn_choose_pay.png"/>
            </div>
            <div @click="payOrder" class="botton-btn">立即付款</div>
        </div>
    </div>
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
                product:{},
                finace: {},
                address:{},
                rentPrice:{},
                submitInfo: {
                    remark: '',
                    emergencyPhone: '',
                    emergencyName: '',
                    emergencyRelation: ''
                },
                orderId: '',
                payInfo: {},
                showPay: false
            }
        },
        created () {
            console.log(this.$mp.query)
            this.getAddressList()
            this.getProduct()
        },
        methods: {
            getAddressList() {
                let commentDto = {
                    "pageNum": 1,
                    "pageSize":10
                }
                this.POST('userAddress/list', commentDto, res => {
                    let result = res.data.result;
                    if (result.list.length>=1) {
                        this.type = 'update'
                        result.list[0].full_region = result.list[0].provinceName+ ' '+result.list[0].cityName+' '+result.list[0].areaName+ ' '
                        this.address = result.list[0];
                    }
                },'user');
            },
            getProduct() {
                let dto = {
                    "id": this.$mp.query.id
                }
                this.POST('api/mallGoods/detail', dto, res => {
                    let result = res.data.result;
                    this.finace = result.finaceList[this.$mp.query.finace]
                    for (let it of result.productList) {
                        if(it.id == this.$mp.query.guige) {
                            this.product = it
                        }
                    }
                    this.rentPrice = this.product.financeRespDTOList[this.$mp.query.rentTime]
                    let productSub = {}
                    productSub.name = result.name
                    productSub.picUrl = result.picUrl
                    productSub.descList = this.product.specifications
                    productSub.price = this.product.price
                    this.productSub = productSub
                });
            },
            goToAddress() {
                let url = '/pages/addressManage/index?from=order'
                if(this.$mp.platform === 'alipay') {
                    my.navigateTo({
                        url: url
                    })
                } else {
                    wx.navigateTo({
                        url: url
                    })
                }
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
            ValidatePhone(val){
                var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;//手机号码
                var isMob= /^0?1[3|4|5|8][0-9]\d{8}$/;// 座机格式
                if(isMob.test(val)||isPhone.test(val)){
                    return true;
                }
                else{
                    return false;
                }
            },
            submit() {
                if(this.submitInfo.emergencyPhone === '') {
                    this.toast('请填写紧急联系电话！')
                    return
                }
                if(this.submitInfo.emergencyName === '') {
                    this.toast('请填写紧急联系人！')
                    return
                }
                if(!this.ValidatePhone(this.submitInfo.emergencyPhone)) {
                    this.toast('请填写正确的紧急联系电话！')
                    return
                }
                if(this.submitInfo.emergencyRelation === '') {
                    this.toast('请填写与紧急联系人关系！')
                    return
                }
                let submitInfo = {
                    ...this.submitInfo,
                    "num": 1,
                    "addressId": this.address.id,
                    "goodsAttachProductId": this.finace.id,
                    "goodsId": this.$mp.query.id,
                    "productFinanceId": this.rentPrice.id,
                    "productId": this.$mp.query.guige,
                }
                this.POST('api/tradeOrder/submit', submitInfo, res => {
                    let result = res.data.result;
                    if (result.orderId){
                        this.orderId = result.orderId
                        let ddto = {
                            'orderId': this.orderId
                            // 'orderId': 503
                        }
                        this.POST('api/tradeOrder/payAtOnce', ddto, res => {
                            let result = res.data.result;
                            result.amount = result.amount.toFixed(2)
                            this.showPay = true
                            this.payInfo = result
                        });
                    }
                });
            },
            payOrder() {
                console.log(this.orderId)
            },
            closePay() {
                let url = `/pages/orderDetail/index?id=${this.orderId}`
                if(this.$mp.platform === 'alipay') {
                    my.redirectTo({
                        url
                    })
                } else {
                    wx.redirectTo({
                        url
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
        height: calc(100vh - 200rpx);
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
        width: 554rpx;
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
        width: 652rpx;
        margin-left: 29rpx;
        margin-top: 15rpx;
    }
    .finace-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 652rpx;
        margin-left: 29rpx;
        font-size: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 1px solid #E7E7E7
    }
    .finace-container .span-l {
        color: #969696;
        font-size: 26rpx;
    }
    .rent-container {
        width: 652rpx;
        margin-left: 29rpx;
        font-size: 30rpx;
        padding: 30rpx 0;
    }
    .rent-container .rent1{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .rent-container .rent1 .sub-span {
        color: #969696;
        font-size: 26rpx;
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
        width: 652rpx;
        margin-left: 29rpx;
        border-radius: 20rpx;
        background-color: #f7f7f7;
        font-size: 26rpx;
        padding: 30rpx 20rpx;
        height: 90rpx;
    }
    .remark-container .text{
        background-color: #f7f7f7;
        font-size: 26rpx;
    }
    .emergency-container {
        width: 652rpx;
        margin-left: 29rpx;
        margin-top: 30rpx;
    }
    .emergency-container .title {
        font-size: 30rpx;
        font-weight: 400;
    }
    .emergency-container .input-emergency-container {
        font-size: 26rpx;
        line-height: 80rpx;
        height: 80rpx;
    }
    .emergency-container .input-emergency-container .input{
        font-size: 26rpx;
        line-height: 80rpx;
        height: 80rpx;
    }
    .emergency-container .input-emergency-container + .input-emergency-container{
        border-top: 1px solid #f7f7f7
    }
    .botton-btn {
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
        margin-bottom: 30rpx;
    }
    .bottom-container{
        position: fixed;
        bottom: 0;
        height: 200rpx;
        background-color: #f9f9f9
    }
    .bottom-container .text{
        font-size: 26rpx;
        color: #9a9a9a;
        line-height: 60rpx;
        padding: 20rpx 29rpx;
    }
    .bottom-container .xieyi {
        color: #ff7000;
        display: inline;
    }
    .pay-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 106;
        background: rgba(0, 0, 0, 0.5);
    }
    .pay-main {
        position: absolute;
        bottom: 0;
        width: 100vw;
        z-index: 888;
        background-color: #fff;
        border-radius: 50rpx 50rpx 0 0;
    }
    .pay-main .cot-1 {
        height: 100rpx;
        line-height: 100rpx;
        text-align: center;
        font-size: 30rpx;
        border-bottom: 1px solid #e6e6e6
    }
    .pay-main .icon-cloce {
        width: 48rpx;
        height: 48rpx;
        position: absolute;
        right: 40rpx;
        top: 26rpx;
    }
    .pay-main .cot-2 {
        text-align: center;
        margin: 0 50rpx;
        padding: 20rpx 50rpx;
        border-bottom: 1px solid #e6e6e6
    }
    .pay-main .cot-2 .text1{
        font-size: 70rpx;
        font-weight: 700;
        line-height: 100rpx;
    }
    .pay-main .cot-2 .text2{
        font-size: 30rpx;
        font-weight: 200;
        color: #999999;
        line-height: 80rpx;
    }
    .pay-main .cot-3 {
        height: 130rpx;
        line-height: 130rpx;
        margin: 0 50rpx;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 90rpx;
    }
    .pay-main .cot-3 .text{
        flex: 1;
        font-size: 28rpx;
        margin-left: 30rpx;
    }
    .pay-main .icon-zfb{
        width: 83rpx;
        height: 74rpx;
    }
    .pay-main .icon-check{
        width: 69rpx;
        height: 48rpx;
    }
</style>