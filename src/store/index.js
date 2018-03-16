import Vue from 'vue'
import Vuex from 'vuex'
import {getStore} from '../assets/js/utils'

Vue.use(Vuex)
const state = {
  page_loading: false, // 页面加载loading
  list_reload: false, // 返回上级是否重新加载列表
  show_menu_slide: true, // 是否显示侧边的导航栏
  user_info: null, // 当前用户信息
  online_user: [],//在线用户
  notify_no_read_list: [], //未读消息列表
  notify_no_read_count: 0,
  system_info: null, // 站点信息
  menu_model: '', // 当前选中的菜单模块
  menu_top: false,
  menu_slide: false,
  menu_data: {
    menu_list: [],
    menu_list_old: [],  //未格式化前的列表
    menu_model_list: [],
    menu_model_list_all: [],
    menu_model: '',
  }
}
state.user_info = getStore('user_info', true)
state.system_info = getStore('system_info', true)

state.menu_data.menu_list = getStore('menu_list',true)
state.menu_data.menu_list_old = getStore('menu_list_old',true)
state.menu_data.menu_model_list = getStore('menu_model_list',true)
state.menu_data.menu_model_list_all = getStore('menu_model_list_all',true)
state.menu_data.menu_model = getStore('menu_model')


export default new Vuex.Store({
  state,
  getters: {
    user_info: state => state.user_info,
    online_user: state => state.online_user,
    notify_no_read_list: state => state.notify_no_read_list,
    notify_no_read_count: state => state.notify_no_read_count,
    system_info: state => state.system_info,
    show_menu_slide: state => state.show_menu_slide,
    page_loading: state => state.page_loading,
    menu_model: state => state.menu_model,
    menu_top: state => state.menu_top,
    menu_slide: state => state.menu_slide,
    menu_data: state => state.menu_data
  },
})
