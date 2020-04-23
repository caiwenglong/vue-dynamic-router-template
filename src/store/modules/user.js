import {
  login,
  getInfo,
  getSMSCode,
  loginBySMSCode
} from '@/api/login'
import {
  setToken,
  getToken,
  removeToken,
  setUserData,
  removeUserData,
  getUserData,
  setRoles,
  getRoles,
  removeRoles
} from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    userData: getUserData(),
    name: '',
    roles: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit, dispatch }, loginForm) {
      return new Promise((resolve, reject) => {
        login(loginForm)
          .then(response => {
            // 处理用户信息
            if (response) {
              // 保存用户信息至sessionStorage
              const userData = JSON.stringify(response)
              // commit('SET_USER_DATA', userData)
              if (response.token) {
                commit('SET_TOKEN', response.token)
                setToken(response.token)
              }
              setUserData(userData)
              if (response.username) {
                commit('SET_NAME', response.username)
              }
              if (response.roles) {
                commit('SET_ROLES', response.roles)
                setRoles(response.roles)
              }
            }
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 通过验证码登录
    LoginByAuthCode({ commit, dispatch }, loginForm) {
      return new Promise((resolve, reject) => {
        loginBySMSCode(loginForm).then(response => {
          if (response) {
            // 保存用户信息至sessionStorage
            const userData = JSON.stringify(response)
            setUserData(userData)
            // commit('SET_USER_DATA', userData)

            if (response.token) {
              commit('SET_TOKEN', response.token)
              setToken(response.token)
            }
            if (response.sessionToken) {
              commit('SET_TOKEN', response.sessionToken)
              setToken(response.sessionToken)
            }
            if (response.username) {
              commit('SET_NAME', response.username)
            }
            if (response.roles) {
              commit('SET_ROLES', response.roles)
              setRoles(response.roles)
            }
          }
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROUTERS', null)
        commit('SET_ROLES', '')
        removeUserData()
        removeToken()
        removeRoles()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_ROUTERS', null)
        commit('SET_ROLES', '')
        removeUserData()
        removeToken()
        removeRoles()
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        var rolesFromCookie = getRoles()
        if (rolesFromCookie && rolesFromCookie.length > 0) {
          commit('SET_ROLES', rolesFromCookie)
          resolve()
        } else {
          getInfo().then(response => {
            const data = response.data || {}
            commit('SET_NAME', data.userName)
            if (data && data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', data.roles)
              setRoles(data.roles)
            } else {
              reject('getInfo: roles must be a non-null array !')
            }
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },

    // 更新 Token 及 Cookies
    SetToken({ commit }, token) {
      commit('SET_TOKEN', token)
      setToken(token)
    },
    GetAuthCode({ commit }, tel) {
      return new Promise((resolve, reject) => {
        getSMSCode(tel).then(res => {
        }).catch(err => {
        })
      })
    }
  }
}

export default user
