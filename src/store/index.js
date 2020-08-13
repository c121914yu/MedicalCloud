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
      state.user = data
      console.log(state.user)
    },
    updateRoles: (state, roles) => {
      state.user.roles = roles
    },
    updateEmail: (state, email) => {
      state.user.email = email
    },
    updateEqument: (state, equments) => {
      state.user.equments = equments
    }
  },
  actions: {}
})