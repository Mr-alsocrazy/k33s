<template>
  <div>
    <el-menu mode="vertical" :default-active=CurrentActive @select="handleSelect">
      <el-menu-item index="/image">
        镜像管理
      </el-menu-item>
      <el-menu-item index="/load">
        工作负载管理
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "AsideBox",
  data() {
    return {
      CurrentActive: '/image',
    }
  },
  methods: {
    handleSelect(index) {
      this.CurrentActive = index;
      this.$router.replace(index)
    }
  }
}
</script>
