<template>
  <div>
    <el-container>
      <el-header>
        服务管理
      </el-header>
      <el-main>
        <el-card>
          <div slot="header">
            <span>服务列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addDeployment=true">
              创建新服务
            </el-button>
          </div>
          <div>
            <el-table :data="tableData" width="50%">
              <el-table-column prop="namespace" label="命名空间" width="180"></el-table-column>
              <el-table-column prop="name" label="名称" width="180"></el-table-column>
              <el-table-column prop="type" label="类型"></el-table-column>
              <el-table-column prop="selector" label="选择器"></el-table-column>
              <el-table-column prop="port" label="端口号"></el-table-column>
              <el-table-column prop="target_port" label="目标端口号"></el-table-column>
              <el-table-column prop="node_port" label="访问端口号"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-button type="text" @click="handleClickDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              <el-table-column>
                <el-button type="text" @click="modify=true">修改</el-button>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog tile="创建新服务" :visible.sync="addDeployment">
            <el-form :model="form">
              <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="名称"/>
              </el-form-item>
              <el-form-item label="使用的pod">
                <el-input v-model="form.pod" placeholder="副本数量"/>
              </el-form-item>
              <el-form-item label="目标端口">
                <el-input v-model="form.target_port" placeholder="镜像名称"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="createService">创建</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
          <el-dialog tile="修改服务" :visible.sync="modify">
            <el-form :model="m_form">
              <el-form-item label="名称">
                <el-input v-model="m_form.name" placeholder="名称"/>
              </el-form-item>
              <el-form-item label="使用的pod">
                <el-input v-model="m_form.pod" placeholder="副本数量"/>
              </el-form-item>
              <el-form-item label="目标端口">
                <el-input v-model="m_form.target_port" placeholder="镜像名称"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="changeService">修改</el-button>
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
        pod: '',
        target_port: 0
      },
      m_form: {
        name: '',
        pod: '',
        target_port: 0
      },
      inputArray: [],
    }
  },
  methods: {
    getServiceList() {
      this.$axios.get(`${this.$baseURL}/api/v1/services/list`)
      .then(
        res => {
          console.log(res.data)
          this.tableData = []
          for (let idx in res.data) {
            let item = res.data[idx]
            console.log(item)
            let table = {
              namespace: '',
              name: '',
              type: '',
              port: 0,
              target_port: 0,
              node_port: 0,
              selector: ''
            }
            table.namespace = item.namespace
            table.name = item.name
            table.type = item.type
            table.port = item.port
            table.target_port = item.target_port
            table.node_port = '10.251.255.227:' + item.node_port
            let label = ''
            for (const key in item.selector)
                label += `${key}: ${item.selector[key]}\n`
            table.selector = label
            this.tableData.push(table)
          }
        }
      )
    },
    handleClickDelete(row) {
      console.log(row.name)
      const jsonData = {'name': row.name}
      this.$axios.post(`${this.$baseURL}/api/v1/services/delete`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res.data)
          this.$message('删除成功')
          setTimeout(() => this.$router.go(0), 1000)
        }
      )
    },
    cancel() {
      this.addDeployment = false
    },
    createService() {
      const jsonData = {
        "name": this.form.name,
        "pod": this.form.pod,
        "target_port": parseInt(this.form.target_port),
      }
      console.log(jsonData)
      this.$axios.post(`${this.$baseURL}/api/v1/services/create`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          if (res.code == 500) {
            this.$message.error('名称重复！')
          } else {
            console.log(res.data)
            this.$message('创建成功')
            this.addDeployment = false
          }
        }
      )
    },
    changeService() {
      const jsonData = {
        "name": this.m_form.name,
        "pod": this.m_form.pod == '' ? null : this.m_form.replicas,
        "target_port": this.m_form.target_port == 0 ? null : parseInt(this.m_form.target_port),
      }
      console.log(jsonData)
      this.$axios.post(`${this.$baseURL}/api/v1/services/update`, jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(
        res => {
          console.log(res.data)
          this.$message('修改成功')
          this.$router.go(0)
        }
      )
    }
  },
  mounted() {
    this.getServiceList()
  }
}
</script>
