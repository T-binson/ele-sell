<template>
  <transition name="move">
    <div class="food-detail" v-show="showFlag" ref="foodDetail">
      <div class="food-content" ref="foodContent">
        <div class="img-header">
          <img alt="" :src="food.image">
          <div class="back" @click="hide"><i class="icon-arrow_lift"></i></div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="statistics">
            <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFood">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :ratings="food.ratings" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" @select="select" @toggleContent="toggleContent"></rating-select>
          <div class="rating-wrapper">
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            <ul class="ratings" v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px" v-for="(rating, index) in food.ratings" :key="index" v-show="(selectType === 2 && (onlyContent ? rating.text : true)) || (rating.rateType === selectType && (onlyContent ? rating.text : true))">
                <!-- v-show="contentShow(rating.rateType, rating.text)" 判断评价的显示-->
                <div class="user"><span class="name">{{rating.username}}</span><img :src="rating.avatar" width="12" height="12" alt="" class="avatar"></div>
                <div class="time">{{rating.rateTime | formatTime}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType === 0, 'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import Vue from 'vue'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import Split from 'components/split/split'
import RatingSelect from 'components/rating-select/rating-select'
import {formatDate} from 'common/js/date'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  name: 'food-detail',
  data () {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  props: {
    food: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    show () {
      this.showFlag = true
      this.selectType = ALL
      this.onlyContent = false
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodDetail, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide () {
      this.showFlag = false
      this.onlyContent = false
    },
    addFood (event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.food, 'count', 1)
      this.$emit('add', this.food)
      this.$emit('cartAdd', event.target)
    },
    cartAdd (target) {
      this.$emit('cartAdd', target)
    },
    select (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent (onlyContent) {
      this.onlyContent = !onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
    // 判断评价的显示
    // contentShow (type, text) {
    //   if (this.onlyContent && !text) {
    //     return false
    //   }
    //   if (this.selectType === ALL) {
    //     return true
    //   } else {
    //     return type === this.selectType
    //   }
    // }
  },
  filters: {
    formatTime (time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartcontrol,
    Split,
    RatingSelect
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/fontIcon"
@import "~common/stylus/mixin"

  .food-detail
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background-color: #fff
    &.move-enter-active, &.move-leave-active
      transition: all .4s
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .food-content
      .img-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%
        img
          position: absolute
          left: 0
          top: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          left: 0
          top: 10px
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        padding: 18px
        position: relative
        .title
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7,17,27)
          margin-bottom: 8px
        .statistics
          height: 10px
          font-size: 0
          color: rgb(147, 153, 159)
          line-height: 10px
          margin-bottom: 18px
          .sell-count
            font-size: 10px
            margin-right: 12px
          .rating
            font-size: 10px
        .price
          line-height: 24px
          font-weight: 700
          .now
            font-size: 14px
            color: rgb(240, 20, 20)
            margin-right: 8px
          .old
            font-size: 10px
            color: rgb(147, 153, 159)
            text-decoration: line-through;
        .cartcontrol-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          border-radius: 12px
          font-size: 10px
          color: #fff
          background-color: rgb(0, 160, 220)
          .&.fade-enter-active, &.fade-leave-active
            transition: all .3s
          &.fade-enter, &.fade-leave-to
            opacity: 0
      .info
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7, 17, 27)
        .text
          line-height: 24px
          padding: 0 8px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        padding-top: 18px
        .title
          line-height: 14px
          margin-left: 18px
          font-size: 14px
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
          .ratings
            .rating-item
              position: relative
              padding: 16px 0
              border-1px(rgba(7, 17, 27, .1))
              .user
                position: absolute
                right: 0
                top: 16px
                line-height: 12px
                font-size: 0
                .name
                  display: inline-block
                  vertival-align: top
                  margin-right: 6px
                  font-size: 10px
                  color: rgb(147, 153, 159)
                .avatar
                  border-radius: 50%
              .time
                margin-bottom: 6px
                line-height: 12px
                font-size: 10px
                color: rgb(147, 153, 159)
              .text
                line-height: 16px
                font-size: 12px
                color: rgb(7, 17, 27)
                .icon-thumb_down, .icon-thumb_up
                  margin-right: 4px
                  line-height: 16px
                  font-size: 12px
                .icon-thumb_down
                  color: rgb(147, 153, 159)
                .icon-thumb_up
                  color: rgb(0, 160, 220)
</style>
