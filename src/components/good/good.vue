<template>
  <div class="goods">
    <div class="menu-wrapper" ref='menuWrapper'>
      <ul class="menu" v-show="goods.length">
        <li v-for="(good, index) in goods" :key="index" class="menu-item" :class="{current: currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text" :class="{'border-1px': currentIndex !== index}">
            <span v-show="good.type > 0" class="icon" :class="classMap[good.type]"></span>{{good.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list" ref="foodList" v-for="(good, index) in goods" :key="index">
          <h2 class="title">{{good.name}}</h2>
          <ul>
            <li class="food-item" v-for="(food, index) in good.foods" :key="index" :class="{'border-1px': index !== good.foods.length - 1}" @click="openFood(food, $event)">
              <div class="icon">
                <img  width="57" height="57" alt="" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span>月售{{food.sellCount}}份</span>
                  <span>好评{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food" @add="add" @decrease="decrease" @cartAdd="cartAdd" :emptyFoods="emptyFoods"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <food-detail :food="foodDetails" ref="foodDetail" @add="add" @cartAdd="cartAdd"></food-detail>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import CartControl from 'components/cartcontrol/cartcontrol'
import FoodDetail from 'components/food-detail/food-detail'

const ERR_OK = 0

export default {
  name: 'good',
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectFoods: [],
      foodDetails: {}
    }
  },
  props: {
    seller: {
      type: Object,
      default: () => {
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
    CartControl,
    FoodDetail
  },
  created() {
    this.$http.get('/api/goods').then(response => {
      if (response.body.errno === ERR_OK) {
        this.goods = response.body.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  computed: {
    currentIndex() {
      for (let i = 0, len = this.listHeight.length; i < len; i++) {
        if (this.listHeight[i + 1] && this.scrollY >= this.listHeight[i] && this.scrollY < this.listHeight[i + 1]) {
          return i
        }
      }
      return 0
    }
  },
  methods: {
    selectMenu(index, event) {
      if (!event._constructed) {
        return
      }
      this.foodsScroll.scrollToElement(this.$refs.foodList[index], 300)
    },
    add(food) {
      let index = 0
      index = this.selectFoods.findIndex((item) => {
        return item.name === food.name
      })
      if (index > -1) {
        this.selectFoods.splice(index, 1)
      }
      this.selectFoods.push(food)
      this.$emit('foodsChange', this.selectFoods)
    },
    decrease(food) {
      let index = 0
      index = this.selectFoods.findIndex((item) => {
        return item.name === food.name
      })
      if (index > -1) {
        this.selectFoods.splice(index, 1)
      }
      if (food.count === 0) {
        this.$emit('foodsChange', this.selectFoods)
        return
      }
      this.selectFoods.push(food)
      this.$emit('foodsChange', this.selectFoods)
    },
    cartAdd(target) {
      // 体验优化，异步执行动画
      this.$nextTick(() => {
        this.shoppingCart.drop(target)
      })
    },
    openFood(food, event) {
      if (!event._constructed) {
        return
      }
      this.foodDetails = food
      this.$refs.foodDetail.show()
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      // the listHeight has some problems
      let height = 0
      this.listHeight.push(height)
      this.$refs.foodList.forEach((item) => {
        height += item.clientHeight
        this.listHeight.push(height)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

.goods
  display: flex
  position: fixed
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu
      .menu-item
        display: table
        width: 56px
        height: 54px
        font-size: 0
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          font-weight: 700
          background-color: #fff;
        .text
          display: table-cell
          font-size: 12px
          vertical-align: middle
          &.border-1px
            border-1px(rgba(7,17,27,.1))
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right: 2px
          vertical-align: middle
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('img/decrease_3')
          &.discount
            bg-image('img/discount_3')
          &.guarantee
            bg-image('img/guarantee_3')
          &.invoice
            bg-image('img/invoice_3')
          &.special
            bg-image('img/special_3')
  .foods-wrapper
    flex: 1
    .food-list
      .title
        height: 26px
        line-height: 26px
        padding-left: 14px
        font-size: 12px
        color: rgb(147, 153, 159)
        background-color: #f3f5f7
        border-left: 2px solid #d9dde1
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        position: relative
        &.border-1px
          border-1px(rgba(7, 17, 27, .1))
        .icon
          flex: 0 0 57px
          margin-right: 10px
          img
            border-radius: 2px
        .content
          flex: 1
          .name
            font-size: 14px
            color: rgb(7, 17, 27)
            line-height: 14px
            margin: 2px 0px 8px 0px
          .desc
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 12px
            margin-bottom: 8px
          .extra
            font-size: 0
            span
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 10px
              margin-right: 12px
          .price
            span
              color: rgb(147, 153, 159)
              line-height: 24px
              font-weight: 700
              &.now
                font-size: 14px
                color: rgb(240, 20, 20)
                margin-right: 8px
              &.old
                text-decoration: line-through
                font-size: 10px
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
