<template>
    <div class="app-container">
      <div class="filter-container" style="margin-bottom:20px;">
        <el-input v-model="listQuery.name" placeholder="名字" style="width: 200px;margin-right: 10px;;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
      </div>
  
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"

      >
        <el-table-column label="ID" prop="id"  align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色值"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="排序"  align="center">
          <template slot-scope="{row}">
            <span>{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" class-name="status-col" width="100">
            <template slot-scope="{row}">
              <span>{{ row.status }}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
            <template slot-scope="{row}">
            <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="更新时间" width="150px" align="center">
            <template slot-scope="{row}">
            <span>{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
       
    
    <el-drawer
        :title="textMap[dialogStatus]"
        :visible.sync="drawer"
        style="overflow:auto;"
        >

        <el-form ref="dataForm"  :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          <el-form-item label="角色名字">
            <el-col :span="18">
                <el-input v-model="temp.name" />
            </el-col>
            
          </el-form-item>
          <el-form-item label="角色值">
            <el-col :span="18">
                <el-input v-model="temp.department" />
            </el-col>
          </el-form-item>
          <el-form-item label="状态">
            <el-col :span="18">
                <el-radio-group v-model="temp.status">
                    <el-radio-button label="启用"></el-radio-button>
                    <el-radio-button label="停用"></el-radio-button>
                </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="备注">
            <el-col :span="18">
                <el-input type="textarea" v-model="temp.remark" />
            </el-col>
          </el-form-item>
          <el-form-item label="权限配置">
            <tree
                :nodes="nodes"
                :setting = "setting"
                @onClick="onClick"
                @onCheck="onCheck"
                @onCreated="handleCreated"
                />
          </el-form-item>
          <el-form-item>
            <el-button @click="dialogFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
            确认
          </el-button>
          </el-form-item>
        </el-form>
       
      </el-drawer>
    </div>
  </template>
  
  <script>
  import { fetchList, createArticle, updateArticle } from '@/api/article'
  import waves from '@/directive/waves' // waves directive
  import { parseTime } from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import tree from "vue-giant-tree";

  export default {
    name: 'ComplexTable',
    components: { Pagination,tree },
    directives: { waves },
    filters: {

      parseTime(time, cFormat){
        return parseTime(time, cFormat)
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        drawer: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: '',
        },
        temp: {
          department_id: 1,
          department_name: '',
          role_id:0,
          role_name: '',
          name: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        nodes:[
            { id:1, pid:0, name:"随意勾选 1", open:true},
            { id:11, pid:1, name:"随意勾选 1-1", open:true},
            { id:111, pid:11, name:"随意勾选 1-1-1"},
            { id:112, pid:11, name:"随意勾选 1-1-2"},
            { id:12, pid:1, name:"随意勾选 1-2", open:true},
            { id:121, pid:12, name:"随意勾选 1-2-1"},
            { id:122, pid:12, name:"随意勾选 1-2-2"},
            { id:2, pid:0, name:"随意勾选 2", checked:true, open:true},
            { id:21, pid:2, name:"随意勾选 2-1"},
            { id:22, pid:2, name:"随意勾选 2-2", open:true},
            { id:221, pid:22, name:"随意勾选 2-2-1", checked:true},
            { id:222, pid:22, name:"随意勾选 2-2-2"},
            { id:23, pid:2, name:"随意勾选 2-3"}
        ],
        setting:{
            check: {
                enable: true
            },
            data: {
            simpleData: {
                    enable: true,
                    pIdKey: "pid"
                }
            },
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
  
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      resetTemp() {
        this.temp = {
          department_id: 1,
          department_name: '',
          role_id:0,
          role_name: '',
          name: '',
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.drawer = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createArticle(this.temp).then(() => {
              this.list.unshift(this.temp)
              this.drawer = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.drawer = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            updateArticle(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.drawer = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      },
      onClick(evt, treeId, treeNode) {

      },
      onCheck(evt, treeId, treeNode) {

      },
      handleCreated(ztreeObj) {

      }
    }
  }
  </script>
  <style lang="scss">
  .el-drawer__body{
    overflow: auto !important;
  }
  </style>