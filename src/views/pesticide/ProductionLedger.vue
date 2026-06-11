<template>
  <div class="production-ledger">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>农药生产电子台账</span>
          <el-button type="primary" @click="handleAddBatch">
            <el-icon><Plus /></el-icon>
            新增生产批次
          </el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="生产批次管理" name="batches">
          <el-table :data="batches" border style="width: 100%">
            <el-table-column prop="batchNo" label="批次号" width="180" />
            <el-table-column prop="productName" label="产品名称" width="150" />
            <el-table-column prop="registrationNo" label="登记证号" width="150" />
            <el-table-column prop="productionDate" label="生产日期" width="120" />
            <el-table-column prop="quantity" label="数量" width="100">
              <template #default="{ row }">
                {{ row.quantity }} {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column prop="inventory" label="库存" width="100">
              <template #default="{ row }">
                {{ row.inventory }} {{ row.unit }}
              </template>
            </el-table-column>
            <el-table-column label="销售去向" min-width="200">
              <template #default="{ row }">
                <el-tag v-for="sale in row.sales" :key="sale.orderNo" style="margin: 2px">
                  {{ sale.company }}: {{ sale.quantity }}箱
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="企业档案" name="companies">
          <el-table :data="companies" border style="width: 100%">
            <el-table-column prop="name" label="企业名称" width="200" />
            <el-table-column prop="creditCode" label="统一社会信用代码" width="200" />
            <el-table-column prop="legalPerson" label="法人代表" width="100" />
            <el-table-column prop="phone" label="联系电话" width="130" />
            <el-table-column prop="productionScope" label="生产范围" min-width="200" />
            <el-table-column prop="licenseNo" label="许可证号" width="180" />
            <el-table-column prop="licenseExpiry" label="有效期至" width="120" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="产品登记" name="products">
          <el-table :data="products" border style="width: 100%">
            <el-table-column prop="name" label="产品名称" width="150" />
            <el-table-column prop="registrationNo" label="登记证号" width="150" />
            <el-table-column prop="toxicityName" label="毒性" width="100">
              <template #default="{ row }">
                <el-tag :type="row.toxicity === 'low' ? 'success' : row.toxicity === 'medium' ? 'warning' : 'danger'">
                  {{ row.toxicityName }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="formulationName" label="剂型" width="120" />
            <el-table-column prop="content" label="含量" width="100" />
            <el-table-column prop="usageScope" label="使用范围" min-width="150" />
            <el-table-column prop="targetPests" label="防治对象" min-width="150" />
            <el-table-column prop="companyName" label="生产企业" width="180" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      v-model="addBatchDialogVisible"
      title="新增生产批次"
      width="600px"
    >
      <el-form :model="batchForm" label-width="120px">
        <el-form-item label="产品名称">
          <el-select v-model="batchForm.productId" placeholder="请选择产品">
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="批次号">
          <el-input v-model="batchForm.batchNo" placeholder="自动生成" disabled />
        </el-form-item>
        
        <el-form-item label="生产日期">
          <el-date-picker v-model="batchForm.productionDate" type="date" />
        </el-form-item>
        
        <el-form-item label="生产数量">
          <el-input-number v-model="batchForm.quantity" :min="1" />
          <span style="margin-left: 10px">箱</span>
        </el-form-item>
        
        <el-form-item label="规格">
          <el-input v-model="batchForm.specification" placeholder="如：100g/袋×50袋/箱" />
        </el-form-item>
        
        <el-form-item label="质检报告">
          <el-upload action="#" :auto-upload="false">
            <el-button size="small" type="primary">上传质检报告</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addBatchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveBatch">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { productionBatches, productionCompanies, pesticideProducts } from '@/data/pesticide'

const activeTab = ref('batches')

const batches = ref([...productionBatches])
const companies = ref([...productionCompanies])
const products = ref([...pesticideProducts])

const addBatchDialogVisible = ref(false)
const batchForm = reactive({
  productId: '',
  batchNo: '',
  productionDate: '',
  quantity: 1,
  specification: ''
})

const handleAddBatch = () => {
  batchForm.productId = ''
  batchForm.batchNo = 'BN' + Date.now()
  batchForm.productionDate = ''
  batchForm.quantity = 1
  batchForm.specification = ''
  addBatchDialogVisible.value = true
}

const handleSaveBatch = () => {
  const product = products.value.find(p => p.id === batchForm.productId)
  if (product) {
    batches.value.push({
      id: 'BATCH' + Date.now(),
      batchNo: batchForm.batchNo,
      productId: product.id,
      productName: product.name,
      registrationNo: product.registrationNo,
      companyId: product.companyId,
      companyName: product.companyName,
      productionDate: new Date(batchForm.productionDate).toISOString().split('T')[0],
      quantity: batchForm.quantity,
      unit: '箱',
      specification: batchForm.specification,
      qualityReport: '',
      inventory: batchForm.quantity,
      sales: []
    })
    
    ElMessage.success('生产批次已保存')
    addBatchDialogVisible.value = false
  }
}
</script>

<style scoped>
.production-ledger {
  padding: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>