<template>
  <div class="disaster-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>灾情上报管理</span>
          <el-button type="primary" @click="handleReport">
            <el-icon><Plus /></el-icon>
            灾情上报
          </el-button>
        </div>
      </template>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="8">
          <el-statistic title="灾情记录" :value="records.length" suffix="条" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="受灾面积" :value="totalAffectedArea" suffix="亩" />
        </el-col>
        <el-col :span="8">
          <el-statistic title="预估损失" :value="totalLoss" suffix="万元" />
        </el-col>
      </el-row>

      <el-divider />

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="灾害类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable>
            <el-option label="倒春寒" value="frost" />
            <el-option label="春旱" value="drought" />
            <el-option label="病虫害" value="pest" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="searchForm.level" placeholder="全部等级" clearable>
            <el-option label="高风险" value="high" />
            <el-option label="中风险" value="medium" />
          </el-select>
        </el-form-item>
        <el-form-item label="处置状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option label="处置中" value="processing" />
            <el-option label="已完成" value="resolved" />
          </el-select>
        </el-form-item>
        <el-form-item label="区域">
          <el-input v-model="searchForm.keyword" placeholder="市县名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="filteredRecords" border style="width: 100%">
        <el-table-column prop="id" label="灾情编号" width="170" />
        <el-table-column prop="typeName" label="灾害类型" width="110" />
        <el-table-column label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ getLevelName(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发生区域" min-width="180">
          <template #default="{ row }">
            {{ row.region.name }} / {{ row.region.counties.join('、') }}
          </template>
        </el-table-column>
        <el-table-column prop="affectedArea" label="受灾面积(亩)" width="130" sortable />
        <el-table-column prop="disasterArea" label="成灾面积(亩)" width="130" sortable />
        <el-table-column label="预估损失" width="120">
          <template #default="{ row }">{{ formatMoney(row.estimatedLoss) }}万元</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'resolved' ? 'success' : 'warning'">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportTime" label="上报时间" width="170" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleDispatch(row)">调度</el-button>
            <el-button size="small" type="success" :disabled="row.status === 'resolved'" @click="handleResolve(row)">办结</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="灾情处置详情" width="860px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="灾情编号">{{ currentRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="灾害类型">{{ currentRecord.typeName }}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{ currentRecord.occurTime }}</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ currentRecord.reporter }}</el-descriptions-item>
        <el-descriptions-item label="受灾作物">{{ currentRecord.affectedCrops?.join('、') }}</el-descriptions-item>
        <el-descriptions-item label="处置状态">{{ getStatusName(currentRecord.status) }}</el-descriptions-item>
        <el-descriptions-item label="处置措施" :span="2">{{ currentRecord.measures }}</el-descriptions-item>
        <el-descriptions-item label="上报位置" :span="2">{{ currentRecord.location || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="上报图文" :span="2">
          <div class="report-media">
            <el-image
              v-for="image in currentRecord.images"
              :key="image"
              :src="image"
              fit="cover"
              class="report-image"
            />
            <span v-if="!currentRecord.images?.length">暂无图片</span>
          </div>
          <div class="report-text">{{ currentRecord.description || '暂无文字说明' }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider content-position="left">调度流程信息</el-divider>
      <el-timeline v-if="currentRecord.dispatchFlows?.length">
        <el-timeline-item
          v-for="flow in currentRecord.dispatchFlows"
          :key="flow.time + flow.action"
          :timestamp="flow.time"
          type="primary"
        >
          <div class="timeline-title">{{ flow.action }}</div>
          <div class="timeline-content">{{ flow.content }}</div>
          <el-tag size="small">{{ flow.department }}</el-tag>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无调度流程信息" />

      <el-divider content-position="left">处置流程</el-divider>
      <el-steps :active="currentRecord.status === 'resolved' ? 4 : 2" finish-status="success" align-center>
        <el-step title="灾情上报" />
        <el-step title="核实研判" />
        <el-step title="措施调度" />
        <el-step title="办结归档" />
      </el-steps>
    </el-dialog>

    <el-dialog v-model="formVisible" title="灾情上报" width="680px">
      <el-form :model="reportForm" label-width="100px">
        <el-form-item label="灾害类型">
          <el-select v-model="reportForm.typeName" placeholder="请选择灾害类型">
            <el-option label="倒春寒" value="倒春寒" />
            <el-option label="春旱" value="春旱" />
            <el-option label="病虫害" value="病虫害" />
          </el-select>
        </el-form-item>
        <el-form-item label="发生区域">
          <el-input v-model="reportForm.region" placeholder="请输入市县区域" />
        </el-form-item>
        <el-form-item label="受灾面积">
          <el-input-number v-model="reportForm.affectedArea" :min="0" :step="1000" />
        </el-form-item>
        <el-form-item label="上报位置">
          <el-input v-model="reportForm.location" placeholder="请输入灾情位置或经纬度" />
        </el-form-item>
        <el-form-item label="图文说明">
          <el-input v-model="reportForm.description" type="textarea" :rows="3" placeholder="请输入灾情现场文字说明" />
        </el-form-item>
        <el-form-item label="现场图片">
          <el-upload v-model:file-list="reportForm.images" action="#" list-type="picture-card" :auto-upload="false" :limit="3">
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="处置措施">
          <el-input v-model="reportForm.measures" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReport">提交上报</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="dispatchVisible" title="调度流程信息录入" width="640px">
      <el-form :model="dispatchForm" label-width="110px">
        <el-form-item label="灾情编号">
          <el-input v-model="dispatchForm.recordId" disabled />
        </el-form-item>
        <el-form-item label="调度部门">
          <el-input v-model="dispatchForm.department" placeholder="请输入调度部门" />
        </el-form-item>
        <el-form-item label="调度动作">
          <el-input v-model="dispatchForm.action" placeholder="如：物资调拨、专家派遣、现场核查" />
        </el-form-item>
        <el-form-item label="调度内容">
          <el-input v-model="dispatchForm.content" type="textarea" :rows="4" placeholder="请输入具体调度流程和处置要求" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dispatchVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDispatch">保存调度</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { disasterRecords } from '@/data/disasters'

function loadMobileDisasterReports() {
  try {
    return JSON.parse(localStorage.getItem('mobileDisasterReports') || '[]')
  } catch (error) {
    return []
  }
}

const records = ref([
  ...loadMobileDisasterReports(),
  ...disasterRecords.map(item => ({
    ...item,
    description: item.description || '现场作物出现倒伏、叶片受损情况，已组织农技人员核验。',
    location: item.location || `${item.region.name}${item.region.counties[0]}`,
    images: item.images || [
      'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=realistic%20agricultural%20disaster%20field%20inspection%2C%20damaged%20wheat%20crops%2C%20rural%20Anhui%20farmland%2C%20daylight%2C%20documentary%20photo&image_size=landscape_4_3'
    ],
    dispatchFlows: item.dispatchFlows || []
  }))
])

const detailVisible = ref(false)
const formVisible = ref(false)
const dispatchVisible = ref(false)
const currentRecord = ref({})

const searchForm = reactive({
  type: '',
  level: '',
  status: '',
  keyword: ''
})

const reportForm = reactive({
  typeName: '',
  region: '',
  affectedArea: 0,
  location: '',
  description: '',
  images: [],
  measures: ''
})

const dispatchForm = reactive({
  recordId: '',
  department: '',
  action: '',
  content: ''
})

const filteredRecords = computed(() => records.value.filter(item => {
  const keyword = searchForm.keyword.trim()
  return (!searchForm.type || item.type === searchForm.type) &&
    (!searchForm.level || item.level === searchForm.level) &&
    (!searchForm.status || item.status === searchForm.status) &&
    (!keyword || item.region.name.includes(keyword) || item.region.counties.some(county => county.includes(keyword)))
}))

const totalAffectedArea = computed(() => records.value.reduce((sum, item) => sum + item.affectedArea, 0))
const totalLoss = computed(() => Number((records.value.reduce((sum, item) => sum + item.estimatedLoss, 0) / 10000).toFixed(0)))

const getLevelType = level => level === 'high' ? 'danger' : 'warning'
const getLevelName = level => level === 'high' ? '高风险' : '中风险'
const getStatusName = status => status === 'resolved' ? '已完成' : '处置中'
const formatMoney = value => (value / 10000).toFixed(0)

const handleSearch = () => {
  ElMessage.success(`查询到 ${filteredRecords.value.length} 条灾情记录`)
}

const handleReset = () => {
  Object.assign(searchForm, { type: '', level: '', status: '', keyword: '' })
}

const handleView = row => {
  currentRecord.value = row
  detailVisible.value = true
}

const handleDispatch = row => {
  currentRecord.value = row
  Object.assign(dispatchForm, {
    recordId: row.id,
    department: '',
    action: '',
    content: ''
  })
  dispatchVisible.value = true
}

const handleSaveDispatch = () => {
  if (!dispatchForm.department) {
    ElMessage.warning('请输入调度部门')
    return
  }
  if (!dispatchForm.action) {
    ElMessage.warning('请输入调度动作')
    return
  }
  if (!dispatchForm.content) {
    ElMessage.warning('请输入调度内容')
    return
  }
  const record = records.value.find(item => item.id === dispatchForm.recordId)
  if (record) {
    record.dispatchFlows.push({
      department: dispatchForm.department,
      action: dispatchForm.action,
      content: dispatchForm.content,
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    })
  }
  dispatchVisible.value = false
  ElMessage.success(`${dispatchForm.recordId} 调度流程已保存`)
}

const handleResolve = row => {
  row.status = 'resolved'
  ElMessage.success(`${row.id} 已办结归档`)
}

const handleReport = () => {
  Object.assign(reportForm, { typeName: '', region: '', affectedArea: 0, location: '', description: '', images: [], measures: '' })
  formVisible.value = true
}

const handleSubmitReport = () => {
  if (!reportForm.typeName) {
    ElMessage.warning('请选择灾害类型')
    return
  }
  if (!reportForm.region) {
    ElMessage.warning('请输入发生区域')
    return
  }
  if (reportForm.affectedArea === 0) {
    ElMessage.warning('请输入受灾面积')
    return
  }
  const newRecord = {
    id: `DIS${Date.now()}`,
    type: reportForm.typeName === '春旱' ? 'drought' : reportForm.typeName === '倒春寒' ? 'frost' : 'pest',
    typeName: reportForm.typeName,
    level: reportForm.affectedArea >= 10000 ? 'high' : 'medium',
    region: { name: reportForm.region, counties: [reportForm.region] },
    affectedArea: reportForm.affectedArea,
    disasterArea: Math.round(reportForm.affectedArea * 0.6),
    estimatedLoss: reportForm.affectedArea * 120,
    status: 'processing',
    reportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
    occurTime: new Date().toISOString().split('T')[0],
    reporter: '县级上报员',
    affectedCrops: ['小麦'],
    measures: reportForm.measures,
    location: reportForm.location,
    description: reportForm.description,
    images: reportForm.images.map(file => file.url).filter(Boolean),
    dispatchFlows: []
  }
  records.value.unshift(newRecord)
  formVisible.value = false
  ElMessage.success('灾情信息已提交，等待县级核验')
}
</script>

<style scoped>
.disaster-manage {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-row {
  margin-bottom: 10px;
}

.search-form {
  margin-bottom: 16px;
}

.timeline-title {
  font-weight: 600;
  margin-bottom: 6px;
}

.timeline-content {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 8px;
}

.report-media {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.report-image {
  width: 120px;
  height: 90px;
  border-radius: 6px;
}

.report-text {
  color: #606266;
  line-height: 1.6;
}
</style>
