<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/user/list">
                    <h1>团队列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 创建团队</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <Form-item label="团队名称" prop="team_name">
                            <Input v-model="formValidate.team_name" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="状态" prop="state">
                            <RadioGroup v-model="formValidate.state">
                                <Radio label="1">启用</Radio>
                                <Radio label="0">禁用</Radio>
                            </RadioGroup>
                        </Form-item>
                        <div class="footer-item">
                            <Form-item>
                                <Button type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                                <router-link to="/team/list">
                                    <Button type="text">取消</Button>
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
  import WrapperContent from '../../components/wrapper-content.vue'
  import {getStore, sendAjax} from '../../assets/js/utils'
  import $ from 'jquery'

  export default {
    components: {
      WrapperContent
    },
    data() {
      return {
        formValidate: {
          team_name: '',
          state: 1,
        },
        sending: false,
        ruleValidate: {
          team_name: [
            {required: true, message: '团队名称不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let app = this
            this.sending = true
            let option = {
              url: 'Team_Team.addTeam', method: 'post',
              data: app.formValidate,
              success: function (res) {
                const code = res.ret;
                const msg = res.msg;
                if (code !== 200) {
                  app.$Message.warning({
                    content: msg,
                    duration: 5
                  });
                } else {
                  app.$store.state.list_reload = true
                  app.$Message.success('创建成功')
                  app.$router.push('/team/list')
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
