<template>
  <div class="cart">
    <transition name="slide">
      <div class="decrease" v-show="food.count > 0" @click.stop.prevent="decreaseFood($event)">
        <span class="icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="count" v-show="food.count > 0">{{food.count}}</div>
    <div class="add icon-add_circle" @click.stop.prevent="addFood($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'

export default {
  name: 'cartcontrol',
  props: {
    food: {
      type: Object,
      default () {
        return {}
      }
    },
    emptyFoods: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    addFood (event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count += 1
      }
      this.$emit('add', this.food)
      this.$emit('cartAdd', event.target)
    },
    decreaseFood (event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count -= 1
      }
      this.$emit('decrease', this.food)
    }
  },
  watch: {
    emptyFoods () {
      // console.log(this.emptyFoods) ???
      this.emptyFoods.forEach((item) => {
        if (this.food.name === item.name && this.food.count > 0) {
          this.food.count = 0
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/fontIcon"

.cart
  display: flex
  align-items: center
  justify-content: space-between
  .decrease, .add
    padding: 6px
    line-height: 24px
    font-size: 24px
    color: rgb(0, 160, 220)
  .decrease
    &.slide-enter-active, &.slide-leave-active
      transition: all .4s linear
      span
        transition: all .4s linear
    &.slide-enter-to, &.slide-leave
      opacity: 1
      tranform: translate3d(0, 0, 0)
      span
        tranform: rotate(0)
    &.slide-enter, &.slide-leave-to
      opacity: 0
      tranform: translate3d(24px, 0 , 0)
      span
        tranform: rotate(180deg)
  .count
    line-height: 24px
    width: 12px
    vertical-align: top
    text-align: center
    font-size: 10px
    color: rgb(147, 153, 159)
</style>
