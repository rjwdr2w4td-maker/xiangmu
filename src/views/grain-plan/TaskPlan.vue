<template>
  <div class="task-plan">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>种植计划制定</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增计划
          </el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="年度">
          <el-select v-model="searchForm.year" placeholder="请选择年度">
            <el-option label="2026年" value="2026" />
            <el-option label="2025年" value="2025" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="作物类型">
          <el-select v-model="searchForm.cropType" placeholder="请选择作物类型" clearable>
            <el-option label="小麦" value="wheat" />
            <el-option label="水稻" value="rice" />
            <el-option label="玉米" value="corn" />
            <el-option label="大豆" value="soybean" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="执行中" value="active" />
            <el-option label="待启动" value="pending" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredTasks" border style="width: 100%">
        <el-table-column prop="id" label="计划编号" width="150" />
        <el-table-column prop="year" label="年度" width="80" />
        <el-table-column prop="name" label="计划名称" min-width="200" />
        <el-table-column prop="cropType" label="作物类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCropName(row.cropType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalArea" label="总面积(万亩)" width="120" sortable>
          <template #default="{ row }">
            {{ (row.totalArea / 10000).toFixed(0) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ getStatusName(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看详情</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="!isPlanApproved(row)"
              @click="handleDecompose(row)"
            >
              任务分解
            </el-button>
            <el-button
              size="small"
              type="success"
              :disabled="!canSendTask(row)"
              @click="handleSend(row)"
            >
              下达
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="decomposeDialogVisible"
      :title="`任务分解 - ${decomposeDialogSubtitle}`"
      width="900px"
    >
      <el-form :model="decomposeForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划名称">
              <el-input v-model="decomposeForm.taskName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作物类型">
              <el-input v-model="decomposeForm.cropTypeName" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-alert
          :title="`当前登录层级：${getUserLevelName(currentUserLevel)}，当前分解对象：${decomposeTargetLabel}`"
          type="info"
          :closable="false"
          style="margin-bottom: 16px"
        />

        <el-divider content-position="left">{{ decomposeTargetLabel }}</el-divider>

        <el-table :data="decomposeForm.cities" border style="width: 100%">
          <el-table-column prop="name" :label="decomposeColumns[0].label" :min-width="decomposeColumns[0].minWidth" />
          <el-table-column v-if="currentUserLevel === 'county'" prop="type" :label="decomposeColumns[1].label" :min-width="decomposeColumns[1].minWidth" />
          <el-table-column :label="currentUserLevel === 'county' ? '承担面积(亩)' : '计划面积(亩)'">
            <template #default="{ row }">
              <el-input-number
                v-model="row.planArea"
                :min="0"
                :step="currentUserLevel === 'county' ? 50 : 10000"
                size="small"
                @change="updateTotalArea"
              />
            </template>
          </el-table-column>
          <el-table-column v-if="currentUserLevel === 'province'" label="承担主体类型">
            <template #default="{ row }">
              <el-checkbox-group v-model="row.undertakerTypes">
                <el-checkbox label="large_farmer">规模大户</el-checkbox>
                <el-checkbox label="family_farm">家庭农场</el-checkbox>
                <el-checkbox label="ordinary_farmer">普通农户</el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
          <el-table-column v-if="currentUserLevel === 'city'" prop="actualArea" label="已落实面积(亩)" />
        </el-table>

        <el-form-item label="总计面积" style="margin-top: 20px">
          <el-tag type="success" size="large">
            {{ formatArea(decomposeForm.totalArea) }} 万亩
          </el-tag>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="decomposeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDecompose">保存分解</el-button>
        <el-button type="success" @click="handleSubmitDecompose">提交审核</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDialogVisible"
      title="计划详情 - 数据钻取"
      width="1000px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="计划编号">{{ viewData.id }}</el-descriptions-item>
        <el-descriptions-item label="年度">{{ viewData.year }}年</el-descriptions-item>
        <el-descriptions-item label="计划名称">{{ viewData.name }}</el-descriptions-item>
        <el-descriptions-item label="作物类型">{{ getCropName(viewData.cropType) }}</el-descriptions-item>
        <el-descriptions-item label="总面积">{{ formatArea(viewData.totalArea) }}万亩</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ viewData.createTime }}</el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">市级任务分解详情（点击可钻取到县）</el-divider>

      <el-table :data="viewData.decomposition" border style="width: 100%">
        <el-table-column prop="name" label="市级名称" min-width="150" />
        <el-table-column prop="planArea" label="计划面积(亩)" min-width="150" sortable>
          <template #default="{ row }">
            {{ row.planArea }}
          </template>
        </el-table-column>
        <el-table-column prop="actualArea" label="已落实面积" min-width="150" sortable>
          <template #default="{ row }">
            {{ row.actualArea }}
          </template>
        </el-table-column>
        <el-table-column prop="progress" label="完成度" min-width="160" sortable>
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :color="getProgressColor(row.progress)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="handleDrillDownCity(row)">
              钻取县级数据
            </el-button>
            <el-button size="small" type="primary" @click="handleViewCitySubjects(row)">
              查看主体
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      v-model="countyDialogVisible"
      title="县级数据钻取 - 到户到田"
      width="800px"
    >
      <h4 style="margin-bottom: 15px">{{ countyData.cityName }} - 任务分解到县</h4>
      
      <el-table :data="countyData.counties" border style="width: 100%">
        <el-table-column prop="name" label="县级名称" min-width="150" />
        <el-table-column prop="planArea" label="计划面积(亩)" min-width="150" sortable />
        <el-table-column prop="actualArea" label="已落实面积" min-width="150" sortable />
        <el-table-column prop="progress" label="完成度" min-width="160" sortable>
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :color="getProgressColor(row.progress)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleViewFarmers(row)">
              查看种植主体(到户)
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog
      v-model="subjectDialogVisible"
      title="种植主体演示列表"
      width="760px"
    >
      <el-alert
        :title="subjectDialogTitle"
        type="success"
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-table :data="subjectData" border style="width: 100%">
        <el-table-column prop="name" label="主体名称" min-width="180" />
        <el-table-column prop="type" label="主体类型" min-width="140" />
        <el-table-column prop="area" label="落实面积(亩)" min-width="130" />
        <el-table-column prop="plotCount" label="地块数" min-width="100" />
        <el-table-column prop="contact" label="联系人" min-width="130" />
      </el-table>
    </el-dialog>

    <el-dialog v-model="addDialogVisible" title="新增种植计划" width="600px">
      <el-form :model="addForm" label-width="100px" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="年度" prop="year">
          <el-date-picker
            v-model="addForm.year"
            type="year"
            placeholder="选择年度"
            value-format="YYYY"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="作物类型" prop="cropType">
          <el-select v-model="addForm.cropType" placeholder="请选择作物类型" style="width: 100%">
            <el-option label="小麦" value="wheat" />
            <el-option label="水稻" value="rice" />
            <el-option label="玉米" value="corn" />
            <el-option label="大豆" value="soybean" />
            <el-option label="油菜" value="rapeseed" />
          </el-select>
        </el-form-item>
        <el-form-item label="总面积(亩)" prop="totalArea">
          <el-input-number v-model="addForm.totalArea" :min="0" :step="10000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAdd">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { plantingTasks } from '@/data/tasks'
import { useUserStore } from '@/stores/user'
import { administrativeDivisions } from '@/data/basic'

const userStore = useUserStore()

const searchForm = reactive({
  year: '2026',
  cropType: '',
  status: ''
})

const tasks = ref([...plantingTasks])

const decomposeDialogVisible = ref(false)
const viewDialogVisible = ref(false)
const countyDialogVisible = ref(false)
const subjectDialogVisible = ref(false)

const decomposeForm = reactive({
  taskId: '',
  taskName: '',
  cropTypeName: '',
  totalArea: 0,
  cities: []
})

const viewData = ref({})
const countyData = ref({})
const subjectDialogTitle = ref('')
const subjectData = ref([])

const addDialogVisible = ref(false)
const addFormRef = ref(null)
const addForm = ref({
  name: '',
  year: new Date().getFullYear().toString(),
  cropType: '',
  totalArea: 0,
  remark: ''
})
const addFormRules = {
  name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  year: [{ required: true, message: '请选择年度', trigger: 'change' }],
  cropType: [{ required: true, message: '请选择作物类型', trigger: 'change' }],
  totalArea: [{ required: true, message: '请输入总面积', trigger: 'blur' }]
}

const filteredTasks = computed(() => {
  let result = tasks.value
  
  if (searchForm.year) {
    result = result.filter(t => t.year === parseInt(searchForm.year))
  }
  if (searchForm.cropType) {
    result = result.filter(t => t.cropType === searchForm.cropType)
  }
  if (searchForm.status) {
    result = result.filter(t => t.status === searchForm.status)
  }
  
  return result
})

const getCropName = (cropType) => {
  const map = {
    wheat: '小麦',
    rice: '水稻',
    corn: '玉米',
    soybean: '大豆'
  }
  return map[cropType] || cropType
}

const getStatusName = (status) => {
  const map = {
    pending_audit: '待审核',
    approved: '审核通过',
    active: '执行中',
    pending: '待启动',
    completed: '已完成'
  }
  return map[status] || status
}

const getStatusTag = (status) => {
  const map = {
    pending_audit: 'warning',
    approved: 'success',
    active: 'success',
    pending: 'warning',
    completed: 'info'
  }
  return map[status] || ''
}

const isPlanApproved = (row) => ['approved', 'pending', 'active', 'completed'].includes(row.status)

const canSendTask = (row) => isPlanApproved(row) && row.decomposition?.length > 0 && row.status !== 'active' && row.status !== 'completed'

const formatArea = (area) => {
  return (area / 10000).toFixed(0)
}

const getProgressColor = (progress) => {
  if (progress >= 95) return '#67C23A'
  if (progress >= 80) return '#409EFF'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const currentUserLevel = ref(localStorage.getItem('userLevel') || userStore.userLevel || 'province')

const refreshCurrentUserLevel = () => {
  currentUserLevel.value = localStorage.getItem('userLevel') || userStore.userLevel || 'province'
}

const getUserLevelName = (level) => {
  const map = {
    province: '省级用户',
    city: '市级用户',
    county: '县级用户',
    town: '乡镇用户',
    farmer: '种植主体'
  }
  return map[level] || '未设置'
}

const decomposeTargetLabel = computed(() => {
  if (currentUserLevel.value === 'city') return '乡镇分解'
  if (currentUserLevel.value === 'county') return '农户主体分解'
  return '市级任务分解'
})

const decomposeDialogSubtitle = computed(() => {
  if (currentUserLevel.value === 'city') return '市级任务分解 - 选择乡镇'
  if (currentUserLevel.value === 'county') return '县级任务分解 - 选择农户主体'
  return '省级对16市分解'
})

const decomposeColumns = computed(() => {
  if (currentUserLevel.value === 'city') {
    return [{ prop: 'name', label: '乡镇名称', minWidth: 150 }, { prop: 'planArea', label: '计划面积(亩)', minWidth: 200, slot: true }, { prop: 'actualArea', label: '已落实面积(亩)', minWidth: 150 }]
  }
  if (currentUserLevel.value === 'county') {
    return [{ prop: 'name', label: '主体名称', minWidth: 180 }, { prop: 'type', label: '主体类型', minWidth: 140 }, { prop: 'planArea', label: '承担面积(亩)', minWidth: 200, slot: true }]
  }
  return [{ prop: 'name', label: '市级名称', minWidth: 150 }, { prop: 'planArea', label: '计划面积(亩)', minWidth: 200, slot: true }, { prop: 'undertakerTypes', label: '承担主体类型', minWidth: 280 }]
})

const handleSearch = () => {
  ElMessage.success(`已查询到${filteredTasks.value.length}条种植计划`)
}

const handleAdd = () => {
  addForm.value = {
    name: '',
    year: new Date().getFullYear().toString(),
    cropType: '',
    totalArea: 0,
    remark: ''
  }
  addDialogVisible.value = true
}

const handleSaveAdd = async () => {
  if (!addFormRef.value) return
  
  await addFormRef.value.validate((valid) => {
    if (valid) {
      const newTask = {
        id: 'TASK' + Date.now(),
        year: parseInt(addForm.value.year),
        name: addForm.value.name,
        cropType: addForm.value.cropType,
        totalArea: addForm.value.totalArea,
        status: 'pending_audit',
        createTime: new Date().toISOString().split('T')[0],
        decomposition: [],
        remark: addForm.value.remark
      }
      tasks.value.unshift(newTask)
      addDialogVisible.value = false
      ElMessage.success('新增计划成功')
    }
  })
}

const handleView = (row) => {
  viewData.value = row
  viewDialogVisible.value = true
}

const handleDecompose = (row) => {
  refreshCurrentUserLevel()

  if (!isPlanApproved(row)) {
    ElMessage.warning('计划审核通过后才可以进行任务分解')
    return
  }

  decomposeForm.taskId = row.id
  decomposeForm.taskName = row.name
  decomposeForm.cropTypeName = getCropName(row.cropType)
  decomposeForm.totalArea = row.decomposition?.reduce((sum, city) => sum + city.planArea, 0) || 0
  
  if (currentUserLevel.value === 'city') {
    decomposeForm.cities = buildTownOptions(row.decomposition || [])
  } else if (currentUserLevel.value === 'county') {
    decomposeForm.cities = buildFarmerOptions(row.decomposition || [])
  } else {
    decomposeForm.cities = row.decomposition?.length ? row.decomposition.map(city => ({
      ...city,
      undertakerTypes: city.undertakerTypes || []
    })) : [
      { code: '340100', name: '合肥市', planArea: 0, undertakerTypes: [] },
      { code: '340200', name: '芜湖市', planArea: 0, undertakerTypes: [] },
      { code: '340300', name: '蚌埠市', planArea: 0, undertakerTypes: [] },
      { code: '340400', name: '淮南市', planArea: 0, undertakerTypes: [] },
      { code: '340500', name: '马鞍山市', planArea: 0, undertakerTypes: [] }
    ]
  }
  
  decomposeDialogVisible.value = true
}

const buildTownOptions = (decomposition) => {
  const userCityCode = userStore.userLevel === 'city' ? '340100' : null
  const cityDivision = administrativeDivisions[0]?.children?.find(city => city.code === userCityCode) || administrativeDivisions[0]?.children?.[0]
  const townList = (cityDivision?.children || []).map(county => ({
    code: county.code,
    name: county.name,
    planArea: 0,
    actualArea: 0,
    type: 'town'
  }))
  return townList.length > 0 ? townList : [
    { code: '340102', name: '瑶海区', planArea: 0, actualArea: 0, type: 'town' },
    { code: '340103', name: '庐阳区', planArea: 0, actualArea: 0, type: 'town' },
    { code: '340104', name: '蜀山区', planArea: 0, actualArea: 0, type: 'town' },
    { code: '340111', name: '包河区', planArea: 0, actualArea: 0, type: 'town' },
    { code: '340121', name: '长丰县', planArea: 0, actualArea: 0, type: 'town' },
    { code: '340122', name: '肥东县', planArea: 0, actualArea: 0, type: 'town' }
  ]
}

const buildFarmerOptions = (decomposition) => {
  const subjects = [
    { code: 'SUBJ001', name: '张明家庭农场', type: '家庭农场', planArea: 0 },
    { code: 'SUBJ002', name: '李华种植专业合作社', type: '合作社', planArea: 0 },
    { code: 'SUBJ003', name: '王强规模种植大户', type: '规模大户', planArea: 0 },
    { code: 'SUBJ004', name: '赵强家庭农场', type: '家庭农场', planArea: 0 },
    { code: 'SUBJ005', name: '陈明种植大户', type: '规模大户', planArea: 0 }
  ]
  return subjects
}

const updateTotalArea = () => {
  decomposeForm.totalArea = decomposeForm.cities.reduce((sum, city) => sum + city.planArea, 0)
}

const handleSaveDecompose = () => {
  const task = tasks.value.find(item => item.id === decomposeForm.taskId)
  if (task) {
    task.decomposition = decomposeForm.cities.map(city => ({
      ...city,
      actualArea: city.actualArea || 0,
      progress: city.progress || 0,
      counties: city.counties || []
    }))
  }
  ElMessage.success('任务分解已保存')
  decomposeDialogVisible.value = false
}

const handleSubmitDecompose = () => {
  const task = tasks.value.find(item => item.id === decomposeForm.taskId)
  if (task) {
    task.decomposition = decomposeForm.cities.map(city => ({
      ...city,
      actualArea: city.actualArea || 0,
      progress: city.progress || 0,
      counties: city.counties || []
    }))
    task.status = 'pending'
  }
  ElMessage.success('任务分解已提交，可进行下达')
  decomposeDialogVisible.value = false
}

const handleSend = (row) => {
  if (!isPlanApproved(row)) {
    ElMessage.warning('计划审核通过后才可以下达')
    return
  }
  if (!row.decomposition?.length) {
    ElMessage.warning('请先完成任务分解')
    return
  }
  row.status = 'active'
  ElMessage.success(`计划"${row.name}"已下达至各市`)
}

const handleDrillDownCity = (row) => {
  countyData.value = {
    cityName: row.name,
    counties: row.counties || []
  }
  countyDialogVisible.value = true
}

const handleViewFarmers = (row) => {
  subjectDialogTitle.value = `${row.name}种植主体到户列表`
  subjectData.value = buildSubjectData(row.name, row.actualArea || row.planArea)
  subjectDialogVisible.value = true
}

const handleViewCitySubjects = (row) => {
  subjectDialogTitle.value = `${row.name}种植主体落实情况`
  subjectData.value = buildSubjectData(row.name, row.actualArea || row.planArea)
  subjectDialogVisible.value = true
}

const buildSubjectData = (regionName, area = 0) => {
  const baseArea = Math.max(Math.round(area / 3), 1)
  return [
    { name: `${regionName}丰粮家庭农场`, type: '家庭农场', area: baseArea, plotCount: 3, contact: '张明' },
    { name: `${regionName}惠农合作社`, type: '合作社', area: baseArea + 120, plotCount: 5, contact: '李华' },
    { name: `${regionName}王强种植大户`, type: '规模大户', area: Math.max(area - baseArea * 2 - 120, 1), plotCount: 2, contact: '王强' }
  ]
}
</script>

<style scoped>
.task-plan {
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
  color: #333;
  font-size: 16px;
}
</style>