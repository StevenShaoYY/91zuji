
<script>
  import mixins from './mixins'
  export default {
    mpType: 'app',
    mixins: [mixins],
    onLaunch() {
      if(this.$mp.query && this.$mp.query.id && this.$mp.query.from === 'tuiguang') {
        this.jump(`/pages/goodsDetail/index?id=${this.$mp.query.id}`)
      }
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
      } else {
        wx.login({
          success: res => {
            getApp().globalData.authCode = res.code
            this.POST('userBase/v1.0/wxLogin', {'code': res.code} ,res => {
              let result = res.data.result;
              if(result && result.accessToken && result.accessToken!==''){
                getApp().globalData.accessToken = result.accessToken
              }
            }, 'user')
          }
        })
      }
    },
    globalData() {
      return {
        a: 100,
        authCode:'',
        //accessToken: "7b0db29115e84620b6933a5e96459b9a"
        accessToken: ""
      }
    }
  }
// "@megalo/target": "0.4.2",
</script>
