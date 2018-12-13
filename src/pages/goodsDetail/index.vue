<template>
<div>
    <view class="container" :style="divStyle" >
        <section class="header">
            <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
                <swiper-item v-for="(item, index) of goodsDetail.gallery" :key="index" :data-index="index">
                    <img class="image" :src="item" background-size="cover"/>
                </swiper-item>
            </swiper>
            <div class="goods-title">{{goodsDetail.name}}</div>
            <div class="goods-price-container">
                <div class="rent-price">¥<span class="big-price">{{goodsDetail.rentPrice}}</span><span class="normal-font">/{{goodsDetail.periodUnit}}</span></div>
                <div class="total-price">商品价值：¥{{goodsDetail.retailPrice}}</div>
            </div>
        </section>
        <ul class="tab-list">
            <li class="ta-li" v-for="(item,index) of tabList" :key="index" :class="{'active':index==activeItem}" @click="switchTab(index)">
            {{item}}
            </li>
        </ul>
        <swiper class="swiper-container" :current="activeItem" duration="300" @change="switchTabBySwiper" :style="{height:winHeight+'rpx'}" skip-hidden-item-layout="true">
            <swiper-item>
                <scroll-view @scroll="scrollEvent($event)" :scroll-y="canScroll" :style="{height:winHeight+'rpx'}">
                    <div class="img-container">
                        <img mode="widthFix" v-for="(item, index) of goodsDetail.description" :key="index" :data-index="index" class="desc-image" :src="item" background-size="cover"/>
                    </div>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view @scroll="scrollEvent($event)" :scroll-y="canScroll" :style="{height:winHeight+'rpx'}">
                    <div class="comment-container has-comment" v-if="commentList.length>0">
                        <comment-card v-for="(item, index) of commentList" :key="index" :commentItem="item"></comment-card>
                    </div>
                    <div class="comment-container no-comment-container" v-if="commentList.length==0">
                        <div class="no-comment">暂无评论</div>
                    </div>
                </scroll-view>
            </swiper-item>
            <swiper-item>
                <scroll-view @scroll="scrollEvent($event)" :scroll-y="canScroll" :style="{height:winHeight+'rpx'}">
                    <section>
                        <div class="zuling-header">租赁流程</div>
                        <div class="zuling-content">选择商品 -- 下单审核 -- 首期支付 -- 发货 -- 月付租金 -- 归还商品</div>
                        <div class="zuling-header">租期结束后可选方案</div>
                        <div class="zuling-subheader">归还</div>
                        <div class="zuling-content">支持邮寄归还</div>
                        <div class="zuling-subheader">买断</div>
                        <div class="zuling-content">支持尾款终身拥有</div>
                    </section>
                    <section>
                        <div class="zuling-header">其他说明</div>
                        <div class="zuling-subheader">收货须知</div>
                        <div class="zuling-content">身份证正反面复印件以确认本人收货，并交由快递小哥寄回本平台制定地点存档</div>
                        <div class="zuling-subheader">租金</div>
                        <div class="zuling-content">用户需按月支付租金，需开通支付宝免密制度协议，平台每月将自动从支付宝账号中扣除相应租金。用户也可提前主动支付剩下的租金</div>
                        <div class="zuling-subheader">买断</div>
                        <div class="zuling-content">租赁到期后可支付买断款买断该商品，买断款以下单时协议里的买断价为准。</div>
                    </section>
                </scroll-view>
            </swiper-item>
        </swiper>
        <view class="bottom-btn">
            <view class="l-collect" >
                <img @click="collect()" class="icon" :src="coloctIcon"/>
            </view>
            <view @click="showDialog($event)" class="select-guige">立即租赁</view>
        </view>
        <login-dialog v-if="showLogin" @close="showLogin=false"></login-dialog>
    </view>
       <div class="attr-pop-box" :hidden="openAttr" catchtouchmove="ture">
            <div class="attr-pop">
                <div class="img-info">
                    <div class="close" @click="closeAttr">
                        <img class="icon" src="/static/images/btn_close_popup.png"/>
                    </div>
                    <img class="img" :src="goodsDetail.picUrl"/>
                    <div class="info">
                        {{goodsDetail.name}}
                    </div>
                </div>
                <div class="price-container">
                    <div class="p">¥{{selectGoods.rentPrice}}</div>
                    <div class="a">商品价值:¥{{selectGoods.goodsPrice}}</div>
                </div>
                <div class="center-container">
                    <div class="spec-con">
                        <div class="spec-item" v-for="(item, index) of goodsDetail.specificationList" :key="index" :data-index="index">
                            <div class="name">{{item.name}}</div>
                            <div class="values">
                                <div :class="iitem.checked ? iitem.checked=='noexist'?'value unexist-value':'selected value' : 'value'"  @click="selectproduct" v-for="(iitem, iindex) of item.specificationLists" :key="iindex" :data-index="iindex" :data-name-id="iitem.name" :data-sername-id="iitem.serName">{{iitem.name}}</div>
                            </div>
                        </div>
                        <div class="spec-item">
                            <div class="name">{{goodsDetail.financeSpecificationList[0].name}}</div>
                            <div class="values">
                                <div :class="item2.checked ? 'selected value' : 'value'"  @click="selectRentTime" v-for="(item2, index2) of goodsDetail.financeSpecificationList[0].goodsFinanceSpecificationLists" :key="index2" :data-index="index2" :data-name-id="item2.name">{{item2.name}}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="goodsDetail.finaceList.length>0" class="yiwao-container">
                        <div>意外保障<span class="sub">什么是意外保障？</span>
                            <navigator class="fa-qa" url="/pages/finaceques/index" >
                                <img class="img" src="/static/images/question.png" background-size="cover" />
                            </navigator>
                        </div>
                        <div class="yiwai-select">
                            <div @click="finaceSelect(0)" :class="goodsDetail.finaceList[0].checked ? 'selected value first' : 'value first'">一次性支付&nbsp&nbsp|&nbsp&nbsp¥{{goodsDetail.finaceList[0].amount}}</div>
                            <div class="unexist-value value" v-if="goodsDetail.finaceList.length>1&&fenqiSelectFlag==false">分期信息选择规格后显示</div>
                            <div @click="finaceSelect(1)" :class="goodsDetail.finaceList[1].checked ? 'selected value' : 'value'" v-if="goodsDetail.finaceList.length>1&&fenqiSelectFlag==true">分{{finace}}期&nbsp&nbsp|&nbsp&nbsp每期¥{{goodsDetail.finaceList[1].amount}}</div>
                        </div>
                    </div>
                </div>
                <div class="bottom-btn-container">
                    <div @click="placeOrder" class="startOrder">
                        确认
                    </div>
                </div>
            </div>
        </div>
</div>
</template>

<script>
    import mixins from '../../mixins'
    import CommentCard from '../../components/commentCard.vue';
    import LoginDialog from '../../components/loginDialog.vue';
    export default {
        mpType: 'page',
        mixins: [mixins],
        components: {
            'comment-card': CommentCard,
            'login-dialog': LoginDialog
        },
        data () {
            return {
                goodsDetail: {
                    financeSpecificationList:[{}],
                    finaceList: [{}]
                },
                commentList: [],
                tabList: ['图文详情', '商品评论', '租赁说明'],
                activeItem: 0,
                winHeight: '',
                openAttr:true,
                selectGoods: {
                    rentPrice: '',
                    goodsPrice: ''
                },
                fenqiSelectFlag: false,
                allResultArr: [],
                hasRentSelected: false,
                finace: '',
                showLogin: false,
                hasScrollB:false,
                hasScrollT:false,
                canScroll: true,
                divStyle: '',
                coloctIcon: "/static/images/icon_collect_normal.png"
            }
        },
        created () {
            /*
            * demo 使用假数据
            */
            let dto = {
                "id": this.$mp.query.id
            }
            let commentDto = {
                "pageNum": 1,
                "pageSize": 100,
                "type": 0,
                "valueId": this.$mp.query.id
            }
            if (this.$mp.platform === 'wechat') {
                wx.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR-85-130;
                        this.winHeight = calc
                    }
                });
            } else {
                my.getSystemInfo({
                    success: res => {
                        const clientHeight = res.windowHeight
                        const clientWidth = res.windowWidth
                        const rpxR = 750 / clientWidth;
                        const calc = clientHeight * rpxR -85-130;
                        this.winHeight = calc
                    }
                });
            }
            this.POST('api/mallGoods/detail', dto, res => {
                let result = res.data.result;
                result.rentPrice = result.rentPrice.toFixed(2)
                result.retailPrice = result.retailPrice.toFixed(2)
                for (let it in result.specificationList) {
                    let specificationLists = []
                    result.specificationList[it].specificationLists = specificationLists
                    for(let itt of result.specificationList[it].specificationList) {
                        result.specificationList[it].specificationLists.push({
                            'name': itt,
                            'serName': it,
                            'checked': false
                        })
                    }
                }
                for (let it of result.financeSpecificationList) {
                    let goodsFinanceSpecificationLists = []
                    it.goodsFinanceSpecificationLists = goodsFinanceSpecificationLists
                    for(let itt of it.goodsFinanceSpecificationList) {
                        it.goodsFinanceSpecificationLists.push({
                            'name': itt,
                            'checked': false
                        })
                    }
                }
                for (let it of result.finaceList) {
                    it.checked = false
                }
                let reg = /[1-9][0-9]*/g;
                if (result.finaceList.length>1) {
                    let dt = []
                    result.finaceList[1].dataList = dt
                    for (let t of result.financeSpecificationList[0].goodsFinanceSpecificationList) {
                        result.finaceList[1].dataList.push(t.match(reg)[0])
                    }
                }
                this.goodsDetail = result
                this.selectGoods.rentPrice = this.goodsDetail.rentPrice
                this.selectGoods.goodsPrice = this.goodsDetail.retailPrice
                this.buildResult()
            });
            this.POST('comment/list', commentDto, res => {
                let result = res.data.result;
                this.commentList = result.list
                // this.commentList = [{
                //     addTime: '2018-2-12 12:23:30' ,
                //     content: 'osajdljasdisajd按时大大' ,
                //     hasPicture: 'false' ,
                //     id: '2222222' ,
                //     picUrls:'sssss',
                //     star:'3' ,
                //     type:'0' ,
                //     user : '无动于衷23aa' ,
                //     userAvatar: '' ,
                //     userId : '11111' ,
                //     valueId: '222222'
                //  }]
            });
        },
        methods: {
            scrollByPlat(da) {
                if(this.$mp.platform === 'alipay') {
                    my.pageScrollTo({
                        scrollTop: da
                    })
                } else {
                    wx.pageScrollTo({
                        scrollTop: da
                    })
                }
            },
            scrollEvent(e) {
                if(!this.hasScrollB &&e.detail.scrollTop>1) {
                    this.scrollByPlat(410)
                    this.hasScrollB = true
                    this.hasScrollT = false
                    // this.scrollByPlat(e.detail.scrollTop)
                }
                if(!this.hasScrollA &&e.detail.scrollTop<1) {
                    // this.scrollByPlat(0)
                    this.hasScrollT = true
                    this.hasScrollB = false
                    // this.scrollByPlat(e.detail.scrollTop)
                }
            },
            checkLogin() {
                if(getApp().globalData.accessToken === '') {
                    return false
                } else {
                    return true
                }
            },
            toastComfirm() {
                if(this.$mp.platform == 'alipay') {
                    my.confirm({
                        title: '登录提示',
                        content: '确定要取消订单吗？',
                        confirmButtonText: '取消订单',
                        cancelButtonText: '暂不需要',
                        success: (result) => {
                            this.POST('api/tradeOrder/cancel', {"orderId": this.$mp.query.id}, res => {
                                my.navigateBack({
                                    delta: 1
                                })                                
                            });
                        },
                    });
                } else {
                    wx.showModal({
                        title: '温馨提示',
                        content: '确定要取消订单吗？',
                        confirmText: '取消订单',
                        cancelText: '暂不需要',
                        success: (result) => {
                            this.POST('api/tradeOrder/cancel', {"orderId": this.$mp.query.id}, res => {
                                wx.navigateBack({
                                    delta: 1
                                })                                
                            });
                        },
                    });
                }
            },  
            toast(str) {
                if(this.$mp.platform === 'alipay') {
                    my.showToast({
                        type: 'none',
                        content: str,
                        duration: 3000,
                        success: () => {
                            console.log('success')
                        },
                    });
                } else {
                    wx.showToast({
                        title: str,
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            placeOrder() {
                let finaceList = this.goodsDetail.finaceList
                let finaceSelected = false
                let proGuige = this.isCheckedAllSpec()
                for (let i in finaceList) {
                    if (finaceList[i].checked) {
                        finaceSelected = i
                    }
                }
                
                if (proGuige === false) {
                    this.toast('请选择规格')
                    return
                }
                if(this.fenqiSelectFlag === false) {
                    this.toast('请选择租期')
                    return
                }
                if(finaceSelected === false) {
                    this.toast('请选择付款方式')
                    return
                }
                if(this.$mp.platform === 'alipay') {
                    my.navigateTo({
                        url: `/pages/placeOrder/index?id=${this.$mp.query.id}&guige=${proGuige}&rentTime=${this.hasRentSelected}&finace=${finaceSelected}`
                    })
                } else {
                    wx.navigateTo({
                       url: `/pages/placeOrder/index?id=${this.$mp.query.id}&guige=${proGuige}&rentTime=${this.hasRentSelected}&finace=${finaceSelected}`
                    })
                }
            },
            switchTabBySwiper (e) {
                this.activeItem = e.detail.current
            },
            switchTab (index) {
                this.activeItem = index
            },
            showDialog(e) {
                if(!this.checkLogin()){
                    this.showLogin=true
                    return
                }
                this.openAttr = false;
                this.canScroll = false;
                this.divStyle = 'top:0rpx;left:0px;width:100%;height:100%;overflow:hidden;position:fixed;z-index:0;'
            },
            closeAttr () {
                this.canScroll = true
                this.openAttr = true;
                this.divStyle = ''
            },
            selectproduct(e) {
                //1.点击改变样式
                //2.检查是否有货
                // console.log(e)
                // console.log(this.goodsDetail.specificationList)
                let checkedValues = [];
                let _specificationList = this.goodsDetail.specificationList;
                let specNameId = e.currentTarget.dataset.index;
                let specSernameId = e.currentTarget.dataset.sernameId;
                if (_specificationList[specSernameId].specificationLists[specNameId].checked === 'noexist') {
                    return
                }
                if (_specificationList[specSernameId].specificationLists[specNameId].checked === true) {
                    _specificationList[specSernameId].specificationLists[specNameId].checked = false
                } else {
                    for (let i of _specificationList[specSernameId].specificationLists) {
                        if (i.checked !== 'noexist')
                            i.checked = false
                    }
                    _specificationList[specSernameId].specificationLists[specNameId].checked = true
                }
                this.goodsDetail.specificationList = _specificationList;
                this.changeSpecInfo()
                this.changeAll()
            },
            getSelectProduct(id) {
                for (let i of this.goodsDetail.productList) {
                    if(i.id == id) {
                        return i
                    }
                }
            },
            powerset(arr) {
                var ps = [[]];
                for (var i=0; i < arr.length; i++) {
                    for (var j = 0, len = ps.length; j < len; j++) {
                        ps.push(ps[j].concat(arr[i]));
                    }
                }
                return ps;
            },
            buildResult() {
                // this.allResultArr
                let res = []
                let proList = this.goodsDetail.productList
                for (let i of proList) {
                    if (i.number <= 0) continue
                    let set = this.powerset(i.specifications)
                    for (let j of set) {
                        let key = j.join('+')
                        if (res[key]) {
                            res[key].skus.push(i.id)
                        } else {
                            res[key] ={
                                skus: [i.id]
                            }
                        }
                    }
                }
                this.allResultArr = res
            },
            getSelectItem () {
                let _specificationListTemp = this.goodsDetail.specificationList;
                let selectItem = []
                for (let i of _specificationListTemp) {
                    let hasAdd = false
                    for (let j of i.specificationLists) {
                        if(j.checked === true) {
                            selectItem.push(j.name)
                            hasAdd = true
                        }
                    }
                    if (!hasAdd) {
                        selectItem.push('')
                    }
                }
                return selectItem
            },
            trimSpliter(arr) {
                let ret = ''
                for (let k of arr){
                    if(k !== '') {
                        ret = ret + '+' + k
                    }
                }
                if (ret[0] === '+') {
                    ret = ret.substr(1)
                }
                return ret
            },
            changeSpecInfo () {
                let select = this.getSelectItem ()
                let _specificationListTemp = this.goodsDetail.specificationList;
                for (let i in _specificationListTemp) {
                    let copy = this.getSelectItem ()
                    let data1 = _specificationListTemp[i]
                    for (let j in data1.specificationLists) {
                        let item = data1.specificationLists[j].name
                        if(select[i] === item) {
                            continue
                        }
                        copy[i] = item
                        let curr = this.trimSpliter(copy)
                        data1.specificationLists[j].checked = 'noexist'
                        if(this.allResultArr[curr]) {
                            // console.log(this.allResultArr[curr])
                            data1.specificationLists[j].checked = false
                        }
                    }  
                }
            },
           
            // 判断规格是否选择完整(每一种至少选择一项)，加入购物车前进行判断
            isCheckedAllSpec () {
                let selectItem = this.getSelectItem()
                for (let j of selectItem) {
                    if (j === '') {
                        return false
                    }
                }
                let curr = selectItem.join('+')
                return this.allResultArr[curr].skus[0]
            },
            selectRentTime(e) {
                //1.点击改变样式
                //2.改变价格
                //3.改变保障价格
                let rentId = e.currentTarget.dataset.index;
                let rentList = this.goodsDetail.financeSpecificationList[0].goodsFinanceSpecificationLists
                if(!rentList[rentId].checked) {
                    for(let j of rentList) {
                        j.checked = false
                    }
                    rentList[rentId].checked = true
                    this.hasRentSelected = rentId
                }
                this.changeAll()
            },
            changeAll() {
                if (this.hasRentSelected!==false && this.isCheckedAllSpec()) {
                    let sp = this.getSelectProduct(this.isCheckedAllSpec())
                    this.selectGoods.rentPrice = sp.financeRespDTOList[this.hasRentSelected].price.toFixed(2)
                    this.fenqiSelectFlag = true
                    this.selectGoods.goodsPrice = sp.price.toFixed(2)
                    if(this.goodsDetail.finaceList[1])
                        this.finace = this.goodsDetail.finaceList[1].dataList[this.hasRentSelected]
                } else if (this.isCheckedAllSpec()) {
                    let sp = this.getSelectProduct(this.isCheckedAllSpec())
                    this.selectGoods.goodsPrice = sp.price.toFixed(2)
                }
            },
            finaceSelect(id) {
                let list = this.goodsDetail.finaceList
                if(list[id].checked === true) {
                    list[id].checked = false
                } else {
                    for (let i of list) {
                        i.checked = false
                    }
                    list[id].checked = true
                }
            },
            collect() {
                if(!this.checkLogin()){
                    this.showLogin=true
                    return
                }
                let dto = {
                    "type": 0,
                    "valueId": this.$mp.query.id
                }
                if(this.goodsDetail.isCollect) {
                    this.POST('api/mallCollect/delete', dto, res => {
                        this.toast('取消收藏成功')
                        this.coloctIcon = "/static/images/icon_collect_normal.png"
                        this.goodsDetail.isCollect = false
                    });
                } else {
                    this.POST('api/mallCollect/add', dto, res => {
                        this.toast('收藏成功')
                        this.goodsDetail.isCollect = true
                        this.coloctIcon = "/static/images/icon_collect_current.png"
                    });
                }
            }
        }
    }
</script>


<style scoped lang="scss">
    .container {
        background-color: #ffffff;
        font-family:microsoft yahei;
    }
    .tab-list {
        display: flex;
        height: 90rpx;
        justify-content: space-around;
        align-items: center;
        width: 692rpx;
        margin-left: 29rpx;
    }
    .tab-list .ta-li {
        font-size: 28rpx;
        line-height: 50rpx;
        color: #a8a8a8;
        border-radius: 25rpx;
        width: 160rpx;
        text-align:center;
        // border: 1rpx solid #FFFFFF;
    }
    .tab-list .active {
      border: 1rpx solid #f6f6f6;
      box-shadow: 4rpx 4rpx 20rpx #cccccc;
      color:#1b1b1b;
    }
    .swiper-container{
        margin-bottom: 140rpx;
    }
    // .tab-list {
    //     display: flex;
    //     height: 70rpx;
    //     justify-content: space-around;
    //     align-items: center;
    //     width: 50%;
    //     margin-left: 25%;
    // }
    // .tab-list view {
    //     font-size: 28rpx;
    //     font-weight: 700;
    //     line-height: 35rpx;
    //     color: #a8a8a8;
    //     // border-radius: 25px;
    //     // width: 100px;
    //     display: flex;
    //     justify-content: center;
    //     padding-right: 8rpx;
    //     padding-bottom: 5rpx;
    //     // border: 0.5px solid #FFFFFF;
    // }
    // .tab-list .active {
    //     border-bottom: 5rpx solid #1a1717;
    //     // box-shadow: 2px 2px 10px #cccccc;
    //     color:#1b1b1b;
    // }
    .header {
        width: 692rpx;
        background-color: #ffffff;
        // height: 700rpx;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
    }
    .goodsimgs {
        width:450rpx;
        height: 450rpx;
        margin-left: 121rpx;
        margin-top: 20rpx;
    }
    .goodsimgs .image{
        width: 450rpx;
        height: 450rpx;
        // height: 100%;
    }
    .goods-title {
        font-weight: 700;
        margin-left: 30rpx;
        margin-right: 30rpx;
        margin-top: 20rpx;
    }
    .goods-price-container {
        // margin-top: 300rpx;
        display: flex;
        // margin-top: 20rpx;
        justify-content: space-between;
        padding: 0rpx 30rpx;
    }
    .rent-price {
        font-size: 24rpx;
        color:#FF6900;
        // line-height: 30rpx;
    }
    .rent-price .big-price {
        font-size: 50rpx;
    }
    .rent-price .normal-font {
        color: #a8a8a8;
    }
    .total-price {
        font-size: 24rpx;
        color: #a8a8a8;
        margin-top: 40rpx;
        // line-height: 45rpx;
    }
    // --ww
    // .total-price {
    //     font-size: 24rpx;
    //     color: #a8a8a8;
    //     margin-top: 30rpx;
    //     // line-height: 45rpx;
    // }
    .zuling-header {
        font-size: 28rpx;
        font-weight: 700;
        margin-left: 29rpx;
        margin-top: 40rpx;
    }
    .zuling-subheader {
        font-size: 26rpx;
        font-weight: 400;
        margin-left: 29rpx;
        margin-top: 40rpx;
    }
    .zuling-content {
        font-size: 26rpx;
        margin-left: 29rpx;
        margin-right: 29rpx;
        margin-top: 25rpx;
        color: #a8a8a8;
        line-height: 50rpx;
    }
    .bottom-btn {
        width: 100%;
        height: 100rpx;
        position: fixed;
        bottom: 0;
        background-color: #FFFFFF;
        border-top:1px solid #F5f5f5;
        display: flex;
        justify-content: space-between;
    }
    .l-collect {
        height: 100rpx; 
        width: 54rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 60rpx;
    }
    .l-collect .icon {
        width: 54rpx;
        height: 52rpx;
    }
    .select-guige {
        background-color: #FF7000;
        color:#ffffff;
        text-align: center;
        height: 80rpx;
        border-radius: 40rpx;
        width: 595rpx;
        margin-top: 10rpx;
        line-height: 80rpx;
        font-size: 26rpx;
        margin-right: 15rpx;
    }
    .img-container {
        margin-top: 20rpx;
        width: 750rpx;
        font-size: 0rpx;
    }
    .desc-image {
        width: 750rpx;
        // height: auto;
        // margin-top:-8rpx;
        // height: 900rpx;
    }
    .comment-container {
        width: 692rpx;
        min-height: 82vh;
        margin-left: 29rpx;
        border: 1px solid #FAFAFA;
        border-radius: 20rpx;
        margin-top: 20rpx;
        box-shadow: 2rpx 2rpx 50rpx #cccccc;
    }
    .no-comment-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        color: #a8a8a8;
    }
    .attr-pop-box {
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .5);
        z-index: 8;
        bottom: 0rpx;
    }
    .attr-pop {
        width: 750rpx;
        border-radius: 50rpx 50rpx 0rpx 0;
        height: auto;
        max-height: 980rpx;
        // padding: 30rpx;
        background: #fff;
        position: fixed;
        z-index: 9;
        bottom: 0rpx;
        overflow-y: auto;
    }
    .img-info {
        position: fixed;
        width: 100%;
        height: 300rpx;
        background-color: #FFF6EF;
        display: flex;
        flex-direction: row;
        z-index: 12;
    }
    .img-info .img {
        margin: 60rpx 0 0 60rpx;
        width: 280rpx;
        height: 280rpx;
        z-index: 888;
    }
    .img-info .info {
        color: #FF6F00;
        margin-top: 160rpx;
        margin-left: 20rpx;
        margin-right: 20rpx;
        font-weight: 700;
        font-size: 32rpx;
    }
    .attr-pop .close {
        position: absolute;
        width: 48rpx;
        height: 48rpx;
        right: 80rpx;
        overflow: hidden;
        top: 31.25rpx;
    }

    .attr-pop .close .icon {
        width: 48rpx;
        height: 48rpx;
    }
    .center-container {
        margin-top: 460rpx;
        margin-bottom: 140rpx;
    }
    .price-container {
        position: fixed;
        width: 750rpx;
        background-color: #ffffff;
        margin-top: 300rpx;
        display: flex;
        height: 160rpx;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10;
    }
    .price-container .p {
        font-weight: 700;
        font-size: 40rpx;
    }
    .price-container .a {
        font-weight: 400;
        font-size: 24rpx;
        color: #999999;
        margin-top: 10rpx;
    }
    .spec-con {
        width: 692rpx;
        margin-left: 29rpx;
        display: flex;
        flex-direction: column;
        font-size: 26rpx;
        margin-top: -20rpx;
        padding-bottom: 50rpx;
    }
    .spec-con .spec-item {
        display: flex;
        flex-direction: row;
    }
    .spec-con .spec-item .name{
        flex: 170rpx;
        margin-top: 30rpx;
    }
    .spec-con .spec-item .values{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        flex: 522rpx;
    }
    .spec-con .spec-item .values .value{
        border: 1px solid #999999;
        height: 54rpx;
        line-height: 54rpx;
        padding: 0 20rpx;
        max-width: 160rpx;
        white-space:nowrap;
        text-overflow: ellipsis;
        overflow:hidden;
        border-radius: 10rpx;
        margin-left: 30rpx;
        margin-top: 30rpx;
    }
    .yiwao-container {
        width: 692rpx;
        margin-left: 29rpx;
        border-top: 1px solid #e7e7e7;
        padding-top: 30rpx;
        font-size: 26rpx;
    }
    .fa-qa {
        width: 32rpx;
        height: 32rpx;
        position: absolute;
        right: 33rpx;
        // bottom: 0;
        display:inline-block;

    }
    .fa-qa .img{
        width: 32rpx;
        height: 32rpx;
    }
    .yiwao-container .sub {
        color:#959595;
        font-size: 22rpx;
        margin-left: 15rpx;
    }
    .yiwao-container .yiwai-select{
        display: flex;
        flex-direction: row;
    }
    .yiwao-container .yiwai-select .value {
        border: 1px solid #9A9A9A;
        height: 54rpx;
        line-height: 54rpx;
        padding: 0 20rpx;
        border-radius: 10rpx;
        margin-top: 30rpx;
    }
    .yiwao-container .yiwai-select .first {
        margin-right: 30rpx;
    }
    .unexist-value {
        border: 1px dashed #cacaca !important;
        color: #9a9a9a !important;
    }
    .selected {
        border: 1px solid #ff6f00 !important;
        color: #ff6f00 !important;
    }
    .bottom-btn-container {
        background-color: #ffffff;
        width: 750rpx;
        height: 140rpx;
        position: fixed;
        bottom: 0rpx;
    }
    .startOrder{
        color: #fff;
        background-color: #FF6F00;
        height: 80rpx;
        border-radius: 40rpx;
        text-align: center;
        width: 692rpx;
        margin-left: 29rpx;
        line-height: 80rpx;
        font-weight: 400;
        font-size: 30rpx;
        // margin-bottom: 30rpx;
        margin-top: 30rpx;
    }
</style>