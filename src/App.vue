<template>
  <div>
    <el-container>
      <el-aside width="150px">
        <el-menu mode="vertical" :default-active=CurrentActive @select="handleSelect">
          <el-menu-item index="/images">
            镜像管理
          </el-menu-item>
          <el-menu-item index="/load">
            工作负载管理
          </el-menu-item>
          <el-menu-item index="/services">
            服务管理
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "AsideBox",
  data() {
    return {
      CurrentActive: '/images',
    }
  },
  methods: {
    handleSelect(index) {
      this.CurrentActive = index
      this.$router.replace(index)
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-container {
  margin-bottom: 40px;
}
.el-aside {
  text-align: center;
  line-height: 200px;
}
.el-aside .el-menu {
  margin-top: 30px;
}
</style>
