<template>
  <div class="wrapper">
    <div>
      {{data.orderRemark}}
    </div>
    <div>
      <order-product :product="productSub"></order-product>
    </div>
    <div>
      <div>{{data.note}}</div>
      <div>{{data.statusTime}}</div>
    </div>
    <div class="bottom-container">
      <div class="btn-container">
        <div v-for="item of data.operationList" :key="item.id">
          <div v-if="item.id==1" class="btn sty1">立即付款</div>
            <div v-if="item.id==3" class="btn sty1">归还设备</div>
            <div v-if="item.id==2" @click="cancleOrder" class="btn sty2">取消订单</div>
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
    .wrapper{
      height: 245rpx;
      width: 630rpx;
      margin-left: 30rpx;
      border-bottom: 1px solid #f5f5f5
    }
    .first-section {
      display: flex;
      flex-direction: row;
      margin-top: 30rpx;
    }
    .image {
      width: 90rpx;
      height: 90rpx;
      margin-right: 25rpx;
    }
    .inner-container {
      display: flex;
      flex-direction: column;
      font-size: 26rpx;
      font-weight: 400;
    }
    .user-text {
      line-height: 60rpx;
    }
    .second-section {
      margin-top: 30rpx;
      font-size: 26rpx;
    }
    .third-section {
      margin-top: 30rpx;
      font-size: 24rpx;
      color: #a8a8a8;
    }
</style>
<script>
import OrderProduct from './orderProduct.vue';
    export default {
        props:{
          data: {
              type: Object,
              default: {}
          },
        },
        components: {
          'order-product': OrderProduct
        },
        created() {
          this.productSub={
            picUrl: this.data.picUrl,
            descList:this.data.specifications,
            name:this.data.goodsName,
            orderSn:this.data.orderSn,
          }
        },
        data () {
            return {
              productSub:{}
            }
        },
        methods: {
          cancleOrder() {
            let order = this.data.orderId
          }
        }
    }
</script>