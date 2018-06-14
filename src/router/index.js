import Vue from 'vue'
import Router from 'vue-router'
import Home from './home';
import Project from './project';
import System from './system';
import Team from './team';
import User from './user';
import Personal from './personal';

Vue.use(Router);
const router = new Router({
    routes: [].concat(
        Home,
        Project,
        System,
        Team,
        User,
        Personal
    )
});

router.beforeEach((to, from, next) => {
    next();
});
router.afterEach(route => {
    //预留
});

export default router
