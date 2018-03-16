<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/user/list">
                    <h1>用户列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 编辑用户</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <Form-item label="用户编号" prop="user_name">
                            <Input v-model="formValidate.user_name" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户昵称" prop="realname">
                            <Input v-model="formValidate.realname" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="用户密码" prop="password">
                            <Input v-model="formValidate.password" placeholder="请输入用户密码，留空则不修改" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="确认密码" prop="password">
                            <Input v-model="formValidate.password_confirm" placeholder="请确认用户密码，留空则不修改" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="状态" prop="state">
                            <RadioGroup v-model="formValidate.state">
                                <Radio label="1">启用</Radio>
                                <Radio label="0">禁用</Radio>
                            </RadioGroup>
                        </Form-item>
                        <div class="footer-item">
                            <Form-item>
                                <Button permission="User_User.editUser" type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                                <router-link to="/user/list">
                                    <Button type="text" >取消</Button>
                                </router-link>
                            </Form-item>
                        </div>
                    </Form>
                </div>
            </div>
        </wrapper-content>
    </div>
</template>
<script type="es6">
  import WrapperContent from '../../../components/wrapper-content.vue'
  import {getStore, sendAjax} from '../../../assets/js/utils'
  import $ from 'jquery'

  export default {
    components: {
      WrapperContent
    },
    data() {
      return {
        formValidate: {
          user_id: '',
          user_name: '',
          realname: '',
          password: '',
          password_confirm: '',
          state: 1,
        },
        sending: false,
        ruleValidate: {
          user_name: [
            {required: true, message: '用户编号不能为空', trigger: 'blur'}
          ],
          realname: [
            {required: true, message: '用户昵称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    created (){
      let app = this
      sendAjax({
        url: 'User_User.getUser',
        data: {user_id: app.$route.params.user_id},
        success: function (res) {
          if (res.data) {
             app.formValidate.user_id = res.data.id
             app.formValidate.user_name = res.data.user_name
             app.formValidate.realname = res.data.realname
             app.formValidate.state = res.data.state
          }
        }
      });
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if(valid) {
            if(this.formValidate.password !== this.formValidate.password_confirm){
              this.$Message.warning('两次输入的密码不相同')
              return false
            }
            let app = this
            this.sending = true
            let option = {
              url: 'User_User.editUser', method: 'post',
              data: app.formValidate,
              success: function (res) {
                const code = res.ret;
                const msg = res.msg;
                if (code !== 200) {
                  app.$Message.warning(msg);
                } else {
                  app.$store.state.list_reload = true
                  app.$Message.success('修改成功')
                  app.$router.push('/user/list')
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
    }
  }
</script>
