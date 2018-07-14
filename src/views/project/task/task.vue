<template>
    <div class="task-info">
        <div class="project-navigation">
            <div class="project-nav-header">
                <Breadcrumb class="text-default" separator=">">
                    <!--<Breadcrumb-item href="/project/all">项目</Breadcrumb-item>-->
                    <Breadcrumb-item>{{ project.name }} <span class="text-warning" v-show="project.name">（长按列表可拖动排序）</span></Breadcrumb-item>
                </Breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li class="actives"><a class="app" data-app="tasks">任务</a></li>
                    <li class=""><a class="app" data-app="works" @click="$router.push('/project/file/' + project_id)">
                        文件 </a>
                    <li class=""><a class="app" data-app="build" @click="$router.push('/project/build/' + project_id)">
                        版本 </a>
                    </li>
                </ul>
            </section>
            <div class="project-nav-footer">
                <a class="footer-item" :class="{'active':user_menu_modal}"
                   @click="user_menu_modal = !user_menu_modal,menu_modal = false">
                    <Icon type="android-people"></Icon>
                    <span>{{ project_user_list.length }}</span>
                </a>
                <a class="footer-item" :class="{'active':menu_modal}"
                   @click="menu_modal = !menu_modal,user_menu_modal = false">
                    <Icon type="navicon"></Icon>
                    <span>菜单</span>
                </a>
            </div>
        </div>
        <wrapper-content>
            <!-- <SlickList lockAxis="y" v-model="task_type_list">
                 <SlickItem v-for="(item, index) in task_type_list" v-if="index>0" :index="index" :key="index">
                     <div class="menu-list">
                         <div class="list-left">
                             <span class="iconfont icon-caidan"></span>
                             <span class="text">{{item.name}}</span>
                         </div>
                         <div class="list-right">
                             <span class="iconfont icon-kaiguan4"></span>
                         </div>
                     </div>
                 </SlickItem>
             </SlickList>-->
            <SlickList lockAxis="x" axis="x" :pressDelay="500" :pressThreshold="150" helperClass="task-type-move" v-model="task_type_list" class="board-scrum-stages" @input="SlickEvent($event,'task_type')">
                <SlickItem class="scrum-stage" :class="{ 'fixed-creator': task_type.fixed_creator == true}"
                           v-for="(task_type,index) in task_type_list" :index="index"
                           :key="task_type.id">
                    <header class="scrum-stage-header ui-sortable-handle">
                        <div class="stage-name hinted"><span class="icon icon-tick"></span> {{ task_type.name }} <span
                                class="task-count"
                                v-if="task_type.list.length > 0"> · {{ task_type.list.length }}</span> <span
                                class="icon icon-chevron-right"></span>
                        </div>
                        <div class="stage-menu-toggler popover">
                            <Dropdown trigger="click" @on-click="taskTypeAction">
                                <!--<Tooltip placement="left" content="编辑任务列表">-->
                                <a href="javascript:void(0)" class="menu-toggler-title">
                                    <Icon type="chevron-down"></Icon>
                                </a>
                                <!--</Tooltip>-->
                                <DropdownMenu slot="list">
                                    <header class="popover-header">
                                        <p class="popover-title">菜单列表</p>
                                    </header>
                                    <DropdownItem class="muted" :name="'setExecutor_' + task_type.id + '_' + index">
                                        <Icon size="14" class="m-r-xs" type="person"></Icon>
                                        设置本列所有任务执行者
                                    </DropdownItem>
                                    <DropdownItem class="muted" :name="'setEndTime_' + task_type.id + '_' + index">
                                        <Icon size="14" class="m-r-xs" type="clock"></Icon>
                                        设置本列所有任务截止时间
                                    </DropdownItem>
                                    <DropdownItem class="muted" :name="'delTask_' + task_type.id + '_' + index">
                                        <Icon size="14" class="m-r-xs" type="trash-b"></Icon>
                                        删除本列所有任务
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </header>
                    <div class="scrum-stage-wrap hidden-creator ui-sortable"
                         :class="{ 'hidden-creator-bottom': task_type.show_card == true}">
                        <section :id="task_type.id + '-section'" :task-type-index="index" class="scrum-stage-content thin-scroll">
                            <!--未完成列表-->
                            <SlickList lockAxis="y" axis="y" :pressDelay="500" helperClass="task-move"
                                       v-model="task_type.list" @input="SlickEvent($event,'task')" class="scrum-stage-tasks">
                                <SlickItem class="task task-card ui-sortable-handle"
                                           :class="showTaskLevel(task.pri)"
                                           @click.native="showTaskDetail(task.id,index,task_index)"
                                           v-for="(task,task_index) in task_type.list"
                                           v-if="task.task_state == 0" :key="task.id" :index="task_index">
                                    <div class="task-priority bg-priority-0"></div>
                                    <a class="check-box" @click.stop="setTaskState(task.id,index,task_index,true)"><span
                                            class="ivu-icon ivu-icon-checkmark"></span></a>
                                    <div class="task-content-set open-detail">
                                        <div class="task-content-wrapper">
                                            <div class="task-content"> {{ task.name }}</div>
                                            <img v-if="task.executor_user_info.avatar"
                                                 :src="task.executor_user_info.avatar"
                                                 :title="task.executor_user_info.realname"
                                                 class="avatar img-circle img-24 hinted">
                                        </div>
                                        <div class="task-info-wrapper clearfix">
                                            <div class="task-infos">
                                                <span class="label label-primary" v-if="task.end_time != null">
                                                    <span :title="task.end_time">
                                                       {{ showTaskTime(task.begin_time, task.end_time) }}
                                                    </span>
                                                </span>
                                                <span class="icon-wrapper muted" v-if="task.has_content">
                                                   <Icon type="android-clipboard"></Icon>
                                               </span>
                                                <span class="icon-wrapper muted" v-if="task.remind_time != null">
                                                   <Icon type="android-alarm-clock"></Icon>
                                               </span>
                                                <span class="icon-wrapper muted" v-if="task.has_file">
                                                     <Icon type="android-attach"></Icon>
                                               </span>
                                                <span class="icon-wrapper muted" style="width: 45px" v-if="task.has_children">
                                                     <Icon type="ios-list-outline"></Icon>
                                                    <span class="m-l-xs">{{showTaskCount(task.children_task,1)}}/{{showTaskCount(task.children_task,-1)}}</span>
                                               </span>
                                                <span class="tag muted" :class="'tag-color-'+ tag.color"
                                                      v-for="(tag,tag_index) in task.task_tag_item_list"> {{ tag.name }} </span>
                                                <span :class="'icon-wrapper text text-' + task.task_execute.color"
                                                      v-if="task.execute_state > 0">{{ task.task_execute_name }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </SlickItem>
                            </SlickList>
                            <!--创建任务卡片-->
                            <div class="task-creator-wrap card" v-if="task_type.show_card">
                                <form class="task-creator">
                                    <Input v-model="task.name" class="task-content-input" type="textarea" :rows="3"
                                           placeholder="任务内容"/>
                                    <div class="handler-wrap">
                                        <Dropdown trigger="click" @on-click="selectExecutor">
                                            <a data-original-title="" title=""
                                               class="executor-handler"><img
                                                    :src="default_executor.avatar"
                                                    class="avatar img-circle img-24 hinted"> <span
                                                    class="creator-handler-text name">{{ default_executor.realname }}</span></a>
                                            <DropdownMenu slot="list">
                                                <DropdownItem v-if="project_user_list.length > 0"
                                                              v-for="(user,index) in project_user_list" :key="index"
                                                              :name="index">
                                                    <img class="avatar img-circle img-24 pull-left m-r-sm "
                                                         :src="user.avatar">
                                                    <span class="muted"
                                                          style="line-height: 25px;">{{ user.realname }}</span>
                                                    <Icon type="ios-checkmark-empty" size="24" style="float: right"
                                                          class="muted" v-if="user.id == default_executor.id"></Icon>
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                    <div class="submit-set">
                                        <Button type="ghost" size="large" class="middle-btn"
                                                @click="hideTaskCard(index)">取消
                                        </Button>
                                        <Button type="primary" size="large" class="middle-btn"
                                                @click="addTask(task_type.id,index)">创建
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            <!--已完成列表-->
                            <ul class="scrum-stage-tasks-done">
                                <li class="task done task-card ui-sortable-handle"
                                    :class="showTaskLevel(task.pri)"
                                    @click="showTaskDetail(task.id,index,task_index)"
                                    v-for="(task,task_index) in task_type.list"
                                    v-if="task.task_state == 1" :key="task.id">
                                    <div class="task-priority bg-priority-0"></div>
                                    <a class="check-box"
                                       @click.stop="setTaskState(task.id,index,task_index,false)"> <span
                                            class="ivu-icon ivu-icon-checkmark"></span></a>
                                    <div class="task-content-set open-detail">
                                        <div class="task-content-wrapper">
                                            <div class="task-content">{{ task.name }}</div>
                                            <img v-if="task.executor_user_info.avatar"
                                                 :src="task.executor_user_info.avatar"
                                                 :title="task.executor_user_info.realname"
                                                 class="avatar img-circle img-24 hinted">
                                        </div>
                                        <div class="task-info-wrapper clearfix">
                                            <div class="task-infos">
                                                <span class="tag muted" :class="'tag-color-'+ tag.color"
                                                      v-for="(tag,tag_index) in task.task_tag_item_list"> {{ tag.name }} </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <!--添加任务按钮-->
                            <div class="task-creator-handler-wrap" @click="showTaskCard(index)"
                                 v-if="!task_type.show_card">
                                <a class="task-creator-handler link-add-handler">
                                    <Icon type="plus-circled"></Icon>
                                    添加任务
                                </a>
                            </div>
                        </section>
                    </div>
                </SlickItem>
            </SlickList>
        </wrapper-content>
        <Modal class="menu-modal"
               width="350"
               v-model="menu_modal"
               :transition-names="['router-right-slide','router-right-slide']"
               title="项目菜单">
            <div class="project-menus">
                <ul class="list activities-panel-menu-list">
                    <li>
                        <a class="app" @click="project_setting_modal = !project_setting_modal">
                            <Icon type="gear-a"></Icon>
                            项目设置
                        </a>
                    </li>
                    <li>
                        <a class="open-project-information-modal-handler">
                            <Icon type="alert"></Icon>
                            项目信息
                        </a>
                    </li>
                    <li>
                        <a class="activity-panel-all-plugin switch-handler" data-type="plugins">
                            <Icon type="more"></Icon>
                            查看更多
                        </a>
                    </li>
                </ul>
            </div>
            <div class="activity-panel-statistics">
                <div class="activity-card-datas activity-card">
                    <header class="activity-card-header">
                        <Icon type="gear-a"></Icon>
                        <span
                                class="activity-card-title">任务统计</span>
                    </header>
                    <div class="data-statistics">
                        <div class="activity-unassignedtasks activity-link-unassign data-handler">
                            <div class="activity-unassignedtasks-title">待完成的任务</div>
                            <a class="activity-link">
                                <span class="unassignedtasks-number">{{ project_task_undo }}</span>
                            </a>
                        </div>
                        <div class="activity-today activity-link-today data-handler">
                            <div class="activity-today-title">已逾期的任务</div>
                            <a class="activity-link">
                                <span class="todayDatas-number">{{ project_task_overdue }}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="activity-panel-card-table" style="display: none">
                <div class="activity-card-table activity-card">
                    <header class="activity-card-header">
                        <span class="activity-card-title">项目进展</span>
                        <section class="activity-card-body">
                            当前进度：50%
                        </section>
                    </header>
                </div>
            </div>
            <ul class="list activity-panel-activities-list">
                <li class="activity-panel-activities-title">
                    <div class="project-activies-title">
                        <Icon type="gear-a"></Icon>
                        <span class="activity-card-title">项目动态</span>
                    </div>
                </li>
                <li class="activity-panel-activities-wrap" v-for="(log,index) in project_log_list">
                    <div class="activity-panel-activities">
                        <div class="activities-content detail-content">
                            <div class="activity-panel-activities-body">
                                <div class="activity-card activity-task">
                                    <header class="activity-card-header">
                                        <img class="avatar img-circle img-24 hinted" :src="log.user_avatar">
                                    </header>
                                    <div class="activity-content">
                                        <span class="activity-card-title">
                                            <b>{{ log.user_name }}</b> <span class="action">{{  log.ticket }} {{ log.content }}</span><span
                                                v-if="log.log_type != 'upload' && log.task_title != null">：{{ log.task_title }}</span>
                                        </span>
                                        <footer class="activity-card-footer">
                                            <span class="react-time-stamp">
                                                <time data-reactroot="" class="time-stamp">{{ log.create_time }}</time>
                                            </span>
                                        </footer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </Modal>
        <Modal class="menu-modal user-menu-modal"
               width="350"
               v-model="user_menu_modal"
               :transition-names="['router-right-slide','router-right-slide']"
               title="项目成员">
            <div class="user-content">
                <Input v-model="project_user_keyword" size="large" placeholder="搜索成员"></Input>
            </div>
            <div class="project-menus">
                <ul class="list activities-panel-menu-list">
                    <li>
                        <a class="menu-user-list" @click="user_modal = !user_modal">
                            <Icon type="plus-circled" style="color:#5cadff" size="36"></Icon>
                            <span class="m-l-sm" style="color:#5cadff;font-size: 14px;">添加成员</span>
                        </a>
                    </li>
                    <li v-for="(user,index) in project_user_list">
                        <a class="menu-user-list">
                            <img class="avatar img-circle img-24 hinted" :src="user.avatar">
                            <div class="user-info">
                                <div class="user-item">
                                    <span> {{ user.realname }}</span>
                                    <span class="user-role muted">
                                        {{ user.level_name }}
                                    </span>
                                    <Tooltip placement="top" v-if="user.is_owner == 1" content="项目拥有者">
                                        <Icon type="ribbon-b" style="color:orange" size="14"></Icon>
                                    </Tooltip>
                                    <a class="pull-right muted" v-if="user.is_owner == 0"
                                       @click="del_user_id = user.u_user_id,del_project_user_modal = !del_project_user_modal">移出</a>
                                </div>
                                <p class="muted">{{ user.user_name }}</p>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </Modal>
        <Modal
                v-model="add_task_modal"
                title="任务提示">
            <p>系统检测到你输入了 {{ add_task_count }} 行内容，你是想创建多条任务吗？</p>
            <div slot="footer">
                <Button type="ghost" size="large" :loading="send_loading" @click="confirmAddTask(false)">创建一条
                </Button>
                <Button type="primary" size="large" :loading="send_loading" @click="confirmAddTask(true)">
                    创建 {{ add_task_count }} 条
                </Button>
            </div>
        </Modal>
        <Modal
                v-model="del_project_user_modal"
                title="操作提示">
            <p>真的要将成员移出本项目吗？ </p>
            <div slot="footer">
                <Button type="text" @click="del_project_user_modal = false">再想想</Button>
                <Button type="warning" :loading="send_loading" @click="delProjectUser">移出</Button>
            </div>
        </Modal>
        <Modal
                v-model="del_type_task_modal"
                title="操作提示">
            <p>真的要将删除本列表的所有任务吗？ </p>
            <div slot="footer">
                <Button type="text" @click="del_type_task_modal = false">再想想</Button>
                <Button type="error" :loading="send_loading" @click="delTypeTask">真的</Button>
            </div>
        </Modal>
        <Modal
                v-model="set_type_endTime_modal"
                class-name="date-time-modal"
                title="设置截止时间">
            <DatePicker type="datetime" placeholder="请选择截止时间" style="width: 100%" v-model="task_type_end_time"
                        :options="date_picker_option" :confirm="true" @on-ok="setTypeTaskEndTime"
                        @on-clear="clearTypeTaskEndTime"></DatePicker>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="set_executor_modal"
                width="360"
                class="user-modal">
            <p slot="header" style="text-align:center;">
                <span>设置任务执行人</span>
            </p>
            <Form>
                <Form-item label="成员搜索" prop="user_truename">
                    <Input type="text" v-model="project_user_keyword" placeholder="输入成员账号 / 姓名进行查找"/>
                </Form-item>
                <p class="list-title">项目成员</p>
                <ul class="user-list" v-if="data_loading == false">
                    <li v-for="(user,index) in project_user_list">
                        <img width="25" class="img-circle"
                             :src="user.avatar"
                             alt="">
                        <span class="name-label">{{ user.realname }}（{{ user.account }}）</span>
                        <span class="pull-right">
                                <Button type="ghost" size="small" @click="setTypeTaskExecutor(user.u_user_id,index)"
                                        :loading="send_loading">设置</Button>
                            </span>
                    </li>
                </ul>
                <div style="text-align: center" v-if="data_loading == true">
                    <p class="tip" style="padding: 45px 0;">加载中...</p>
                </div>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
        <Modal
                v-model="user_modal"
                width="360"
                class="user-modal">
            <p slot="header" style="text-align:center;">
                <span>添加成员至项目</span>
            </p>
            <Form>
                <Form-item label="成员搜索" prop="user_truename">
                    <Input type="text" v-model="user_keyword" placeholder="输入成员账号 / 姓名进行查找"/>
                </Form-item>
                <p class="list-title">项目成员</p>
                <ul class="user-list" v-if="data_loading == false">
                    <li v-for="(user,index) in project_user_add_list">
                        <img width="25" class="img-circle"
                             :src="user.avatar"
                             alt="">
                        <span class="name-label">{{ user.realname }}（{{ user.account }}）</span>
                        <span class="pull-right">
                                <span v-if="user.is_add" style="color: #A6A6A6">已加入</span>
                                <Button type="ghost" size="small" v-else
                                        @click="addProjectUser(user.u_user_id,index)">添加</Button>
                            </span>
                    </li>
                </ul>
                <div style="text-align: center" v-if="data_loading == true">
                    <p class="tip" style="padding: 45px 0;">加载中...</p>
                </div>
                <div style="text-align: center" v-if="project_user_list.length == 0">
                    <div class="illustration"></div>
                    <p class="tip">所有成员均已加入本项目</p>
                </div>
            </Form>
            <div slot="footer">
            </div>
        </Modal>
        <task-detail :showModal="show_task_detail" :task_id="task_id" @on-modal-change="modalChange"
                     @on-task-update="taskUpdate">
        </task-detail>
        <project-setting :showModal="project_setting_modal" :project_id="project_id"
                         @on-modal-change="modalProjectSettingChange" @on-update="projectUpdate">

        </project-setting>
    </div>
</template>
<style>

</style>
<script type="es6">
    import WrapperContent from '../../../components/wrapper-content.vue'
    import TaskDetail from '../../../components/task-detail.vue'
    import ProjectSetting from '../../../components/project-setting.vue'
    import {mapState} from 'vuex'
    import * as utils from '../../../assets/js/utils'
    import * as dateTime from '../../../assets/js/date_time'
    import $ from 'jquery'
    import moment from 'moment'
    import {SlickList, SlickItem} from 'vue-slicksort';
    import {
        getInfo,
        getUserList,
        getLogList,
        getTaskList,
        getTaskForUser,
        getTaskTypeList,
        addTask,
        setTaskState,
        selectProjectUser,
        addProjectUser,
        delProjectUser,
        delTypeTask,
        setTypeTaskEndTime,
        setTypeTaskExecutor,
        exchangeTaskSort,
        exchangeTaskTypeSort
    } from "@/api/project"

    export default {
        components: {
            WrapperContent,
            TaskDetail,
            ProjectSetting,
            SlickList,
            SlickItem
        },
        data() {
            return {
                menu_modal: false,
                user_menu_modal: false,
                show_task_detail: false,
                date_picker_option: {
                    disabledDate(date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                task_type_end_time: null,
                task_type_list: [],
                project_id: this.$route.params.project_id,
                project: {},
                project_user_list: [],
                task_id: 0,
                //新建任务类型
                task_type: '',
                task_type_index: 0,
                //新建任务下标
                task_index: 0,
                add_task_modal: false,
                //新建任务对象
                task: {
                    title: '',
                    content: '',
                    project_id: 0,
                    task_type: 0
                },
                default_executor: {},
                //新建任务条数
                add_task_count: 0,
                send_loading: false,
                add_task_loading: false,

                //任务日志
                project_log_list: [],
                //待完成
                project_task_undo: 0,
                //逾期
                project_task_overdue: 0,

                //搜索团队成员
                project_user_keyword: '',

                user_modal: false,
                user_keyword: '',
                project_user_add_list: [],
                data_loading: false,

                del_project_user_modal: false,
                del_user_id: 0,

                project_setting_modal: false,

                del_type_task_modal: false,
                set_type_endTime_modal: false,
                set_executor_modal: false,
                type_task_id: 0,
                select_task_type_index: 0,

                move_task_type_index: 0,
                from_task_id: 0,
                to_task_id: 0,
                change: false,//防止重复触发
                exchanging: false,//停止拖拽时会触发两次，所以加此限制
                chang_type: '',


                timer: false,
                screenHeight: document.body.clientHeight,
            }
        },
        computed: {
            ...mapState(['user_info'])
        },
        watch: {
            task_type_list() {
                // let app = this;
                // $.each(app.task_type_list, function (k, v) {
                //     app.getList(v.id, k)
                // })
            },
            project_id() {
                this.getProjectInfo()
            },
            menu_modal(value) {
                if (value) {
                    this.getProjectLogList();
                    this.getTaskForUserUndo();
                    this.getTaskForUserOverdue()
                }
            },
            user_modal(value) {
                if (value) {
                    this.menu_modal = false;
                    this.getProjectUserAdd()
                } else {
                }
            },
            del_project_user_modal(value) {
            },
            project_user_keyword: function () {
                this.project_user_search()
            },
            set_type_endTime_modal: function (value) {
                if (value) {
                    this.task_type_end_time = new Date()
                }
            },
            user_keyword: function () {
                this.user_search()
            },
            screenHeight(val) {
                if (!this.timer || true) {
                    this.screenWidth = val;
                    this.hasScrolled();
                    this.timer = true;
                    let that = this;
                    setTimeout(function () {
                        that.timer = false
                    }, 400)
                }
            },
            '$route'(to, from) { // 路由监听，重新获取数据
                this.project_id = this.$route.params.project_id;
                this.getTaskType();
                this.getProjectUserList()
            }
        },
        created() {
            const m = moment().locale('zh-cn');
            this.default_executor = this.user_info;
            this.getTaskType();
            this.getProjectUserList();
        },
        mounted() {
            const app = this;
            //等待数据挂载完毕后判断是否有滚动条
            setTimeout(function () {
                app.hasScrolled()
            }, 3000);
            window.onresize = () => {
                return (() => {
                    window.screenHeight = document.body.clientHeight;
                    app.screenHeight = window.screenHeight;
                    app.hasScrolled();
                })()
            }
        },
        methods: {
            SlickEvent(list,type){
                console.log(list);
                const send = [];
                if (type === 'task') {
                    list.forEach(function (v, k) {
                        if (v.task_state == 0) {
                            send.push(v.id);
                        }
                    });
                    exchangeTaskSort(JSON.stringify(send));
                }else{
                    list.forEach(function (v, k) {
                        send.push(v.id);
                    });
                    exchangeTaskTypeSort(JSON.stringify(send));
                }
            },
            sortEnd(event){
                console.log(event);
            },
            showTaskCount(list,state){
                let count = 0;
                if (!list) {
                    return count;
                }
                if (state == -1) {
                    count = list.length;
                }else{
                    list.forEach(function (v, k) {
                        if (v.task_state == state) {
                            count++;
                        }
                    });
                }
                return count;
            },
            //获取任务类型列表
            getTaskType() {
                let app = this;
                app.task_type_list = [];
                getTaskTypeList(app.project_id).then(res => {
                    app.task_type_list = res.data.list;
                    app.task_type_list.forEach(function (v,k) {
                        app.getList(v.id, k)
                    });
                });
            },
            //获取对应任务类型的任务列表
            getList(task_type, index) {
                let app = this;
                getTaskList(app.project_id, task_type).then(res => {
                    app.hasScrolled();
                    app.task_type_list[index].list = res.data.list;
                });
            },
            getProjectInfo() {
                let app = this;
                getInfo(app.$route.params.project_id).then(res => {
                    app.project = res.data;
                });
            },
            getProjectUserList() {
                let app = this;
                getUserList(app.$route.params.project_id, app.project_user_keyword).then(res => {
                    app.project_user_list = res.data.list;
                });
            },
            //隐藏添加任务卡片
            hideTaskCard(index) {
                this.task_type_list[index].show_card = false
            },
            //显示添加任务卡片
            showTaskCard(index) {
                let app = this;
                $.each(app.task_type_list, function (k, v) {
                    app.task_type_list[k].show_card = false
                });
                app.task_type_list[index].show_card = true
            },
            showTaskLevel(level) {
                return {
                    'warning': level === 2,
                    'error': level === 1,
                }
            },
            selectExecutor(project_user_index) {
                let app = this;
                app.default_executor = app.project_user_list[project_user_index]
            },
            //准备添加任务
            addTask(task_type, index) {
                if (this.task.name === '') {
                    this.$Message.warning('任务内容不能为空', 2);
                    return false
                }
                this.task_type = task_type;
                this.task_index = index;
                this.task.task_type = task_type;
                this.task.project_id = this.project_id;
                //判断换行，添加多条任务
                let titles = this.task.name.split("\n");
                if (titles.length > 1) {
                    this.add_task_count = titles.length;
                    this.add_task_modal = true;
                } else {
                    this.add_task_count = 1;
                    this.doAddTask();
                }
            },
            //添加任务
            doAddTask() {
                let app = this;
                if (app.add_task_loading) {
                    app.$Message.warning('正在添加任务，请稍后...', 2);
                    return false;
                }
                setTimeout(function () {
                    if (app.add_task_loading === true) {
                        app.$Message.loading({
                            content: '正在添加任务，请稍后...',
                            duration: 5
                        })
                    }
                }, 2000);
                app.add_task_loading = true;
                app.task.task_count = app.add_task_count;
                app.task.executor_id = app.default_executor.id;
                console.log(app.task);
                addTask(app.task).then(res => {
                    app.add_task_loading = false;
                    app.$Message.destroy();
                    const result = utils.showBack(res);
                    if (result) {
                        app.getList(app.task_type, app.task_index);
                        app.task = {
                            name: '',
                            desc: '',
                            task_type: 0
                        };
                        app.$Notice.success({
                            title: '添加任务成功',
                            desc: '你可以点击该任务继续进行详细设置'
                        });
                    }
                });
            },
            //确认添加任务
            confirmAddTask(confirm) {
                if (!confirm) {
                    this.add_task_count = 1
                }
                this.add_task_modal = false;
                this.doAddTask()
            },
            //标记任务
            setTaskState(task_id, task_type_index, task_index, done) {
                let app = this;
                let task_state = 0;
                if (done) {
                    task_state = 1
                }
                let task_data = {
                    task_id: task_id,
                    task_state: task_state
                };
                app.task_type_list[task_type_index].list[task_index].task_state = task_state;
                setTaskState(task_id, task_state);
            },
            showTaskDetail(task_id, task_type_index, task_index) {
                this.show_task_detail = true;
                this.task_id = task_id;
                this.task_type_index = task_type_index;
                this.task_index = task_index
            },
            modalChange(value) {
                this.show_task_detail = value
            },
            taskUpdate(value, action, task_type_index) {
                if (value.pid != 0) {
                    return false;
                }
                if (action === 'update') {
                    if (value !== null) {
                        this.task_type_list[this.task_type_index].list[this.task_index] = value
                    } else {
                        this.task_type_list[this.task_type_index].list.splice(this.task_index, 1)
                    }
                }
                if (action === 'change_task_type') {
                    this.task_type_list[this.task_type_index].list.splice(this.task_index, 1);
                    this.getList(value.task_type, task_type_index)
                }
            },
            //任务日志
            getProjectLogList() {
                let app = this;
                getLogList(app.$route.params.project_id).then(res => {
                    app.project_log_list = res.data.list
                });
            },
            getTaskForUserUndo() {
                let app = this;
                getTaskForUser(1, 0, app.$route.params.project_id).then(res => {
                    app.project_task_undo = res.data.count;
                });
            },
            getTaskForUserOverdue() {
                let app = this;
                getTaskForUser(1, 0, app.$route.params.project_id, 1).then(res => {
                    app.project_task_undo = res.data.count;
                });
            },
            user_search: _.debounce(
                function () {
                    this.getProjectUserAdd()
                },
                1000
            ),
            project_user_search: _.debounce(
                function () {
                    this.getProjectUserList()
                },
                1000
            ),
            getProjectUserAdd() {
                let app = this;
                app.data_loading = true;
                selectProjectUser(app.$route.params.project_id, app.user_keyword).then(res => {
                    app.data_loading = false;
                    app.project_user_add_list = res.data.list
                });
            },
            addProjectUser(user_id, index) {
                let app = this;
                addProjectUser(user_id, app.$route.params.project_id).then(res => {
                    const result = utils.showBack(res);
                    if (result) {
                        app.project_user_add_list[index].is_add = true;
                        app.getProjectUserList()
                    }
                });
            },
            delProjectUser() {
                let app = this;
                app.send_loading = true;
                delProjectUser(app.del_user_id, app.project_id).then(res => {
                    app.send_loading = false;
                    app.del_project_user_modal = false;
                    if (res.ret === 200) {
                        app.$Message.success('已将成员移出本项目');
                        app.getProjectUserList()
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            taskTypeAction(name) {
                let type_key_list = name.split('_');
                const type_key = type_key_list[type_key_list.length - 2];
                const type_index = type_key_list[type_key_list.length - 1];
                const action = type_key_list[0];
                switch (action) {
                    case 'delTask':
                        this.del_type_task_modal = true;
                        break;
                    case 'setEndTime':
                        this.set_type_endTime_modal = true;
                        break;
                    case 'setExecutor':
                        this.set_executor_modal = true;
                        break;
                }
                this.type_task_id = type_key;
                this.select_task_type_index = type_index
            },
            delTypeTask() {
                let app = this;
                app.send_loading = true;
                delTypeTask(app.project_id, app.type_task_id).then(res => {
                    app.send_loading = false;
                    app.del_type_task_modal = false;
                    if (res.ret === 200) {
                        app.task_type_list[app.select_task_type_index].list = []
                    } else {
                        app.$Message.warning(res.msg)
                    }
                });
            },
            setTypeTaskEndTime() {
                let app = this;
                app.send_loading = true;
                let end_time = null;
                if (app.task_type_end_time != null) {
                    end_time = dateTime.date_format(app.task_type_end_time, "yyyy-MM-dd hh:mm:ss");
                }
                setTypeTaskEndTime(app.project_id, app.type_task_id, end_time).then(res => {
                    app.send_loading = false;
                    app.set_type_endTime_modal = false;
                    if (res.ret === 200) {
                        $.each(app.task_type_list[app.select_task_type_index].list, function (key, value) {
                            value.end_time = end_time
                        })
                    } else {
                        app.$Message.warning(res.msg)
                    }
                });
            },
            setTypeTaskExecutor(user_id) {
                let app = this;
                app.send_loading = true;
                setTypeTaskExecutor(app.project_id, app.type_task_id, user_id).then(res => {
                    app.project_user_keyword = '';
                    app.send_loading = false;
                    app.set_executor_modal = false;
                    if (res.ret === 200) {
                        $.each(app.task_type_list[app.select_task_type_index].list, function (key, value) {
                            value.executor_user_info = res.data;
                        })
                    } else {
                        app.$Message.warning(res.msg);
                    }
                });
            },
            clearTypeTaskEndTime() {
                let app = this;
                app.task_type_end_time = null;
                app.setTypeTaskEndTime();
            },
            projectUpdate(value) {
                this.project = value
            },
            modalProjectSettingChange(value) {
                this.project_setting_modal = value
            },
            //判断是否有滚动条
            hasScrolled() {
                if (!this.timer || true) {
                    let app = this;
                    $.each(app.task_type_list, function (k, v) {
                        let scrolled = utils.hasScrolled(document.getElementById(v.id + "-section"));
                        app.task_type_list[k].fixed_creator = scrolled === true;
                        app.modal_height = $(window).height() - 100;
                        $(".ivu-modal-content").css("max-height", app.modal_height + "px");
                        $(".ivu-modal-content").css("overflow", "auto");
                        app.timer = true;
                        setTimeout(function () {
                            app.timer = false
                        }, 400)
                    })
                }
            },
            //格式化任务起止时间
            showTaskTime(begin_time, end_time) {
                return dateTime.showTaskTime(begin_time, end_time)
            }
        }
    }
</script>
