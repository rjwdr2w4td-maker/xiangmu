<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
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
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
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
          <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
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
          <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
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
        <el-card>
          <template #header>
            <div class="card-header">
              <span>全省播种进度概览</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="sowing">播种进度</el-radio-button>
                <el-radio-button label="harvest">收获进度</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" style="height: 350px"></div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card>
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
        <el-card>
          <template #header>
            <span>最新预警信息</span>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="warning in warnings"
              :key="warning.id"
              :timestamp="warning.issueTime"
              placement="top"
            >
              <el-card>
                <h4>{{ warning.title }}</h4>
                <p>{{ warning.content }}</p>
                <el-tag :type="getWarningType(warning.level)" size="small">
                  {{ warning.levelName }}
                </el-tag>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>长势对比快览</span>
          </template>
          <div ref="growthChartRef" style="height: 300px"></div>
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
  position: relative;
  min-height: 132px;
  border-radius: 26px;
  padding: 24px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.96), rgba(239, 246, 255, 0.82));
  border: 1px solid rgba(59, 130, 246, 0.12);
  box-shadow: 0 20px 50px rgba(30, 64, 175, 0.1);
  transition: all 0.28s;
}

.stat-card::after {
  content: '';
  position: absolute;
  right: -44px;
  top: -44px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.13);
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 28px 66px rgba(30, 64, 175, 0.16);
}

.stat-icon {
  width: 68px;
  height: 68px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 32px;
  box-shadow: 0 18px 36px rgba(30, 64, 175, 0.16);
}

.stat-content {
  margin-left: 22px;
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 34px;
  font-weight: 900;
  color: #172554;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  margin-top: 7px;
  font-weight: 800;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 900;
}

.todo-list {
  max-height: 350px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 16px 14px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08);
  cursor: pointer;
  transition: all 0.28s;
  border-radius: 16px;
  margin-bottom: 8px;
}

.todo-item:hover {
  background: linear-gradient(90deg, rgba(239, 246, 255, 0.98), rgba(255, 251, 235, 0.86));
  padding-left: 20px;
  box-shadow: inset 3px 0 0 #f59e0b;
}

.todo-item:last-child {
  border-bottom: none;
}

.badge-item {
  margin-right: 16px;
  color: #2563eb;
}

.todo-text {
  flex: 1;
  font-size: 14px;
  color: #334155;
  font-weight: 800;
}
</style>