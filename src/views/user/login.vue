<template>
    <div class="login-page">
        <div class="login-card">
            <Card class="main">
                <h2 class="title">登录系统帐号</h2>
                <Form ref="loginValidate" :model="loginValidate" :rules="ruleValidate" label-position="top"
                      class="submit-form">
                    <Form-item label="账号：" prop="account">
                        <Input size="large" v-model="loginValidate.account" clearable />
                    </Form-item>
                    <Form-item label="密码：" prop="password">
                        <Input type="password" size="large" v-model="loginValidate.password" clearable />
                    </Form-item>
                    <div class="sub text-center">
                        <Button size="large" class="login-btn" type="primary" long :loading="sending"
                                @click="handleSubmit('loginValidate')">登&nbsp;&nbsp;录
                        </Button>
                    </div>
                    <div class="pro">
                        <div class="direct">
                            <Checkbox-group>
                                <Checkbox label="15天自动登录" v-model="loginValidate.remember"></Checkbox>
                            </Checkbox-group>
                        </div>
                    </div>
                    <!-- <div class="others text-center">
                         <div class="text">使用第三方登录</div>
                         <div class="party-link">
                             <span class="icon icon-weibo"><img src="https://img.wdstatic.cn/www-nd/images/account/weibo-normal.23a661c9.svg" alt="" width="29"></span>
                             <span class="icon icon-kezhan"><img src="https://css.wdstatic.cn/www-nd/images/account/kezhan-normal.96ebce09.svg" alt=""></span>
                         </div>
                     </div>-->
                </Form>
            </Card>
        </div>
    </div>
</template>
<style>
    .login-page{
        background: #FFF;
        height: 100%;
        position: absolute;
        width: 100%;
    }
    .login-card {
        width: 840px;
        height: 482px;
        margin: 100px auto;
        border-radius: 3px;
        box-shadow: 0 0 4px rgba(0,0,0,.2);
        line-height: 1;
        background: url("http://static.vilson.xyz/signup_bg-5ff4429982.jpg");
        /*background: url("http://static.vilson.xyz/login_bg-340082e72e.jpg");*/
    }

    .login-card .main {
        float: left;
        border: 1px solid #e5e5e5;
        border-radius: 3px;
        background-color: #fff;
        box-shadow: 2px 2px 56px rgba(0, 0, 0, .13);
        -webkit-box-shadow: 2px 2px 56px rgba(0, 0, 0, .13);
        width: 450px;
        height: 564px;
        top: -40px;
        padding-left: 55px;
        margin-left: 340px;

    }

    .login-card .main .title {
        margin: 50px 0 0;
        color: #212121;
        font-size: 30px;
        font-weight: 300;
    }

    .login-card .main .submit-form {
        margin-top: 78px;
        width: 315px;
    }

    .login-card .main {
        position: relative;
    }

    .sub {
        margin-top: 36px;
        padding-bottom: 20px;
    }

    .submit-form .pro {
        text-align: center;
        font-size: 12px;
        color: #666;
        letter-spacing: 1px;
        margin-bottom: 65px;
    }

    .main .others {
        padding-top: 18px;
        border-top: 1px solid #e5e5e5;
        color: #ccc;
        font-size: 13px;
        letter-spacing: 1px;
        cursor: pointer;
    }

    .others .party-link {
        width: 198px;
        margin: 15px auto 0;
    }

    .login-btn {
        padding-bottom: 6px;
        font-size: 16px;
    }
</style>
<script type="es6">
  import {getApiUrl, addCookie, setStore, sendAjax, getStore} from '../../assets/js/utils'
  import axios from 'axios'
  import {Ajax as Ajax} from '../../assets/js/ajax'

  export default {
    components: {},
    data() {
      const validateName = (rule, value, callback = function () {
      }) => {
        if (!value) {
          return callback(new Error('请填写有效账户'));
        }
        callback();
      };
      const validatePassword = (rule, value, callback = function () {
      }) => {
        if (!value || value.length < 6) {
          return callback(new Error('密码区分大小写，不少于6位'));
        }
        callback();
      };
      return {
        img_path: '',
        sending: false,
        loginValidate: {
          account: '',
          password: '',
          remember: false
        },
        ruleValidate: {
          account: [
            {validator: validateName, trigger: 'blur'}
          ],
          password: [
            {validator: validatePassword, trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      '$route'(to, from) { // 路由监听，重新获取数据
        this.checkLogin()
      }
    },
    created (){
      this.$store.state.page_loading = false
      this.$store.state.menu_top = false
      this.$store.state.menu_slide = false
      this.checkLogin()
    },
    methods: {
      checkLogin(){
        let app = this
        if(app.$store.state.user_info != null) {
          // app.$router.push(app.$store.state.menu_data.menu_model_list[0]['path'])
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.sending = true
            let app = this
            app.sending = true
            let option = {
              url: 'User_User.Login', method: 'post',
              data: this.loginValidate,
              success: function (res) {
                const content = res.data;
                const code = res.ret;
                const msg = res.msg;
                if (code !== 200) {
                  app.$Message.warning({
                    content: msg,
                    duration: 3
                  });
                } else {
                  let duration = 0;
                  if (app.loginValidate.remember) {
                    duration = 15 * 24;
                  }
                  setStore('token', content.token,true, duration)
                  setStore('account', content.account,true, duration)
                  sendAjax({
                    url: 'System_Setting.getSetting',
                    data: {
                      set_name: 'base_setting'
                    },
                    success: function (res) {
                      if(res.data) {
                        setStore('system_info',res.data)
                        app.$store.state.system_info = res.data
                      }
                    }
                  });
                  sendAjax({  //获取菜单资源
                    url: 'User_User.getUserMenu',
                    success: function (res) {
                      setStore('menu_list', res.data.menu_list)
                      setStore('menu_list_old', res.data.menu_list_old)
                      setStore('menu_model_list', res.data.menu_model_list)
                      setStore('menu_model_list_all', res.data.menu_model_list_all)
                      setStore('menu_model', res.data.menu_model_list[0]['id'])
                      app.$store.state.menu_data.menu_list = res.data.menu_list
                      app.$store.state.menu_data.menu_list_old = res.data.menu_list_old
                      app.$store.state.menu_data.menu_model_list = res.data.menu_model_list
                      app.$store.state.menu_data.menu_model_list_all = res.data.menu_model_list_all
                      app.$store.state.menu_model = res.data.menu_model_list[0]['id']
                      const menu_model_list = res.data.menu_model_list
                      sendAjax({   //获取权限资源
                        url: 'User_User.getUserAuth',
                        success: function (res) {
                          setStore('auth_list', res.data)
                          sendAjax({  //获取令牌
                            url: 'User_User.getInfoByToken',
                            success: function (res) {
                              const user_info = res.data
                              if (user_info !== '' || user_info !== null) {
                                app.$store.state.user_info = user_info.user_info
                                setStore('user_info', user_info.user_info)
                              }
                              app.$Message.success('登录成功~!');
                              if(app.$store.state.user_info != null) {
                                app.$socket.emit('login', app.$store.state.user_info.id);
                              }
                              app.getNotifyNoReadList()
                              app.$router.push(menu_model_list[0]['path'])
                              // app.$router.push(menu_model_list[0]['path'])
                            }
                          })
                        }
                      })
                    }
                  });
                }
                app.sending = false;
              }, fail: function (res) {
                app.sending = false;
              }
            }
            sendAjax(option)
          }
        })
      },
      getNotifyNoReadList() {
        let app = this
        sendAjax({
          url: 'Common_Notify.getList',
          data:{
            page_size: 5
          },
          success: function (res) {
            app.$store.state.notify_no_read_list = res.data.list
            app.$store.state.notify_no_read_count = res.data.count
          }
        });
      },
    },
  }
</script>
