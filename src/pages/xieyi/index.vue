<template>
    <web-view v-if="isWebView==true" :src="url"></web-view>
</template>

<script>
    import mixins from '../../mixins'
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        data () {
            return {
                url:'',
                isWebView:false
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        created () {
            wx.getSystemInfo({
                success:res => {
                if (res.platform == "ios") {
                    console.log('ios平台')
                    this.isWebView = true
                    //ios平台
                } else if (res.platform == "android") {
                    this.isWebView = false
                    //android平台
                } else if (res.platform == "devtools") {
                    console.log('开发工具')
                    this.isWebView = true
                    //开发工具
                }
                },
                fail(res) {},
                complete() {},
            })
            this.POST('api/contract/rawList', '', res => {
                let result = res.data.result;
                this.url = result[0].link
                if(this.isWebView == false) {
                    wx.downloadFile({
                        url: this.url ,
                        success: res => {
                            console.log(res)
                            var Path = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
                            wx.openDocument({
                                filePath: Path,
                                success: function (res) {
                                    console.log('打开成功');
                                }
                            })
                        },
                        fail: function (res) {
                            console.log(res);
                        }
                    })
                }
            });
        },
        methods: {
           
        }
    }
</script>


<style scoped lang="scss">
.wrapper{
    font-family:microsoft yahei;
    font-size: 26rpx;
    margin-left: 26rpx;
    width: 692rpx;
    margin-top: 60rpx;
    margin-left: 29rpx;
    line-height: 30rpx;
}
</style>