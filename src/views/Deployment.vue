<template>
  <div>
    <el-container>
      <el-header>
        工作负载管理
      </el-header>
      <el-main>
        <el-card>
          <div slot="header">
            <span>工作负载列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addDeployment=true">
              创建新负载
            </el-button>
          </div>
          <div>
            <el-table :data="tableData" width="50%">
              <el-table-column prop="namespace" label="命名空间" width="180"></el-table-column>
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="image_labels" label="标签"></el-table-column>
              <el-table-column prop="replicas" label="副本数"></el-table-column>
              <el-table-column prop="container_port" label="容器端口"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="handleClickDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <el-button type="text" @click="modify = true">修改</el-button>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog tile="创建新负载" :visible.sync="addDeployment">
            <el-form :model="form">
              <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="名称"/>
              </el-form-item>
              <el-form-item label="副本数量">
                <el-input-number v-model="form.replicas" placeholder="副本数量"/>
              </el-form-item>
              <el-form-item label="镜像名称">
                <el-input v-model="form.image" placeholder="镜像名称"/>
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="form.port" placeholder="端口"/>
              </el-form-item>
              <el-form-item label="环境变量">
                <el-input v-model="form.env" placeholder="环境变量"/>
              </el-form-item>
              <el-form-item label="添加标签">
                <el-button type="primary" @click="addItem">Add +</el-button>
              </el-form-item>
              <el-form-item label="标签">
                <div v-for="(input, index) in inputArray" :key="index">
                  <el-input v-model="form.tag[input].tagName" placeholder="标签名称"/>
                  <br>
                  <el-input v-model="form.tag[input].tagContent" placeholder="标签内容"/>
                  <br>
                  <el-button @click="removeItem(index)" type="danger">删除</el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="createDeployment">创建</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog tile="修改负载" :visible.sync="modify">
            <el-form :model="m_form">
              <el-form-item label="名称">
                <el-input v-model="m_form.name" placeholder="名称"/>
              </el-form-item>
              <el-form-item label="副本数量">
                <el-input-number v-model="m_form.replicas" placeholder="副本数量"/>
              </el-form-item>
              <el-form-item label="镜像名称">
                <el-input v-model="m_form.image" placeholder="镜像名称"/>
              </el-form-item>
              <el-form-item label="端口">
                <el-input v-model="m_form.port" placeholder="端口"/>
              </el-form-item>
              <el-form-item label="环境变量">
                <el-input v-model="m_form.env" placeholder="环境变量"/>
              </el-form-item>
              <el-form-item label="添加标签">
                <el-button type="primary" @click="m_addItem">Add +</el-button>
              </el-form-item>
              <el-form-item label="标签">
                <div v-for="(input, index) in m_inputArray" :key="index">
                  <el-input v-model="m_form.tag[input].tagName" placeholder="标签名称"/>
                  <br>
                  <el-input v-model="m_form.tag[input].tagContent" placeholder="标签内容"/>
                  <br>
                  <el-button @click="m_removeItem(index)" type="danger">删除</el-button>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changeDeployment">修改</el-button>
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
      addDeployment: false,
      modify: false,
      form: {
        name: '',
        replicas: 1,
        port: 80,
        image: '',
        env: '',
        tag: {}
      },
      m_form: {
        name: '',
        replicas: 0,
        image: '',
        port: 0,
        env: '',
        tag: {}
      },
      inputArray: [],
      m_inputArray: []
    }
  },
  methods: {
    addItem() {
      let curIndex = this.inputArray.length
      let inputName = `index_${curIndex}`
      this.$set(this.form.tag, inputName, {tagName: '', tagContent: ''})
      this.inputArray.push(inputName)
    },
    removeItem(index) {
      let removeInputName = this.inputArray.splice(index, 1)[0]
      delete this.form.tag[removeInputName]
    },
    m_addItem() {
      let curIndex = this.m_inputArray.length
      let inputName = `index_${curIndex}`
      this.$set(this.m_form.tag, inputName, {tagName: '', tagContent: ''})
      this.m_inputArray.push(inputName)
    },
    m_removeItem(index) {
      let removeInputName = this.m_inputArray.splice(index, 1)[0]
      delete this.m_form.tag[removeInputName]
    },
    getDeploymentList() {
      this.$axios.get(`${this.$baseURL}/api/v1/deployments/list`)
      .then(
        res => {
          this.tableData = []
          for (let idx in res.data) {
            let item = res.data[idx]
            let table = {
              namespace: '',
              name: '',
              replicas: 0,
              container_port: 0,
              image_labels: ''
            }
            table.namespace = item.namespace
            table.name = item.name
            table.replicas = item.replicas
            table.container_port = item.container_port
            let label = ''
            for (const key in item.image_labels)
                label += `${key}: ${item.image_labels[key]}\n`
            table.image_labels = label
            this.tableData.push(table)
          }
        }
      )
    },
    handleClickDelete(row) {
      console.log(row.name)
      const jsonData = {'name': row.name}
      this.$axios.post(`${this.$baseURL}/api/v1/deployments/delete`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res)
          this.$message('删除成功')
          setTimeout(() => this.$router.go(0), 1000)
        }
      )
    },
    cancel() {
      this.addDeployment = false
      this.modify = false
    },
    createDeployment() {
      let tagObject = {}
      for (const index in this.form.tag) {
        let {tagName, tagContent} = this.form.tag[index]
        tagObject[tagName] = tagContent
      }
      const jsonData = {
        "name": this.form.name,
        "replicas": this.form.replicas,
        "image": this.form.image,
        "container_port": parseInt(this.form.port),
        "environment_variables": JSON.parse(this.form.env),
        "labels": tagObject
      }
      console.log(jsonData)
      this.$axios.post(`${this.$baseURL}/api/v1/deployments/create`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res)
          this.$message('创建成功')
          this.addDeployment = false
          this.$router.go(0)
        }
      )
    },
    changeDeployment() {
      let tagObject = {}
      if (this.m_form.tag == '')
        tagObject = null
      else {
        for (const index in this.m_form.tag) {
          let {tagName, tagContent} = this.m_form.tag[index]
          tagObject[tagName] = tagContent
        }
      }
      const jsonData = {
        "name": this.m_form.name == '' ? null : this.m_form.name,
        "image": this.m_form.image == '' ? null : this.m_form.image,
        "replicas": this.m_form.replicas == 0 ? null : this.m_form.replicas,
        "container_port": this.m_form.port == 0 ? null : parseInt(this.m_form.port),
        "environment_variables": this.m_form.env == '' ? null : JSON.parse('{}'),
        "labels": tagObject
      }
      console.log(jsonData)
      this.$axios.post(`${this.$baseURL}/api/v1/deployments/update`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res.data)
          this.modify = false
          this.$router.go(0)
        }
      )
    }
  },
  mounted() {
    this.getDeploymentList()
  }
}
</script>
