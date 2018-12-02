<template>
    <div class="wrapper">
        <productl v-for="item of categoryList" :key="item.id" :productItem="item"></productl>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import Product2 from '../../components/product2.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'productl': Product2
        },
        data () {
            return {
                categoryList:[]
            }
        },
        created () {
            this.getCollectList()
        },
        onPullDownRefresh() {
            this.getCollectList()
        },
        methods: {
            getCollectList() {
                let commentDto = {
                    "pageNum": 1,
                    "pageSize":100,
                    "type": 0
                }
                this.POST('api/mallCollect/list', commentDto, res => {
                    let result = res.data.result;
                    let re = []
                    for (let j of result) {
                        j.goodsSimpleRespDTO.goodsDetailUrl = `/pages/goodsDetail/index?id=${j.id}`
                        re.push(j.goodsSimpleRespDTO)
                    }
                    this.categoryList = re;
                    if (this.$mp.platform === 'alipay') {
                        my.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                    }
                });
            }
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