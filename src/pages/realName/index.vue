<template>
<div>
    <div class="wrapper">
        <!-- v-if="userNoAuth" -->
        <radio-group class="radio-group" @change="radioChange" v-if="userNoAuth">
            <label class="radio" v-for="item of radioGroup" :key="item.name"><radio :value="item.value" :checked="item.checked"/>{{item.value}}</label>           
        </radio-group>
        <div class="realname-noauth" v-if="userNoAuth && showTab==2">
            <div class="input-emergency-container">
                <p class="_p">姓名</p>
                <input class="input" type="text" v-model= "submitInfo.certName" placeholder="请输入姓名">
            </div>
            <div class="input-emergency-container">
                <p class="_p">身份证号</p>
                <input class="input" type="text" v-model= "submitInfo.certNo" placeholder="请输入身份证号">
            </div>
            <div @click="submit" class="botton-btn">确认</div>
        </div>
        <div class="realname-noauth" v-if="userNoAuth && showTab==1">
            <div class="text-container">
              <div class="title"><img class="titleimg" src="/static/images/icon_upload_card.png" >上传有效证件</div>
              <div class="content">1.大陆公民持有的本人有效<span class="origan">二代身份证</span></div>
              <div class="content">2.拍摄时请保持身份证<span class="origan">边角完整、字迹清晰、亮度均匀</span></div>
            </div>
            <div class="pic-item">
                <div @click="addPositive" class="img-btn"><img class="sf-pic" :src="imgPositive.src" ></div>
            </div>
            <div class="pic-item">
                <div @click="addNegative" class="img-btn"><img class="sf-pic" :src="imgNegative.src" ></div>
            </div>
            <div class="tishi-container">
              <img class="tishi-img" src="/static/images/img_example_first.png" >
              <img class="tishi-img" src="/static/images/img_example_forth.png" >
              <img class="tishi-img" src="/static/images/img_example_second.png" >
              <img class="tishi-img" src="/static/images/img_example_third.png" >
            </div>
            <!-- <div @click="submit" class="botton-btn">芝麻认证</div> -->
            <div @click="submit" class="botton-btn">确认</div>
        </div>
        <div class="realname-authing" v-if="userAuthed">
            <div class="add-item">
                <div class="add-title">姓名</div>
                <div class="add-content"><input v-model="submitInfo.certName" class="add-input" type="text" :disabled="true"></div>
            </div>
            <div class="add-item" v-if="user.nationality">
                <div class="add-title">民族</div>
                <div class="add-content"><input v-model="user.nationality" class="add-input" type="text" :disabled="true"></div>
            </div>
            <div class="add-item" v-if="user.sex">
                <div class="add-title" >性别</div>
                <div class="add-content"><input v-model="user.sex" class="add-input" :disabled="true"></div>
            </div>
            <div class="add-item add-item2">
                <div class="add-title">证件号码</div>
                <div class="add-content"><input v-model="submitInfo.certNo"  class="add-input" type="text" :disabled="true"></div>
            </div>
        </div>
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
                submitInfo: {
                    certName: '',
                    certNo: ''
                },
                radioGroup: [
                    {name: '1', value: '拍摄身份证', checked: 'true'},
                    {name: '2', value: '手动录入'}
                ],
                showTab:1,
                url:'',
                imgUrl:'',
                imgPositive:{
                    src: '/static/images/btn_upload_face.png',
                    isOk:false
                },
                imgNegative:{
                    src: '/static/images/btn_upload_back.png',
                    isOk:false
                },
                userNoAuth:false,
                userAuthing:false,
                userAuthed:true,
                user:{
                    address:'',
                    birth:'',
                    name:'',
                    nationality:'',
                    num:'',
                    sex:''
                },
                backUrl: false,
                picUploaded: false,
                frontUploaded: false,
                backUploaded: false
            }
        },
        created () {
            if (this.$mp.query.id) {
                let query = this.$mp.query
                this.backUrl = `/pages/bindcard/index?id=${query.id}&guige=${query.guige}&rentTime=${query.rentTime}&finace=${query.finace}`
                this.backUrl1 = `/pages/placeOrder/index?id=${query.id}&guige=${query.guige}&rentTime=${query.rentTime}&finace=${query.finace}`
            }
            this.getUserInfo();
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        methods: {
            submit() {
                if(this.showTab==1) {
                    if(this.frontUploaded == true && this.backUploaded == true) {
                        this.zhimaCom()
                    } else {
                        if(this.frontUploaded == true) {
                            this.toast('请上传身份证反面照片！')
                        } else if (this.backUploaded == true){
                            this.toast('请上传身份证正面照片！')
                        } else {
                            this.toast('请上传身份证照片！')
                        }
                    }
                }
                if(this.showTab==2) {
                    if(this.submitInfo.certName !== ''){
                        if(this.submitInfo.certNo !== '') {
                            if(this.isCardNo(this.submitInfo.certNo)) {
                                this.uploadData()
                            } else {
                                this.toast('请先输入正确的身份证！')
                            }
                        } else {
                            this.toast('请先输入身份证！')
                        }
                    } else {
                        this.toast('请先输入姓名！')
                    }
                }
            },
            uploadData() {
                let dto = {
                    "cardName": this.submitInfo.certName,
                    "homeAddress": "",
                    "idCardNo": this.submitInfo.certNo,
                    "workAddress": ""
                }
                this.POST('userBase/sumitInfo', dto, res => {
                    if(res.data.ok == true)
                        this.zhimaCom()
                },'user')
            },
            isCardNo(card) 
            { 
            // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
                var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
                if(reg.test(card) === false) 
                { 
                    return false; 
                } else {
                    return true;
                }
            },
            radioChange(e){
                if(e.detail.value === "拍摄身份证")
                    this.showTab = 1
                else
                    this.showTab = 2
            },
            zhimaCom() {
                let dto = {
                    isAuth: true
                }
                this.POST('userBase/v1.2/setAuth?isAuth=true', dto, res => {
                    this.userAuthed = true;
                    this.userNoAuth = false;
                    if(this.backUrl!==false) {
                        if(this.$mp.platform === 'alipay') {
                            my.redirectTo({
                                url: this.backUrl1
                            })
                        } else {
                            wx.redirectTo({
                                url: this.backUrl1
                            })
                        }
                    }
                },'user')
                // this.POST('api/certification/certificationInitializeAliApplet', this.submitInfo, res => {
                //     let bizNo = res.data.result
                //     my.startZMVerify({
                //         bizNo: bizNo,
                //         success: (res) => {
                //             let pass = false
                //             if(res.passed === true)
                //                 pass = true
                //             let dto = {
                //                 'bizNo': bizNo,
                //                 'passed': pass
                //             }
                //             this.POST('api/certification/appletUpdateCertificationStatus', dto, res =>{
                //                 if(pass){
                //                     this.userAuthed = true;
                //                     this.userNoAuth = false;
                //                     if(this.backUrl!==false) {
                //                         if(this.$mp.platform === 'alipay') {
                //                             my.redirectTo({
                //                                 url: this.backUrl1
                //                             })
                //                         } else {
                //                             wx.redirectTo({
                //                                 url: this.backUrl1
                //                             })
                //                         }
                //                     }
                //                 } else {
                //                     this.toast('验证失败！')
                //                 }
                                
                //             })
                //         },
                //         fail: (res) => {
                //             let dto = {
                //                 'bizNo': bizNo,
                //                 'passed': false
                //             }
                //             this.POST('api/certification/appletUpdateCertificationStatus', dto, res =>{
                //                 if(this.backUrl!==false) {
                //                     if(this.$mp.platform === 'alipay') {
                //                         my.navigateBack({
                //                             delta: 1
                //                         })
                //                     } else {
                //                         wx.navigateBack({
                //                             delta: 1
                //                         })
                //                     }
                //                 }
                //             })
                //         },
                //     });
                // })
            },
            getUserInfo() {
                this.POST('userBase/getSimpleInfo', '', res => {
                    let result = res.data;
                    if(result.ok===true) {
                        // debugger
                        if(result.result.idCardFrontImage!=null) {
                            this.frontUploaded = true
                        }
                        if(result.result.idCardBackImage!=null) {
                            this.backUploaded = true
                        }
                        if(result.result.idCardBackImage!=null && result.result.idCardFrontImage !=null) {
                            this.user.address = result.result.frontRespDTO.address;
                            this.imgPositive.src = result.result.idCardFrontImage
                            this.imgNegative.src = result.result.idCardBackImage
                            this.user.birth = result.result.frontRespDTO.birth;
                            // this.user.name = result.result.frontRespDTO.name;
                            this.user.nationality = result.result.frontRespDTO.nationality;
                            let numDes = result.result.frontRespDTO.num.substr(0,3) + "***********" + result.result.frontRespDTO.num.substr(-4);
                            // this.user.num = numDes;
                            this.user.sex = result.result.frontRespDTO.sex;
                            this.submitInfo = {
                                certName: result.result.cardName,
                                certNo: result.result.idCardNo
                            }
                        } else {
                            this.userNoAuth = true;
                            this.userAuthed = false;
                        }
                        if(!result.result.isIdCardFront){
                            this.userNoAuth = true;
                            this.userAuthed = false;
                        } else {
                            this.submitInfo = {
                                certName: result.result.cardName,
                                certNo: result.result.idCardNo
                            }
                            this.userNoAuth = false;
                            this.userAuthed = true; 
                            // this.userNoAuth = true;
                            // this.userAuthed = false;
                        }
                            // no bankcard
                            // if(this.backUrl!==false) {
                            //     if(this.$mp.platform === 'alipay') {
                            //         my.redirectTo({
                            //             url: this.backUrl1
                            //         })
                            //     } else {
                            //         wx.redirectTo({
                            //             url: this.backUrl1
                            //         })
                            //     }
                            // }
                            // this.POST('userBase/checkBankBind', '', res => {
                            //     if(!res.data.result) {
                            //         if(this.backUrl!==false) {
                            //             if(this.$mp.platform === 'alipay') {
                            //                 my.redirectTo({
                            //                     url: this.backUrl
                            //                 })
                            //             } else {
                            //                 wx.redirectTo({
                            //                     url: this.backUrl
                            //                 })
                            //             }
                            //         } else {
                            //             if(this.$mp.platform === 'alipay') {
                            //                 my.redirectTo({
                            //                     url: '/pages/bindcard/index'
                            //                 })
                            //             } else {
                            //                 wx.redirectTo({
                            //                     url: '/pages/bindcard/index'
                            //                 })
                            //             }
                            //         }
                            //     } else {
                            //         if(this.backUrl!==false) {
                            //             if(this.$mp.platform === 'alipay') {
                            //                 my.redirectTo({
                            //                     url: this.backUrl1
                            //                 })
                            //             } else {
                            //                 wx.redirectTo({
                            //                     url: this.backUrl1
                            //                 })
                            //             }
                            //         }
                            //     }
                            // },'user')
                    } else {
                        this.toast(result.msg)
                    }
                },'user');
            },
            addPositive() {
                wx.chooseImage({
                    count: 1,
                    success: (res) =>{
                        this.compressImg(res)
                    }
                });
            },
            compressImg(res){
                wx.compressImage({
                    src: res.tempFilePaths[0],
                    quality: 40,
                    success: (res) =>{
                        this.imgUrl = res.tempFilePath;
                        this.uploadFile('userBase/idCard/front', "image","file",this.imgUrl,null, res => {
                            console.log(res)
                            let result = JSON.parse(res.data);
                            if(result.ok===true) {
                                this.imgPositive.src = this.imgUrl;
                                this.imgPositive.isOk = true;
                                this.frontUploaded = true
                                this.checkStatus();
                            } else {
                                this.toast(result.msg)
                            }
                        },'user');
                    },
                    fail: res=>{
                        console.log(res)
                    }
                })
            },
            addNegative() {
                 wx.chooseImage({
                    count: 1,
                    success: (res) =>{
                        this.compressBImg(res)
                    }
                });
                // my.chooseImage({
                //     count: 1,
                //     success: (res) => {
                //         my.compressImage({
                //             apFilePaths:res.apFilePaths,
                //             compressLevel:2,
                //             success:(res)=> {
                //                 this.imgUrl = res.apFilePaths[0];
                //                 this.uploadFile('userBase/idCard/back', "image","file",this.imgUrl,null, res => {
                //                     let result = JSON.parse(res.data);
                //                     if(result.ok===true) {
                //                         this.imgNegative.src = this.imgUrl;
                //                         this.imgNegative.isOk = true;
                //                         this.backUploaded = true
                //                         this.checkStatus();
                //                     } else {
                //                         this.toast(result.msg)
                //                     }
                //                 },'user');
                //             }
                //         })
                        
                //     }
                // });
                
            },
            compressBImg(res){
                wx.compressImage({
                    src: res.tempFilePaths[0],
                    quality: 40,
                    success: (res) =>{
                        this.imgUrl = res.tempFilePath;
                        this.uploadFile('userBase/idCard/back', "image","file",this.imgUrl,null, res => {
                            let result = JSON.parse(res.data);
                            if(result.ok===true) {
                                this.imgNegative.src = this.imgUrl;
                                this.imgNegative.isOk = true;
                                this.backUploaded = true
                                this.checkStatus();
                            } else {
                                this.toast(result.msg)
                            }
                        },'user');
                    },
                    fail: res=>{
                        console.log(res)
                    }
                })
            },
            checkStatus() {
                if(this.imgPositive.isOk == true && this.imgNegative.isOk == true) {
                    this.userNoAuth = false;
                    this.userAuthing = false;
                    this.userAuthed = false;
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
                    // } else {
                    //     if(this.$mp.platform === 'alipay') {
                    //         my.redirectTo({
                    //             url: '/pages/bindcard/index'
                    //         })
                    //         return 
                    //     } else {
                    //         wx.redirectTo({
                    //             url: '/pages/bindcard/index'
                    //         })
                    //         return 
                    //     }
                    // }
                    
                    this.getUserInfo();
                }
            },
        }
    }
</script>


<style scoped lang="scss">
.wrapper{
    font-family:microsoft yahei;
    font-size: 26rpx;
    background-color: #fff;
    width: 692rpx;
    height: calc(100vh - 180rpx);
    padding:80rpx 29rpx;
    line-height: 30rpx;
}
.botton-btn{
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
    position:absolute;
}
.radio-group{
    display: flex;
    justify-content: space-around;
    margin-bottom: 20rpx;
}
.input-emergency-container{
    display: flex;
    padding: 30rpx;
}
.input-emergency-container ._p{
    flex: 0 0 160rpx;
    display: flex;
    align-items: center;
}

.input-emergency-container .input{
    border-bottom: 1px solid #ccc;
    font-size: 15px;
}
.text-container .content{
  font-size: 24rpx;
  color: #cecece;
  margin-top: 20rpx;
}
.realname-authing{
    padding: 20rpx;
    background-color: #fff;
    border: 1rpx solid #f6f6f6;
    box-shadow: 4rpx 4rpx  20rpx #cccccc;
}
.origan {
  color:#f27605;
}
.text-container .title {
  color: #949494;
  font-size:26rpx;
  line-height: 39rpx;
  position: relative;
  padding-left: 68rpx;
}
.text-container .titleimg {
  width: 48rpx;
  height: 39rpx;
  margin-right: 20rpx;
  position: absolute;
  left:0rpx;
}
.img-btn {
    text-align: center;
}
.pic-item {
  margin-top: 25rpx;
  width: 450rpx;
  height: 290rpx;
  margin-left: 121rpx;
}
.sf-pic {
  width: 450rpx;
  height: 290rpx;
}
.tishi-container{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 50rpx;
}
.tishi-container .tishi-img{
  width: 157rpx;
  height: 154rpx;
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

.add-item{
    height: 90rpx;
    display: flex;
    flex-direction: row;
    margin: 0 30rpx;
}

.add-title{
    font-size: 32rpx;
    line-height: 90rpx;
    width: 180rpx;
}
.add-content {
    font-size: 26rpx;
    display: flex;
    align-items: center
}
.add-input {
    font-size: 26rpx;
    color: #363636;
}


</style>