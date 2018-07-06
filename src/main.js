/* eslint-disable no-console,no-unused-vars */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import iView from 'iview'
import App from './App'
import store from './store'
import router from './router'
import 'iview/dist/styles/iview.css'
import '@/assets/css/app.less'
import '@/assets/icon/iconfont'
import CheckLabel from '@/components/check-label';

Vue.use(VueRouter);
Vue.use(store);

Vue.config.productionTip = false;
Vue.use(iView);

Vue.component('CheckLabel', CheckLabel);

new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {App}
});
