<template>
  <div class="star" :class="starType">
    <span class="star-item" :class="item" v-for="(item,index) in itemClasses" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  name: 'star',
  data() {
    return {}
  },
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType() {
      return 'star-' + this.size
    },
    itemClasses() {
      let ret = []
      let score = Math.floor(this.score * 2) / 2
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        ret.push(CLS_ON)
      }
      if (hasDecimal) {
        ret.push(CLS_HALF)
      }
      while (ret.length < LENGTH) {
        ret.push(CLS_OFF)
      }
      return ret
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

.star
  font-size: 0
  .star-item
    display: inline-block
    background-repeat: no-repeat
  &.star-24
    .star-item
      width: 10px
      height: 10px
      margin-right: 3px
      background-size: 10px 10px
      &:last-child
        margin-right: 0px
      &.on
        bg-image('./img/star24_on')
      &.off
        bg-image('./img/star24_off')
      &.half
        bg-image('./img/star24_off')
  &.star-36
    .star-item
      width: 15px
      height: 15px
      margin-right: 6px
      background-size: 15px 15px
      &:last-child
        margin-right: 0px
      &.on
        bg-image('./img/star36_on')
      &.off
        bg-image('./img/star36_off')
      &.half
        bg-image('./img/star36_off')
  &.star-48
    .star-item
      width: 20px
      height: 20px
      margin-right: 22px
      background-size: 20px 20px
      &:last-child
        margin-right: 0px
      &.on
        bg-image('./img/star48_on')
      &.off
        bg-image('./img/star48_off')
      &.half
        bg-image('./img/star48_off')
</style>
