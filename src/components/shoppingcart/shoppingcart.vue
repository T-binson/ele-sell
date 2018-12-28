<template>
  <div>
    <div class="shopCart">
      <div class="content" @click="toggleList">
        <div class="left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount > 0}"><i class="icon-shopping_cart"></i></div>
            <div class="count" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price">
            <span class="total" :class="{highlight: totalPrice > 0}">￥{{totalPrice}}</span>
          </div>
          <div class="desc">另需配送费￥{{seller.deliveryPrice}}元</div>
        </div>
        <div class="right" :class="{enough: totalPrice >= seller.minPrice}" @click.stop="pay">
          <span class="pay">{{payDesc}}</span>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in  balls" :key="index">
          <transition name="drop"
                    @before-enter="beforeEnter"
                    @enter="enter"
                    @after-enter="afterEnter">
            <div class="ball" v-show="ball.show">
              <div class="inner"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="fold">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click.stop="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index" v-show="food.count">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" @add="add" @decrease="decrease" @cartAdd="cartAdd"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="fold" @click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Cartcontrol from 'components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'

export default {
  name: 'ShoppingCart',
  data () {
    return {
      balls: [
        {show: false},
        {show: false},
        {show: false},
        {show: false},
        {show: false}
      ],
      dropBalls: [],
      target: null,
      fold: false
    }
  },
  props: {
    seller: {
      type: Object,
      default () {
        return {}
      }
    },
    selectFoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: {
    Cartcontrol
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.seller.minPrice}元起送`
      } else if (this.totalPrice < this.seller.minPrice) {
        let diff = this.seller.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    showFlag: {
      get () {
        return this.fold
      },
      set () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        return show
      }
    }
  },
  methods: {
    drop (el) {
      this.balls.forEach((ball) => {
        ball.show = true
        ball.el = el
        this.dropBalls.push(ball)
      })
    },
    // the transition has some problems to solve
    beforeEnter (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
          el.style.transform = `translate3d(0, ${y}px, 0)`
          el.children[0].style.webkitTransform = `translate3d(${x}px, 0, 0)`
          el.children[0].style.transform = `translate3d(${x}px, 0, 0)`
        }
      }
    },
    enter (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0, 0, 0)'
        el.style.transform = 'translate3d(0, 0, 0)'
        el.children[0].style.webkitTransform = 'translate3d(0, 0, 0)'
        el.children[0].style.transform = 'translate3d(0, 0, 0)'
      })
      el.addEventListener('transitionend', done)
    },
    afterEnter (el) {
      let ball = this.dropBalls.shift()
      if (ball.show) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
      if (this.fold) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    },
    empty () {
      this.$emit('empty', this.selectFoods)
    },
    hideList () {
      this.fold = false
    },
    add (food) {
      let index = 0
      index = this.selectFoods.findIndex((item) => {
        return item.name === food.name
      })
      this.selectFoods.splice(index, 0, food)
      if (index > -1) {
        this.selectFoods.splice(index + 1, 1)
      }
    },
    decrease (food) {
      let index = 0
      index = this.selectFoods.findIndex((item) => {
        return item.name === food.name
      })
      if (food.count === 0) {
        this.selectFoods.splice(index, 1)
        return
      }
      this.selectFoods.splice(index, 0, food)
      if (index > -1) {
        this.selectFoods.splice(index + 1, 1)
      }
    },
    cartAdd (target) {
      // 体验优化，异步执行动画
      this.$nextTick(() => {
        this.drop(target)
      })
    },
    pay () {
      if (this.totalPrice < this.seller.minPrice) {
        return
      }
      // jump into the pay page
      alert(`You must pay ${this.totalPrice}`)
    }
  },
  watch: {
    selectFoods () {
      if (!this.totalCount) {
        this.fold = false
        return
      }
      let show = !this.fold
      return show
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

  .shopCart
    width: 100%
    height: 48px
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    .content
      display: flex
      height: 100%
      .left
        flex: 1
        height: 100%
        background-color: #141d27
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          width: 56px
          height: 56px
          border-radius: 50%
          margin: 0px 12px
          padding: 6px
          box-sizing: border-box
          vertical-align: top
          background-color: #141d27
          .logo
            width: 44px
            height: 44px
            border-radius: 50%
            margin-bottom: 2px
            background-color: #2b343c
            text-align: center
            &.highlight
              background-color: rgb(0, 160, 220)
              .icon-shopping_cart
                color: #fff
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: rgba(255,255,255,.4)
          .count
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            font-size: 9px
            font-weight: 700
            color: #fff
            border-radius: 16px
            background-color: rgb(240,20,20)
            box-shadow: 0px 4px 8px 0px rgba(0,0,0,.4)
        .price
          display: inline-block
          vertical-align: top
          font-size: 16px
          font-weight: 700
          color: rgba(255, 255,255, .4)
          line-height: 24px
          padding-right: 12px
          margin-top: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,.1)
          .highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          padding: 12px 12px 0px 12px
          font-size: 10px
          box-sizing: border-box
          color: rgba(255, 255,255, .4)
      .right
        flex: 0 0 105px
        height: 100%
        width: 105px
        padding: 12px 8px 0px
        box-sizing: border-box
        text-align: center
        background-color: #2b333b
        &.enough
          background-color: #00b43c
          .pay
            color: #fff
        .pay
          line-height: 24px
          font-size: 12px
          font-weight: 700
          color: rgba(255,255,255,.4)
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active, &.drop-leave-active
          transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            transition: all .4s linear
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background-color: rgb(0, 160, 220)
    .shopcart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .5s
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background-color: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        max-height: 217px
        overflow: hidden
        padding: 0 18px
        background-color: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    background-filter: blur(10px)
    opacity: 1
    background-color: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all .5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background-color: rgba(7, 17, 27, 0)
</style>
