<template>
  <div class="production-ledger">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>农药生产电子台账</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            {{ addButtonText }}
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
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
    >
      <el-form :model="form" label-width="120px">
        <template v-if="activeTab === 'batches'">
          <el-form-item label="产品名称">
            <el-select v-model="form.productId" placeholder="请选择产品" style="width: 100%">
              <el-option
                v-for="product in products"
                :key="product.id"
                :label="product.name"
                :value="product.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="批次号">
            <el-input v-model="form.batchNo" placeholder="自动生成" disabled />
          </el-form-item>

          <el-form-item label="生产日期">
            <el-date-picker v-model="form.productionDate" type="date" style="width: 100%" />
          </el-form-item>

          <el-form-item label="生产数量">
            <el-input-number v-model="form.quantity" :min="1" />
            <span style="margin-left: 10px">箱</span>
          </el-form-item>

          <el-form-item label="规格">
            <el-input v-model="form.specification" placeholder="如：100g/袋×50袋/箱" />
          </el-form-item>
        </template>

        <template v-else-if="activeTab === 'companies'">
          <el-form-item label="企业名称">
            <el-input v-model="form.name" placeholder="请输入企业名称" />
          </el-form-item>

          <el-form-item label="统一社会信用代码">
            <el-input v-model="form.creditCode" placeholder="请输入统一社会信用代码" />
          </el-form-item>

          <el-form-item label="法人代表">
            <el-input v-model="form.legalPerson" placeholder="请输入法人代表" />
          </el-form-item>

          <el-form-item label="联系电话">
            <el-input v-model="form.phone" placeholder="请输入联系电话" />
          </el-form-item>

          <el-form-item label="生产范围">
            <el-input v-model="form.productionScope" placeholder="如：杀虫剂、杀菌剂" />
          </el-form-item>

          <el-form-item label="许可证号">
            <el-input v-model="form.licenseNo" placeholder="请输入许可证号" />
          </el-form-item>

          <el-form-item label="有效期至">
            <el-date-picker v-model="form.licenseExpiry" type="date" style="width: 100%" />
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item label="产品名称">
            <el-input v-model="form.name" placeholder="请输入产品名称" />
          </el-form-item>

          <el-form-item label="登记证号">
            <el-input v-model="form.registrationNo" placeholder="请输入登记证号" />
          </el-form-item>

          <el-form-item label="生产企业">
            <el-select v-model="form.companyId" placeholder="请选择生产企业" style="width: 100%">
              <el-option
                v-for="company in companies"
                :key="company.id"
                :label="company.name"
                :value="company.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="毒性">
            <el-select v-model="form.toxicity" placeholder="请选择毒性" style="width: 100%">
              <el-option label="低毒" value="low" />
              <el-option label="中等毒" value="medium" />
              <el-option label="高毒" value="high" />
            </el-select>
          </el-form-item>

          <el-form-item label="剂型">
            <el-select v-model="form.formulation" placeholder="请选择剂型" style="width: 100%">
              <el-option label="可湿性粉剂" value="WP" />
              <el-option label="水剂" value="SL" />
              <el-option label="乳油" value="EC" />
              <el-option label="悬浮剂" value="SC" />
              <el-option label="水分散粒剂" value="WG" />
            </el-select>
          </el-form-item>

          <el-form-item label="含量">
            <el-input v-model="form.content" placeholder="如：50%" />
          </el-form-item>

          <el-form-item label="使用范围">
            <el-input v-model="form.usageScope" placeholder="如：水稻、小麦、蔬菜" />
          </el-form-item>

          <el-form-item label="防治对象">
            <el-input v-model="form.targetPests" placeholder="如：飞虱、蚜虫" />
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { productionBatches, productionCompanies, pesticideProducts } from '@/data/pesticide'

const activeTab = ref('batches')

const batches = ref([...productionBatches])
const companies = ref([...productionCompanies])
const products = ref([...pesticideProducts])

const dialogVisible = ref(false)
const form = reactive({})

const tabConfig = {
  batches: {
    buttonText: '新增生产批次',
    title: '新增生产批次',
    successMessage: '生产批次已保存'
  },
  companies: {
    buttonText: '新增企业档案',
    title: '新增企业档案',
    successMessage: '企业档案已保存'
  },
  products: {
    buttonText: '新增产品登记',
    title: '新增产品登记',
    successMessage: '产品登记已保存'
  }
}

const toxicityMap = {
  low: '低毒',
  medium: '中等毒',
  high: '高毒'
}

const formulationMap = {
  WP: '可湿性粉剂',
  SL: '水剂',
  EC: '乳油',
  SC: '悬浮剂',
  WG: '水分散粒剂'
}

const addButtonText = computed(() => tabConfig[activeTab.value].buttonText)
const dialogTitle = computed(() => tabConfig[activeTab.value].title)

const resetForm = values => {
  Object.keys(form).forEach(key => {
    delete form[key]
  })
  Object.assign(form, values)
}

const formatDate = value => {
  if (!value) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return new Date(value).toISOString().split('T')[0]
}

const createBatchNo = () => {
  const now = new Date()
  const dateText = formatDate(now).replaceAll('-', '')
  return `BN${dateText}${String(batches.value.length + 1).padStart(3, '0')}`
}

const handleAdd = () => {
  if (activeTab.value === 'batches') {
    resetForm({
      productId: '',
      batchNo: createBatchNo(),
      productionDate: '',
      quantity: 1,
      specification: ''
    })
  } else if (activeTab.value === 'companies') {
    resetForm({
      name: '',
      creditCode: '',
      legalPerson: '',
      phone: '',
      productionScope: '',
      licenseNo: '',
      licenseExpiry: ''
    })
  } else {
    resetForm({
      name: '',
      registrationNo: '',
      companyId: '',
      toxicity: 'low',
      formulation: 'WP',
      content: '',
      usageScope: '',
      targetPests: ''
    })
  }

  dialogVisible.value = true
}

const saveBatch = () => {
  const product = products.value.find(item => item.id === form.productId)
  if (!product) {
    ElMessage.warning('请选择产品')
    return false
  }

  batches.value.push({
    id: `BATCH${Date.now()}`,
    batchNo: form.batchNo,
    productId: product.id,
    productName: product.name,
    registrationNo: product.registrationNo,
    companyId: product.companyId,
    companyName: product.companyName,
    productionDate: formatDate(form.productionDate),
    quantity: form.quantity,
    unit: '箱',
    specification: form.specification,
    qualityReport: '',
    inventory: form.quantity,
    sales: []
  })

  return true
}

const saveCompany = () => {
  companies.value.push({
    id: `COMP${Date.now()}`,
    name: form.name || '未命名企业',
    creditCode: form.creditCode || `91340000${Date.now()}`,
    address: '',
    legalPerson: form.legalPerson || '',
    phone: form.phone || '',
    productionScope: form.productionScope || '',
    licenseNo: form.licenseNo || '',
    licenseExpiry: formatDate(form.licenseExpiry),
    status: 'active',
    createTime: formatDate(new Date())
  })

  return true
}

const saveProduct = () => {
  const company = companies.value.find(item => item.id === form.companyId)
  if (!company) {
    ElMessage.warning('请选择生产企业')
    return false
  }

  products.value.push({
    id: `PROD${Date.now()}`,
    name: form.name || '未命名产品',
    registrationNo: form.registrationNo || `PD${Date.now()}`,
    toxicity: form.toxicity,
    toxicityName: toxicityMap[form.toxicity],
    formulation: form.formulation,
    formulationName: formulationMap[form.formulation],
    content: form.content || '',
    usageScope: form.usageScope || '',
    targetPests: form.targetPests || '',
    companyId: company.id,
    companyName: company.name,
    status: 'active'
  })

  return true
}

const handleSave = () => {
  const saveHandlers = {
    batches: saveBatch,
    companies: saveCompany,
    products: saveProduct
  }

  const saved = saveHandlers[activeTab.value]()
  if (!saved) {
    return
  }

  ElMessage.success(tabConfig[activeTab.value].successMessage)
  dialogVisible.value = false
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
