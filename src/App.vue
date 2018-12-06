
<script>
  import mixins from './mixins'
  export default {
    mpType: 'app',
    mixins: [mixins],
    onLaunch() {
      if(this.$mp.platform == 'alipay') {
        my.getAuthCode({
          scopes: 'auth_base',
          success: (res) => {
            getApp().globalData.authCode = res.authCode
            my.getAuthUserInfo({
              success: (userInfo) => {
                console.log(userInfo.nickName)
              },
              fail: (res) => {
                  console.log(res)
                  console.log('getuserInfo_fail')
              },
            });
            this.POST('userBase/alipayLogin', {"authCode": res.authCode}, res => {
                let result = res.data.result;
                if(result.accessToken){
                  getApp().globalData.accessToken = result.accessToken
                }
            },'user');
          },
        });
      }
    },
    globalData() {
      return {
        a: 100,
        authCode:'',
        accessToken: ''
        // accessToken: 'f361841a14f845f78c9fd35a4fe83de2'
      }
    }
  }
</script>
