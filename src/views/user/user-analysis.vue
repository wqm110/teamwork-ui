<template>
    <div>
        <wrapper-content pageTitle="本周项目">
            <Row>
                <i-col span="18">
                    <router-link to="/project/add">
                        <Button type="primary" icon="plus-round">
                            新增项目
                        </Button>
                    </router-link>
                </i-col>
                <i-col span="6">
                    <i-input class="input-height">
                        <Button class="input-height search-button" type="primary" slot="append"
                                icon="ios-search"></Button>
                    </i-input>
                </i-col>
            </Row>
            <div class="data-content">
                666
            </div>
        </wrapper-content>
        <transition name="router-slid">
            <router-view></router-view>
        </transition>

    </div>
</template>
<script type="es6">
    import WrapperContent from '../../components/wrapper-content.vue'
    import * as utils from '../../assets/js/utils'
    import $ from 'jquery'
    import * as dateTime from '../../assets/js/date_time'

    export default{
        components: {
            WrapperContent,
        },
        data(){
            return {
                self: this,
                archive_modal: false,
                choose_project_id: 0,
                choose_project_index: 0,
                show_menu: false,
                send_loading: false,
                page_size: 10,
                page_num: 1,
                columns: [
//                    {
//                        type: 'selection',
//                        width: 60,
//                        align: 'center'
//                    },
                    {
                        title: '项目名称',
                        key: 'name',
                        width: 300,
                        render (row, column, index) {
                            return `<i-button  @click="goPage('/projectinfo/${row.id}/tasks')"  class="name-link" type="text" >
                                         ${row.name}
                                    </i-button>`;
                        }
                    },
                    {
                        title: '评级',
                        key: 'level_name',
                        sortable: true
                    },
                    {
                        title: '开启日期',
                        key: 'begin_date',
                        sortable: true
                    },
                    {
                        title: '预交日期',
                        key: 'prepay_date',
                        sortable: true
                    },
                    {
                        title: '进度',
                        key: 'schedule',
                        sortable: true,
                        render (row, column, index) {
                            return `<span class="text-success">${row.schedule}%</span>`;
                        }
                    },
                    {
                        title: '状态',
                        sortable: true,
                        key: 'project_state'
                    },
                    {
                        title: '业务',
                        key: 'business_name',
                    }
                ],
                projectList: [],
                projectCount: 0,
            }
        },
        created: function () {
//            this.getProjectList(1, this.page_size)
        },
        methods: {
            getProjectList (page_num, page_size = 10){
                let app = this
                app.page_size = page_size
                app.page_num = page_num
                app.$store.state.page_loading = true
                utils.sendAjax({
                    url: 'Project.getProjectList',
                    data: {
                        page_size: this.page_size,
                        page_num: this.page_num,
                        filter: {
                            'prepay_time>=?': Math.round(dateTime.getWeekDay().monday / 1000 ),
                            'state = ?': 1,
                        }
                    },
                    success: function (res) {
                        app.$store.state.page_loading = false
                        app.projectList = res.data.content.list
                        app.projectCount = Number(res.data.content.count)
                    }
                });
            },
          rowClassName (row, index) {
            return 'rowClassName';
          },
            changePageSize (page_size){
                this.page_size = page_size
                this.getProjectList(this.page_num, page_size)
            },
            reloadList (){
                this.getProjectList(1, this.page_size)
            },
            goPage (url){
                this.$router.push(url)
            }
        },
        watch: {
            '$route' (to, from) { // 路由监听，重新获取数据
                if (this.$store.state.list_reload) {
//                    this.getProjectList(1, this.page_size)
                }
            }
        }

    }
</script>
