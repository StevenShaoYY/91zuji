
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
            // this.globalData.authCode = res.authCode
            this.POST('userBase/alipayLogin', {"authCode": res.authCode}, res => {
                let result = res.data.result;
                console.log(result)
                if(result.accessToken && result.accessToken!==''){
                  // this.globalData.accessToken = result.accessToken
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
