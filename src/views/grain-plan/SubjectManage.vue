<template>
  <div class="subject-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>种植主体管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增主体
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="主体类型">
          <el-select v-model="searchForm.type" placeholder="全部" clearable>
            <el-option label="规模种植大户" value="large_farmer" />
            <el-option label="家庭农场" value="family_farm" />
            <el-option label="农民专业合作社" value="cooperative" />
            <el-option label="普通农户" value="ordinary_farmer" />
            <el-option label="农业企业" value="enterprise" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="主体名称">
          <el-input v-model="searchForm.name" placeholder="请输入主体名称" clearable />
        </el-form-item>
        
        <el-form-item label="所属地区">
          <el-input v-model="searchForm.region" placeholder="请输入地区" clearable />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredSubjects" border style="width: 100%">
        <el-table-column prop="id" label="主体编号" width="120" />
        <el-table-column prop="name" label="主体名称" width="200" />
        <el-table-column prop="type" label="主体类型" width="150">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">
              {{ getTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="负责人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column prop="totalArea" label="种植面积(亩)" width="120" sortable />
        <el-table-column prop="address" label="地址" min-width="200" />
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="filteredSubjects.length"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; justify-content: flex-end"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      @close="handleDialogClose"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主体名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入主体名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主体类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择主体类型">
                <el-option label="规模种植大户" value="large_farmer" />
                <el-option label="家庭农场" value="family_farm" />
                <el-option label="农民专业合作社" value="cooperative" />
                <el-option label="普通农户" value="ordinary_farmer" />
                <el-option label="农业企业" value="enterprise" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="owner">
              <el-input v-model="formData.owner" placeholder="请输入负责人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="formData.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="种植面积" prop="totalArea">
              <el-input-number v-model="formData.totalArea" :min="0" placeholder="请输入种植面积" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入详细地址" />
        </el-form-item>

        <el-form-item label="地块信息">
          <el-button type="primary" size="small" @click="handleAddPlot">
            <el-icon><Plus /></el-icon>
            添加地块
          </el-button>
          <el-table :data="formData.plots" border style="width: 100%; margin-top: 10px">
            <el-table-column prop="plotId" label="地块编号" min-width="160" />
            <el-table-column prop="area" label="面积(亩)" min-width="120" />
            <el-table-column prop="cropType" label="作物类型" min-width="180">
              <template #default="{ row }">
                <el-select v-model="row.cropType" size="small">
                  <el-option label="小麦" value="wheat" />
                  <el-option label="水稻" value="rice" />
                  <el-option label="玉米" value="corn" />
                  <el-option label="大豆" value="soybean" />
                  <el-option label="油菜" value="rapeseed" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row, $index }">
                <el-button size="small" type="danger" @click="handleDeletePlot($index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="主体详情"
      width="900px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="主体编号">{{ viewData.id }}</el-descriptions-item>
        <el-descriptions-item label="主体名称">{{ viewData.name }}</el-descriptions-item>
        <el-descriptions-item label="主体类型">{{ getTypeName(viewData.type) }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ viewData.owner }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ viewData.phone }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ viewData.idCard }}</el-descriptions-item>
        <el-descriptions-item label="种植面积">{{ viewData.totalArea }}亩</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createTime }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ viewData.address }}</el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px">
        <h4>地块信息（到田数据钻取展示）</h4>
        <el-table :data="viewData.plots" border style="width: 100%">
          <el-table-column prop="plotId" label="地块编号" min-width="140" />
          <el-table-column prop="area" label="面积(亩)" min-width="100" />
          <el-table-column prop="cropType" label="作物类型" min-width="120">
            <template #default="{ row }">
              {{ getCropName(row.cropType) }}
            </template>
          </el-table-column>
          <el-table-column label="地理位置" min-width="180">
            <template #default="{ row }">
              <el-tag type="info" size="small">
                {{ row.location[0] }}°, {{ row.location[1] }}°
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="{ row }">
              <el-button size="small" type="primary" @click="handleViewPlot(row)">
                查看地图
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog
      v-model="mapDialogVisible"
      title="地块地图定位"
      width="620px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="地块编号">{{ mapPlot.plotId }}</el-descriptions-item>
        <el-descriptions-item label="作物类型">{{ getCropName(mapPlot.cropType) }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ mapPlot.area }}亩</el-descriptions-item>
        <el-descriptions-item label="经纬度">{{ mapPlot.location?.[0] }}°E, {{ mapPlot.location?.[1] }}°N</el-descriptions-item>
      </el-descriptions>
      <div class="map-preview">
        <el-icon :size="42"><Location /></el-icon>
        <div>{{ mapPlot.plotId }} 地块位置演示</div>
        <el-tag type="success" style="margin-top: 8px">已定位到地图中心</el-tag>
      </div>
    </el-dialog>

    <el-dialog v-model="plotDialogVisible" title="添加地块" width="500px">
      <el-form :model="plotForm" label-width="100px">
        <el-form-item label="地块编号" required>
          <el-input v-model="plotForm.plotId" placeholder="请输入地块编号" />
        </el-form-item>
        <el-form-item label="面积(亩)" required>
          <el-input-number v-model="plotForm.area" :min="0" :step="10" style="width: 100%" />
        </el-form-item>
        <el-form-item label="作物类型" required>
          <el-select v-model="plotForm.cropType" placeholder="请选择作物类型" style="width: 100%">
            <el-option label="小麦" value="wheat" />
            <el-option label="水稻" value="rice" />
            <el-option label="玉米" value="corn" />
            <el-option label="大豆" value="soybean" />
            <el-option label="油菜" value="rapeseed" />
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input-number v-model="plotForm.location[0]" :precision="6" :step="0.001" style="width: 100%" />
        </el-form-item>
        <el-form-item label="纬度">
          <el-input-number v-model="plotForm.location[1]" :precision="6" :step="0.001" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="plotDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSavePlot">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { plantingSubjects, subjectTypes } from '@/data/subjects'

const searchForm = reactive({
  type: '',
  name: '',
  region: ''
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const viewDialogVisible = ref(false)
const mapDialogVisible = ref(false)
const plotDialogVisible = ref(false)
const formRef = ref(null)
const plotForm = ref({
  plotId: '',
  area: 0,
  cropType: '',
  location: [117.27, 31.86]
})

const subjects = ref([...plantingSubjects])

const formData = reactive({
  id: '',
  name: '',
  type: '',
  owner: '',
  phone: '',
  idCard: '',
  totalArea: 0,
  address: '',
  plots: []
})

const viewData = ref({})
const mapPlot = ref({})

const rules = {
  name: [{ required: true, message: '请输入主体名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择主体类型', trigger: 'change' }],
  owner: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  totalArea: [{ required: true, message: '请输入种植面积', trigger: 'blur' }]
}

const filteredSubjects = computed(() => {
  let result = subjects.value
  
  if (searchForm.type) {
    result = result.filter(s => s.type === searchForm.type)
  }
  if (searchForm.name) {
    result = result.filter(s => s.name.includes(searchForm.name))
  }
  if (searchForm.region) {
    result = result.filter(s => s.address.includes(searchForm.region))
  }
  
  return result
})

const getTypeName = (type) => {
  const map = {
    large_farmer: '规模种植大户',
    family_farm: '家庭农场',
    cooperative: '农民专业合作社',
    ordinary_farmer: '普通农户',
    enterprise: '农业企业'
  }
  return map[type] || type
}

const getTypeTag = (type) => {
  const map = {
    large_farmer: 'success',
    family_farm: 'primary',
    cooperative: 'warning',
    ordinary_farmer: 'info',
    enterprise: 'danger'
  }
  return map[type] || ''
}

const getCropName = (cropType) => {
  const map = {
    wheat: '小麦',
    rice: '水稻',
    corn: '玉米',
    soybean: '大豆',
    rapeseed: '油菜'
  }
  return map[cropType] || cropType
}

const handleSearch = () => {
  pagination.currentPage = 1
}

const handleReset = () => {
  searchForm.type = ''
  searchForm.name = ''
  searchForm.region = ''
}

const handleAdd = () => {
  dialogTitle.value = '新增种植主体'
  resetFormData()
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑种植主体'
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleView = (row) => {
  viewData.value = row
  viewDialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除主体"${row.name}"吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    const index = subjects.value.findIndex(s => s.id === row.id)
    if (index !== -1) {
      subjects.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

const handleAddPlot = () => {
  plotForm.value = {
    plotId: 'PLOT' + Date.now(),
    area: 0,
    cropType: '',
    location: [117.27, 31.86]
  }
  plotDialogVisible.value = true
}

const handleSavePlot = () => {
  if (!plotForm.value.plotId) {
    ElMessage.warning('请输入地块编号')
    return
  }
  if (plotForm.value.area === 0) {
    ElMessage.warning('请输入地块面积')
    return
  }
  if (!plotForm.value.cropType) {
    ElMessage.warning('请选择作物类型')
    return
  }
  formData.plots.push({
    plotId: plotForm.value.plotId,
    area: plotForm.value.area,
    cropType: plotForm.value.cropType,
    location: plotForm.value.location
  })
  plotDialogVisible.value = false
  ElMessage.success('地块添加成功')
}

const handleDeletePlot = (index) => {
  formData.plots.splice(index, 1)
}

const handleViewPlot = (row) => {
  mapPlot.value = row
  mapDialogVisible.value = true
  ElMessage.success(`已定位地块${row.plotId}`)
}

const resetFormData = () => {
  formData.id = 'SUBJ' + Date.now()
  formData.name = ''
  formData.type = ''
  formData.owner = ''
  formData.phone = ''
  formData.idCard = ''
  formData.totalArea = 0
  formData.address = ''
  formData.plots = []
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

const handleSave = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogTitle.value === '新增种植主体') {
        formData.createTime = new Date().toISOString().split('T')[0]
        subjects.value.unshift({ ...formData })
        ElMessage.success('新增成功')
      } else {
        const index = subjects.value.findIndex(s => s.id === formData.id)
        if (index !== -1) {
          subjects.value[index] = { ...formData }
          ElMessage.success('编辑成功')
        }
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.subject-manage {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

h4 {
  margin: 10px 0;
  color: #333;
  font-size: 16px;
}
</style>