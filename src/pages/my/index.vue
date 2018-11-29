<template>
    <div class="wrapper">
        我的
    </div>
</template>

<script>
    import mixins from '../../mixins'
    // import Topic from '../../components/topic.vue';
    export default {
        mpType: 'page',
        mixins: [mixins],
        // components: {
        //     'yx-slider': YXSlider,
        //     'topic': Topic
        // },
        data () {
            return {
            }
        },
        created () {
            /*
            * demo 使用假数据
            */
            // this.POST('api/home/ad', '', res => {
            //     let result = res.data.result;
            //     this.YXBanners = result
            // });
        },
        methods: {
            
        }
    }
</script>


<style scoped lang="scss">
   
</style>