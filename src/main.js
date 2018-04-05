/* eslint-disable no-console,no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import App from './App'
import router from './router'
import store from './store/'
import 'iview/dist/styles/iview.css'
import './assets/css/app.less'
import './assets/icon/iconfont'
import {getPushData} from './assets/js/utils'
import {showMsgNotification} from "./assets/js/notify"
import VueSocketio from 'vue-socket.io';
import socketio from 'socket.io-client';

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueSocketio, socketio('http://127.0.0.1:2120'), store);
// Vue.use(VueSocketio, socketio('https://39.108.2.63:2120'), store);
router.beforeEach((to, from, next) => {
  next()
});

router.afterEach((to, from, next) => {
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  sockets: {
    //建立socket连接
    connect: function () {
      if (store.state.user_info != null) {
        this.$socket.emit('login', store.state.user_info.id);
      }
    },
    customEmit: function (val) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    },
    //上线通知
    user_login: function (data) {
      const push_data = getPushData(data)
      if (store.state.user_info != null) {
        if (push_data.user_id != store.state.user_info.id) {
          const permission = showMsgNotification(push_data.title, push_data.notice, {
            showTime: 5000
          })
          if (permission === false) {
            this.$Notice.info({
              title: push_data.notice
            });
          }
        }
      }
    },
    task_remind_notice: function (data) {
      const push_data = getPushData(data)
      console.log(push_data)
      if (store.state.user_info != null) {
        const permission = showMsgNotification(push_data.title, push_data.notice, {
          showTime: 10000,
          onclick: function () {
            window.open('http://127.0.0.1:8090/#/project/task/' + push_data.data.project_id)
          }
        })
        if (permission === false) {
          let link = '/#/project/task/' + push_data.data.project_id
          this.$Notice.warning({
            title: push_data.title,
            desc: '<a href="'+link +'">' + push_data.notice  + '</a>' + '<br> <span class="muted">For：' + push_data.data.project_name + '</span>',
            duration: 0
          });
        }
      }
    },
    //监听服务端消息推送
    // new_notice(value) {
    //   console.log(value);
    // },
    //监听连接人数
    update_online_uids(value) {
      this.$store.state.online_user = JSON.parse(value)
    },
  },
  template: '<App/>',
  components: {App}
});
