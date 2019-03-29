<template>
    <div class="wrapper">
        <div class="comment-container no-comment-container" v-if="faqList.length==0">
            <div class="no-comment">暂无帮助</div>
        </div>
        <ul class="trans-faq">
            <li class="trans-faq-li" :style="{height:item.height}" :class="{'content-show':item.show}" v-for="(item, index) of faqList" :key="index" :data-index="index"  @click="showDetail($event)">
                <h2 class="trans-faq-h2">{{item.question}}</h2>
                <div class="faqUl" :data-index="index" :data-show="item.show" >
                    <text class="trans-faq-text">
                        {{item.answer}}
                    </text>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import mixins from '../../mixins'
    export default {
        mpType: 'page',
        mixins: [mixins],
        
        data () {
            return {
                faqList: []
            }
        },
        onShareAppMessage() {
            return this.shareMessage('/pages/index/index')
        },
        created () {
            this.POST('issue/list', '', res => {
                let result = res.data.result;
                for (let i of result) {
                    i.height = '90rpx';
                    i.show = false
                }
                this.faqList = result
            });
        },
        methods: {
            showDetail (e) {
                if (this.$mp.platform === 'wechat'){
                    var query = wx.createSelectorQuery()
                    query.selectAll('.faqUl').boundingClientRect((rects) => {
                        rects.forEach((rect) => {
                        if (rect.dataset.index.toString() === e.currentTarget.dataset.index.toString()) {
                            this.$set(this.faqList[rect.dataset.index], 'show', true)
                            this.$set(this.faqList[rect.dataset.index], 'height', rect.height + 240 + 'rpx')
                        } else {
                            this.$set(this.faqList[rect.dataset.index], 'show', false)
                            this.$set(this.faqList[rect.dataset.index], 'height', '90rpx')
                        }
                        })
                    }).exec()
                } else {
                    var query = my.createSelectorQuery()
                    query.selectAll('.faqUl').boundingClientRect().exec(
                        (rects) => {
                            let rect = rects[0]
                            for(let i in rect) {
                                if( i == e.currentTarget.dataset.index) {
                                    this.$set(this.faqList[i], 'show', true)
                                    this.$set(this.faqList[i], 'height', rect[i].height + 240 + 'rpx')
                                } else {
                                    this.$set(this.faqList[i], 'show', false)
                                    this.$set(this.faqList[i], 'height', '90rpx')
                                }
                            }
                        }
                    )
                }
                
            }
        }
    }
</script>


<style scoped lang="scss">
   .wrapper{
        font-family:microsoft yahei;
       background-color: #fff;
       min-height: 100%;
   }
   .comment-container {
        font-family:microsoft yahei;
        width: 692rpx;
        margin-left: 29rpx;
        min-height: calc(100vh - 60rpx);
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        box-shadow: 2rpx 2rpx 5rpx #cccccc;
    }
    .no-comment-container {
        font-family:microsoft yahei;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: #a8a8a8;
    }
   .trans-faq{
        width: 692rpx;
        margin: 30rpx 29rpx;
    }

    .trans-faq .trans-faq-li {
        width: 100%;
        /* height: 90rpx; */
        overflow: hidden;
        background-color: #fff;
        border-radius: 8rpx;
        box-shadow: 2px 2px 10px #cccccc;
        transition: all .3s ease;
    }

    .trans-faq .trans-faq-li + .trans-faq-li{
        margin-top: 20rpx;
    }

    .trans-faq .trans-faq-li .trans-faq-h2{
        width: 100%;
        height: 90rpx;
        overflow: hidden;
        line-height: 90rpx;
        font-size: 26rpx;
        padding-left: 26rpx;
        color:#444444;
    }
    .trans-faq .trans-faq-li .faqUl{
        width: 92%;
        line-height: 40rpx;
        font-size: 25rpx;
        padding: 0 0 26rpx 4%;
        margin: -30rpx 0 0 0;
        color:#555555;
    }
    .trans-faq .trans-faq-li .faqUl .trans-faq-text{
        width: 100%;
    }
</style>