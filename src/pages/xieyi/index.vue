<template>
    <web-view :src="url"></web-view>
</template>

<script>
    import mixins from '../../mixins'
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        data () {
            return {
                url:''
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        created () {
            this.POST('api/contract/rawList', '', res => {
                let result = res.data.result;
                this.url = result[0].link
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