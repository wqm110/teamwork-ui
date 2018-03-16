<template>
    <div id="menu-slide" :class="menu_slide_class">
        <Menu ref="menu" width="256px" theme="dark" :active-name="activeKey" :open-names="openItems"
              @on-select="goPage" accordion>
            <!--<MenuGroup  v-for="(menu,index) in menu_list" :key="menu.id" :name="menu.name" :title="menu.title" v-if="menu.model == menuModel">
                <div v-if="menu.nextItem">
                    <MenuItem  v-for="(sec_menu,index) in menu.nextItem" :key="menu.id" :name="'/' + sec_menu.path">
                        <Icon v-if="sec_menu.icon" :type="sec_menu.icon"></Icon>
                        {{ sec_menu.title }}
                    </MenuItem>
                </div>
            </MenuGroup>-->
            <Submenu v-for="(menu,index) in menu_list" :key="menu.id" :name="menu.name" v-if="menu.model == menuModel">
                <template slot="title">
                    <Icon v-if="menu.icon" :type="menu.icon"></Icon>
                    {{ menu.title }}
                </template>
                <div v-if="menu.nextItem">
                    <Menu-item v-for="(sec_menu,index) in menu.nextItem" :key="sec_menu.id" :name="'/' + sec_menu.path">
                        {{ sec_menu.title }}
                    </Menu-item>
                </div>
            </Submenu>
        </Menu>
    </div>
</template>
<script type="es6">
  import * as utils from '../assets/js/utils'
  import {mapGetters} from 'vuex'
  import $ from 'jquery'

  export default {
    props: {
      activeKey: {
        type: String
      },
      openItems: {
        type: Array
      },
      menuModel: { //菜单分组
        type: String
      }
    },
    data() {
      return {
        menu_list: [],
        updated: true,
      };
    },
    created() {
      this.$nextTick(() => {
        let app = this
        app.menu_list = app.menu_data.menu_list
      });
    },
    watch: {
      '$route'(to, from) { // 路由监听，重新获取数据
        this.menu_list = this.menu_data.menu_list
      },
      openItems: function (value) {
        //防止菜单列表展开异常
        if(this.updated) {
          this.updated = false
          this.$refs.menu.updateOpened(value)
        }

      }
    },
    computed: {
      ...
        mapGetters([
          'menu_data',
          'show_menu_slide'
        ]),
      menu_slide_class: function () {
        if (this.show_menu_slide) {
          return 'menu-slide';
        } else {
          return 'menu-slide hide';
        }
      }
    },
    methods: {
      goPage(name) { // 点击菜单进入对应路由
        this.$nextTick(() => {
          this.$router.push(name)
        });
      },
    },
  };
</script>
