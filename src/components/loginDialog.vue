<template>
  <div class="pay-container" >
      <div class="pay-main">
          <div class="header">温馨提示</div>
          <div class="content">您还未登录，点击确定创建用户</div>
          <div>
            <button @click="closeDialog">暂不需要</button>
            <button open-type="getAuthorize" onGetAuthorize="getAuthorize" onError="onAuthError" scope='phoneNumber'>立即登录</button>
          </div>
      </div>
    </div>
</template>
<style scoped>
    .pay-container {
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
        height: 240rpx;
        left: 100rpx;
        z-index: 888;
        background-color: #fff;
        border-radius: 10rpx;
    }
</style>
<script>
    import mixins from '../mixins'
    export default {
        mixins: [mixins],
        props:{
        },
        created() {
          console.log(11111);
          console.log(this)
        },
        data () {
            return {
              showPay:false,
              payInfo: {}
            }
        },
        methods: {
          getAuthorize(){
            console.log('start get mobile')
            this.getNum()
          },
          getNum() {
            my.getPhoneNumber({
              success: (res) => {
                  let encryptedData = res.response
                  console.log(encryptedData)
                  // my.httpRequest({
                  //     url: '你的后端服务端',
                  //     data: encryptedData
                  // });
              },
              fail: (res) => {
                  console.log(res)
                  console.log('getPhoneNumber_fail')
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