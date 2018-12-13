<template>
<div>
    <div class="wrapper">
        <div class="realname-noauth" v-if="userNoAuth">
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
        </div>
        <div class="realname-authing" v-if="userAuthed">
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
                userAuthed:false,
                user:{
                    address:'',
                    birth:'',
                    name:'',
                    nationality:'',
                    num:'',
                    sex:''
                },
                backUrl: false
            }
        },
        created () {
            if (this.$mp.query.id) {
                let query = this.$mp.query
                this.backUrl = `/pages/placeOrder/index?id=${query.id}&guige=${query.guige}&rentTime=${query.rentTime}&finace=${query.finace}`
            }
            this.getUserInfo();
        },
        methods: {
            getUserInfo() {
                this.POST('userBase/getSimpleInfo', '', res => {
                    let result = res.data;
                    if(result.ok===true) {
                        if(this.backUrl!==false) {
                            if(this.$mp.platform === 'alipay') {
                                my.redirectTo({
                                    url: this.backUrl
                                })
                            } else {
                                wx.redirectTo({
                                    url: this.backUrl
                                })
                            }
                        }
                        if(result.result.idCardBackImage!=null && result.result.idCardFrontImage !=null) {
                            this.userAuthed = true;
                            this.user.address = result.result.frontRespDTO.address;
                            this.user.birth = result.result.frontRespDTO.birth;
                            this.user.name = result.result.frontRespDTO.name;
                            this.user.nationality = result.result.frontRespDTO.nationality;
                            let numDes = result.result.frontRespDTO.num.substr(0,3) + "***********" + result.result.frontRespDTO.num.substr(-4);
                            this.user.num = numDes;
                            this.user.sex = result.result.frontRespDTO.sex;
                        } else {
                            this.userNoAuth = true;
                        }
                    } else {
                        this.toast(result.msg)
                    }
                },'user');
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
            addPositive() {
                my.chooseImage({
                    count: 1,
                    success: (res) => {
                        this.imgUrl = res.apFilePaths[0];
                        console.log(this.imgUrl);
                        this.uploadFile('userBase/idCard/front', 'image','file',this.imgUrl,null, res => {
                            let result = JSON.parse(res.data);
                            if(result.ok===true) {
                                this.imgPositive.src = this.imgUrl;
                                this.imgPositive.isOk = true;
                                this.checkStatus();
                            } else {
                                this.toast(result.msg)
                            }
                        },'user');
                    },
                });
                
            },
            addNegative() {
                my.chooseImage({
                    count: 1,
                    success: (res) => {
                        this.imgUrl = res.apFilePaths[0];
                        console.log(this.imgUrl);
                        this.uploadFile('userBase/idCard/back', 'image','file',this.imgUrl,null, res => {
                            let result = JSON.parse(res.data);
                            if(result.ok===true) {
                                this.imgNegative.src = this.imgUrl;
                                this.imgNegative.isOk = true;
                                this.checkStatus();
                            } else {
                                this.toast(result.msg)
                            }
                        },'user');
                    },
                });
                
            },
            checkStatus() {
                if(this.imgPositive.isOk == true && this.imgNegative.isOk == true) {
                    this.userNoAuth = false;
                    this.userAuthing = false;
                    this.userAuthed = false;
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
    height: 100vh;
    padding:80rpx 29rpx;
    line-height: 30rpx;
}
.text-container .content{
  font-size: 24rpx;
  color: #cecece;
  margin-top: 20rpx;
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
    position: absolute;
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
    height: 120rpx;
    display: flex;
    flex-direction: row;
    margin: 0 30rpx;
}

.add-title{
    font-size: 32rpx;
    line-height: 120rpx;
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