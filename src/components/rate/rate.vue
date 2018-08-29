<template>
  <div class="rate" ref="rate">
    <div class="rate-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <h2 class="desc">综合评分</h2>
          <p class="rank">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star class="" :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star class="star" :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="deliveryTime">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent" @select="select" @toggleContent="toggleContent"></rating-select>
      <div class="ratings-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="(rating, index) in ratings" :key="index" v-show="(selectType === 2 && (onlyContent ? rating.text : true)) || (selectType === rating.rateType && (onlyContent ? rating.text : true))">
            <div class="avatar"><img width="28" height="28" :src="rating.avatar" alt=""></div>
            <div class="content">
              <h1 class="username">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star class="star" :size="24" :score="rating.score"></star>
                <span class="deliveryTime" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                <span class="icon-thumb_up" v-show="rating.recommend && rating.recommend.length"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatTime}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import {formatDate} from 'common/js/date'
import Star from 'components/star/star'
import Split from 'components/split/split'
import RatingSelect from 'components/rating-select/rating-select'

const ALL = 2
const ERR_OK = 0

export default {
  name: 'rate',
  data() {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: false
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
    },
    size: {
      type: Number,
      default: 0
    },
    score: {
      type: Number,
      default: 0
    }
  },
  components: {
    Star,
    Split,
    RatingSelect
  },
  methods: {
    select(type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    toggleContent(onlyContent) {
      this.onlyContent = !onlyContent
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      })
    }
  },
  created() {
    this.$http.get('/api/ratings').then(response => {
      if (response.body.errno === ERR_OK) {
        this.ratings = response.body.data
        this.selectType = ALL
        this.onlyContent = false
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.rate, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    })
  },
  filters: {
    formatTime(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

  .rate
    position: absolute
    top: 174px
    left: 0
    bottom: 48px
    width: 100%
    overflow: hidden
    .rate-content
      .overview
        display: flex
        justify-content: space-between
        padding: 18px 0px
        .overview-left
          flex: 0 0 137px
          padding: 6px 0px
          border-right: 1px solid rgba(7, 17, 27, .1)
          text-align: center
          @media only screen and (max-width: 320px)
            flex: 0 0 120px
            width: 120px
          .score
            line-height: 28px
            font-size: 24px
            color: rgb(255, 153, 0)
            margin-bottom: 6px
          .desc
            margin-bottom: 8px
            line-height: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
          .rank
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
        .overview-right
          flex: 1
          padding: 6px 0px 6px 24px
          @media only screen and (max-width: 320px)
            padding-left: 6px
          .score-wrapper
            margin-bottom: 8px
            font-size: 0
            .title
              display: inline-block
              vertical-align: top
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .star
              display: inline-block
              margin: 0px 12px
            .score
              display: inline-block
              vertical-align: top
              line-height: 18px
              font-size: 12px
              color: rgb(255, 153, 0)
          .delivery-wrapper
            line-height:18px
            font-size: 0
            .title
              vertical-align: top
              margin-right: 12px
              font-size: 12px
              color: rgb(7, 17, 27)
            .deliveryTime
              vertical-align: top
              font-size: 12px
              color: rgb(147, 153, 159)
      .ratings-wrapper
        padding: 0 18px
        .rating-item
          display: flex
          padding: 18px 0px
          border-1px(rgba(7, 17, 27, .1))
          .avatar
            flex: 0 0 28px
            width: 28px
            margin-right: 12px
            img
              border-radius: 50%
          .content
            flex: 1
            position: relative
            .username
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
              margin-bottom: 4px
            .star-wrapper
              margin-bottom: 6px
              font-size: 0
              .star
                display: inline-block
                vertical-align: top
                margin-right: 6px
              .deliveryTime
                display: inline-block
                line-height: 12px
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
            .text
              margin-bottom: 8px
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .recommend
              line-height: 16px
              font-size: 0
              .icon-thumb_up
                display: inline-block
                margin-right: 8px
                font-size: 12px
                color: rgb(0, 160, 220)
              .item
                display: inline-block
                padding: 0 6px
                margin: 0px 8px 4px 0px
                border 1px solid rgba(7, 17, 27, .1)
                border-radius: 1px
                background-color: rgb(255, 255, 255)
                font-size: 9px
                color: rgb(147, 153, 159)
                white-space: nowrap
                text-overflow: ellipsis
            .time
              position: absolute
              right: 0
              top: 0
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
</style>
