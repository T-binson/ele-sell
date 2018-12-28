<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{active: selectType === 2}" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{active: selectType === 0}" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{active: selectType === 1}" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch">
      <span class="icon-check_circle" :class="{on: onlyContent}" @click="toggle($event)"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  name: 'rating-select',
  props: {
    ratings: {
      type: Array,
      default () {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default () {
        return {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    }
  },
  computed: {
    positives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives () {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  },
  methods: {
    select (type, event) {
      if (!event._constructed) {
        return
      }
      this.$emit('select', type)
    },
    toggle (event) {
      if (!event._constructed) {
        return
      }
      this.$emit('toggleContent', this.onlyContent)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

.rating-select
  .rating-type
    padding: 18px 0
    margin: 0px 18px
    border-1px(rgba(7, 17,27, 0.1))
    font-size: 0
    .block
      display: inline-block
      line-height: 16px
      padding: 8px 12px
      margin-right: 8px
      border-radius: 1px
      color: rgb(77, 85, 93)
      font-size: 12px
      &.active
        color: #fff
      .count
        margin-left: 2px
        font-size: 8px
      &.positive
        background-color: rgba(0, 160, 220, .2)
        &.active
          background-color: rgb(0, 160, 220)
      &.negative
        background-color: rgba(77, 85, 93, .2)
        &.active
          background-color: rgb(77, 85, 93)
  .switch
    padding: 12px 18px
    font-size: 0
    color: rgb(147, 153, 159)
    line-height: 24px
    border-bottom: 1px solid rgba(7, 17, 27, .1)
    .icon-check_circle
      display: inline-block
      font-size: 24px
      margin-right: 4px
      vertical-align: top
      &.on
        color: #00c850
    .text
      display: inline-block
      font-size: 12px
      vertical-align: top
</style>
