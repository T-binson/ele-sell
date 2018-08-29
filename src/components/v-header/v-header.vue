<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="" width="64" height="64">
      </div>
      <div class="content" >
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}} / {{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports-count" v-if="seller.supports" @click.stop="show">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click.stop="show">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="">
    </div>
    <transition name="fade">
      <!-- sticky footer -->
      <div class="details" v-show="detailsShow">
        <div class="details-wrapper clearfix">
          <div class="main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="support" v-if="seller.supports">
              <li class="item" v-for="item in seller.supports" :key="item.type">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="description">
                {{seller.bulletin}}
              </p>
            </div>
          </div>
        </div>
        <div class="details-close" @click="hide">
          <i class="icon-remove_circle_outline"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Star from 'components/star/star'

export default {
  name: 'v-header',
  data () {
    return {
      detailsShow: false
    }
  },
  props: {
    seller: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    Star
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    show() {
      this.detailsShow = true
    },
    hide() {
      this.detailsShow = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/index"

.header
  position: relative
  overflow: hidden
  background-color: rgba(7, 17, 27, .5)
  .content-wrapper
    padding: 24px 12px 18px 24px
    font-size: 0
    position: relative
    .avatar
      display: inline-block
      vertical-align: top
      img
        border-radius: 4px
    .content
      display: inline-block
      margin-left: 16px;
      color: rgb(255,255,255)
      .title
        padding: 2px 0px 8px 0px
        .brand
          display: inline-block
          width: 30px
          height: 18px
          vertical-align: top
          bg-image('./img/brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 6px
          font-size: 16px
          font-weight: bold
          line-height: 18px;
          color: rgb(255,255,255)
      .description
        margin-bottom: 10px
        font-size: 12px
        color: rgb(255,255,255)
        line-height: 12px
      .supports
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 4px
          vertical-align: top
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('./img/decrease_1')
          &.discount
            bg-image('./img/discount_1')
          &.guarantee
            bg-image('./img/guarantee_1')
          &.invoice
            bg-image('./img/invoice_1')
          &.special
            bg-image('./img/special_1')
        .text
          font-size: 10px
          line-height: 12px
    .supports-count
      position: absolute
      right: 12px
      bottom: 14px
      height: 24px
      line-height: 24px
      border-radius: 14px
      padding: 0px 8px
      background-color: rgba(0, 0, 0, .2)
      color: #fff
      text-align: center
      .count
        margin-right: 2px
        font-size: 10px
        vertical-align: top
      .icon-keyboard_arrow_right
        line-height: 24px
        font-size: 10px
  .bulletin-wrapper
    position: relative
    height: 28px
    line-height: 28px
    padding: 0 22px 0 12px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    background-color: rgba(7, 17, 27, .2)
    color: #fff
    .bulletin-title
      display: inline-block
      width: 22px
      height: 12px
      vertical-align: top
      margin-top: 8px
      bg-image('./img/bulletin')
      background-size: 22px 12px
      background-repeat: no-repeat
    .bulletin-text
      vertical-align: top
      margin: 0px 4px
      font-size: 10px
    .icon-keyboard_arrow_right
      position: absolute
      right: 12px
      top: 10px
      font-size: 10px
  .background
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: -1
    filter: blur(10px)
    img
      width: 100%
      height: 100%
  .details
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    overflow: auto
    z-index: 100
    color: #fff
    background: rgba(7, 17, 27, .8)
    backdrop-filter: blur(10px)
    opacity: 1
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .details-wrapper
      width: 100%
      min-height: 100%
      .main
        margin-top: 64px
        padding-bottom: 64px
        .name
          line-height: 16px
          font-size: 16px
          font-weight: 700
          text-align: center
        .star-wrapper
          margin-top: 18px
          padding: 2px 0px
          text-align: center
        .title
          width:80%
          margin: 24px auto 24px auto
          display: flex
          align-items: center
          justify-content: space-around
          .line
            flex: 1
            position: relative
            border-bottom: 1px solid rgba(255,255,255,.2)
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
        .support
          width: 80%
          margin: 24px auto 28px auto
          .item
            padding: 0 12px
            margin-bottom: 12px
            font-size: 0
            &:last-child
              margin-bottom: 0px
            .icon
              display: inline-block
              width: 16px
              height: 16px
              margin-right: 6px
              vertical-align: top
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('./img/decrease_2')
              &.discount
                bg-image('./img/discount_2')
              &.guarantee
                bg-image('./img/guarantee_2')
              &.invoice
                bg-image('./img/invoice_2')
              &.special
                bg-image('./img/special_2')
            .text
              vertical-align: top
              font-size: 12px
              line-height: 16px
        .bulletin
          width: 80%
          margin: 0 auto
          .description
            line-height: 24px
            font-size: 12px
            padding: 0 12px
    .details-close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0 auto
      clear: both
      text-align: center
      font-size: 32px
      .icon-close
        display: inline-block
        background-color: rgba(255, 255, 255, .5)
</style>
