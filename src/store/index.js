import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  getters: {
    matchUser: (state) => {
      if (!state.user) return false
      return true
    },
    getUser: (state) => {
      return {
        ...state.user
      }
    }
  },
  mutations: {
    setUser: (state, data) => {
      state.user = {
        ...data
      }
    },
    updateRoles: (state, roles) => {
      state.user.roles = roles
    }
  },
  actions: {}
})