<template>
  <div class="set-user">
    <div
      class="card"
      v-for="(item, index) in userList"
      :key="index"
    >
      <img
        :src="item.picture"
        alt="加载失败"
      />
      <p class="name">{{ item.name }}</p>
      <button
        class="edit"
        @click="edit(item, index)"
      >编辑</button>
      <button
        class="remove"
        @click="remove(item, index)"
      >删除</button>
    </div>
    <p class="remark center"><small>点击头像或名称可切换用户</small></p>
    <i
      class="iconfont icon-add add"
      @click="popupData={}"
    ></i>
    <Popup
      v-if="popupData!=null"
      :param_name="popupData.name"
      :param_picture="popupData.picture"
      @close="close"
      @confirm="confirm"
    ></Popup>
  </div>
</template>

<script>
import Popup from './components/popup_setUser'
export default {
  data() {
    return {
      userList: [
        {
          name: '余金隆',
          picture: 'http://blogs.jinlongyuchitang.cn/avator.jpg'
        },
        {
          name: '邓丹婵',
          picture: 'http://blogs.jinlongyuchitang.cn/avator.jpg'
        },
        {
          name: '妈妈',
          picture: 'http://blogs.jinlongyuchitang.cn/background.jpg'
        }
      ],
      popupData: null
    }
  },
  methods: {
    edit(item, i) {
      this.popupData = {}
      this.popupData.name = item.name
      this.popupData.picture = item.picture
      this.popupData.index = i
    },
    remove(item, index) {
      this.$showModel({
        head: '提示',
        text: `确认删除 ${item.name} ?`,
        cancelText: '取消',
        confirmColor: 'var(--red)',
        success: () => {
          // 网络请求
          this.userList.splice(index, 1)
          this.$showToast({
            text: '删除成功',
            type: 'success'
          })
        }
      })
    },
    confirm(e) {
      if (this.popupData.hasOwnProperty('index')) {
        this.userList[this.popupData.index].name = e.name
        this.userList[this.popupData.index].picture = e.picture
        this.$showToast({
          text: '修改成功'
        })
      } else {
        this.userList.push(e)
        this.$showToast({
          text: '新建用户成功'
        })
      }
      this.close()
    },
    close() {
      this.popupData = null
    }
  },
  components: {
    Popup
  }
}
</script>

<style lang="stylus" scope>
.set-user
  user-select none
  min-height 100vh
  .card
    margin 15px auto
    width 90%
    padding 10px
    border-radius 8px
    box-shadow var(--shadow3)
    display flex
    align-items center
    img
      width 70px
      height 70px
      border-radius 50%
      border var(--border1)
    .name
      flex 1
      margin 0 10px
    .edit
      margin-right 5px
    .remove
      background-color var(--red)
  .add
    position absolute
    right 10px
    bottom 20px
    font-size 2.6em
    color var(--green)
</style>
