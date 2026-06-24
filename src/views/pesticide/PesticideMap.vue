<template>
  <div class="pesticide-map">
    <el-row :gutter="16" class="overview-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-label">全省生产企业</div>
          <div class="stat-value">{{ productionCompanies.length }}</div>
          <div class="stat-sub">覆盖 {{ coveredCities }} 个重点市县</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-label">累计生产数量</div>
          <div class="stat-value">{{ provinceProductionTotal }}</div>
          <div class="stat-sub">单位：箱，来源生产批次台账</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-label">累计销售总量</div>
          <div class="stat-value">{{ provinceSalesTotal }}</div>
          <div class="stat-sub">单位：箱，来源批次 sales 明细</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card class="stat-card" shadow="never">
          <div class="stat-label">批次台账数量</div>
          <div class="stat-value">{{ productionBatches.length }}</div>
          <div class="stat-sub">已纳入地图统计汇总</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="main-row">
      <el-col :xs="24" :lg="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>农药生产企业分布图</span>
              <el-button-group>
                <el-button size="small" @click="handleZoomIn"><el-icon><ZoomIn /></el-icon></el-button>
                <el-button size="small" @click="handleZoomOut"><el-icon><ZoomOut /></el-icon></el-button>
                <el-button size="small" @click="handleResetView"><el-icon><RefreshRight /></el-icon></el-button>
              </el-button-group>
            </div>
          </template>
          <div class="map-shell">
            <div ref="mapRef" class="leaflet-map"></div>
            <div class="map-legend">
              <div class="legend-title">图例</div>
              <div class="legend-item"><span class="legend-dot"></span><span>生产企业</span></div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="8">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>企业产销对比</span>
              <el-tag type="success" effect="plain">全省</el-tag>
            </div>
          </template>
          <div ref="chartRef" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="list-card">
      <template #header>
        <div class="card-header">
          <span>生产企业名录</span>
          <span class="header-extra">点击“定位”聚焦地图，点击“档案”查看企业画像</span>
        </div>
      </template>
      <el-table :data="companyPoints" border style="width: 100%">
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="name" label="企业名称" min-width="210" />
        <el-table-column prop="city" label="所在区域" width="110" />
        <el-table-column prop="productionScope" label="生产范围" min-width="220" show-overflow-tooltip />
        <el-table-column prop="licenseNo" label="许可证号" width="180" />
        <el-table-column label="累计生产" width="110">
          <template #default="{ row }">{{ row.productionTotal }}箱</template>
        </el-table-column>
        <el-table-column label="累计销售" width="110">
          <template #default="{ row }">{{ row.salesTotal }}箱</template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleLocate(row)">定位</el-button>
            <el-button size="small" type="primary" @click="handleView(row)">档案</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="生产企业档案" width="760px" append-to-body>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="企业名称">{{ detailData.name }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码">{{ detailData.creditCode }}</el-descriptions-item>
        <el-descriptions-item label="所在区域">{{ detailData.city }}</el-descriptions-item>
        <el-descriptions-item label="法定代表人">{{ detailData.legalPerson }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ detailData.phone }}</el-descriptions-item>
        <el-descriptions-item label="许可证号">{{ detailData.licenseNo }}</el-descriptions-item>
        <el-descriptions-item label="许可有效期">{{ detailData.licenseExpiry }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag type="success" effect="plain">正常生产</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="生产范围" :span="2">{{ detailData.productionScope }}</el-descriptions-item>
        <el-descriptions-item label="企业地址" :span="2">{{ detailData.address }}</el-descriptions-item>
        <el-descriptions-item label="累计生产数量">{{ detailData.productionTotal || 0 }}箱</el-descriptions-item>
        <el-descriptions-item label="累计销售数量">{{ detailData.salesTotal || 0 }}箱</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, markRaw, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import L from 'leaflet'
import { productionBatches, productionCompanies } from '@/data/pesticide'

const mapRef = ref(null)
const chartRef = ref(null)
const detailVisible = ref(false)
const detailData = ref({})
const map = shallowRef(null)
const markerLayer = shallowRef(null)
const chart = shallowRef(null)

const anhuiCityCoords = [
  { city: '马鞍山', coordinate: [118.51, 31.69] },
  { city: '合肥', coordinate: [117.47, 31.89] },
  { city: '合肥', coordinate: [117.31, 31.95] },
  { city: '合肥', coordinate: [117.55, 31.74] },
  { city: '宣城', coordinate: [119.42, 30.89] },
  { city: '合肥', coordinate: [117.20, 31.84] },
  { city: '池州', coordinate: [117.03, 30.12] },
  { city: '芜湖', coordinate: [118.38, 31.33] },
  { city: '蚌埠', coordinate: [117.39, 32.92] },
  { city: '安庆', coordinate: [117.05, 30.52] },
  { city: '滁州', coordinate: [118.31, 32.32] },
  { city: '阜阳', coordinate: [115.86, 32.90] },
  { city: '亳州', coordinate: [115.78, 33.85] },
  { city: '六安', coordinate: [116.52, 31.74] },
  { city: '淮南', coordinate: [117.00, 32.63] },
  { city: '淮北', coordinate: [116.80, 33.96] }
]

const getCompanyTotals = companyId => {
  const companyBatches = productionBatches.filter(item => item.companyId === companyId)
  return companyBatches.reduce((totals, batch) => {
    totals.productionTotal += Number(batch.quantity) || 0
    totals.salesTotal += (batch.sales || []).reduce((sum, sale) => sum + (Number(sale.quantity) || 0), 0)
    return totals
  }, { productionTotal: 0, salesTotal: 0 })
}

const companyPoints = computed(() => productionCompanies.map((company, index) => {
  const coord = anhuiCityCoords[index % anhuiCityCoords.length]
  return {
    ...company,
    city: coord.city,
    coordinate: coord.coordinate,
    ...getCompanyTotals(company.id)
  }
}))

const provinceProductionTotal = computed(() => productionBatches.reduce((sum, batch) => sum + (Number(batch.quantity) || 0), 0))
const provinceSalesTotal = computed(() => productionBatches.reduce((sum, batch) => sum + (batch.sales || []).reduce((saleSum, sale) => saleSum + (Number(sale.quantity) || 0), 0), 0))
const coveredCities = computed(() => new Set(companyPoints.value.map(item => item.city)).size)

onMounted(async () => {
  await nextTick()
  initMap()
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  destroyMap()
  destroyChart()
})

const initMap = () => {
  if (!mapRef.value) return
  destroyMap()
  const leafletMap = markRaw(L.map(mapRef.value, { zoomControl: false, attributionControl: true }).setView([31.65, 117.65], 7))
  L.control.zoom({ position: 'topright' }).addTo(leafletMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(leafletMap)
  map.value = leafletMap
  markerLayer.value = markRaw(L.layerGroup().addTo(leafletMap))
  renderMarkers()
  leafletMap.invalidateSize()
}

const destroyMap = () => {
  if (markerLayer.value) {
    markerLayer.value.clearLayers()
    markerLayer.value = null
  }
  if (map.value) {
    map.value.off()
    map.value.remove()
    map.value = null
  }
}

const renderMarkers = () => {
  if (!markerLayer.value) return
  markerLayer.value.clearLayers()
  companyPoints.value.forEach(company => {
    const marker = L.circleMarker([company.coordinate[1], company.coordinate[0]], {
      radius: 11,
      color: '#ffffff',
      fillColor: '#1f7a4d',
      fillOpacity: 0.9,
      weight: 2
    })
    marker.bindTooltip(company.name, { direction: 'top', offset: [0, -8] })
    marker.on('click', () => handleView(company))
    marker.addTo(markerLayer.value)
  })
}

const initChart = () => {
  if (!chartRef.value) return
  destroyChart()
  chart.value = markRaw(echarts.init(chartRef.value))
  chart.value.setOption({
    color: ['#1f7a4d', '#d99a22'],
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { top: 0, right: 0, data: ['生产数量', '销售数量'] },
    grid: { left: 42, right: 18, top: 48, bottom: 76 },
    xAxis: {
      type: 'category',
      data: companyPoints.value.map(item => item.name.replace('安徽', '').replace('有限公司', '')),
      axisLabel: { interval: 0, rotate: 36, fontSize: 11 }
    },
    yAxis: { type: 'value', name: '箱' },
    series: [
      { name: '生产数量', type: 'bar', barMaxWidth: 18, data: companyPoints.value.map(item => item.productionTotal) },
      { name: '销售数量', type: 'bar', barMaxWidth: 18, data: companyPoints.value.map(item => item.salesTotal) }
    ]
  })
}

const destroyChart = () => {
  if (chart.value) {
    chart.value.dispose()
    chart.value = null
  }
}

const handleResize = () => {
  map.value?.invalidateSize()
  chart.value?.resize()
}

const handleZoomIn = () => map.value?.zoomIn()
const handleZoomOut = () => map.value?.zoomOut()
const handleResetView = () => map.value?.setView([31.65, 117.65], 7)

const handleLocate = row => {
  map.value?.setView([row.coordinate[1], row.coordinate[0]], 11)
  detailData.value = row
  ElMessage.success(`已定位到 ${row.name}`)
}

const handleView = row => {
  detailData.value = row
  detailVisible.value = true
}
</script>

<style scoped>
.pesticide-map {
  padding: 0;
}

.overview-row,
.main-row {
  margin-bottom: 16px;
}

.overview-row :deep(.el-col) {
  margin-bottom: 16px;
}

.stat-card {
  border-top: 3px solid #1f7a4d;
  background: linear-gradient(180deg, #f7fbf8 0%, #ffffff 72%);
}

.stat-label {
  color: #52616b;
  font-size: 14px;
}

.stat-value {
  margin-top: 8px;
  color: #12392a;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
}

.stat-sub {
  margin-top: 8px;
  color: #87939d;
  font-size: 12px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-weight: 600;
}

.header-extra {
  color: #87939d;
  font-size: 13px;
  font-weight: 400;
}

.map-shell {
  position: relative;
  z-index: 1;
  height: 560px;
  overflow: hidden;
  border: 1px solid #d8e6dc;
  border-radius: 8px;
  background: #eef5f0;
}

.leaflet-map {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 560px;
}

.leaflet-map :deep(.leaflet-pane),
.leaflet-map :deep(.leaflet-control-container) {
  z-index: 1;
}

.leaflet-map :deep(.leaflet-top),
.leaflet-map :deep(.leaflet-bottom) {
  z-index: 2;
}

.map-legend {
  position: absolute;
  left: 16px;
  bottom: 16px;
  z-index: 3;
  min-width: 118px;
  padding: 12px 14px;
  border: 1px solid #d8e6dc;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 4px 12px rgba(31, 122, 77, 0.12);
}

.legend-title {
  margin-bottom: 8px;
  color: #12392a;
  font-weight: 600;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #52616b;
  font-size: 13px;
}

.legend-dot {
  width: 13px;
  height: 13px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  background: #1f7a4d;
  box-shadow: 0 0 0 1px #1f7a4d;
}

.chart-card,
.chart-card :deep(.el-card__body) {
  height: 100%;
}

.chart-box {
  width: 100%;
  height: 560px;
}

.list-card {
  margin-top: 16px;
}

@media (max-width: 1200px) {
  .chart-box {
    height: 360px;
  }
}
</style>
