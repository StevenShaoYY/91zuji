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
            if(this.$mp.query.type == "category") {
                this.getCategoryList()  
            } else if(this.$mp.query.type == "topic"){
                this.getTopicList()
            }
        },
        onPullDownRefresh() {
            if(this.$mp.query.type === 'category') {
                this.getCategoryList()  
            } else {
                this.getTopicList()
            }
        },
        methods: {
            getCategoryList() {
                let dto = {
                    "id": this.$mp.query.id
                }
                let commentDto = {
                    "pageNum": 1,
                    "pageSize": 99,
                    "categoryId": this.$mp.query.id
                }
                this.POST('api/mallGoods/listByCategory', commentDto, res => {
                    let result = res.data.result;
                    for (let j of result) {
                        j.goodsDetailUrl = `/pages/goodsDetail/index?id=${j.id}`
                    }
                    this.categoryList = result;
                    if (this.$mp.platform === 'alipay') {
                        my.stopPullDownRefresh()
                    } else {
                        wx.stopPullDownRefresh()
                    }
                });
            },
            getTopicList() {
                let dto = {
                    "id": this.$mp.query.id
                }
                let commentDto = {
                    "id": this.$mp.query.id
                }
                this.POST('topic/detail', commentDto, res => {
                    let result = res.data.result;
                    for (let j of result.goodsList) {
                        j.goodsDetailUrl = `/pages/goodsDetail/index?id=${j.id}`
                    }
                    this.categoryList = result.goodsList;
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