<template>
  <div class="pay-container" >
      <div class="pay-main">
          <div class="header">温馨提示</div>
          <div class="content">您还未登录，点击确定创建用户</div>
          <div class="btn-container">
            <button class="btn sty2" @click="closeDialog">暂不需要</button>
            <button class="btn sty1" open-type="getAuthorize" @getAuthorize="authorize" @error="onAuthError" scope='phoneNumber'>立即登录</button>
          </div>
      </div>
    </div>
</template>
<style scoped>
    .pay-container {
        font-family:microsoft yahei;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        /* width: 100vw;
        height: 100vh; */
        z-index: 106;
        background: rgba(0, 0, 0, 0.5);
    }
    .pay-main {
        position: absolute;
        top: 35vh;
        width: 550rpx;
        height: 260rpx;
        left: 100rpx;
        z-index: 888;
        background-color: #fff;
        border-radius: 10rpx;
    }
    .pay-main .header {
      font-size: 30rpx;
      font-weight: 400;
      padding: 30rpx;
    }
    .pay-main .content {
      font-size: 26rpx;
      font-weight: 100;
      padding-left: 30rpx;
    }
    .pay-main .btn-container {
      display: flex;
      margin-top: 30rpx;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
    }
    .pay-main .btn {
      font-size: 28rpx;
      border: none;
      margin-right: 40rpx;
    }
    .pay-main .sty2 {
      color: #BCBCBC;
    }
    .pay-main .sty1 {
      color: #1598f6;
    }
</style>
<script>
    import mixins from '../mixins'
    export default {
        mixins: [mixins],
        props:{
        },
        created() {
        },
        data () {
            return {
              showPay:false,
              payInfo: {}
            }
        },
        methods: {
          authorize(){
            if(this.$mp.platform === 'alipay'){
              this.getNum()
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
          getNum() {
            my.getPhoneNumber({
              success: (res) => {
                  let encryptedData = res.response
                  let dto = {
                    "authCode": getApp().globalData.authCode,
                    "responseContent": encryptedData
                  }
                  this.POST('userBase/alipayPhone', dto, res => {
                    let result = res.data.result;
                    if(result.accessToken && result.accessToken!='') {
                      getApp().globalData.accessToken = result.accessToken
                      this.toast('注册成功！')
                      this.closeDialog()
                    } else {
                      this.toast('注册失败！')
                      this.closeDialog()
                    }
                  },'user');
              },
              fail: (res) => {
                  console.log(res)
                  console.log('getPhoneNumber_fail')
                  this.toast('获取权限失败！')
              },
            });
          },
          onAuthError() {
            this.closeDialog()
          },
          closeDialog() {
            this.$emit('close')      
          }
        }
    }
</script>