
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
            this.POST('userBase/alipayLogin', {"authCode": res.authCode}, res => {
                let result = res.data.result;
                if(result.accessToken && result.accessToken!==''){
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
      }
    }
  }
// "@megalo/target": "0.4.2",
</script>
