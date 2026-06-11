<template>
  <div class="event-handle">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>事件协同处置 - 整改闭环管理</span>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="整改任务管理" name="rectify">
          <el-table :data="rectifyList" border style="width: 100%">
            <el-table-column prop="plotNo" label="图斑编号" width="150" />
            <el-table-column label="位置" width="200">
              <template #default="{ row }">
                {{ row.location.city }} {{ row.location.county }}
              </template>
            </el-table-column>
            <el-table-column prop="problemTypeName" label="问题类型" width="150" />
            <el-table-column prop="rectifyMeasure" label="整改措施" min-width="200" />
            <el-table-column prop="rectifyDeadline" label="整改时限" width="120" />
            <el-table-column prop="rectifyStatus" label="整改状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.rectifyStatus === 'completed' ? 'success' : 'warning'">
                  {{ row.rectifyStatus === 'completed' ? '已完成' : '整改中' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="250" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleViewRectify(row)">查看详情</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="handleReportRectify(row)"
                  :disabled="row.rectifyStatus === 'completed'"
                >
                  上报整改
                </el-button>
                <el-button
                  size="small"
                  type="success"
                  @click="handleAcceptRectify(row)"
                  :disabled="row.rectifyStatus !== 'pending_accept'"
                >
                  验收
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="整改验收" name="accept">
          <el-table :data="acceptList" border style="width: 100%">
            <el-table-column prop="plotNo" label="图斑编号" width="150" />
            <el-table-column label="整改主体" width="200">
              <template #default="{ row }">
                {{ row.rectifyUnit }}
              </template>
            </el-table-column>
            <el-table-column prop="rectifyMeasure" label="整改措施" min-width="200" />
            <el-table-column prop="reportTime" label="上报时间" width="160" />
            <el-table-column label="整改照片" width="120">
              <template #default="{ row }">
                <el-image
                  :src="row.photoUrl"
                  :preview-src-list="[row.photoUrl]"
                  fit="cover"
                  style="width: 60px; height: 60px"
                >
                  <template #placeholder>
                    <div style="background: #f5f7fa; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="handleViewAccept(row)">查看</el-button>
                <el-button size="small" type="primary" @click="handleAccept(row)">验收通过</el-button>
                <el-button size="small" type="danger" @click="handleReject(row)">验收驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="复盘考核" name="review">
          <el-card shadow="hover" style="margin-bottom: 20px">
            <el-descriptions :column="4" border>
              <el-descriptions-item label="总图斑数">5个</el-descriptions-item>
              <el-descriptions-item label="已处置">4个</el-descriptions-item>
              <el-descriptions-item label="处置率">80%</el-descriptions-item>
              <el-descriptions-item label="平均处置时长">3.5天</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-table :data="reviewList" border style="width: 100%">
            <el-table-column prop="plotNo" label="图斑编号" width="150" />
            <el-table-column label="处置流程" min-width="300">
              <template #default="{ row }">
                <el-steps :active="5" finish-status="success" size="small">
                  <el-step title="发现" :description="row.discoveryTime" />
                  <el-step title="核查" :description="row.checkTime" />
                  <el-step title="审核" :description="row.reviewTime" />
                  <el-step title="整改" :description="row.rectifyTime" />
                  <el-step title="验收" :description="row.acceptTime" />
                </el-steps>
              </template>
            </el-table-column>
            <el-table-column prop="totalDays" label="总耗时(天)" width="100" />
            <el-table-column prop="score" label="处置评分" width="100">
              <template #default="{ row }">
                <el-rate :model-value="row.score" disabled />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="reportDialogVisible"
      title="上报整改结果"
      width="600px"
    >
      <el-form :model="reportForm" label-width="120px">
        <el-form-item label="图斑编号">
          <el-input v-model="reportForm.plotNo" disabled />
        </el-form-item>
        
        <el-form-item label="整改措施">
          <el-input
            v-model="reportForm.measure"
            type="textarea"
            :rows="3"
            placeholder="请描述具体整改措施"
          />
        </el-form-item>

        <el-form-item label="整改完成情况">
          <el-input
            v-model="reportForm.result"
            type="textarea"
            :rows="3"
            placeholder="请描述整改完成情况"
          />
        </el-form-item>

        <el-form-item label="整改照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handlePhotoChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <div style="color: #999; font-size: 12px">请上传整改完成后的现场照片</div>
        </el-form-item>

        <el-form-item label="整改责任人">
          <el-input v-model="reportForm.responsiblePerson" placeholder="请输入责任人姓名" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="reportDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReportSubmit">提交上报</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="acceptDialogVisible"
      title="整改验收"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="图斑编号">{{ acceptData.plotNo }}</el-descriptions-item>
        <el-descriptions-item label="整改单位">{{ acceptData.rectifyUnit }}</el-descriptions-item>
        <el-descriptions-item label="整改措施" :span="2">{{ acceptData.rectifyMeasure }}</el-descriptions-item>
        <el-descriptions-item label="上报时间">{{ acceptData.reportTime }}</el-descriptions-item>
        <el-descriptions-item label="整改责任人">{{ acceptData.responsiblePerson }}</el-descriptions-item>
      </el-descriptions>

      <div style="margin-top: 20px">
        <h4>整改前后对比</h4>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-image
              :src="acceptData.beforePhoto"
              fit="cover"
              style="width: 100%; height: 200px"
            >
              <template #placeholder>
                <div style="background: #f5f7fa; height: 200px; display: flex; align-items: center; justify-content: center">
                  <span>整改前照片</span>
                </div>
              </template>
            </el-image>
            <div style="text-align: center; margin-top: 10px">整改前</div>
          </el-col>
          <el-col :span="12">
            <el-image
              :src="acceptData.afterPhoto"
              fit="cover"
              style="width: 100%; height: 200px"
            >
              <template #placeholder>
                <div style="background: #f5f7fa; height: 200px; display: flex; align-items: center; justify-content: center">
                  <span>整改后照片</span>
                </div>
              </template>
            </el-image>
            <div style="text-align: center; margin-top: 10px">整改后</div>
          </el-col>
        </el-row>
      </div>

      <el-form :model="acceptForm" label-width="100px" style="margin-top: 20px">
        <el-form-item label="验收结论">
          <el-radio-group v-model="acceptForm.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="reject">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="验收意见">
          <el-input
            v-model="acceptForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入验收意见"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="acceptDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAcceptSubmit">提交验收</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const activeTab = ref('rectify')

const rectifyList = ref([
  {
    plotNo: 'AH-2026-00123',
    location: { city: '合肥市', county: '长丰县' },
    problemTypeName: '疑似撂荒',
    rectifyMeasure: '协调流转土地，恢复耕种',
    rectifyDeadline: '2026-04-15',
    rectifyStatus: 'rectifying'
  },
  {
    plotNo: 'AH-2026-00126',
    location: { city: '蚌埠市', county: '怀远县' },
    problemTypeName: '种植计划未落实',
    rectifyMeasure: '修复灌溉设施，完成播种',
    rectifyDeadline: '2026-04-15',
    rectifyStatus: 'pending_accept'
  }
])

const acceptList = ref([
  {
    plotNo: 'AH-2026-00125',
    rectifyUnit: '繁昌区农业农村局',
    rectifyMeasure: '重新流转承包，恢复耕种',
    reportTime: '2026-03-28 10:00:00',
    photoUrl: '',
    responsiblePerson: '李明'
  }
])

const reviewList = ref([
  {
    plotNo: 'AH-2026-00125',
    discoveryTime: '2026-03-15',
    checkTime: '2026-03-18',
    reviewTime: '2026-03-19',
    rectifyTime: '2026-03-25',
    acceptTime: '2026-03-28',
    totalDays: 13,
    score: 4
  }
])

const reportDialogVisible = ref(false)
const acceptDialogVisible = ref(false)

const reportForm = reactive({
  plotNo: '',
  measure: '',
  result: '',
  photos: [],
  responsiblePerson: ''
})

const acceptData = ref({})
const acceptForm = reactive({
  result: 'pass',
  comment: ''
})

const handleViewRectify = (row) => {
  ElMessage.info('查看整改详情')
}

const handleReportRectify = (row) => {
  reportForm.plotNo = row.plotNo
  reportForm.measure = row.rectifyMeasure
  reportForm.result = ''
  reportForm.photos = []
  reportForm.responsiblePerson = ''
  reportDialogVisible.value = true
}

const handlePhotoChange = (file) => {
  reportForm.photos.push(file)
}

const handleReportSubmit = () => {
  ElMessage.success('整改结果已上报，等待验收')
  reportDialogVisible.value = false
}

const handleAcceptRectify = (row) => {
  ElMessage.success('验收通过，整改完成')
}

const handleViewAccept = (row) => {
  acceptData.value = {
    ...row,
    beforePhoto: '',
    afterPhoto: ''
  }
  acceptForm.result = 'pass'
  acceptForm.comment = ''
  acceptDialogVisible.value = true
}

const handleAccept = (row) => {
  handleViewAccept(row)
}

const handleReject = (row) => {
  ElMessage.warning('验收驳回，请继续整改')
}

const handleAcceptSubmit = () => {
  if (acceptForm.result === 'pass') {
    ElMessage.success('验收通过，整改闭环完成')
  } else {
    ElMessage.warning('验收驳回，请继续整改')
  }
  acceptDialogVisible.value = false
}
</script>

<style scoped>
.event-handle {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h4 {
  color: #333;
  font-size: 16px;
  margin: 10px 0;
}
</style>