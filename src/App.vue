
<script>
  export default {
    mpType: 'app',
    onLaunch() {
      my.getAuthCode({
        scopes: 'auth_user',
        success: (res) => {
          my.alert({
            content: res.authCode,
          });
        },
      });
    },
    globalData() {
      return {
        a: 100,
        accessToken: 'f361841a14f845f78c9fd35a4fe83de2'
      }
    }
  }
</script>
