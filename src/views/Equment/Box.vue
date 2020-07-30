<template>
  <div class="medical-box">
    <SetMedical
      v-if="setIndex"
      :medicines="setMedicines"
      :index="setIndex"
      @close="setIndex=null"
    ></SetMedical>
    <div class="box">
      <div
        class="slice"
        :class="[
          'slice' + index,
          hasMedical.indexOf(index-1) > -1 ? 'active':''
        ]"
        v-for="index in 6"
        :key="index"
        @click="set_medical(index)"
      >
      </div>
    </div>
    <div class="numbers">
      <div
        class="number"
        :class="'number' + index"
        v-for="index in 6"
        :key="index"
        @click="set_medical(index)"
      >
        {{index}}
      </div>
    </div>
    <p class="remark"><small>*点击对应编码的药柜可配置储药情况</small></p>
    <form @submit="save">
      <div class="input">
        <input
          type="text"
          class="disable"
          placeholder="设备标识码"
          v-model="boxInfo.id"
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
export default {
  data() {
    return {
      boxInfo: {
        type: '智能药盒',
        id: 'adsfg2-tfas15',
        name: '房间药盒',
        medicines: [
          [
            {
              name: '小柴胡颗粒',
              amount: 1,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 1,
              remark: '饭后服用',
            },
          ],
          [
            {
              name: '小柴胡颗粒',
              amount: 0,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 0,
              remark: '饭后服用',
            },
          ],
          [
            {
              name: '小柴胡颗粒',
              amount: 1,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 1,
              remark: '饭后服用',
            },
          ],
          [
            {
              name: '小柴胡颗粒',
              amount: 1,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 1,
              remark: '饭后服用',
            },
          ],
          [
            {
              name: '小柴胡颗粒',
              amount: 1,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 1,
              remark: '饭后服用',
            },
          ],
          [
            {
              name: '小柴胡颗粒',
              amount: 0,
              remark: '饭后服用',
            },
            {
              name: '***颗粒',
              amount: 0,
              remark: '饭后服用',
            },
          ],
        ],
      },
      setIndex: null,
      setMedicines: null,
    }
  },
  methods: {
    set_medical(index) {
      this.setMedicines = this.boxInfo.medicines[index - 1]
      this.setIndex = index
    },
    save(e) {
      e.preventDefault()
      console.log(this.type)
      this.$showToast({
        text: '修改成功',
      })
    },
    remove() {
      this.$showModel({
        text: '确认删除该设备?',
        cancelText: '取消',
        success: () => {
          this.$showToast({
            text: '删除成功',
          })
        },
      })
    },
  },
  computed: {
    hasMedical() {
      let index = []
      this.boxInfo.medicines.forEach((item, i) => {
        item.find((medical) => {
          if (medical.amount > 0) {
            index.push(i)
            return true
          }
        })
      })
      console.log(index)
      return index
    },
  },
  components: {
    SetMedical,
  },
}
</script>

<style lang="stylus" scoped>
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
    width 100%
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
        border-radius 0
        border-bottom var(--border1)
        &:focus
          border-color var(--green)
        &:focus + i
          color var(--green)
          font-weight 500
        &.disable
          color var(--gray1)
  button
    margin 5px 0
    width 100%
    padding 10px
    border-radius 20px
    &.remove
      background-color var(--red)
</style>
