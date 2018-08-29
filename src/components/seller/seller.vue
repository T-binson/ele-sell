<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="statistics border-1px">
          <star class="star" :size="36" :score="seller.score"></star>
          <span class="count">({{seller.ratingCount}})</span>
          <span class="count">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="price">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="price">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="price">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="collect" @click="collect">
          <span class="icon-favorite" :class="{active: favorite}"></span>
          <span class="favorite">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="introduction">{{seller.bulletin}}</p>
        <ul class="supports" v-if="seller.supports">
          <li class="support" v-for="(support, index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-picture">
        <h1 class="title">商家实景</h1>
        <div class="pics-wrapper" ref="picsWrapper">
          <ul class="pics" ref="pics">
            <li class="pic-item" v-for="(pic, index) in seller.pics" :key="index"><img width="120" height="90" :src="pic" alt=""></li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="title">商家信息</h1>
        <ul class="info-list">
          <li class="list" v-for="(info, index) in seller.infos" :key="index">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {saveToLocal, loadFromLocal} from 'common/js/storage'
import BScroll from 'better-scroll'
import Star from 'components/star/star'
import Split from 'components/split/split'

export default {
  name: 'seller',
  data() {
    return {
      favorite: loadFromLocal(this.seller.id, 'favorite', false)
    }
  },
  props: {
    seller: {
      type: Object,
      default() {
        return {}
      }
    },
    shoppingCart: {
      type: Object,
      default() {
        return {}
      }
    },
    emptyFoods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    Star,
    Split
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    })
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let width = this.$refs.pics.children.length * (picWidth + margin) - margin
      this.$refs.pics.style.width = width + 'px'
      this.$nextTick(() => {
        if (!this.picScroll) {
          this.picScroll = new BScroll(this.$refs.picsWrapper, {
            scrollX: true,
            eventPassthrough: 'vertical',
            click: true
          })
        } else {
          this.picScroll.refresh()
        }
      })
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    collect(event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

  .seller
    position: absolute
    top: 174px
    bottom: 48px
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        fon-size: 14px
        color: rgb(7,17, 27)
      .statistics
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        font-size: 0
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .count
          display: inline-block
          vertical-align: top
          margin-right: 12px
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding: 18px 0px
        .block
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, .1)
          text-align: center
          &:last-child
            border-right: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            font-size: 10px
            color: rgb(7, 17, 27)
            .price
              line-height: 24px
              font-size: 24px
      .collect
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        font-size: 0
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          &.active
            color: rgb(240, 20, 20)
        .favorite
          display: block
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 90)
    .bulletin
      padding: 18px 18px 0px 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .introduction
        padding: 0px 12px
        margin-bottom: 16px
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)
      .supports
        .support
          padding: 16px 12px
          border-top: 1px solid rgba(7, 17, 27, .1)
          font-size: 0
          .icon
            display: inline-block
            width: 16px
            height: 16px
            margin-right: 6px
            vertical-align: top
            background-size: 16px 16px
            background-repeat: no-repeat
            &.decrease
              bg-image('./img/decrease_4')
            &.discount
              bg-image('./img/discount_4')
            &.guarantee
              bg-image('./img/guarantee_4')
            &.invoice
              bg-image('./img/invoice_4')
            &.special
              bg-image('./img/special_4')
          .text
            vertical-align: top
            font-size: 12px
            line-height: 16px
            color: rgb(7, 17, 27)
    .seller-picture
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7,17, 27)
      .pics-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pics
          font-size: 0
          .pic-item
            display: inline-block
            width: 120px
            height: 90px
            margin-right: 6px
            &:last-child
              margin-right: none
    .seller-info
      padding: 18px 18px 0px 18px
      color: rgb(7, 17, 27)
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
      .info-list
        .list
          padding: 16px 12px
          border-top: 1px solid rgba(7, 17, 27, .1)
          line-height: 16px
          font-size: 12px
</style>
