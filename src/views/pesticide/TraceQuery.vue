<template>
  <div class="trace-query">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>农药追溯查询</span>
          <el-button type="primary" @click="handleScan"><el-icon><Search /></el-icon>模拟扫码</el-button>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="追溯码/批次号"><el-input v-model="searchForm.keyword" placeholder="请输入批次号、产品名、登记证号" clearable /></el-form-item>
        <el-form-item label="产品名称"><el-select v-model="searchForm.productId" placeholder="全部产品" clearable><el-option v-for="product in pesticideProducts" :key="product.id" :label="product.name" :value="product.id" /></el-select></el-form-item>
        <el-form-item><el-button type="primary" @click="handleSearch">查询</el-button><el-button @click="handleReset">重置</el-button></el-form-item>
      </el-form>

      <el-table :data="filteredBatches" border style="width: 100%">
        <el-table-column prop="batchNo" label="批次号" width="170" />
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="registrationNo" label="登记证号" width="150" />
        <el-table-column prop="companyName" label="生产企业" min-width="200" />
        <el-table-column prop="productionDate" label="生产日期" width="120" />
        <el-table-column prop="quantity" label="生产数量" width="110"><template #default="{ row }">{{ row.quantity }}{{ row.unit }}</template></el-table-column>
        <el-table-column prop="inventory" label="库存" width="100"><template #default="{ row }">{{ row.inventory }}{{ row.unit }}</template></el-table-column>
        <el-table-column label="操作" width="260" fixed="right"><template #default="{ row }"><el-button size="small" @click="handleTrace(row)">追溯链路</el-button><el-button size="small" type="primary" @click="handleQuality(row)">质检报告</el-button><el-button size="small" type="success" @click="handleSubmit(row)">提交核验</el-button></template></el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="traceVisible" title="农药全链路追溯" width="900px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="批次号">{{ currentBatch.batchNo }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ currentBatch.productName }}</el-descriptions-item>
        <el-descriptions-item label="生产企业">{{ currentBatch.companyName }}</el-descriptions-item>
        <el-descriptions-item label="规格">{{ currentBatch.specification }}</el-descriptions-item>
      </el-descriptions>
      <el-divider content-position="left">流向链路</el-divider>
      <el-timeline>
        <el-timeline-item :timestamp="currentBatch.productionDate" type="success">
          <h4>生产入库</h4>
          <p>{{ currentBatch.companyName }} 生产 {{ currentBatch.quantity }}{{ currentBatch.unit }}</p>
        </el-timeline-item>
        <el-timeline-item v-for="sale in currentBatch.sales" :key="sale.orderNo" :timestamp="sale.date" type="primary">
          <h4>销售出库</h4>
          <p>流向 {{ sale.company }}，数量 {{ sale.quantity }}{{ currentBatch.unit }}，单号 {{ sale.orderNo }}</p>
        </el-timeline-item>
        <el-timeline-item v-for="flow in matchedFlows" :key="flow.id" :timestamp="flow.transactionDate" :type="flow.flowType === 'out' ? 'warning' : 'info'">
          <h4>{{ flow.companyName }} {{ flow.flowTypeName }}</h4>
          <p>{{ flow.flowType === 'out' ? `购买人 ${flow.buyer}` : `来源 ${flow.source}` }}，数量 {{ flow.quantity }}{{ flow.unit }}，单号 {{ flow.orderNo }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

    <el-dialog v-model="qualityVisible" title="质检与登记信息" width="720px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="产品名称">{{ currentProduct.name }}</el-descriptions-item>
        <el-descriptions-item label="登记证号">{{ currentProduct.registrationNo }}</el-descriptions-item>
        <el-descriptions-item label="毒性">{{ currentProduct.toxicityName }}</el-descriptions-item>
        <el-descriptions-item label="剂型">{{ currentProduct.formulationName }}</el-descriptions-item>
        <el-descriptions-item label="含量">{{ currentProduct.content }}</el-descriptions-item>
        <el-descriptions-item label="生产企业">{{ currentProduct.companyName }}</el-descriptions-item>
        <el-descriptions-item label="使用范围" :span="2">{{ currentProduct.usageScope }}</el-descriptions-item>
        <el-descriptions-item label="防治对象" :span="2">{{ currentProduct.targetPests }}</el-descriptions-item>
      </el-descriptions>
      <el-alert title="质检报告已通过校验，可用于执法抽查和经营台账核验" type="success" :closable="false" class="quality-alert" />
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { pesticideProducts, productionBatches, businessFlows } from '@/data/pesticide'

const searchForm = reactive({ keyword: '', productId: '' })
const traceVisible = ref(false)
const qualityVisible = ref(false)
const currentBatch = ref({ sales: [] })
const currentProduct = ref({})

const filteredBatches = computed(() => productionBatches.filter(item => {
  const keyword = searchForm.keyword.trim()
  return (!keyword || item.batchNo.includes(keyword) || item.productName.includes(keyword) || item.registrationNo.includes(keyword)) && (!searchForm.productId || item.productId === searchForm.productId)
}))
const matchedFlows = computed(() => businessFlows.filter(item => item.batchNo === currentBatch.value.batchNo))

const handleSearch = () => ElMessage.success(`查询到 ${filteredBatches.value.length} 个生产批次`)
const handleReset = () => Object.assign(searchForm, { keyword: '', productId: '' })
const handleScan = () => {
  searchForm.keyword = productionBatches[0].batchNo
  ElMessage.success('已识别包装二维码并填入批次号')
}
const handleTrace = row => {
  currentBatch.value = row
  traceVisible.value = true
}
const handleQuality = row => {
  currentProduct.value = pesticideProducts.find(item => item.id === row.productId) || {}
  qualityVisible.value = true
}
const handleSubmit = row => ElMessage.success(`${row.batchNo} 已提交监管核验`)
</script>

<style scoped>
.trace-query { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.search-form { margin-bottom: 16px; }
.quality-alert { margin-top: 18px; }
</style>
