import Vue from 'vue'
import Router from 'vue-router'
// import login from '@/views/user/login'
// import user from '@/views/user/user'
// import userWeek from '@/views/user/user-week'
// import userArchive from '@/views/user/user-archive'
// import userMaintain from '@/views/user/user-maintain'
// import userAdd from '@/views/user/user-add'
// import userEdit from '@/views/user/user-edit'
// import memberInfo from '@/views/team/member_info'
// import dashboard from '@/views/dashboard/dashboard'

// 以下写法是懒加载写法，结合 Vue 的 异步组件 和 Webpack 的 code splitting feature, 轻松实现路由组件的懒加载。
const login = r => require.ensure([], () => r(require('../views/user/login')), 'login')

const userList = r => require.ensure([], () => r(require('../views/user/profile/user-list')), 'userList')
const userAnalysis = r => require.ensure([], () => r(require('../views/user/user-analysis')), 'userAnalysis')
const userAdd = r => require.ensure([], () => r(require('../views/user/profile/user-add')), 'userAdd')
const userEdit = r => require.ensure([], () => r(require('../views/user/profile/user-edit')), 'userEdit')
const userBaseSetting = r => require.ensure([], () => r(require('../views/user/setting/base/user-base-setting')), 'userBaseSetting')

const assGroupAccess = r => require.ensure([], () => r(require('../views/user/profile/user-ass-group-access')), 'assGroupAccess')
const authGroupList = r => require.ensure([], () => r(require('../views/system/auth/auth-group-list')), 'authGroupList')
const authGroupAdd = r => require.ensure([], () => r(require('../views/system/auth/auth_group_add')), 'authGroupAdd')
const authGroupEdit = r => require.ensure([], () => r(require('../views/system/auth/auth_group_edit')), 'authGroupEdit')
const authMenuList = r => require.ensure([], () => r(require('../views/system/auth/auth-menu-list')), 'authMenuList')
const authMenuAdd = r => require.ensure([], () => r(require('../views/system/auth/auth-menu-add')), 'authMenuAdd')
const authMenuEdit = r => require.ensure([], () => r(require('../views/system/auth/auth-menu-edit')), 'authMenuEdit')
const authRuleList = r => require.ensure([], () => r(require('../views/system/auth/auth-rule-list')), 'authRuleList')
const authRuleAdd = r => require.ensure([], () => r(require('../views/system/auth/auth-rule-add')), 'authRuleAdd')
const authRuleEdit = r => require.ensure([], () => r(require('../views/system/auth/auth-rule-edit')), 'authRuleEdit')
const GroupUserList = r => require.ensure([], () => r(require('../views/system/auth/group-user-list')), 'GroupUserList')

const menuModelList = r => require.ensure([], () => r(require('../views/system/auth/menu-model-list')), 'menuModelList')
const menuModelAdd = r => require.ensure([], () => r(require('../views/system/auth/menu-model-add')), 'menuModelAdd')
const menuModelEdit = r => require.ensure([], () => r(require('../views/system/auth/menu-model-edit')), 'menuModelEdit')

const SystemSettingBase = r => require.ensure([], () => r(require('../views/system/setting/base/system-setting-base')), 'SystemSettingBase')

const AccountInfo = r => require.ensure([], () => r(require('../views/account/info')), 'accountInfo')

const logList = r => require.ensure([], () => r(require('../views/system/log/log-list')), 'logList')

const ProjectStatistics = r => require.ensure([], () => r(require('../views/project/statistics/statistics')), 'ProjectStatistics')
const ProjectOverview = r => require.ensure([], () => r(require('../views/project/overview/overview')), 'ProjectOverview')
const AllProjectList = r => require.ensure([], () => r(require('../views/project/allProject/list')), 'AllProjectList')
const MyProjectList = r => require.ensure([], () => r(require('../views/project/myProject/list')), 'MyProjectList')
const ProjectLevelList = r => require.ensure([], () => r(require('../views/project/level/list')), 'ProjectLevelList')
const ProjectLevelAdd = r => require.ensure([], () => r(require('../views/project/level/add')), 'ProjectLevelAdd')
const ProjectLevelEdit = r => require.ensure([], () => r(require('../views/project/level/edit')), 'ProjectLevelEdit')
const ProjectFileList = r => require.ensure([], () => r(require('../views/project/file/file')), 'ProjectFileList')
const ProjectBuildList = r => require.ensure([], () => r(require('../views/project/build/build')), 'ProjectBuildList')
const ProjectType = r => require.ensure([], () => r(require('../views/project/projectType/list')), 'ProjectType')

const TeamList = r => require.ensure([], () => r(require('../views/team/list')), 'TeamList')
const TeamAdd = r => require.ensure([], () => r(require('../views/team/add')), 'TeamAdd')
const TeamEdit = r => require.ensure([], () => r(require('../views/team/edit')), 'TeamEdit')

const TeamUserList = r => require.ensure([], () => r(require('../views/team/user/list')), 'TeamUserList')
const TeamUserDetail = r => require.ensure([], () => r(require('../views/team/user/detail')), 'TeamUserDetail')

const TeamUserLevelList = r => require.ensure([], () => r(require('../views/team/user/level/list')), 'TeamUserLevelList')
const TeamUserLevelDetail = r => require.ensure([], () => r(require('../views/team/user/level/detail')), 'TeamUserLevelDetail')
const TeamUserPositionList = r => require.ensure([], () => r(require('../views/team/user/position/list')), 'TeamUserPositionList')
const TeamUserPositionDetail = r => require.ensure([], () => r(require('../views/team/user/position/detail')), 'TeamUserPositionDetail')

const ProjectTask = r => require.ensure([], () => r(require('../views/project/task/task')), 'ProjectTask')
const ProjectTaskOverview = r => require.ensure([], () => r(require('../views/project/task/task-overview')), 'ProjectTaskOverview')
const ProjectTaskTypeTemplate = r => require.ensure([], () => r(require('../views/project/task/task_type_template_list')), 'ProjectTaskTypeTemplate')


const PersonalNoticeList = r => require.ensure([], () => r(require('../views/personal/notice/list')), 'PersonalNoticeList')

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login',
      meta: {model: 'login'},
    },
    {
      path: '/login',
      component: login,
      name: 'login',
      meta: {model: 'login'},
    },
    {
      name: 'user_list',
      path: '/user/list',
      component: userList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'user_add',
          path: '/user/add',
          component: userAdd,
          meta: {model: 'Project', parent: '/user/list'},
        },
        {
          name: 'user_edit',
          path: '/user/edit/:user_id',
          component: userEdit,
          meta: {model: 'Project', parent: '/user/list'},
        },
        {
          name: 'ass_group_access',
          path: '/user/ass_group_access/:user_id',
          component: assGroupAccess,
          meta: {model: 'Project', parent: '/user/list'},
        }
      ]
    },
    {
      name: 'user_base_setting',
      path: '/user/base_setting',
      component: userBaseSetting,
      meta: {model: 'Project'}
    },
    {
      name: 'user_analysis',
      path: '/user/analysis',
      component: userAnalysis,
      meta: {model: 'Project'},
    },
    {
      name: 'system_setting_base',
      path: '/system/setting_base',
      component: SystemSettingBase,
      meta: {model: 'Project'}
    },
    {
      name: 'system_auth_group_list',
      path: '/system/auth_group/list',
      component: authGroupList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'auth_group_add',
          path: '/system/auth_group/add',
          component: authGroupAdd,
          meta: {model: 'Project', parent: '/system/auth_group/list'},
        },
        {
          name: 'auth_group_edit',
          path: '/system/auth_group/edit/:id',
          component: authGroupEdit,
          meta: {model: 'Project', parent: '/system/auth_group/list'},
        },
        {
          name: 'system_group_user_list',
          path: '/system/auth_group/user_list/:id',
          component: GroupUserList,
          meta: {model: 'Project', parent: '/system/auth_group/list'}
        },
      ]
    },
    {
      name: 'system_menu_model_list',
      path: '/system/menu_model/list',
      component: menuModelList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'menu_model_add',
          path: '/system/menu_model/add',
          component: menuModelAdd,
          meta: {model: 'Project', parent: '/system/menu_model/list'},
        },
        {
          name: 'menu_model_edit',
          path: '/system/menu_model/edit/:id',
          component: menuModelEdit,
          meta: {model: 'Project', parent: '/system/menu_model/list'},
        }
      ]
    },
    {
      name: 'system_auth_menu_list',
      path: '/system/auth_menu/list',
      component: authMenuList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'auth_menu_add',
          path: '/system/auth_menu/add',
          component: authMenuAdd,
          meta: {model: 'Project', parent: '/system/auth_menu/list'},
        },
        {
          name: 'auth_menu_edit',
          path: '/system/auth_menu/edit/:id',
          component: authMenuEdit,
          meta: {model: 'Project', parent: '/system/auth_menu/list'},
        }
      ]
    },
    {
      name: 'system_auth_rule_list',
      path: '/system/auth_rule/list',
      component: authRuleList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'auth_rule_add',
          path: '/system/auth_rule/add',
          component: authRuleAdd,
          meta: {model: 'Project', parent: '/system/auth_rule/list'},
        },
        {
          name: 'auth_rule_edit',
          path: '/system/auth_rule/edit/:id',
          component: authRuleEdit,
          meta: {model: 'Project', parent: '/system/auth_rule/list'},
        }
      ]
    },
    {
      name: 'account_info',
      path: '/account/info',
      component: AccountInfo,
      meta: {},
    },
    {
      name: 'system_log_list',
      path: '/system/log/list',
      component: logList,
      meta: {model: 'Project'},
    },
    {
      name: 'project_statistics',
      path: '/project/statistics',
      component: ProjectStatistics,
      meta: {model: 'Project'},
    },
    {
      name: 'project_overview',
      path: '/project/overview',
      component: ProjectOverview,
      meta: {model: 'Project'},
    },
    {
      name: 'all_project_list',
      path: '/project/all_project/list',
      component: AllProjectList,
      meta: {model: 'Project'},
    },
    {
      name: 'my_project_list',
      path: '/project/my_project/list',
      component: MyProjectList,
      meta: {model: 'Project'},
    },
    {
      name: 'project_file_list',
      path: '/project/file/:project_id',
      component: ProjectFileList,
      meta: {model: 'Project'},
    },
    {
      name: 'project_build_list',
      path: '/project/build/:project_id',
      component: ProjectBuildList,
      meta: {model: 'Project'},
    },
    {
      name: 'project_type_list',
      path: '/project/project_type/list',
      component: ProjectType,
      meta: {model: 'Project'},
    },
    {
      name: 'project_level_list',
      path: '/project/level/list',
      component: ProjectLevelList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'project_level_add',
          path: '/project/level/add',
          component: ProjectLevelAdd,
          meta: {model: 'Project', parent: '/project/level/list'},
        },
        {
          name: 'project_level_edit',
          path: '/project/level/edit/:level_id',
          component: ProjectLevelEdit,
          meta: {model: 'Project', parent: '/project/level/list'},
        }
      ]
    },
    {
      name: 'project_task',
      path: '/project/task/:project_id',
      component: ProjectTask,
      meta: {model: 'Project'},
    },
    {
      name: 'project_task_overview',
      path: '/project/taskoverview/:team_id',
      component: ProjectTaskOverview,
      meta: {model: 'Project', parent: '/project/taskoverview/0'},
    },
    {
      name: 'project_task_type_template',
      path: '/project/task_type_template/:type_id',
      component: ProjectTaskTypeTemplate,
      meta: {model: 'Project', parent: '/project/project_type/list'},
    },
    {
      name: 'team_list',
      path: '/team/list',
      component: TeamList,
      meta: {model: 'Project'},
      children: [
        {
          name: 'team_add',
          path: '/team/add',
          component: TeamAdd,
          meta: {model: 'Project', parent: '/team/list'},
        },
        {
          name: 'team_edit',
          path: '/team/edit/:team_id',
          component: TeamEdit,
          meta: {model: 'Project', parent: '/team/list'},
        }
      ]
    },
    {
      name: 'team_user_list',
      path: '/team/user/list/:team_id',
      component: TeamUserList,
      meta: {model: 'Project', parent: '/team/list'},
    },
    {
      name: 'team_user_detail',
      path: '/team/user/detail/:user_id',
      component: TeamUserDetail,
      meta: {model: 'Project', parent: '/user/list'},
    },
    {
      name: 'team_user_level_list',
      path: '/team/user/level/list',
      component: TeamUserLevelList,
      meta: {model: 'Project'},
    },
    {
      name: 'team_user_level_detail',
      path: '/team/user/level/detail/:id',
      component: TeamUserLevelDetail,
      meta: {model: 'Project', parent: '/team/user/level/list'},
    },
    {
      name: 'team_user_position_list',
      path: '/team/user/position/list',
      component: TeamUserPositionList,
      meta: {model: 'Project'},
    },
    {
      name: 'team_user_position_detail',
      path: '/team/user/position/detail/:id',
      component: TeamUserPositionDetail,
      meta: {model: 'Project', parent: '/team/user/position/list'},
    },
    {
      name: 'personal_notice_list',
      path: '/personal/notice/list',
      component: PersonalNoticeList,
      meta: {model: 'Project'},
    },
  ]
})
