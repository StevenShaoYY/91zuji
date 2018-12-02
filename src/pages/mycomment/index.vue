<template>
    <div class="wrapper">
        <div class="comment-container has-comment" v-if="commentList.length>0">
            <comment-card2 v-for="(item, index) of commentList" :key="index" :commentItem="item"></comment-card2>
        </div>
        <div class="comment-container no-comment-container" v-if="commentList.length==0">
            <div class="no-comment">暂无评论</div>
        </div>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    import CommentCard2 from '../../components/commentCard2.vue';
    export default {
        mpType: 'page', 
        mixins: [mixins], 
        components: {
            'comment-card2': CommentCard2
        },
        data () {
            return {
                commentList:[]
            }
        },
        created () {
            this.getCommentList()
        },
        onPullDownRefresh() {
            this.getCommentList()
        },
        methods: {
            getCommentList() {
                let commentDto = {
                    "pageNum": 1,
                    "pageSize":100
                }
                this.POST('comment/userList', commentDto, res => {
                    let result = res.data.result;
                    console.log(result)
                    this.commentList = result.list;
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
    // .wrapper{
    //     font-size: 26rpx;
    //     margin-left: 26rpx;
    //     width: 692rpx;
    //     margin-top: 60rpx;
    //     margin-left: 29rpx;
    //     line-height: 30rpx;
    // }
    .comment-container {
        font-family:microsoft yahei;
        width: 692rpx;
        min-height: 95vh;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
    }
    .no-comment-container {
        font-family:microsoft yahei;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: #a8a8a8;
    }
</style>