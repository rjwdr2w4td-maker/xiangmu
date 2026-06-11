<template>
  <div class="business-ledger">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>农药经营电子台账 - 扫码快速录入</span>
          <div>
            <el-button type="primary" @click="handleScanInput">
              <el-icon><Camera /></el-icon>
              扫码录入
            </el-button>
            <el-button type="success" @click="handleAddFlow">
              <el-icon><Plus /></el-icon>
              手动录入
            </el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="今日入库" :value="stats.todayIn" suffix="箱">
            <template #suffix>
              <el-tag type="success" size="small">箱</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="今日出库" :value="stats.todayOut" suffix="箱">
            <template #suffix>
              <el-tag type="warning" size="small">箱</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="库存总量" :value="stats.totalStock" suffix="箱">
            <template #suffix>
              <el-tag type="info" size="small">箱</el-tag>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="预警库存" :value="stats.warningStock" suffix="种">
            <template #suffix>
              <el-tag type="danger" size="small">种</el-tag>
            </template>
          </el-statistic>
        </el-col>
      </el-row>

      <el-divider />

      <el-table :data="flows" border style="width: 100%">
        <el-table-column prop="flowTypeName" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.flowType === 'in' ? 'success' : 'warning'">
              {{ row.flowTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称" width="150" />
        <el-table-column prop="registrationNo" label="登记证号" width="150" />
        <el-table-column prop="batchNo" label="批次号" width="180" />
        <el-table-column prop="quantity" label="数量(箱)" width="100" />
        <el-table-column label="对方信息" min-width="200">
          <template #default="{ row }">
            <div v-if="row.flowType === 'in'">
              来源: {{ row.source }}
            </div>
            <div v-else>
              <div>购买人: {{ row.buyer }}</div>
              <div style="font-size: 12px; color: #666">
                电话: {{ row.buyerPhone }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="transactionDate" label="交易时间" width="120" />
        <el-table-column prop="orderNo" label="单号" width="150" />
        <el-table-column prop="operator" label="操作员" width="100" />
      </el-table>
    </el-card>

    <el-dialog
      v-model="scanDialogVisible"
      title="扫码快速录入"
      width="500px"
    >
      <el-alert
        title="扫描农药包装二维码"
        description="系统将自动识别并填充产品信息，您只需录入数量即可"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      />

      <div class="scan-area">
        <el-button type="primary" size="large" style="width: 100%" @click="handleScanCode">
          <el-icon><Camera /></el-icon>
          点击扫描二维码
        </el-button>
      </div>

      <div v-if="scannedProduct" style="margin-top: 20px">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="产品名称">{{ scannedProduct.name }}</el-descriptions-item>
          <el-descriptions-item label="登记证号">{{ scannedProduct.registrationNo }}</el-descriptions-item>
          <el-descriptions-item label="批次号">{{ scannedProduct.batchNo }}</el-descriptions-item>
        </el-descriptions>

        <el-form :model="scanForm" label-width="80px" style="margin-top: 20px">
          <el-form-item label="类型">
            <el-radio-group v-model="scanForm.flowType">
              <el-radio label="in">入库</el-radio>
              <el-radio label="out">出库</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="数量">
            <el-input-number v-model="scanForm.quantity" :min="1" />
          </el-form-item>
          
          <el-form-item v-if="scanForm.flowType === 'out'" label="购买人">
            <el-input v-model="scanForm.buyer" placeholder="请输入购买人姓名" />
          </el-form-item>
          
          <el-form-item v-if="scanForm.flowType === 'out'" label="电话">
            <el-input v-model="scanForm.buyerPhone" placeholder="请输入联系电话" />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="scanDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveScan" :disabled="!scannedProduct">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="addFlowDialogVisible"
      title="手动录入台账"
      width="600px"
    >
      <el-form :model="flowForm" label-width="100px">
        <el-form-item label="类型">
          <el-radio-group v-model="flowForm.flowType">
            <el-radio label="in">入库</el-radio>
            <el-radio label="out">出库</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="产品名称">
          <el-select v-model="flowForm.productId" placeholder="请选择产品">
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="批次号">
          <el-input v-model="flowForm.batchNo" placeholder="请输入批次号" />
        </el-form-item>
        
        <el-form-item label="数量(箱)">
          <el-input-number v-model="flowForm.quantity" :min="1" />
        </el-form-item>
        
        <el-form-item v-if="flowForm.flowType === 'in'" label="采购来源">
          <el-input v-model="flowForm.source" placeholder="请输入采购来源" />
        </el-form-item>
        
        <el-form-item v-if="flowForm.flowType === 'out'" label="购买人">
          <el-input v-model="flowForm.buyer" placeholder="请输入购买人姓名" />
        </el-form-item>
        
        <el-form-item v-if="flowForm.flowType === 'out'" label="电话">
          <el-input v-model="flowForm.buyerPhone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item v-if="flowForm.flowType === 'out'" label="身份证">
          <el-input v-model="flowForm.buyerIdCard" placeholder="请输入身份证号" />
        </el-form-item>
        
        <el-form-item label="交易时间">
          <el-date-picker v-model="flowForm.transactionDate" type="datetime" />
        </el-form-item>
        
        <el-form-item label="操作员">
          <el-input v-model="flowForm.operator" placeholder="请输入操作员姓名" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addFlowDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveFlow">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { businessFlows, pesticideProducts, productionBatches } from '@/data/pesticide'

const flows = ref([...businessFlows])
const products = ref([...pesticideProducts])

const scanDialogVisible = ref(false)
const addFlowDialogVisible = ref(false)

const scannedProduct = ref(null)

const scanForm = reactive({
  flowType: 'in',
  quantity: 1,
  buyer: '',
  buyerPhone: ''
})

const flowForm = reactive({
  flowType: 'in',
  productId: '',
  batchNo: '',
  quantity: 1,
  source: '',
  buyer: '',
  buyerPhone: '',
  buyerIdCard: '',
  transactionDate: '',
  operator: ''
})

const stats = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const todayFlows = flows.value.filter(f => f.transactionDate === today)
  
  return {
    todayIn: todayFlows.filter(f => f.flowType === 'in').reduce((sum, f) => sum + f.quantity, 0),
    todayOut: todayFlows.filter(f => f.flowType === 'out').reduce((sum, f) => sum + f.quantity, 0),
    totalStock: 150,
    warningStock: 3
  }
})

const handleScanInput = () => {
  scannedProduct.value = null
  scanForm.flowType = 'in'
  scanForm.quantity = 1
  scanForm.buyer = ''
  scanForm.buyerPhone = ''
  scanDialogVisible.value = true
}

const handleScanCode = () => {
  scannedProduct.value = {
    name: '吡虫啉',
    registrationNo: 'PD201XXXXX1',
    batchNo: 'BN20260315001'
  }
  ElMessage.success('二维码识别成功，产品信息已填充')
}

const handleSaveScan = () => {
  flows.value.unshift({
    id: 'FLOW' + Date.now(),
    flowType: scanForm.flowType,
    flowTypeName: scanForm.flowType === 'in' ? '入库' : '出库',
    companyId: 'BIZ2026001',
    companyName: '合肥XX农资经营部',
    productId: 'SCAN_PRODUCT',
    productName: scannedProduct.value.name,
    registrationNo: scannedProduct.value.registrationNo,
    batchNo: scannedProduct.value.batchNo,
    quantity: scanForm.quantity,
    unit: '箱',
    source: scanForm.flowType === 'in' ? '扫码采购入库' : '',
    buyer: scanForm.flowType === 'out' ? scanForm.buyer : '',
    buyerPhone: scanForm.flowType === 'out' ? scanForm.buyerPhone : '',
    buyerIdCard: '',
    transactionDate: new Date().toISOString().split('T')[0],
    orderNo: (scanForm.flowType === 'in' ? 'PO' : 'SO') + Date.now(),
    operator: '扫码操作员'
  })
  ElMessage.success('扫码录入成功，库存已更新')
  scanDialogVisible.value = false
}

const handleAddFlow = () => {
  flowForm.flowType = 'in'
  flowForm.productId = ''
  flowForm.batchNo = ''
  flowForm.quantity = 1
  flowForm.source = ''
  flowForm.buyer = ''
  flowForm.buyerPhone = ''
  flowForm.buyerIdCard = ''
  flowForm.transactionDate = ''
  flowForm.operator = ''
  addFlowDialogVisible.value = true
}

const handleSaveFlow = () => {
  const product = products.value.find(p => p.id === flowForm.productId)
  if (product) {
    flows.value.push({
      id: 'FLOW' + Date.now(),
      flowType: flowForm.flowType,
      flowTypeName: flowForm.flowType === 'in' ? '入库' : '出库',
      companyId: 'BIZ2026001',
      companyName: '合肥XX农资经营部',
      productId: product.id,
      productName: product.name,
      registrationNo: product.registrationNo,
      batchNo: flowForm.batchNo,
      quantity: flowForm.quantity,
      unit: '箱',
      source: flowForm.flowType === 'in' ? flowForm.source : '',
      buyer: flowForm.flowType === 'out' ? flowForm.buyer : '',
      buyerPhone: flowForm.flowType === 'out' ? flowForm.buyerPhone : '',
      buyerIdCard: flowForm.flowType === 'out' ? flowForm.buyerIdCard : '',
      transactionDate: new Date(flowForm.transactionDate).toISOString().split('T')[0],
      orderNo: (flowForm.flowType === 'in' ? 'PO' : 'SO') + Date.now(),
      operator: flowForm.operator
    })
    
    ElMessage.success('台账已保存')
    addFlowDialogVisible.value = false
  }
}
</script>

<style scoped>
.business-ledger {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.scan-area {
  text-align: center;
  padding: 20px;
  border: 2px dashed #409EFF;
  border-radius: 8px;
}
</style>