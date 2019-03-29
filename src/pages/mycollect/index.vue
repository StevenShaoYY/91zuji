<template>
    <div class="wrapper">
        <productl v-for="item of categoryList" :key="item.id" :productItem="item"></productl>
        <div class="comment-container no-comment-container" v-if="categoryList.length==0">
            <div class="no-comment">暂无收藏</div>
        </div>
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
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
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
    background-color: #ffffff;
    font-family:microsoft yahei;
    font-size: 26rpx;
    margin-left: 26rpx;
    width: 692rpx;
    margin-top: 30rpx;
    margin-left: 29rpx;
    line-height: 30rpx;
}
.no-comment-container {
    min-height: calc(100vh - 60rpx);
    border: 1px solid #FAFAFA;
    border-radius: 20rpx;
    box-shadow: 2rpx 2rpx 50rpx #cccccc;
    font-family:microsoft yahei;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    color: #a8a8a8;
}
</style>