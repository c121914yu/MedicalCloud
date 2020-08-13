<template>
  <div class="set-user">
    <div
      class="card"
      v-for="(item, index) in userList"
      :key="index"
    >
      <img
        :src="item.image"
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
      :param_image="popupData.image"
      @close="close"
      @confirm="confirm"
    ></Popup>
  </div>
</template>

<script>
import Popup from './components/popup_setUser'
import {
  gettRoles,
  createRole,
  updateRole,
  deleteRole,
} from '../../assets/axios/api'
export default {
  data() {
    return {
      userList: [],
      popupData: null,
    }
  },
  watch: {
    userList: 'updateRoles',
  },
  methods: {
    getRoles() {
      gettRoles().then((res) => {
        console.log(res.data)
        this.userList = this.$store.getters.getUser.roles || []
      })
    },
    edit(item, i) {
      this.popupData = {
        ...item,
        index: i,
      }
    },
    remove(item, index) {
      this.$showModel({
        head: '提示',
        text: `确认删除 ${item.name} ?`,
        cancelText: '取消',
        confirmColor: 'var(--red)',
        success: () => {
          // 网络请求
          deleteRole(item._id).then((res) => {
            // 更新vuex内容
            this.userList.splice(index, 1)
            this.$showToast({
              text: '删除成功',
              type: 'success',
            })
          })
        },
      })
    },
    confirm(e) {
      if (this.popupData.hasOwnProperty('index')) {
        updateRole(this.userList[this.popupData.index]._id, e)
          .then((res) => {
            this.userList[this.popupData.index] = { ...res.data.data }
            this.$showToast({
              text: '修改成功',
            })
            this.close()
          })
          .catch((err) => {
            this.close()
          })
      } else {
        createRole(e)
          .then((res) => {
            this.userList.push(res.data.data)
            this.$showToast({
              text: '新建用户成功',
            })
            this.close()
          })
          .catch((err) => {
            this.close()
          })
      }
    },
    close() {
      this.popupData = null
    },
    updateRoles() {
      this.$store.commit('updateRoles', [...this.userList])
    },
  },
  created() {
    this.userList = this.$store.getters.getUser.roles || []
  },
  components: {
    Popup,
  },
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
