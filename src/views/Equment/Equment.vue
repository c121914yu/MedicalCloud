<template>
  <div class="equments">
    <router-link
      class="iconfont icon-add add"
      to="/Equment/Add"
    > </router-link>
    <router-link
      class="item"
      v-for="(item, index) in equments"
      :key="index"
      :to="item.to"
    >
      <i :class="'iconfont icon-' + item.icon"></i>
      <p>{{ item.text }}</p>
      <div
        class="status"
        :class="'status-color' + item.status"
      >
        <div class="dot"></div>
        <p>{{ item.statusText }}</p>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      equments: [
        {
          text: '手机',
          icon: 'phone',
          status: 1,
          statusText: '已绑定',
          to: 'phone',
        },
        {
          text: '邮箱',
          icon: 'email',
          status: 0,
          statusText: '未绑定',
          to: 'email',
        },
      ],
    }
  },
  methods: {},
  created() {
    const user = this.$store.getters.getUser
    const email = user.email
    if (!/@temp.com/g.test(email)) {
      this.equments[1].status = 1
      this.equments[1].statusText = '已绑定'
    }
    const equments = user.equments
    equments.forEach((item) => {
      this.equments.push({
        text: item.name,
        icon: 'icon',
        status: item.status || 0,
        statusText: item.status === 1 ? '已连接' : '未连接',
        to: 'Box/' + item._id,
      })
    })
  },
}
</script>
<style lang="stylus" scoped>
.equments
  padding 10px 5px 60px
  display grid
  grid-template-columns repeat(3, 1fr)
  grid-gap 10px
  text-align center
  .add
    position fixed
    bottom 80px
    right 5px
    font-size 2.4em
    color var(--green)
  .item
    i
      font-size 2em
      &.icon-phone
        color var(--gray1)
      &.icon-email
        color var(--yellow)
      &.icon-icon
        color var(--green)
    .status
      display flex
      align-items center
      justify-content center
      .dot
        width 10px
        height 10px
        border-radius 50%
        margin-right 5px
      // 状态颜色函数
      statusColor(color)
        .dot
          background-color color
        p
          color color
      &.status-color0
        statusColor(var(--gray))
      &.status-color1
        statusColor(var(--green))
</style>
