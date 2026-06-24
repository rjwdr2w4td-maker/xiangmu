<template>
  <div class="mobile-pesticide">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>{{ pageTitle }}</h3>
    </div>

    <template v-if="isRegulatoryEntry">
      <div class="regulatory-hero">
        <div class="hero-title">辖区农药生产经营监管</div>
        <div class="hero-subtitle">{{ selectedCity === 'all' ? '安徽省' : selectedCity }} · 企业档案、生产指标与流通记录</div>
      </div>

      <div class="toolbar-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索企业名称、许可证号或统一社会信用代码"
          clearable
        />
        <el-select v-model="selectedCity" placeholder="选择城市" class="city-select">
          <el-option label="全部城市" value="all" />
          <el-option v-for="city in cityOptions" :key="city" :label="city" :value="city" />
        </el-select>
      </div>

      <div class="metric-grid">
        <div class="metric-card" v-for="metric in regulatoryMetrics" :key="metric.label">
          <span class="metric-label">{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <span class="metric-unit">{{ metric.unit }}</span>
        </div>
      </div>

      <el-tabs v-model="activeCompanyTab" class="company-tabs">
        <el-tab-pane label="生产企业" name="production">
          <div class="company-list">
            <div
              class="company-card"
              v-for="company in filteredProductionCompanies"
              :key="company.id"
              @click="openCompanyDetail(company, 'production')"
            >
              <div class="card-header">
                <el-tag type="success" size="small">生产</el-tag>
                <span class="city-name">{{ getCityName(company.address) }}</span>
              </div>
              <h4>{{ company.name }}</h4>
              <div class="info-row">
                <el-icon><Document /></el-icon>
                {{ company.licenseNo }}
              </div>
              <div class="info-row">
                <el-icon><OfficeBuilding /></el-icon>
                {{ company.productionScope }}
              </div>
              <div class="mini-metrics">
                <span>产品 {{ getCompanyProducts(company.id).length }}</span>
                <span>批次 {{ getProductionBatches(company.id).length }}</span>
                <span>产量 {{ formatNumber(getProductionTotal(company.id)) }} 箱</span>
              </div>
            </div>
            <el-empty v-if="filteredProductionCompanies.length === 0" description="暂无生产企业" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="经营企业" name="business">
          <div class="company-list">
            <div
              class="company-card"
              v-for="company in filteredBusinessCompanies"
              :key="company.id"
              @click="openCompanyDetail(company, 'business')"
            >
              <div class="card-header">
                <el-tag type="primary" size="small">经营</el-tag>
                <span class="city-name">{{ getCityName(company.address) }}</span>
              </div>
              <h4>{{ company.name }}</h4>
              <div class="info-row">
                <el-icon><Document /></el-icon>
                {{ company.licenseNo }}
              </div>
              <div class="info-row">
                <el-icon><OfficeBuilding /></el-icon>
                {{ company.businessType }}
              </div>
              <div class="mini-metrics">
                <span>入库 {{ formatNumber(getBusinessInTotal(company.id)) }} 箱</span>
                <span>出库 {{ formatNumber(getBusinessOutTotal(company.id)) }} 箱</span>
                <span>记录 {{ getBusinessFlows(company.id).length }}</span>
              </div>
            </div>
            <el-empty v-if="filteredBusinessCompanies.length === 0" description="暂无经营企业" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>

    <template v-else>
      <div class="search-section">
        <el-input
          v-model="searchKeyword"
          placeholder="输入农药名称、登记证号或生产企业"
          size="large"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>

      <div class="quick-filter">
        <el-tag
          v-for="tag in productFilterTags"
          :key="tag.value"
          :type="activeFilter === tag.value ? '' : 'info'"
          :effect="activeFilter === tag.value ? 'dark' : 'plain'"
          @click="activeFilter = tag.value"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="result-list">
        <div
          class="pesticide-card"
          v-for="item in filteredProducts"
          :key="item.id"
          @click="openProductDetail(item)"
        >
          <div class="card-header">
            <el-tag :type="item.status === 'active' ? 'success' : 'warning'" size="small">
              {{ item.status === 'active' ? '有效' : '停用' }}
            </el-tag>
            <span class="reg-no">{{ item.registrationNo }}</span>
          </div>
          <h4 class="pesticide-name">{{ item.name }}</h4>
          <div class="card-info">
            <span class="info-row">
              <el-icon><OfficeBuilding /></el-icon>
              {{ item.companyName }}
            </span>
            <span class="info-row">
              <el-icon><Document /></el-icon>
              {{ item.content }} {{ item.formulationName }} · {{ item.toxicityName }}
            </span>
          </div>
          <div class="card-tags">
            <el-tag v-for="usage in splitText(item.usageScope)" :key="usage" size="small" type="info">
              {{ usage }}
            </el-tag>
          </div>
        </div>
        <el-empty v-if="filteredProducts.length === 0" description="暂无查询结果" />
      </div>
    </template>

    <el-dialog v-model="detailVisible" :title="detailTitle" width="100%" class="mobile-detail-dialog">
      <div class="detail-content" v-if="currentItem">
        <template v-if="detailType === 'product'">
          <div class="detail-header">
            <el-tag :type="currentItem.status === 'active' ? 'success' : 'warning'">
              {{ currentItem.status === 'active' ? '登记有效' : '已停用' }}
            </el-tag>
          </div>
          <h3 class="detail-name">{{ currentItem.name }}</h3>
          <p class="detail-reg">登记证号：{{ currentItem.registrationNo }}</p>

          <div class="detail-section">
            <h4>基本信息</h4>
            <div class="detail-row"><span class="label">生产企业</span><span class="value">{{ currentItem.companyName }}</span></div>
            <div class="detail-row"><span class="label">剂型</span><span class="value">{{ currentItem.formulationName }}</span></div>
            <div class="detail-row"><span class="label">含量规格</span><span class="value">{{ currentItem.content }}</span></div>
            <div class="detail-row"><span class="label">毒性</span><span class="value">{{ currentItem.toxicityName }}</span></div>
          </div>

          <div class="detail-section">
            <h4>适用范围</h4>
            <div class="tag-list">
              <el-tag v-for="usage in splitText(currentItem.usageScope)" :key="usage" type="info">{{ usage }}</el-tag>
            </div>
          </div>

          <div class="detail-section">
            <h4>防治对象</h4>
            <div class="tag-list">
              <el-tag v-for="pest in splitText(currentItem.targetPests)" :key="pest" type="warning">{{ pest }}</el-tag>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="detail-header">
            <el-tag :type="detailType === 'production' ? 'success' : 'primary'">
              {{ detailType === 'production' ? '生产企业' : '经营企业' }}
            </el-tag>
          </div>
          <h3 class="detail-name">{{ currentItem.name }}</h3>
          <p class="detail-reg">许可证号：{{ currentItem.licenseNo }}</p>

          <el-tabs v-model="activeDetailTab" class="detail-tabs">
            <el-tab-pane label="档案" name="archive">
              <div class="detail-section compact">
                <div class="detail-row"><span class="label">统一代码</span><span class="value">{{ currentItem.creditCode }}</span></div>
                <div class="detail-row"><span class="label">法定代表人</span><span class="value">{{ currentItem.legalPerson }}</span></div>
                <div class="detail-row"><span class="label">联系电话</span><span class="value">{{ currentItem.phone }}</span></div>
                <div class="detail-row"><span class="label">所在城市</span><span class="value">{{ getCityName(currentItem.address) }}</span></div>
                <div class="detail-row"><span class="label">详细地址</span><span class="value">{{ currentItem.address }}</span></div>
                <div class="detail-row"><span class="label">许可到期</span><span class="value">{{ currentItem.licenseExpiry }}</span></div>
                <div class="detail-row"><span class="label">建档时间</span><span class="value">{{ currentItem.createTime }}</span></div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="指标" name="metrics">
              <div class="detail-metric-grid">
                <div v-for="metric in currentCompanyMetrics" :key="metric.label" class="metric-card small">
                  <span class="metric-label">{{ metric.label }}</span>
                  <strong>{{ metric.value }}</strong>
                  <span class="metric-unit">{{ metric.unit }}</span>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane :label="detailType === 'production' ? '产品' : '流通记录'" name="records">
              <div v-if="detailType === 'production'" class="record-list">
                <div class="record-card" v-for="product in getCompanyProducts(currentItem.id)" :key="product.id">
                  <div class="record-title">{{ product.name }}</div>
                  <div class="record-line">登记证号：{{ product.registrationNo }}</div>
                  <div class="record-line">{{ product.content }} {{ product.formulationName }} · {{ product.toxicityName }}</div>
                  <div class="tag-list light">
                    <el-tag v-for="usage in splitText(product.usageScope)" :key="usage" size="small" type="info">{{ usage }}</el-tag>
                  </div>
                </div>
                <el-empty v-if="getCompanyProducts(currentItem.id).length === 0" description="暂无产品" />
              </div>

              <div v-else class="record-list">
                <div class="record-card" v-for="flow in getBusinessFlows(currentItem.id)" :key="flow.id">
                  <div class="record-head">
                    <span class="record-title">{{ flow.productName }}</span>
                    <el-tag :type="flow.flowType === 'in' ? 'success' : 'warning'" size="small">{{ flow.flowTypeName }}</el-tag>
                  </div>
                  <div class="record-line">登记证号：{{ flow.registrationNo }}</div>
                  <div class="record-line">批号：{{ flow.batchNo }}</div>
                  <div class="record-line">数量：{{ flow.quantity }}{{ flow.unit }} · 日期：{{ flow.transactionDate }}</div>
                  <div class="record-line">{{ flow.flowType === 'in' ? `来源：${flow.source}` : `购买方：${flow.buyer}` }}</div>
                </div>
                <el-empty v-if="getBusinessFlows(currentItem.id).length === 0" description="暂无流通记录" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Document, OfficeBuilding } from '@element-plus/icons-vue'
import {
  businessCompanies,
  businessFlows,
  pesticideProducts,
  productionBatches,
  productionCompanies
} from '@/data/pesticide'

const router = useRouter()
const route = useRoute()

const searchKeyword = ref('')
const activeFilter = ref('all')
const selectedCity = ref('all')
const activeCompanyTab = ref('production')
const detailVisible = ref(false)
const currentItem = ref(null)
const detailType = ref('product')
const activeDetailTab = ref('archive')

const productFilterTags = [
  { label: '全部', value: 'all' },
  { label: '低毒', value: 'low' },
  { label: '中等毒', value: 'medium' },
  { label: '高毒', value: 'high' },
  { label: '可湿性粉剂', value: 'WP' },
  { label: '悬浮剂', value: 'SC' },
  { label: '乳油', value: 'EC' }
]

const isRegulatoryEntry = computed(() => route.params.entry === 'wanzhengtong')
const pageTitle = computed(() => (isRegulatoryEntry.value ? '农药监管' : '农药查询'))
const detailTitle = computed(() => {
  if (detailType.value === 'product') return '农药详情'
  return detailType.value === 'production' ? '生产企业详情' : '经营企业详情'
})

const cityOptions = computed(() => {
  const cities = [...productionCompanies, ...businessCompanies].map(item => getCityName(item.address)).filter(Boolean)
  return [...new Set(cities)]
})

const filteredProductionCompanies = computed(() => filterCompanies(productionCompanies))
const filteredBusinessCompanies = computed(() => filterCompanies(businessCompanies))

const filteredProducts = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return pesticideProducts.filter(item => {
    const matchesKeyword = !keyword || [
      item.name,
      item.registrationNo,
      item.companyName,
      item.usageScope,
      item.targetPests
    ].some(value => String(value || '').toLowerCase().includes(keyword))
    const matchesFilter = activeFilter.value === 'all' || item.toxicity === activeFilter.value || item.formulation === activeFilter.value
    return matchesKeyword && matchesFilter
  })
})

const scopedProductionCompanyIds = computed(() => new Set(filteredProductionCompanies.value.map(item => item.id)))
const scopedBusinessCompanyIds = computed(() => new Set(filteredBusinessCompanies.value.map(item => item.id)))

const scopedProducts = computed(() => pesticideProducts.filter(item => scopedProductionCompanyIds.value.has(item.companyId)))
const scopedBatches = computed(() => productionBatches.filter(item => scopedProductionCompanyIds.value.has(item.companyId)))
const scopedFlows = computed(() => businessFlows.filter(item => scopedBusinessCompanyIds.value.has(item.companyId)))

const regulatoryMetrics = computed(() => [
  { label: '生产企业', value: filteredProductionCompanies.value.length, unit: '家' },
  { label: '经营企业', value: filteredBusinessCompanies.value.length, unit: '家' },
  { label: '累计生产', value: formatNumber(sumBy(scopedBatches.value, 'quantity')), unit: '箱' },
  { label: '销售总量', value: formatNumber(getSalesTotal(scopedBatches.value) + sumBy(scopedFlows.value.filter(item => item.flowType === 'out'), 'quantity')), unit: '箱' },
  { label: '有效产品', value: scopedProducts.value.filter(item => item.status === 'active').length, unit: '个' }
])

const currentCompanyMetrics = computed(() => {
  if (!currentItem.value) return []
  if (detailType.value === 'production') {
    const products = getCompanyProducts(currentItem.value.id)
    const batches = getProductionBatches(currentItem.value.id)
    return [
      { label: '有效产品', value: products.filter(item => item.status === 'active').length, unit: '个' },
      { label: '生产批次', value: batches.length, unit: '批' },
      { label: '累计生产', value: formatNumber(sumBy(batches, 'quantity')), unit: '箱' },
      { label: '累计销售', value: formatNumber(getSalesTotal(batches)), unit: '箱' }
    ]
  }
  const flows = getBusinessFlows(currentItem.value.id)
  return [
    { label: '流通记录', value: flows.length, unit: '条' },
    { label: '入库总量', value: formatNumber(sumBy(flows.filter(item => item.flowType === 'in'), 'quantity')), unit: '箱' },
    { label: '出库总量', value: formatNumber(sumBy(flows.filter(item => item.flowType === 'out'), 'quantity')), unit: '箱' },
    { label: '经营产品', value: new Set(flows.map(item => item.productId)).size, unit: '个' }
  ]
})

const goBack = () => router.back()
const handleSearch = () => {}

const filterCompanies = (companies) => {
  const keyword = searchKeyword.value.trim().toLowerCase()
  return companies.filter(item => {
    const matchesCity = selectedCity.value === 'all' || getCityName(item.address) === selectedCity.value
    const matchesKeyword = !keyword || [
      item.name,
      item.licenseNo,
      item.creditCode,
      item.address,
      item.legalPerson
    ].some(value => String(value || '').toLowerCase().includes(keyword))
    return matchesCity && matchesKeyword
  })
}

const openProductDetail = (item) => {
  currentItem.value = item
  detailType.value = 'product'
  detailVisible.value = true
}

const openCompanyDetail = (item, type) => {
  currentItem.value = item
  detailType.value = type
  activeDetailTab.value = 'archive'
  detailVisible.value = true
}

const getCityName = (address = '') => {
  const matched = String(address).match(/([^省市区县镇路号]+市)/)
  return matched ? matched[1] : '未知城市'
}

const getCompanyProducts = (companyId) => pesticideProducts.filter(item => item.companyId === companyId)
const getProductionBatches = (companyId) => productionBatches.filter(item => item.companyId === companyId)
const getBusinessFlows = (companyId) => businessFlows.filter(item => item.companyId === companyId)
const getProductionTotal = (companyId) => sumBy(getProductionBatches(companyId), 'quantity')
const getBusinessInTotal = (companyId) => sumBy(getBusinessFlows(companyId).filter(item => item.flowType === 'in'), 'quantity')
const getBusinessOutTotal = (companyId) => sumBy(getBusinessFlows(companyId).filter(item => item.flowType === 'out'), 'quantity')

const getSalesTotal = (batches) => batches.reduce((total, batch) => {
  const batchSales = Array.isArray(batch.sales) ? batch.sales.reduce((sum, sale) => sum + Number(sale.quantity || 0), 0) : 0
  return total + batchSales
}, 0)

const sumBy = (list, key) => list.reduce((total, item) => total + Number(item[key] || 0), 0)
const formatNumber = (value) => Number(value || 0).toLocaleString('zh-CN')
const splitText = (value = '') => String(value).split(/[、,，]/).map(item => item.trim()).filter(Boolean)
</script>

<style scoped>
.mobile-pesticide {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.page-header .el-icon {
  font-size: 22px;
  cursor: pointer;
}

.regulatory-hero {
  margin: 12px 16px 0;
  padding: 16px;
  color: #fff;
  background: linear-gradient(135deg, #1a3a5c, #28547d);
  border-radius: 4px;
}

.hero-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

.hero-subtitle {
  font-size: 12px;
  opacity: 0.86;
}

.toolbar-section,
.search-section {
  padding: 16px;
  background: #fff;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.city-select {
  width: 100%;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding: 12px 16px;
}

.metric-card {
  background: #fff;
  border-radius: 4px;
  padding: 13px;
  box-shadow: 0 1px 6px rgba(26, 58, 92, 0.08);
}

.metric-card strong {
  display: inline-block;
  margin-top: 6px;
  font-size: 20px;
  color: #1a3a5c;
}

.metric-card.small strong {
  font-size: 18px;
}

.metric-label,
.metric-unit {
  display: block;
  font-size: 12px;
  color: #6b7280;
}

.company-tabs {
  padding: 0 16px 16px;
}

.company-list,
.result-list,
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-list {
  padding: 12px 16px;
}

.company-card,
.pesticide-card,
.record-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  box-shadow: 0 1px 6px rgba(31, 41, 55, 0.06);
}

.company-card h4,
.pesticide-name {
  margin: 0 0 12px;
  font-size: 16px;
  color: #1f2937;
  line-height: 1.4;
}

.card-header,
.record-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.city-name,
.reg-no {
  font-size: 12px;
  color: #9ca3af;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

.mini-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.mini-metrics span {
  padding: 4px 8px;
  background: #f0f5fa;
  border-radius: 4px;
  font-size: 12px;
  color: #1a3a5c;
}

.quick-filter,
.card-tags,
.tag-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-filter {
  padding: 12px 16px;
  background: #fff;
  overflow-x: auto;
}

.quick-filter::-webkit-scrollbar {
  display: none;
}

.quick-filter .el-tag {
  cursor: pointer;
}

.detail-content {
  padding: 4px 0 12px;
}

.detail-header {
  margin-bottom: 12px;
}

.detail-name {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
  line-height: 1.4;
}

.detail-reg {
  margin: 8px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.detail-section {
  margin-top: 20px;
}

.detail-section.compact {
  margin-top: 4px;
}

.detail-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.detail-row {
  display: flex;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-row .label {
  width: 84px;
  flex: 0 0 84px;
  font-size: 13px;
  color: #6b7280;
}

.detail-row .value {
  flex: 1;
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
  word-break: break-all;
}

.detail-tabs {
  margin-top: 16px;
}

.detail-metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.record-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.record-line {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
}

.tag-list.light {
  margin-top: 10px;
}

:deep(.el-dialog) {
  max-width: 100vw;
  margin: 0;
  border-radius: 4px 4px 0 0;
}

:deep(.mobile-detail-dialog) {
  margin-top: 8vh;
}

:deep(.el-dialog__body) {
  max-height: 78vh;
  overflow-y: auto;
}

:deep(.el-tabs__item.is-active),
:deep(.el-tabs__active-bar) {
  color: #1a3a5c;
}

:deep(.el-tabs__active-bar) {
  background-color: #1a3a5c;
}
</style>
