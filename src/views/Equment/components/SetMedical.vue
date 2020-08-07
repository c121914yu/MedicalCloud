<template>
  <div class="set-medical">
    <div
      class="mask"
      @click="$emit('close')"
    ></div>

    <div class="popup">
      <h2 class="center">药柜{{index+1}}</h2>

      <!-- 药物信息 -->
      <form>
        <div class="input">
          <input
            type="text"
            :placeholder="`药物${currentIndex+1}名称`"
            v-model="temp_medicines[currentIndex].name"
          >
          <i class="iconfont icon-icon"></i>
        </div>
        <div class="input">
          <input
            type="number"
            placeholder="药物数量"
            v-model="temp_medicines[currentIndex].amount"
          >
          <i class="iconfont icon-amount"></i>
        </div>
      </form>

      <div class="change-btn">
        <i
          class="iconfont icon-back"
          :style="currentIndex===0 ? 'opacity:0':''"
          @click="change(-1)"
        ></i>
        <i
          class="iconfont icon-remove"
          @click="remove"
        ></i>
        <i
          class="iconfont"
          :class="currentIndex===temp_medicines.length-1 ? 'icon-add2':'icon-next'"
          @click="change(1)"
        ></i>
      </div>

      <div class="btns">
        <button
          class="sure"
          @click="sure"
        >确认</button>
        <button
          class="close"
          @click="$emit('close')"
        >取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    medicines: Array,
    index: Number,
  },
  data() {
    return {
      temp_medicines: null,
      currentIndex: 0,
    }
  },
  methods: {
    change(i) {
      if (this.currentIndex === 0 && i === -1) return
      if (this.currentIndex === this.temp_medicines.length - 1 && i === 1)
        this.temp_medicines.push({
          name: '',
          amount: '',
          remark: '',
        })
      this.currentIndex += i
    },
    remove() {
      let i = this.currentIndex
      if (this.currentIndex === 0) {
        if (this.temp_medicines.length > 1) this.temp_medicines.splice(i, 1)
        else
          this.temp_medicines[0] = {
            name: '',
            amount: '',
            remark: '',
          }
        this.$forceUpdate()
        return
      }
      this.currentIndex--
      this.temp_medicines.splice(i, 1)
    },
    sure() {
      this.temp_medicines.forEach((item, i) => {
        if (this.temp_medicines.length > 1 && item.name === '') {
          this.temp_medicines.splice(i, 1)
          return
        } else if (this.temp_medicines.length === 1 && item.name === '')
          item = {
            name: '',
            amount: '',
            remark: '',
          }
        else if (item.nmae != '' && item.amount === '') item.amount = 0
      })
      console.log([...this.temp_medicines])
      this.$emit('changeMedical', [...this.temp_medicines])
    },
  },
  created() {
    this.temp_medicines = JSON.parse(JSON.stringify(this.medicines))
  },
}
</script>

<style lang="stylus" scoped>
.set-medical
  .popup
    width 90%
    .change-btn
      margin 10px auto
      width 130px
      text-align center
      i
        margin 0 10px
        font-size 1.4em
        color var(--gray1)
    .btns
      display flex
      align-items center
      justify-content space-around
      button
        width 40%
        padding 5px 0
        border-radius 5px
      .close
        background-color var(--gray1)
</style>