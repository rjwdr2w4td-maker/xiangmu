<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #1a3a5c">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.taskCount }}</div>
            <div class="stat-label">种植计划任务</div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #c0392b">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.plotCount }}</div>
            <div class="stat-label">待核查图斑</div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #2d5a8a">
            <el-icon><Crop /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.silageArea }}</div>
            <div class="stat-label">青贮种植面积(亩)</div>
          </div>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #27ae60">
            <el-icon><FirstAidKit /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pesticideCount }}</div>
            <div class="stat-label">农药追溯批次</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>全省播种进度概览</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="sowing">播种进度</el-radio-button>
                <el-radio-button label="harvest">收获进度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="chart-card">
          <template #header>
            <span>待办事项</span>
          </template>
          <div class="todo-list">
            <div
              v-for="item in todoList"
              :key="item.id"
              class="todo-item"
              @click="handleTodo(item)"
            >
              <el-badge :value="item.count" :max="99" class="badge-item">
                <el-icon :size="24"><component :is="item.icon" /></el-icon>
              </el-badge>
              <span class="todo-text">{{ item.title }}</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>最新预警信息</span>
          </template>
          <div class="warning-list">
            <el-timeline>
              <el-timeline-item
                v-for="warning in warnings"
                :key="warning.id"
                :timestamp="warning.issueTime"
                placement="top"
              >
                <div class="warning-item">
                  <h4>{{ warning.title }}</h4>
                  <p>{{ warning.content }}</p>
                  <el-tag :type="getWarningType(warning.level)" size="small">
                    {{ warning.levelName }}
                  </el-tag>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <span>长势对比快览</span>
          </template>
          <div ref="growthChartRef" class="chart-container-sm"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { weatherWarnings } from '@/data/disasters'
import { plantingTasks } from '@/data/tasks'
import { changePlots } from '@/data/security'
import { silagePlantingRecords } from '@/data/silage'
import { productionBatches } from '@/data/pesticide'

const router = useRouter()
const chartRef = ref(null)
const growthChartRef = ref(null)
const chartType = ref('sowing')

const stats = ref({
  taskCount: plantingTasks.length,
  plotCount: changePlots.filter(p => p.status === 'pending_check' || p.status === 'checking').length,
  silageArea: silagePlantingRecords.reduce((sum, r) => sum + r.area, 0),
  pesticideCount: productionBatches.length
})

const todoList = ref([
  { id: 1, title: '待审核种植计划', icon: 'Document', count: 3, path: '/grain-plan/audit' },
  { id: 2, title: '待核查图斑', icon: 'Warning', count: 5, path: '/grain-security/discovery' },
  { id: 3, title: '待审核青贮申报', icon: 'Crop', count: 2, path: '/silage/planting' },
  { id: 4, title: '待处理预警', icon: 'Bell', count: 3, path: '/grain-plan/disaster' }
])

const warnings = ref(weatherWarnings.map(w => ({
  ...w,
  levelName: w.level === 'orange' ? '橙色预警' : w.level === 'yellow' ? '黄色预警' : '蓝色预警'
})))

const handleTodo = (item) => {
  router.push(item.path)
}

const getWarningType = (level) => {
  const map = {
    orange: 'danger',
    yellow: 'warning',
    blue: 'info'
  }
  return map[level] || 'info'
}

onMounted(() => {
  initChart()
  initGrowthChart()
})

const initChart = () => {
  const chart = echarts.init(chartRef.value)

  const cities = ['合肥市', '芜湖市', '蚌埠市', '淮南市', '马鞍山市']
  const planData = [350, 280, 420, 310, 220]
  const actualData = [342, 275, 408, 300, 215]

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['计划面积', '已播面积']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: cities
    },
    yAxis: {
      type: 'value',
      name: '万亩'
    },
    series: [
      {
        name: '计划面积',
        type: 'bar',
        data: planData,
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '已播面积',
        type: 'bar',
        data: actualData,
        itemStyle: { color: '#67C23A' }
      }
    ]
  }

  chart.setOption(option)
}

const initGrowthChart = () => {
  const chart = echarts.init(growthChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '长势分布',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 350, name: '长势良好', itemStyle: { color: '#67C23A' } },
          { value: 45, name: '长势一般', itemStyle: { color: '#E6A23C' } },
          { value: 5, name: '长势偏差', itemStyle: { color: '#F56C6C' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)
}
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 28px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.stat-content {
  margin-left: 18px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
  color: var(--sys-color-text-primary, #1f2937);
}

.stat-label {
  font-size: 13px;
  color: var(--sys-color-text-secondary, #6b7280);
  margin-top: 4px;
  font-weight: 400;
  white-space: nowrap;
}

.chart-card {
  height: 100%;
}

.chart-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.chart-container {
  height: 350px;
}

.chart-container-sm {
  height: 300px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
}

.todo-list {
  height: 350px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 14px 12px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
}

.todo-item:hover {
  background: #f5f7fa;
}

.todo-item:last-child {
  border-bottom: none;
}

.badge-item {
  margin-right: 14px;
  color: var(--sys-color-primary, #2563eb);
}

.todo-text {
  flex: 1;
  font-size: 14px;
  color: var(--sys-color-text-primary, #334155);
}

.warning-list {
  height: 300px;
  overflow-y: auto;
}

.warning-item {
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 4px;
}

.warning-item h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.warning-item p {
  margin: 0 0 8px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}
</style>
