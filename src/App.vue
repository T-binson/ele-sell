<template>
<div id="app">
  <div class="header">
    <v-header :seller="seller"></v-header>
  </div>
  <div class="tab border-1px">
    <div class="tab-item">
      <router-link class="item" to='/good'>商品</router-link>
    </div>
    <div class="tab-item">
      <router-link class="item" to='/rate'>评价</router-link>
    </div>
    <div class="tab-item">
      <router-link class="item" to='/seller'>商家</router-link>
    </div>
  </div>
  <keep-alive>
    <router-view :seller="seller" @foodsChange="getFoods" :shoppingCart="shoppingCart" :emptyFoods="emptyFoods"></router-view>
  </keep-alive>
  <ShoppingCart ref="shoppingCart" :seller="seller" :selectFoods="selectFoods" @empty="empty"></ShoppingCart>
</div>
</template>

<script>
import {urlParse} from 'common/js/util'
import VHeader from 'components/v-header/v-header'
import ShoppingCart from 'components/ShoppingCart/ShoppingCart'

const ERR_OK = 0

export default {
  name: 'App',
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      },
      selectFoods: [],
      shoppingCart: {},
      emptyFoods: []
    }
  },
  components: {
    'v-header': VHeader,
    ShoppingCart
  },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then(response => {
      if (response.body.errno === ERR_OK) {
        // this.seller = response.body.data
        this.seller = Object.assign({}, this.seller, response.body.data)
      }
    }, response => {
      console.log('can not get the data')
    })
  },
  methods: {
    getFoods (foods) {
      this.selectFoods = foods
      this.shoppingCart = this.$refs.shoppingCart
    },
    empty (foods) {
      // console.log(foods)
      this.selectFoods = []
      this.emptyFoods = foods.slice()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/mixin"

#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      .item
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
