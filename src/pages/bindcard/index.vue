<template>
<div>
    <div class="wrapper">
        <div class="realname-authing">
            <div class="add-item">
                <div class="add-title">持卡人信息</div>
            </div>
            <div class="add-item">
                <div class="add-title">姓名</div>
                <div class="add-content"><input v-model="user.name" class="add-input" type="text" :disabled="true"></div>
            </div>
            <div class="add-item">
                <div class="add-title">民族</div>
                <div class="add-content"><input v-model="user.nationality" class="add-input" type="text" :disabled="true"></div>
            </div>
            <div class="add-item">
                <div class="add-title">性别</div>
                <div class="add-content"><input v-model="user.sex" class="add-input" :disabled="true"></div>
            </div>
            <div class="add-item add-item2">
                <div class="add-title">证件号码</div>
                <div class="add-content"><input v-model="user.num"  class="add-input" type="text" :disabled="true"></div>
            </div>
        </div>
        <div class="realname-authing" style="margin-top:30rpx">
            <div class="add-item">
                <div class="add-title2 gray" >请使用与持卡人一致的储蓄卡</div>
            </div>
            <div class="add-item">
                <div class="add-title">我的银行卡</div>
                <div class="add-content"><input v-model="cardInfo.cardId" placeholder="请输入银行卡号" class="add-input" type="text" ></div>
            </div>
            <div class="add-item">
                <div class="add-title">手机号码</div>
                <div class="add-content"><input v-model="cardInfo.phone" placeholder="请输入银行卡预留手机号码" class="add-input" type="text"></div>
            </div>
            <div class="add-item">
                <div class="add-title">工作单位</div>
                <div class="add-content"><input v-model="cardInfo.company" placeholder="请输入工作单位" class="add-input" type="text"></div>
            </div>
            <div class="add-item2">
                <div class="add-title">验证码</div>
                <div class="add-content2"><input v-model="cardInfo.yzm" placeholder="请输入手机验证码" class="add-input2"></div>
                <div class="yzm" @click="getYZM">获取验证码</div>
            </div>
        </div>
        <div @click="addCard" class="commit-btn">确认添加</div>
    </div>
</div>
</template>

<script>
    import mixins from '../../mixins'
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        data () {
            return {
                user:{
                    address:'',
                    birth:'',
                    name:'',
                    nationality:'',
                    num:'',
                    sex:'',
                    num2: ''
                },
                cardInfo: {
                    cardId: '',
                    phone: '',
                    yzm: '',
                    company: ''
                },
                backUrl: false,
                hasGetCode: false
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        created () {
            if (this.$mp.query.id) {
                let query = this.$mp.query
                this.backUrl = `/pages/placeOrder/index?id=${query.id}&guige=${query.guige}&rentTime=${query.rentTime}&finace=${query.finace}`
            }
            this.getUserInfo();
        },
        methods: {
            checkBankCard(cardNo) {
                if(isNaN(cardNo))
                    return false;
                if(cardNo.length < 12){
                    return false;
                }
                var nums = cardNo.split("");
                var sum = 0;
                var index = 1;
                for(var i = 0 ; i < nums.length; i++){
                    if((i+1)%2==0){
                        var tmp = Number(nums[nums.length-index])*2;
                        if(tmp >= 10){
                            var t = tmp+"".split("");
                            tmp = Number(t[0]) + Number(t[1]);
                        }
                        sum+=tmp;
                    }else{
                        sum+=Number(nums[nums.length-index]);
                    }
                    index ++;
                }
                if(sum%10 != 0){
                    return false;
                }
                return true;
            },
            addCard() {
                if(this.cardInfo.cardId == '') {
                    this.toast('请输入银行卡号！')
                    return
                }
                // if(!this.checkBankCard(this.cardInfo.cardId)) {
                //     this.toast('请输入正确的银行卡号！')
                //     return
                // }
                if(!this.ValidatePhone(this.cardInfo.phone)) {
                    this.toast('请输入正确的手机号！')
                    return
                }
                if(this.cardInfo.company=='') {
                    this.toast('请输入工作单位！')
                    return
                }
                if(this.hasGetCode === false) {
                    this.toast('请先获取验证码！')
                    return
                }
                if(this.cardInfo.yzm == '') {
                    this.toast('请输入验证码！')
                    return
                }
                let dto = {
                    "bankCard": this.cardInfo.cardId,
                    "idCardNum": this.user.num2,
                    "mobile": this.cardInfo.phone,
                    "name": this.user.name,
                    "workAddress": this.cardInfo.company,
                    "validateCode": this.cardInfo.yzm
                }
                this.POST('api/bank/bindApplet', dto, res => {
                    this.toast(res.data.msg)
                    if(res.data.result) {
                        if(this.backUrl !== false) {
                            if(this.$mp.platform === 'alipay') {
                                my.redirectTo({
                                    url: this.backUrl
                                })
                            } else {
                                wx.redirectTo({
                                    url: this.backUrl
                                })
                            }
                        } else {
                            if(this.$mp.platform === 'alipay') {
                                my.redirectTo({
                                    url: '/pages/my/index'
                                })
                            } else {
                                wx.redirectTo({
                                    url: '/pages/my/index'
                                })
                            }
                        }
                    }
                });
            },
            ValidatePhone(val){
                var isPhone = /(?:^1[3456789]|^9[28])\d{9}$/;//手机号码
                if(isPhone.test(val)){
                    return true;
                }
                else{
                    return false;
                }
            },
            getYZM() {
                if(this.cardInfo.cardId == '') {
                    this.toast('请输入银行卡号！')
                    return
                }
                // if(!this.checkBankCard(this.cardInfo.cardId)) {
                //     this.toast('请输入正确的银行卡号！')
                //     return
                // }
                if(!this.ValidatePhone(this.cardInfo.phone)) {
                    this.toast('请输入正确的手机号！')
                    return
                }
                if(this.cardInfo.company=='') {
                    this.toast('请输入工作单位！')
                    return
                }
                let dto = {
                    "bankCard": this.cardInfo.cardId,
                    "idCardNum": this.user.num2,
                    "mobile": this.cardInfo.phone,
                    "name": this.user.name
                }
                this.POST('api/bank/code', dto, res => {
                    this.hasGetCode = true
                    this.toast(res.data.msg)
                });
            },
            getUserInfo() {
                this.POST('userBase/getSimpleInfo', '', res => {
                    let result = res.data;
                    if(result.ok===true) {
                        if(result.result.idCardBackImage!=null && result.result.idCardFrontImage !=null) {
                            this.userAuthed = true;
                            this.user.address = result.result.frontRespDTO.address;
                            this.user.birth = result.result.frontRespDTO.birth;
                            this.user.name = result.result.frontRespDTO.name;
                            this.user.num2 = result.result.frontRespDTO.num;
                            this.user.nationality = result.result.frontRespDTO.nationality;
                            let numDes = result.result.frontRespDTO.num.substr(0,3) + "***********" + result.result.frontRespDTO.num.substr(-4);
                            this.user.num = numDes;
                            this.user.sex = result.result.frontRespDTO.sex;
                            // if(this.backUrl!==false) {
                            //     if(this.$mp.platform === 'alipay') {
                            //         my.redirectTo({
                            //             url: this.backUrl
                            //         })
                            //     } else {
                            //         wx.redirectTo({
                            //             url: this.backUrl
                            //         })
                            //     }
                            // }
                        } else {
                            this.userNoAuth = true;
                        }
                    } else {
                        this.toast(result.msg)
                    }
                },'user');
            }
        }
    }
</script>


<style scoped lang="scss">
.wrapper{
    font-family:microsoft yahei;
    font-size: 26rpx;
    background-color: #fff;
    width: 692rpx;
    height: 100vh;
    padding:80rpx 29rpx;
    line-height: 30rpx;
}
.realname-authing{
    padding: 20rpx;
    background-color: #fff;
    border: 1rpx solid #f6f6f6;
    box-shadow: 4rpx 4rpx 20rpx #cccccc;
}
.commit-btn {
    color: #fff;
    background-color: #FF6F00;
    height: 80rpx;
    border-radius: 40rpx;
    text-align: center;
    width: 692rpx;
    line-height: 80rpx;
    font-weight: 400;
    font-size: 30rpx;
    margin-top: 30rpx;
}
.gray{
    color: #ccc;
    font-size: 24rpx;
}
.yzm{
    color: #EF6700; 
    height: 60rpx;
    line-height: 60rpx;
    width: 150rpx;
    margin-left: 30rpx;
}
.add-item{
    height: 60rpx;
    display: flex;
    flex-direction: row;
}
.add-item2{
    height: 60rpx;
    display: flex;
    flex-direction: row;
}
.add-title2{
    font-size:30rpx;
    line-height: 60rpx;
}
.add-title{
    font-size:30rpx;
    line-height: 60rpx;
    width: 180rpx;
}
.add-content {
    font-size: 26rpx;
    width: 500rpx;
}
.add-content2 {
    font-size: 26rpx;
    width: 250rpx;
    margin-left: -10rpx;
}
.add-input2 {
    font-size: 26rpx;
    width: 100%;
    color: #363636;
}
.add-input {
    font-size: 26rpx;
    width: 100%;
    color: #363636;
}


</style>