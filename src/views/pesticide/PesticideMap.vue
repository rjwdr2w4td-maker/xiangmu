<template>
  <div class="pesticide-map">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>农药数字监管一张图</span>
          <el-radio-group v-model="layerType" size="small" @change="refreshMap">
            <el-radio-button label="production">生产企业</el-radio-button>
            <el-radio-button label="business">经营主体</el-radio-button>
            <el-radio-button label="flow">流通预警</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="map-container">
        <div ref="mapRef" class="leaflet-map"></div>
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-item"><span class="legend-color production"></span><span>生产企业</span></div>
          <div class="legend-item"><span class="legend-color business"></span><span>经营主体</span></div>
          <div class="legend-item"><span class="legend-color warning"></span><span>流通预警</span></div>
        </div>
        <div class="map-tools">
          <el-button-group>
            <el-button size="small" @click="handleZoomIn"><el-icon><ZoomIn /></el-icon></el-button>
            <el-button size="small" @click="handleZoomOut"><el-icon><ZoomOut /></el-icon></el-button>
            <el-button size="small" @click="handleResetView"><el-icon><RefreshRight /></el-icon></el-button>
          </el-button-group>
        </div>
        <div class="map-stats">
          <el-statistic title="生产企业" :value="productionCompanies.length" />
          <el-statistic title="经营主体" :value="businessCompanies.length" />
          <el-statistic title="流通记录" :value="businessFlows.length" />
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card>
          <template #header><span>监管主体列表</span></template>
          <el-table :data="currentCompanies" border style="width: 100%">
            <el-table-column prop="name" label="主体名称" min-width="190" />
            <el-table-column prop="licenseNo" label="许可证号" min-width="170" />
            <el-table-column prop="licenseExpiry" label="有效期" width="110" />
            <el-table-column label="操作" width="150"><template #default="{ row }"><el-button size="small" @click="handleLocate(row)">定位</el-button><el-button size="small" type="primary" @click="handleView(row)">详情</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>近期流通记录</span></template>
          <el-table :data="businessFlows" border style="width: 100%">
            <el-table-column prop="flowTypeName" label="类型" width="80"><template #default="{ row }"><el-tag :type="row.flowType === 'in' ? 'success' : 'warning'">{{ row.flowTypeName }}</el-tag></template></el-table-column>
            <el-table-column prop="companyName" label="经营主体" min-width="160" />
            <el-table-column prop="productName" label="产品" width="110" />
            <el-table-column prop="quantity" label="数量" width="80" />
            <el-table-column label="操作" width="90"><template #default="{ row }"><el-button size="small" @click="handleFlow(row)">追踪</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailVisible" title="监管主体详情" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="主体名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="信用代码">{{ detailData.creditCode }}</el-descriptions-item>
        <el-descriptions-item label="法定代表人">{{ detailData.legalPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="许可证号">{{ detailData.licenseNo }}</el-descriptions-item>
        <el-descriptions-item label="有效期至">{{ detailData.licenseExpiry }}</el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">{{ detailData.address }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleCheck(detailData)">发起核查</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="flowVisible" title="流通定位追踪" width="680px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="产品名称">{{ flowData.productName }}</el-descriptions-item>
        <el-descriptions-item label="批次号">{{ flowData.batchNo }}</el-descriptions-item>
        <el-descriptions-item label="经营主体">{{ flowData.companyName }}</el-descriptions-item>
        <el-descriptions-item label="流通类型">{{ flowData.flowTypeName }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ flowData.quantity }}{{ flowData.unit }}</el-descriptions-item>
        <el-descriptions-item label="交易日期">{{ flowData.transactionDate }}</el-descriptions-item>
        <el-descriptions-item label="对方信息" :span="2">{{ flowData.buyer || flowData.source }}</el-descriptions-item>
      </el-descriptions>
      <el-alert title="已在地图中定位经营主体，并关联批次流向记录" type="success" :closable="false" class="flow-alert" />
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import L from 'leaflet'
import { productionCompanies, businessCompanies, businessFlows } from '@/data/pesticide'

const mapRef = ref(null)
const layerType = ref('production')
const detailVisible = ref(false)
const flowVisible = ref(false)
const detailData = ref({})
const flowData = ref({})
let map = null
let layerGroup = null

const productionPoints = productionCompanies.map((item, index) => ({ ...item, coordinate: [[117.21, 31.84], [118.38, 31.33], [117.36, 32.94]][index] }))
const businessPoints = businessCompanies.map((item, index) => ({ ...item, coordinate: [[117.46, 31.89], [118.45, 31.38], [117.19, 32.97]][index] }))
const currentCompanies = computed(() => layerType.value === 'production' ? productionPoints : businessPoints)

onMounted(() => initMap())

const initMap = () => {
  if (!mapRef.value) return
  map = L.map(mapRef.value).setView([31.86, 117.8], 8)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
  layerGroup = L.layerGroup().addTo(map)
  refreshMap()
}

const refreshMap = () => {
  if (!layerGroup) return
  layerGroup.clearLayers()
  const points = layerType.value === 'production' ? productionPoints : businessPoints
  if (layerType.value === 'flow') {
    businessPoints.forEach(point => addMarker(point, '#F56C6C', '流通预警'))
    return
  }
  points.forEach(point => addMarker(point, layerType.value === 'production' ? '#409EFF' : '#67C23A', layerType.value === 'production' ? '生产企业' : '经营主体'))
}

const addMarker = (point, color, typeName) => {
  L.circleMarker([point.coordinate[1], point.coordinate[0]], { radius: 13, color: '#fff', fillColor: color, fillOpacity: 0.86, weight: 2 }).addTo(layerGroup).bindPopup(`<div style="padding: 8px"><h4 style="margin: 0 0 8px">${point.name}</h4><p>${typeName}</p><p>${point.licenseNo}</p><p>${point.address}</p></div>`)
}

const handleZoomIn = () => map?.zoomIn()
const handleZoomOut = () => map?.zoomOut()
const handleResetView = () => map?.setView([31.86, 117.8], 8)
const handleLocate = row => {
  map?.setView([row.coordinate[1], row.coordinate[0]], 12)
  ElMessage.success(`已定位到 ${row.name}`)
}
const handleView = row => { detailData.value = row; detailVisible.value = true }
const handleCheck = row => { detailVisible.value = false; ElMessage.success(`${row.name} 已生成监管核查任务`) }
const handleFlow = row => {
  flowData.value = row
  layerType.value = 'flow'
  refreshMap()
  const company = businessPoints.find(item => item.id === row.companyId)
  if (company) map?.setView([company.coordinate[1], company.coordinate[0]], 12)
  flowVisible.value = true
}
</script>

<style scoped>
.pesticide-map { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.map-container { position: relative; height: 560px; }
.leaflet-map { height: 560px; width: 100%; border-radius: 8px; overflow: hidden; }
.map-legend, .map-tools, .map-stats { position: absolute; z-index: 500; background: rgba(255, 255, 255, 0.94); border-radius: 6px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12); }
.map-legend { left: 16px; bottom: 16px; padding: 14px; }
.map-legend h4 { margin: 0 0 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
.legend-color { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
.legend-color.production { background: #409EFF; }
.legend-color.business { background: #67C23A; }
.legend-color.warning { background: #F56C6C; }
.map-tools { right: 16px; top: 16px; padding: 8px; }
.map-stats { right: 16px; bottom: 16px; display: flex; gap: 24px; padding: 14px 18px; }
.content-row { margin-top: 20px; }
.flow-alert { margin-top: 18px; }
</style>
