
<script>
  export default {
    mpType: 'app',
    onLaunch() {
      if(this.$mp.platform == 'alipay') {
        my.getAuthCode({
          scopes: 'auth_base',
          success: (res) => {
            getApp().globalData.authCode = res.authCode
            console.log(getApp())
          },
        });
      }
    },
    globalData() {
      return {
        a: 100,
        authCode:'',
        accessToken: 'f361841a14f845f78c9fd35a4fe83de2'
      }
    }
  }
</script>
