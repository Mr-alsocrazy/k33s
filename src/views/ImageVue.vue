<template>
  <div>
    <el-container>
      <el-header>
        镜像管理
      </el-header>
      <el-main>
        <el-card>
          <div slot="header">
            <span>镜像列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addImage=true">
              创建新镜像
            </el-button>
          </div>
          <div>
            <el-table :data="tableData" width="50%">
              <el-table-column prop="id" label="id" width="180"></el-table-column>
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="tag" label="标签"></el-table-column>
              <el-table-column prop="create_time" label="创建时间"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="handleClickDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog tile="创建新镜像" :visible.sync="addImage">
            <el-form :model="form">
              <el-form-item label="上传方式">
                <el-radio-group v-model="form.uploadType">
                  <el-radio-button label="公共平台拉取"></el-radio-button>
                  <el-radio-button label="镜像上传"></el-radio-button>
                  <el-radio-button label="dockerfile上传"></el-radio-button>
                </el-radio-group>
              </el-form-item>      
              <el-form-item v-if="form.uploadType==='公共平台拉取'">
                <el-input v-model="form.imageName" placeholder="镜像名称"/>
                <el-input v-model="form.imageVersion" placeholder="镜像版本"/>
              </el-form-item>
              <el-form-item v-if="form.uploadType==='镜像上传'">
                <el-input v-model="form.uploadURL" placeholder="URL"/>
              </el-form-item>
              <!-- <el-form-item v-if="form.uploadType==='dockerfile上传'">
                <el-upload
                  ref="upload"
                  :http-request="upload"
                  :show-file-list="true"
                  action="http"
                  :before-upload="beforeAvatarUpload"
                  :auto-upload="true"
                  :on-success="handleAvatarSuccess"
                  class="upload-demo"
                  drag
                  name="file"
                  multiple>
                  <i class="el-icon-upload"/>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <div slot="tip" class="el-upload__tip">只能上传jar文件，且不超过2MB</div>
                </el-upload>
              </el-form-item> -->
              <el-form-item>
                <el-button type="primary" @click="onSubmit">创建</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "ImageView",
  data() {
    return {
      tableData: {},
      addImage: false,
      form: {
        uploadType: '公共平台拉取',
        imageName: '',
        imageVersion: '',
        uploadURL: '',
      }
    }
  },
  methods: {
    getImageList() {
      this.$axios.get(`${this.$baseURL}/api/v1/images/list`)
      .then(
        res => {
          this.tableData = res.data
        }
      )
    },
    handleClickDelete(row) {
      console.log(row.id)
      const jsonData = {'image_id': row.id}
      this.$axios.post(`${this.$baseURL}/api/v1/images/remove`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res)
          if (res.data.code == 200){
            this.$message('删除成功')
            this.$router.go(0)
          }
        }
      )
    },
    cancel() {
      this.addImage = false
    },
    upload(file) {
      const formData = new FormData()
      formData.append('files[]', file.file)
      formData.append('id', 1)
      formData.append('Content-Type', 'multipart/form-data')
      this.$axios.post("your URL",formData).then( res => {
            console.log(res)
            this.handleAvatarSuccess(res.data)
        }).catch( res => {
            console.log(res)
        })
    },
    beforeAvatarUpload(file) {
      const isJPG = file.name.slice(-4) === '.jar'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message({
          message: '上传文件只能是 JAR 格式',
          type: 'error'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 2MB',
          type: 'error'
        })
      }
      return isJPG && isLt2M
    },
    handleAvatarSuccess() {
      this.$message('上传成功')
    },
    onSubmit() {
      if (this.form.uploadType === '公共平台拉取') {
        const jsonData = {
          "repository": this.form.imageName,
          "tag": this.form.imageVersion
        }
        this.$axios.post(`${this.$baseURL}/api/v1/images/pull`, jsonData, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(
          res => {
            console.log(res)
            this.addImage = false
            this.$router.go(0)
          }
        )
      }
    }
  },
  mounted() {
    this.getImageList()
  }
}
</script>
