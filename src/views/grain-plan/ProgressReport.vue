<template>
  <div class="progress-report">
    <el-card>
      <template #header>
        <span>进度填报（播种/收获进度调度）</span>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="播种进度填报" name="sowing">
          <el-form :inline="true" :model="sowingForm" class="search-form">
            <el-form-item label="所属市">
              <el-select v-model="sowingForm.city" placeholder="请选择市级">
                <el-option label="合肥市" value="340100" />
                <el-option label="芜湖市" value="340200" />
                <el-option label="蚌埠市" value="340300" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="所属县">
              <el-select v-model="sowingForm.county" placeholder="请选择县级">
                <el-option label="长丰县" value="340121" />
                <el-option label="肥东县" value="340122" />
                <el-option label="肥西县" value="340123" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="作物类型">
              <el-select v-model="sowingForm.cropType" placeholder="请选择作物">
                <el-option label="小麦" value="wheat" />
                <el-option label="水稻" value="rice" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="填报日期">
              <el-date-picker
                v-model="sowingForm.date"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-form>

          <el-card shadow="hover" style="margin-bottom: 20px">
            <template #header>
              <span>进度填报表单（自动计算播种进度）</span>
            </template>
            
            <el-form :model="formData" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="计划面积">
                    <el-input-number v-model="formData.planArea" :min="0" disabled />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="已播面积">
                    <el-input-number
                      v-model="formData.sowedArea"
                      :min="0"
                      :max="formData.planArea"
                      @change="calculateProgress"
                    />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="播种进度">
                    <el-progress
                      :percentage="formData.sowingProgress"
                      :color="getProgressColor(formData.sowingProgress)"
                    />
                    <el-tag :type="getProgressTag(formData.sowingProgress)" style="margin-top: 5px">
                      {{ formData.sowingProgress.toFixed(1) }}%
                    </el-tag>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="规模大户播种">
                    <el-input-number v-model="formData.largeFarmerArea" :min="0" />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="填报人">
                    <el-input v-model="formData.reporter" placeholder="请输入填报人姓名" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item>
                <el-button type="primary" @click="handleSaveSowing">保存填报</el-button>
                <el-button type="success" @click="handleSubmitSowing">提交上报</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card shadow="hover">
            <template #header>
              <span>进度明细库（支持到户、到田数据录入）</span>
            </template>
            
            <el-button type="primary" size="small" style="margin-bottom: 10px" @click="handleAddDetail">
              <el-icon><Plus /></el-icon>
              添加明细
            </el-button>

            <el-table :data="detailData" border style="width: 100%">
              <el-table-column prop="farmerName" label="种植主体（到户）" min-width="180" />
              <el-table-column prop="plotId" label="地块编号（到田）" min-width="140" />
              <el-table-column prop="plotArea" label="地块面积" min-width="110" />
              <el-table-column prop="sowedArea" label="已播面积" min-width="110" />
              <el-table-column prop="sowingTime" label="播种时间" min-width="140" />
              <el-table-column prop="cropVariety" label="作物品种" min-width="140" />
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button size="small" @click="handleViewDetail(row)">查看</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteDetail(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="收获进度填报" name="harvest">
          <el-card shadow="hover">
            <template #header>
              <span>收获进度填报（自动计算收获进度）</span>
            </template>
            
            <el-form :model="harvestFormData" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="种植面积">
                    <el-input-number v-model="harvestFormData.plantArea" :min="0" disabled />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="已收面积">
                    <el-input-number
                      v-model="harvestFormData.harvestedArea"
                      :min="0"
                      :max="harvestFormData.plantArea"
                      @change="calculateHarvestProgress"
                    />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="8">
                  <el-form-item label="收获进度">
                    <el-progress
                      :percentage="harvestFormData.harvestProgress"
                      :color="getProgressColor(harvestFormData.harvestProgress)"
                    />
                    <el-tag :type="getProgressTag(harvestFormData.harvestProgress)" style="margin-top: 5px">
                      {{ harvestFormData.harvestProgress.toFixed(1) }}%
                    </el-tag>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="规模大户收获">
                    <el-input-number v-model="harvestFormData.largeFarmerArea" :min="0" />
                    <span style="margin-left: 10px">亩</span>
                  </el-form-item>
                </el-col>
                
                <el-col :span="12">
                  <el-form-item label="填报人">
                    <el-input v-model="harvestFormData.reporter" placeholder="请输入填报人姓名" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item>
                <el-button type="primary" @click="handleSaveHarvest">保存填报</el-button>
                <el-button type="success" @click="handleSubmitHarvest">提交上报</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="detailDialogVisible"
      title="添加进度明细（到户到田）"
      width="600px"
    >
      <el-form :model="detailFormData" label-width="120px">
        <el-form-item label="种植主体">
          <el-select v-model="detailFormData.farmerId" placeholder="请选择种植主体">
            <el-option label="张明家庭农场" value="SUBJ001" />
            <el-option label="李华种植专业合作社" value="SUBJ002" />
            <el-option label="王强规模种植大户" value="SUBJ003" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="地块编号">
          <el-select v-model="detailFormData.plotId" placeholder="请选择地块">
            <el-option label="PLOT001（150亩）" value="PLOT001" />
            <el-option label="PLOT002（180亩）" value="PLOT002" />
            <el-option label="PLOT003（190亩）" value="PLOT003" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="已播面积">
          <el-input-number v-model="detailFormData.sowedArea" :min="0" />
          <span style="margin-left: 10px">亩</span>
        </el-form-item>
        
        <el-form-item label="播种时间">
          <el-date-picker v-model="detailFormData.sowingTime" type="date" placeholder="选择日期" />
        </el-form-item>
        
        <el-form-item label="作物品种">
          <el-input v-model="detailFormData.cropVariety" placeholder="如：济麦22" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="detailDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDetail">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="viewDetailDialogVisible"
      title="进度明细详情"
      width="560px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="种植主体">{{ currentDetail.farmerName }}</el-descriptions-item>
        <el-descriptions-item label="地块编号">{{ currentDetail.plotId }}</el-descriptions-item>
        <el-descriptions-item label="地块面积">{{ currentDetail.plotArea }}亩</el-descriptions-item>
        <el-descriptions-item label="已播面积">{{ currentDetail.sowedArea }}亩</el-descriptions-item>
        <el-descriptions-item label="播种时间">{{ currentDetail.sowingTime }}</el-descriptions-item>
        <el-descriptions-item label="作物品种">{{ currentDetail.cropVariety }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('sowing')

const sowingForm = reactive({
  city: '340100',
  county: '340121',
  cropType: 'wheat',
  date: new Date()
})

const formData = reactive({
  planArea: 980000,
  sowedArea: 965000,
  largeFarmerArea: 450000,
  sowingProgress: 98.5,
  reporter: '长丰县农业农村局'
})

const harvestFormData = reactive({
  plantArea: 980000,
  harvestedArea: 0,
  largeFarmerArea: 0,
  harvestProgress: 0,
  reporter: ''
})

const detailData = ref([
  {
    farmerName: '张明家庭农场',
    plotId: 'PLOT001',
    plotArea: 150,
    sowedArea: 150,
    sowingTime: '2026-03-10',
    cropVariety: '济麦22'
  },
  {
    farmerName: '李华种植专业合作社',
    plotId: 'PLOT004',
    plotArea: 420,
    sowedArea: 420,
    sowingTime: '2026-03-12',
    cropVariety: '郑麦9023'
  }
])

const detailDialogVisible = ref(false)
const viewDetailDialogVisible = ref(false)
const currentDetail = ref({})
const detailFormData = reactive({
  farmerId: '',
  plotId: '',
  sowedArea: 0,
  sowingTime: '',
  cropVariety: ''
})

const calculateProgress = () => {
  if (formData.planArea > 0) {
    formData.sowingProgress = (formData.sowedArea / formData.planArea) * 100
  }
}

const calculateHarvestProgress = () => {
  if (harvestFormData.plantArea > 0) {
    harvestFormData.harvestProgress = (harvestFormData.harvestedArea / harvestFormData.plantArea) * 100
  }
}

const getProgressColor = (progress) => {
  if (progress >= 95) return '#67C23A'
  if (progress >= 80) return '#409EFF'
  if (progress >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getProgressTag = (progress) => {
  if (progress >= 95) return 'success'
  if (progress >= 80) return 'primary'
  if (progress >= 60) return 'warning'
  return 'danger'
}

const handleSaveSowing = () => {
  ElMessage.success('播种进度已保存')
}

const handleSubmitSowing = () => {
  ElMessage.success('播种进度已提交上报至市级')
}

const handleSaveHarvest = () => {
  ElMessage.success('收获进度已保存')
}

const handleSubmitHarvest = () => {
  ElMessage.success('收获进度已提交上报至市级')
}

const handleAddDetail = () => {
  detailDialogVisible.value = true
}

const handleViewDetail = (row) => {
  currentDetail.value = row
  viewDetailDialogVisible.value = true
}

const handleDeleteDetail = (row) => {
  ElMessageBox.confirm(`确认删除${row.farmerName}的${row.plotId}进度明细吗？`, '提示', {
    type: 'warning'
  }).then(() => {
    const index = detailData.value.findIndex(item => item === row)
    if (index !== -1) {
      detailData.value.splice(index, 1)
      ElMessage.success('进度明细已删除')
    }
  }).catch(() => {})
}

const handleSaveDetail = () => {
  const farmerNames = {
    'SUBJ001': '张明家庭农场',
    'SUBJ002': '李华种植专业合作社',
    'SUBJ003': '王强规模种植大户'
  }
  
  detailData.value.push({
    farmerName: farmerNames[detailFormData.farmerId],
    plotId: detailFormData.plotId,
    plotArea: 150,
    sowedArea: detailFormData.sowedArea,
    sowingTime: new Date(detailFormData.sowingTime).toISOString().split('T')[0],
    cropVariety: detailFormData.cropVariety
  })
  
  ElMessage.success('进度明细已保存')
  detailDialogVisible.value = false
}

calculateProgress()
</script>

<style scoped>
.progress-report {
  padding: 0;
}

.search-form {
  margin-bottom: 20px;
}
</style>