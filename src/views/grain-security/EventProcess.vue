<template>
  <div class="event-process">
    <el-card>
      <template #header>
        <span>事件分析流转 - 图斑生命周期跟踪</span>
      </template>

      <el-table :data="plots" border style="width: 100%">
        <el-table-column prop="plotNo" label="图斑编号" width="150" />
        <el-table-column label="位置" width="180">
          <template #default="{ row }">
            {{ row.location.city }} {{ row.location.county }}
          </template>
        </el-table-column>
        <el-table-column prop="problemTypeName" label="问题类型" width="150" />
        <el-table-column prop="statusName" label="当前状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="任务跟踪" min-width="300">
          <template #default="{ row }">
            <el-steps :active="getStepActive(row.status)" finish-status="success" size="small">
              <el-step title="发现" />
              <el-step title="下发" />
              <el-step title="核查" />
              <el-step title="审核" />
              <el-step title="整改" />
              <el-step title="结案" />
            </el-steps>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewProcess(row)">查看详情</el-button>
            <el-button
              size="small"
              type="primary"
              @click="handleCheck(row)"
              :disabled="row.status !== 'checking'"
            >
              核查
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="processDialogVisible"
      title="图斑全生命周期详情 - 任务跟踪看板"
      width="900px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="图斑编号">{{ processData.plotNo }}</el-descriptions-item>
        <el-descriptions-item label="问题类型">{{ processData.problemTypeName }}</el-descriptions-item>
        <el-descriptions-item label="面积">{{ processData.area }}亩</el-descriptions-item>
        <el-descriptions-item label="风险等级">{{ getRiskName(processData.riskLevel) }}</el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px">
        <h4>处置流程时间线</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(step, index) in processData.statusFlow"
            :key="index"
            :timestamp="step.time"
            placement="top"
            :type="getStepType(index, processData.statusFlow.length)"
          >
            <el-card>
              <h4 style="margin: 0">{{ step.action }}</h4>
              <p style="margin: 5px 0; color: #666">操作人：{{ step.operator }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div v-if="processData.checkResult" style="margin-top: 20px">
        <h4>核查结果</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="核查人">{{ processData.checkResult.checker }}</el-descriptions-item>
          <el-descriptions-item label="核查时间">{{ processData.checkResult.checkTime }}</el-descriptions-item>
          <el-descriptions-item label="核查结论">
            <el-tag :type="processData.checkResult.result === 'confirmed' ? 'danger' : 'success'">
              {{ processData.checkResult.resultName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="核实面积">{{ processData.checkResult.actualArea }}亩</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">{{ processData.checkResult.description }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <el-dialog
      v-model="checkDialogVisible"
      title="现场核查 - 移动端随手拍+离线填报"
      width="700px"
    >
      <el-form :model="checkForm" label-width="120px">
        <el-form-item label="图斑编号">
          <el-input v-model="checkForm.plotNo" disabled />
        </el-form-item>

        <el-alert
          title="内置地图导航"
          description="点击导航按钮，系统将调用内置地图导航功能，引导您到达图斑位置"
          type="info"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-form-item label="核查结论" required>
          <el-radio-group v-model="checkForm.result">
            <el-radio label="confirmed">问题属实</el-radio>
            <el-radio label="unconfirmed">问题不属实</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="核实面积(亩)">
          <el-input-number v-model="checkForm.actualArea" :min="0" />
        </el-form-item>

        <el-form-item label="问题描述">
          <el-input
            v-model="checkForm.description"
            type="textarea"
            :rows="3"
            placeholder="请详细描述现场情况"
          />
        </el-form-item>

        <el-form-item label="现场照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handlePhotoChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div style="color: #999; font-size: 12px">照片将自动添加水印（时间、地点）</div>
        </el-form-item>

        <el-form-item label="现场视频">
          <el-button type="primary" size="small" @click="handleRecordVideo">
            <el-icon><VideoCamera /></el-icon>
            {{ checkForm.video ? '重新录制视频' : '录制视频' }}
          </el-button>
          <el-tag v-if="checkForm.video" type="success" style="margin-left: 10px">
            {{ checkForm.video }}
          </el-tag>
        </el-form-item>

        <el-form-item label="GPS定位">
          <el-tag type="success">已自动获取：117.36°E, 31.86°N</el-tag>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmitCheck">提交核查结果</el-button>
          <el-button @click="handleSaveOffline">
            <el-icon><FolderOpened /></el-icon>
            离线保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { changePlots, taskProcessRecords } from '@/data/security'

const plots = ref(changePlots.filter(p => p.status !== 'pending_check'))

const processDialogVisible = ref(false)
const checkDialogVisible = ref(false)
const processData = ref({})
const checkForm = reactive({
  plotNo: '',
  result: '',
  actualArea: 0,
  description: '',
  photos: [],
  video: ''
})

const getStatusTag = (status) => {
  const map = {
    pending_check: 'danger',
    checking: 'warning',
    reported: 'primary',
    rectifying: 'info',
    completed: 'success'
  }
  return map[status] || ''
}

const getStepActive = (status) => {
  const map = {
    pending_check: 0,
    checking: 2,
    reported: 3,
    rectifying: 4,
    completed: 5
  }
  return map[status] || 0
}

const getRiskName = (level) => {
  const map = { high: '高风险', medium: '中风险', low: '低风险' }
  return map[level] || level
}

const getStepType = (index, total) => {
  if (index === total - 1) return 'primary'
  return 'success'
}

const handleViewProcess = (row) => {
  processData.value = row
  const record = taskProcessRecords.find(r => r.plotId === row.id)
  if (record) {
    processData.value = {
      ...row,
      statusFlow: record.statusFlow
    }
  } else {
    processData.value = {
      ...row,
      statusFlow: [
        { status: 'discovered', time: row.discoveryTime, operator: '系统', action: 'AI智能识别发现疑似图斑' },
        { status: 'assigned', time: row.assignTime, operator: '省农业农村厅', action: `任务下发至${row.assignee}` }
      ]
    }
  }
  processDialogVisible.value = true
}

const handleCheck = (row) => {
  checkForm.plotNo = row.plotNo
  checkForm.result = ''
  checkForm.actualArea = row.area
  checkForm.description = ''
  checkForm.photos = []
  checkForm.video = ''
  checkDialogVisible.value = true
}

const handlePhotoChange = (file) => {
  checkForm.photos.push(file)
}

const handleRecordVideo = () => {
  checkForm.video = `现场核查视频_${checkForm.plotNo}_${Date.now()}.mp4`
  ElMessage.success('现场视频已录制并添加水印')
}

const handleSubmitCheck = () => {
  if (!checkForm.result) {
    ElMessage.warning('请选择核查结论')
    return
  }
  ElMessage.success('核查结果已提交，待市级审核')
  const plot = plots.value.find(item => item.plotNo === checkForm.plotNo)
  if (plot) {
    plot.status = 'reported'
    plot.statusName = '已上报'
    plot.checkResult = {
      checker: '移动端核查员',
      checkTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      result: checkForm.result,
      resultName: checkForm.result === 'confirmed' ? '问题属实' : '问题不属实',
      actualArea: checkForm.actualArea,
      description: checkForm.description,
      video: checkForm.video
    }
  }
  checkDialogVisible.value = false
}

const handleSaveOffline = () => {
  ElMessage.success('数据已离线保存，联网后将自动上传')
}
</script>

<style scoped>
.event-process {
  padding: 0;
}

h4 {
  color: #333;
  font-size: 16px;
  margin: 10px 0;
}
</style>