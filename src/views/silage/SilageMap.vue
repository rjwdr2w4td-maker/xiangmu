<template>
  <div class="silage-map">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>青贮饲料管理一张图</span>
          <el-radio-group v-model="layerType" size="small" @change="refreshMap">
            <el-radio-button label="planting">种植地块</el-radio-button>
            <el-radio-button label="storage">收储企业</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div class="map-container">
        <div ref="mapRef" class="leaflet-map"></div>
        <div class="map-legend">
          <h4>图例说明</h4>
          <div class="legend-item"><span class="legend-color planting"></span><span>已审核种植地块</span></div>
          <div class="legend-item"><span class="legend-color pending"></span><span>待审核地块</span></div>
          <div class="legend-item"><span class="legend-color storage"></span><span>收储企业</span></div>
        </div>
        <div class="map-tools">
          <el-button-group>
            <el-button size="small" @click="handleZoomIn"><el-icon><ZoomIn /></el-icon></el-button>
            <el-button size="small" @click="handleZoomOut"><el-icon><ZoomOut /></el-icon></el-button>
            <el-button size="small" @click="handleResetView"><el-icon><RefreshRight /></el-icon></el-button>
          </el-button-group>
        </div>
        <div class="map-stats">
          <el-statistic title="种植面积" :value="totalArea" suffix="亩" />
          <el-statistic title="预计产量" :value="totalYield" suffix="吨" />
          <el-statistic title="收储重量" :value="totalWeight" suffix="吨" />
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card>
          <template #header><span>种植备案分布</span></template>
          <el-table :data="plantingRecords" border style="width: 100%">
            <el-table-column prop="subjectName" label="主体" min-width="170" />
            <el-table-column prop="area" label="面积(亩)" width="100" />
            <el-table-column label="状态" width="100"><template #default="{ row }"><el-tag :type="row.status === 'approved' ? 'success' : 'warning'">{{ row.statusName }}</el-tag></template></el-table-column>
            <el-table-column label="操作" width="100"><template #default="{ row }"><el-button size="small" @click="handleLocatePlanting(row)">定位</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>收储流向</span></template>
          <el-table :data="storageRecords" border style="width: 100%">
            <el-table-column prop="subjectName" label="企业" min-width="170" />
            <el-table-column prop="sourceFarmer" label="来源" min-width="150" />
            <el-table-column prop="weight" label="重量(吨)" width="100" />
            <el-table-column label="操作" width="100"><template #default="{ row }"><el-button size="small" @click="handleViewStorage(row)">详情</el-button></template></el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="detailVisible" title="地图要素详情" width="660px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="名称">{{ detailData.subjectName }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detailData.typeName }}</el-descriptions-item>
        <el-descriptions-item label="面积/重量">{{ detailData.scaleText }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailData.statusName }}</el-descriptions-item>
        <el-descriptions-item label="坐标" :span="2">{{ detailData.locationText }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import L from 'leaflet'
import { silagePlantingRecords, silageStorageRecords } from '@/data/silage'

const mapRef = ref(null)
const layerType = ref('planting')
const detailVisible = ref(false)
const detailData = ref({})
const plantingRecords = ref(silagePlantingRecords.map(item => ({ ...item })))
const storageRecords = ref(silageStorageRecords.map((item, index) => ({ ...item, location: [[117.32, 31.84], [117.48, 31.9]][index] || [117.28, 31.86] })))
let map = null
let layerGroup = null

const totalArea = computed(() => plantingRecords.value.reduce((sum, item) => sum + item.area, 0))
const totalYield = computed(() => plantingRecords.value.reduce((sum, item) => sum + item.expectedYield, 0))
const totalWeight = computed(() => storageRecords.value.reduce((sum, item) => sum + item.weight, 0))

onMounted(() => initMap())

const initMap = () => {
  if (!mapRef.value) return
  map = L.map(mapRef.value).setView([31.86, 117.36], 10)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
  layerGroup = L.layerGroup().addTo(map)
  refreshMap()
}

const refreshMap = () => {
  if (!layerGroup) return
  layerGroup.clearLayers()
  if (layerType.value === 'planting') {
    plantingRecords.value.forEach(item => {
      const points = item.plotGeom.map(point => [point[1], point[0]])
      const color = item.status === 'approved' ? '#67C23A' : '#E6A23C'
      L.polygon(points, { color, fillColor: color, fillOpacity: 0.28, weight: 2 }).addTo(layerGroup).bindPopup(getPlantingPopup(item))
    })
  } else {
    storageRecords.value.forEach(item => {
      L.circleMarker([item.location[1], item.location[0]], { radius: 13, color: '#fff', fillColor: '#409EFF', fillOpacity: 0.85, weight: 2 }).addTo(layerGroup).bindPopup(getStoragePopup(item))
    })
  }
  nextTick(() => map?.invalidateSize())
}

const getPlantingPopup = item => `<div style="padding: 8px"><h4 style="margin: 0 0 8px">${item.subjectName}</h4><p>面积：${item.area}亩</p><p>预计产量：${item.expectedYield}吨</p><p>状态：${item.statusName}</p></div>`
const getStoragePopup = item => `<div style="padding: 8px"><h4 style="margin: 0 0 8px">${item.subjectName}</h4><p>来源：${item.sourceFarmer}</p><p>重量：${item.weight}吨</p><p>金额：${(item.totalAmount / 10000).toFixed(2)}万元</p></div>`
const handleZoomIn = () => map?.zoomIn()
const handleZoomOut = () => map?.zoomOut()
const handleResetView = () => map?.setView([31.86, 117.36], 10)
const handleLocatePlanting = row => {
  layerType.value = 'planting'
  refreshMap()
  map?.setView([row.plotLocation[1], row.plotLocation[0]], 13)
  ElMessage.success(`已定位到 ${row.subjectName}`)
}
const handleViewStorage = row => {
  detailData.value = { subjectName: row.subjectName, typeName: '收储企业', scaleText: `${row.weight}吨`, statusName: row.statusName, locationText: row.location.join(', ') }
  detailVisible.value = true
}
</script>

<style scoped>
.silage-map { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.map-container { position: relative; height: 560px; }
.leaflet-map { height: 560px; width: 100%; border-radius: 8px; overflow: hidden; }
.map-legend, .map-tools, .map-stats { position: absolute; z-index: 500; background: rgba(255, 255, 255, 0.94); border-radius: 6px; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12); }
.map-legend { left: 16px; bottom: 16px; padding: 14px; }
.map-legend h4 { margin: 0 0 10px; }
.legend-item { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
.legend-color { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
.legend-color.planting { background: #67C23A; }
.legend-color.pending { background: #E6A23C; }
.legend-color.storage { background: #409EFF; }
.map-tools { right: 16px; top: 16px; padding: 8px; }
.map-stats { right: 16px; bottom: 16px; display: flex; gap: 24px; padding: 14px 18px; }
.content-row { margin-top: 20px; }
</style>
