<template>
    <div class="has-header-content">
        <wrapper-content>
            <div class="content-header">
                <router-link to="/project/level/list">
                    <h1>等级列表</h1>
                </router-link>
                <h1>&nbsp;&gt; 编辑等级</h1></div>
            <div class="content-main">
                <div>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80"
                          label-position="left">
                        <Form-item label="名称" prop="level_name">
                            <Input v-model="formValidate.level_name" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="金额" prop="money">
                            <Input v-model="formValidate.money" type="text" style="width: 500px"/>
                        </Form-item>
                        <Form-item label="排序" prop="sort">
                            <Input v-model="formValidate.sort" placeholder="等级排序，值越大越靠前，最小为0" type="text"
                                   style="width: 500px"/>
                        </Form-item>
                        <div class="footer-item">
                            <Form-item>
                                <Button type="primary" @click="handleSubmit('formValidate')" :loading="sending">提交
                                </Button>
                                <router-link to="/project/level/list">
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
          level_name: '',
          money: 0,
          sort: 0
        },
        sending: false,
        ruleValidate: {
          level_name: [
            {required: true, message: '等级名称不能为空', trigger: 'blur'}
          ],
          money: [
            {required: true, message: '等级金额不能为0', trigger: 'blur'}
          ]
        }
      }
    },
    created (){
      let app = this
      sendAjax({
        url: 'Project_Level.getInfo',
        data: {level_id: app.$route.params.level_id},
        success: function (res) {
          if (res.data) {
             app.formValidate.level_id = res.data.id
             app.formValidate.level_name = res.data.level_name
             app.formValidate.money = res.data.money
             app.formValidate.sort = res.data.sort
          }
        }
      });
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if(valid) {
            if (this.formValidate.sort < 0) {
              this.$Message.warning('等级排序不能小于0')
              return false
            }
            let app = this
            this.sending = true
            let option = {
              url: 'Project_Level.editLevel', method: 'post',
              data: app.formValidate,
              success: function (res) {
                const code = res.ret;
                const msg = res.msg;
                if (code !== 200) {
                  app.$Message.warning(msg);
                } else {
                  app.$store.state.list_reload = true
                  app.$Message.success('修改成功')
                  app.$router.push('/project/level/list')
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
