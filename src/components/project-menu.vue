<template>
    <div class="project-menu">
        <Modal  v-model="menu_modal"
                :transition-names="['router-right-slide','router-right-slide']"
                title="操作提示">
            <p>确定要永远删除这个文件吗？删除后无法恢复</p>
            <div slot="footer">
               8888
            </div>
        </Modal>
    </div>
</template>
<style>
</style>
<script type="es6">
  export default {
    name: 'project-menu',
    components: {},
    data() {
      return {}
    }
  }
</script>
