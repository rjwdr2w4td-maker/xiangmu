<template>
  <div class="disaster-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>防灾减灾管理</span>
          <el-button type="primary" @click="handleReport">
            <el-icon><Plus /></el-icon>
            灾情上报
          </el-button>
        </div>
      </template>

      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-statistic title="灾情记录" :value="records.length" suffix="条" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="受灾面积" :value="totalAffectedArea" suffix="亩" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="预估损失" :value="totalLoss" suffix="万元" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="预警信息" :value="weatherWarnings.length" suffix="条" />
        </el-col>
      </el-row>

      <el-divider />

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="灾害类型">
          <el-select v-model="searchForm.type" placeholder="全部类型" clearable>
            <el-option label="倒春寒" value="frost" />
            <el-option label="春旱" value="drought" />
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

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>气象灾害预警</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="warning in weatherWarnings"
              :key="warning.id"
              :timestamp="warning.issueTime"
              :type="getWarningType(warning.level)"
            >
              <div class="timeline-title">{{ warning.title }}</div>
              <div class="timeline-content">{{ warning.content }}</div>
              <div class="tag-list">
                <el-tag v-for="region in warning.affectRegion" :key="region" size="small">{{ region }}</el-tag>
              </div>
              <el-button link type="primary" @click="handleWarning(warning)">查看防范建议</el-button>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>农事指导建议</span>
          </template>
          <el-table :data="agriculturalAdvices" border style="width: 100%">
            <el-table-column prop="region" label="区域" width="90" />
            <el-table-column prop="growthStage" label="生育期" width="100" />
            <el-table-column prop="weather" label="天气" min-width="160" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button size="small" @click="handleAdvice(row)">下发</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailVisible" title="灾情处置详情" width="760px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="灾情编号">{{ currentRecord.id }}</el-descriptions-item>
        <el-descriptions-item label="灾害类型">{{ currentRecord.typeName }}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{ currentRecord.occurTime }}</el-descriptions-item>
        <el-descriptions-item label="上报人">{{ currentRecord.reporter }}</el-descriptions-item>
        <el-descriptions-item label="受灾作物">{{ currentRecord.affectedCrops?.join('、') }}</el-descriptions-item>
        <el-descriptions-item label="处置状态">{{ getStatusName(currentRecord.status) }}</el-descriptions-item>
        <el-descriptions-item label="处置措施" :span="2">{{ currentRecord.measures }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">处置流程</el-divider>
      <el-steps :active="currentRecord.status === 'resolved' ? 4 : 2" finish-status="success" align-center>
        <el-step title="灾情上报" />
        <el-step title="核实研判" />
        <el-step title="措施调度" />
        <el-step title="办结归档" />
      </el-steps>
    </el-dialog>

    <el-dialog v-model="formVisible" title="灾情上报" width="620px">
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
        <el-form-item label="处置措施">
          <el-input v-model="reportForm.measures" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReport">提交上报</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="suggestVisible" :title="suggestTitle" width="640px">
      <el-alert :title="suggestDescription" type="info" :closable="false" />
      <el-divider />
      <el-timeline>
        <el-timeline-item v-for="item in suggestList" :key="item" type="success">
          {{ item }}
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <el-button @click="suggestVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSendSuggestion">一键下发</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { disasterRecords, weatherWarnings, agriculturalAdvices } from '@/data/disasters'

const records = ref(disasterRecords.map(item => ({ ...item })))
const detailVisible = ref(false)
const formVisible = ref(false)
const suggestVisible = ref(false)
const currentRecord = ref({})
const suggestTitle = ref('')
const suggestDescription = ref('')
const suggestList = ref([])

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
  measures: ''
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
const getWarningType = level => ({ orange: 'warning', yellow: 'warning', blue: 'primary' }[level] || 'info')
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
  ElMessage.success(`${row.id} 已生成应急调度单`)
}

const handleResolve = row => {
  row.status = 'resolved'
  ElMessage.success(`${row.id} 已办结归档`)
}

const handleReport = () => {
  Object.assign(reportForm, { typeName: '', region: '', affectedArea: 0, measures: '' })
  formVisible.value = true
}

const handleSubmitReport = () => {
  formVisible.value = false
  ElMessage.success('灾情信息已提交，等待县级核验')
}

const handleWarning = warning => {
  suggestTitle.value = warning.title
  suggestDescription.value = warning.content
  suggestList.value = warning.suggestions
  suggestVisible.value = true
}

const handleAdvice = row => {
  suggestTitle.value = `${row.region}${row.growthStage}农事指导`
  suggestDescription.value = row.weather
  suggestList.value = row.advices
  suggestVisible.value = true
}

const handleSendSuggestion = () => {
  suggestVisible.value = false
  ElMessage.success('防范建议已下发至相关主体')
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

.content-row {
  margin-top: 20px;
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

.tag-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}
</style>
