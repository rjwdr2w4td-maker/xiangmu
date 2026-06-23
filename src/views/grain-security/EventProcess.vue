<template>
  <div class="plot-review">
    <el-card>
      <template #header>
        <span>图斑审核</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="待审核" name="pending">
          <div class="review-container">
            <div class="plot-list">
              <div
                v-for="plot in pendingPlots"
                :key="plot.id"
                class="plot-item"
                :class="{ active: selectedPlot?.id === plot.id }"
                @click="handleSelectPlot(plot)"
              >
                <div class="plot-header">
                  <span class="plot-no">{{ plot.plotNo }}</span>
                  <el-tag size="small" type="warning">{{ plot.statusName }}</el-tag>
                </div>
                <div class="plot-info">
                  <div>{{ plot.location.city }} {{ plot.location.county }}</div>
                  <div>{{ plot.problemTypeName }}</div>
                  <div>{{ plot.area }}亩</div>
                </div>
              </div>
              <el-empty v-if="pendingPlots.length === 0" description="暂无待审核图斑" />
            </div>

            <div class="review-detail">
              <template v-if="selectedPlot">
                <div class="detail-section">
                  <h4>核查照片</h4>
                  <div class="photo-list">
                    <el-image
                      v-for="(photo, index) in selectedPlot.checkResult?.photos || []"
                      :key="index"
                      :src="photo"
                      :preview-src-list="selectedPlot.checkResult?.photos || []"
                      fit="cover"
                      class="photo-item"
                    />
                    <el-empty v-if="!selectedPlot.checkResult?.photos?.length" description="暂无照片" :image-size="60" />
                  </div>
                </div>

                <div class="detail-section" v-if="selectedPlot.checkResult?.video">
                  <h4>核查视频</h4>
                  <el-tag type="success">
                    <el-icon><VideoCamera /></el-icon>
                    {{ selectedPlot.checkResult.video }}
                  </el-tag>
                </div>

                <div class="detail-section">
                  <h4>核查信息</h4>
                  <el-descriptions :column="2" border size="small">
                    <el-descriptions-item label="核查描述" :span="2">
                      {{ selectedPlot.checkResult?.description || '暂无描述' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="核查人员">
                      {{ selectedPlot.checkResult?.checker || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="核查时间">
                      {{ selectedPlot.checkResult?.checkTime || '-' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="实际面积">
                      {{ selectedPlot.checkResult?.actualArea || '-' }} 亩
                    </el-descriptions-item>
                    <el-descriptions-item label="GPS定位">
                      {{ selectedPlot.location?.coordinates || '-' }}
                    </el-descriptions-item>
                  </el-descriptions>
                </div>

                <div class="action-buttons">
                  <el-button type="primary" @click="handleApprove">审核通过</el-button>
                  <el-button type="danger" @click="handleReject">打回重核</el-button>
                </div>
              </template>
              <el-empty v-else description="请选择待审核图斑" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="已审核记录" name="reviewed">
          <el-table :data="reviewedPlots" border style="width: 100%">
            <el-table-column prop="plotNo" label="图斑编号" width="150" />
            <el-table-column label="位置" width="180">
              <template #default="{ row }">
                {{ row.location.city }} {{ row.location.county }}
              </template>
            </el-table-column>
            <el-table-column prop="problemTypeName" label="问题类型" width="150" />
            <el-table-column label="审核结果" width="120">
              <template #default="{ row }">
                <el-tag :type="row.reviewResult === 'approved' ? 'success' : 'warning'">
                  {{ row.reviewResult === 'approved' ? '审核通过' : '打回重核' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="reviewTime" label="审核时间" width="180" />
            <el-table-column prop="reviewer" label="审核人" width="120" />
            <el-table-column label="当前状态">
              <template #default="{ row }">
                <el-tag :type="getStatusTag(row.status)">{{ row.statusName }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="reviewedPlots.length === 0" description="暂无已审核记录" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog v-model="approveDialogVisible" title="审核通过 - 填写整改要求" width="500px">
      <el-form :model="approveForm" label-width="100px">
        <el-form-item label="整改措施" required>
          <el-input
            v-model="approveForm.rectifyMeasure"
            type="textarea"
            :rows="4"
            placeholder="请填写整改措施要求"
          />
        </el-form-item>
        <el-form-item label="整改时限" required>
          <el-date-picker
            v-model="approveForm.rectifyDeadline"
            type="date"
            placeholder="选择整改截止日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitApprove">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="rejectDialogVisible" title="打回重核" width="400px">
      <p>确定将图斑 <strong>{{ selectedPlot?.plotNo }}</strong> 打回重新核查吗？</p>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleSubmitReject">确定打回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { changePlots } from '@/data/security'

const activeTab = ref('pending')
const selectedPlot = ref(null)
const approveDialogVisible = ref(false)
const rejectDialogVisible = ref(false)

const approveForm = reactive({
  rectifyMeasure: '',
  rectifyDeadline: ''
})

const pendingPlots = computed(() => {
  return changePlots.filter(p => p.status === 'reported')
})

const reviewedPlots = computed(() => {
  return changePlots.filter(p => p.reviewResult && (p.status === 'rectifying' || p.status === 'checking'))
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

const handleSelectPlot = (plot) => {
  selectedPlot.value = plot
}

const handleApprove = () => {
  approveForm.rectifyMeasure = ''
  approveForm.rectifyDeadline = ''
  approveDialogVisible.value = true
}

const handleSubmitApprove = () => {
  if (!approveForm.rectifyMeasure) {
    ElMessage.warning('请填写整改措施')
    return
  }
  if (!approveForm.rectifyDeadline) {
    ElMessage.warning('请选择整改时限')
    return
  }

  if (selectedPlot.value) {
    selectedPlot.value.status = 'rectifying'
    selectedPlot.value.statusName = '整改中'
    selectedPlot.value.reviewResult = 'approved'
    selectedPlot.value.reviewTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
    selectedPlot.value.reviewer = '市级审核员'
    selectedPlot.value.rectifyMeasure = approveForm.rectifyMeasure
    selectedPlot.value.rectifyDeadline = approveForm.rectifyDeadline
  }

  approveDialogVisible.value = false
  selectedPlot.value = null
  ElMessage.success('审核通过，已进入整改阶段')
}

const handleReject = () => {
  rejectDialogVisible.value = true
}

const handleSubmitReject = () => {
  if (selectedPlot.value) {
    selectedPlot.value.status = 'checking'
    selectedPlot.value.statusName = '核查中'
    selectedPlot.value.reviewResult = 'rejected'
    selectedPlot.value.reviewTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
    selectedPlot.value.reviewer = '市级审核员'
  }

  rejectDialogVisible.value = false
  selectedPlot.value = null
  ElMessage.success('已打回重核')
}
</script>

<style scoped>
.plot-review {
  padding: 0;
}

.review-container {
  display: flex;
  gap: 20px;
  min-height: 600px;
}

.plot-list {
  width: 320px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background: #fff;
  overflow-y: auto;
  max-height: 600px;
}

.plot-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.3s;
}

.plot-item:hover {
  background: #f5f7fa;
}

.plot-item.active {
  background: #ecf5ff;
  border-left: 3px solid #409eff;
}

.plot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plot-no {
  font-weight: 600;
  color: #303133;
}

.plot-info {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.review-detail {
  flex: 1;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background: #fff;
  padding: 20px;
  overflow-y: auto;
  max-height: 600px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  color: #303133;
  font-size: 15px;
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.photo-item {
  width: 120px;
  height: 90px;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
