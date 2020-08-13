<template>
  <div class="medical-box">
    <SetMedical
      v-if="setMedicines != null"
      :medicines="setMedicines"
      :index="setIndex"
      @close="setMedicines = null"
      @changeMedical="changeMedical"
    ></SetMedical>
    <div class="box">
      <div
        class="slice"
        :class="[
					'slice' + index,
					hasMedical.indexOf(index - 1) > -1 ? 'active' : '',
				]"
        v-for="index in 6"
        :key="index"
        @click="set_medical(index)"
      ></div>
    </div>
    <div class="numbers">
      <div
        class="number"
        :class="'number' + index"
        v-for="index in 6"
        :key="index"
        @click="set_medical(index)"
      >
        {{ index }}
      </div>
    </div>
    <p class="remark"><small>*点击对应编码的药柜可配置储药情况</small></p>
    <form @submit="save">
      <div class="input">
        <input
          type="text"
          class="disable"
          placeholder="设备标识码"
          v-model="boxInfo.identify"
          required
          disabled
        />
        <i class="iconfont icon-icon"></i>
      </div>
      <div class="input">
        <input
          type="text"
          placeholder="给设备起个昵称"
          v-model="boxInfo.name"
          required
        />
        <i class="iconfont icon-name"></i>
      </div>
      <textarea
        class="description"
        rows="3"
        placeholder="对设备进行简单的备注描述"
        v-model="boxInfo.description"
      ></textarea>
      <button type="submit">修改昵称</button>
    </form>
    <button
      class="remove"
      @click="remove"
    >删除设备</button>
  </div>
</template>

<script>
import SetMedical from './components/SetMedical'
import {
  updateEqument,
  deleteEqument,
  updateMedicines,
} from '../../assets/axios/api'
export default {
  data() {
    return {
      boxInfo: {},
      setIndex: null,
      setMedicines: null,
    }
  },
  methods: {
    set_medical(index) {
      let i = index - 1
      this.setIndex = i
      if (!this.boxInfo.medicines[i])
        this.setMedicines = [
          {
            name: '',
            amount: '',
            remark: '',
          },
        ]
      else this.setMedicines = [...this.boxInfo.medicines[i]]
    },
    changeMedical(e) {
      this.boxInfo.medicines[this.setIndex] = e
      this.boxInfo.medicines.splice(0, 0)
      this.setIndex = this.setMedicines = null
      console.log(this.boxInfo.medicines)
      updateMedicines(this.boxInfo._id, {
        data: JSON.stringify(this.boxInfo.medicines),
      })
    },
    save(e) {
      e.preventDefault()
      const data = {
        name: this.boxInfo.name,
        description: this.boxInfo.description,
      }
      updateEqument(this.boxInfo._id, data).then((res) => {
        this.$showToast({
          text: '修改成功',
        })
      })
    },
    remove() {
      this.$showModel({
        text: '确认删除该设备?',
        cancelText: '取消',
        success: () => {
          deleteEqument(this.boxInfo._id).then((res) => {
            if (res.data.success) {
              this.$store.commit('updateEqument', res.data.data)
              this.$showToast({
                text: '删除成功',
              })
              this.$router.push({ name: 'Equment' })
            }
          })
        },
      })
    },
  },
  computed: {
    hasMedical() {
      let index = []
      this.boxInfo.medicines.forEach((item, i) => {
        if (item)
          item.find((medical) => {
            if (+medical.amount > 0) {
              index.push(i)
              return true
            }
          })
      })
      return index
    },
  },
  created() {
    const id = this.$route.params.id
    this.boxInfo = this.$store.getters.getUser.equments.find((item) => {
      return item._id === id
    })
    if (!this.boxInfo) this.$router.push({ name: 'Equment' })
    console.log(this.boxInfo)
  },
  components: {
    SetMedical,
  },
}
</script>

<style lang="stylus">
.medical-box
  position relative
  padding 60px 5% 0
  display flex
  flex-direction column
  align-items center
  .box
    margin-bottom 10px
    position relative
    padding 0
    width 200px
    height 200px
    border-radius 50%
    overflow hidden
    border var(--border1)
    .slice
      overflow hidden
      position absolute
      top 0
      right 0
      width 50%
      height 50%
      border var(--border1)
      transform-origin 0% 100%
      &.slice1
        transform rotate(-30deg) skewY(-30deg)
      &.slice2
        transform rotate(30deg) skewY(-30deg)
      &.slice3
        transform rotate(-270deg) skewY(-30deg)
      &.slice4
        transform rotate(-210deg) skewY(-30deg)
      &.slice5
        transform rotate(-150deg) skewY(-30deg)
      &.slice6
        transform rotate(-90deg) skewY(-30deg)
      &.active
        background-color var(--green3)
  .numbers
    position absolute
    .number
      position absolute
    .number1
      top 25px
      left -5px
    .number2
      top 50px
      left 50px
    .number3
      top 120px
      left 50px
    .number4
      top 150px
      left -5px
    .number5
      top 120px
      left -60px
    .number6
      top 50px
      left -60px
  .type
    width 100%
  form
    .input
      margin-top 15px
      width 100%
      display flex
      align-items center
      border none
      i
        z-index 2
        position absolute
        font-size 1.6em
        color var(--gray1)
      input
        margin 0
        width 100%
        padding-left 35px
        font-size 1em
        border none
        border-bottom var(--border1)
        border-radius 0
        &:focus
          border-color var(--green)
        &:focus + i
          color var(--green)
          font-weight 500
        &.disable
          color var(--gray1)
  textarea
    margin-top 10px
  button
    margin-top 10px
    width 100%
    padding 10px
    border-radius 20px
    &.remove
      background-color var(--red)
</style>
