<template>
  <div class="mobile-pesticide">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>农药查询</h3>
    </div>

    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="输入农药名称或登记证号"
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
        v-for="tag in filterTags"
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
        v-for="item in filteredResults"
        :key="item.id"
        @click="handleDetail(item)"
      >
        <div class="card-header">
          <el-tag :type="item.status === 'valid' ? 'success' : 'warning'" size="small">
            {{ item.status === 'valid' ? '有效' : '过期' }}
          </el-tag>
          <span class="reg-no">{{ item.regNo }}</span>
        </div>
        <h4 class="pesticide-name">{{ item.name }}</h4>
        <div class="card-info">
          <span class="info-row">
            <el-icon><OfficeBuilding /></el-icon>
            {{ item.company }}
          </span>
          <span class="info-row">
            <el-icon><Document /></el-icon>
            {{ item.type }}
          </span>
        </div>
        <div class="card-tags">
          <el-tag v-for="usage in item.usages" :key="usage" size="small" type="info">
            {{ usage }}
          </el-tag>
        </div>
      </div>

      <el-empty v-if="filteredResults.length === 0" description="暂无查询结果" />
    </div>

    <el-dialog v-model="detailVisible" title="农药详情" width="100%">
      <div class="detail-content" v-if="currentItem">
        <div class="detail-header">
          <el-tag :type="currentItem.status === 'valid' ? 'success' : 'warning'">
            {{ currentItem.status === 'valid' ? '登记有效' : '登记过期' }}
          </el-tag>
        </div>
        <h3 class="detail-name">{{ currentItem.name }}</h3>
        <p class="detail-reg">登记证号：{{ currentItem.regNo }}</p>

        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-row">
            <span class="label">生产企业</span>
            <span class="value">{{ currentItem.company }}</span>
          </div>
          <div class="detail-row">
            <span class="label">农药类型</span>
            <span class="value">{{ currentItem.type }}</span>
          </div>
          <div class="detail-row">
            <span class="label">有效成分</span>
            <span class="value">{{ currentItem.component }}</span>
          </div>
          <div class="detail-row">
            <span class="label">含量规格</span>
            <span class="value">{{ currentItem.specification }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h4>适用范围</h4>
          <div class="usage-list">
            <div class="usage-item" v-for="usage in currentItem.usageDetails" :key="usage.crop">
              <span class="crop">{{ usage.crop }}</span>
              <span class="target">防治对象：{{ usage.target }}</span>
              <span class="method">用药方法：{{ usage.method }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>注意事项</h4>
          <ul class="warning-list">
            <li v-for="(warning, index) in currentItem.warnings" :key="index">{{ warning }}</li>
          </ul>
        </div>

        <div class="detail-section">
          <h4>登记有效期</h4>
          <div class="valid-period">
            <span>开始日期：{{ currentItem.validStart }}</span>
            <span>截止日期：{{ currentItem.validEnd }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchKeyword = ref('')
const activeFilter = ref('all')
const detailVisible = ref(false)
const currentItem = ref(null)

const filterTags = [
  { label: '全部', value: 'all' },
  { label: '杀虫剂', value: 'insecticide' },
  { label: '杀菌剂', value: 'fungicide' },
  { label: '除草剂', value: 'herbicide' },
  { label: '植物生长调节剂', value: 'growth' }
]

const pesticideData = ref([
  {
    id: 1,
    name: '吡虫啉',
    regNo: 'PD20080523',
    company: '江苏某农药化工有限公司',
    type: '杀虫剂',
    status: 'valid',
    component: '吡虫啉',
    specification: '10%可湿性粉剂',
    usages: ['水稻', '小麦', '玉米'],
    validStart: '2008-05-23',
    validEnd: '2025-05-23',
    usageDetails: [
      { crop: '水稻', target: '稻飞虱', method: '喷雾，每亩用量20-30克' },
      { crop: '小麦', target: '蚜虫', method: '喷雾，每亩用量15-20克' }
    ],
    warnings: [
      '不能与碱性农药混用',
      '施药时注意防护，避免接触皮肤',
      '收获前7天停止用药',
      '对蜜蜂有毒，开花期禁止使用'
    ]
  },
  {
    id: 2,
    name: '多菌灵',
    regNo: 'PD20091234',
    company: '山东某农药有限公司',
    type: '杀菌剂',
    status: 'valid',
    component: '多菌灵',
    specification: '50%可湿性粉剂',
    usages: ['果树', '蔬菜', '粮食作物'],
    validStart: '2009-12-01',
    validEnd: '2027-12-01',
    usageDetails: [
      { crop: '果树', target: '炭疽病', method: '喷雾，稀释500-800倍' },
      { crop: '蔬菜', target: '灰霉病', method: '喷雾，稀释600倍' }
    ],
    warnings: [
      '可与一般杀菌剂混用',
      '安全间隔期3-5天',
      '不宜长期单一使用'
    ]
  },
  {
    id: 3,
    name: '草甘膦',
    regNo: 'PD20104567',
    company: '浙江某化工集团',
    type: '除草剂',
    status: 'valid',
    component: '草甘膦',
    specification: '41%水剂',
    usages: ['果园', '茶园', '农田'],
    validStart: '2010-06-15',
    validEnd: '2024-06-15',
    usageDetails: [
      { crop: '果园', target: '杂草', method: '喷雾，每亩用量150-200毫升' }
    ],
    warnings: [
      '避免药液飘移到作物上',
      '施药后6小时内遇雨应补喷',
      '对多年生杂草效果好'
    ]
  },
  {
    id: 4,
    name: '乙烯利',
    regNo: 'PD20086789',
    company: '河北某农药厂',
    type: '植物生长调节剂',
    status: 'valid',
    component: '乙烯利',
    specification: '40%水剂',
    usages: ['棉花', '番茄', '香蕉'],
    validStart: '2008-03-01',
    validEnd: '2026-03-01',
    usageDetails: [
      { crop: '棉花', target: '催熟', method: '喷雾，每亩用量100毫升' }
    ],
    warnings: [
      '不能与碱性物质混用',
      '气温20℃以上使用效果好',
      '使用后要及时清洗容器'
    ]
  },
  {
    id: 5,
    name: '敌敌畏',
    regNo: 'PD20051234',
    company: '某农药化工有限公司',
    type: '杀虫剂',
    status: 'expired',
    component: '敌敌畏',
    specification: '80%乳油',
    usages: ['蔬菜', '果树'],
    validStart: '2005-01-01',
    validEnd: '2023-01-01',
    usageDetails: [],
    warnings: ['该产品登记已过期，请勿购买使用']
  }
])

const filteredResults = computed(() => {
  let results = pesticideData.value

  if (searchKeyword.value) {
    results = results.filter(item =>
      item.name.includes(searchKeyword.value) ||
      item.regNo.includes(searchKeyword.value)
    )
  }

  if (activeFilter.value !== 'all') {
    results = results.filter(item => {
      const typeMap = {
        insecticide: '杀虫剂',
        fungicide: '杀菌剂',
        herbicide: '除草剂',
        growth: '植物生长调节剂'
      }
      return item.type === typeMap[activeFilter.value]
    })
  }

  return results
})

const goBack = () => router.back()

const handleSearch = () => {
  // 搜索已在 computed 中处理
}

const handleDetail = (item) => {
  currentItem.value = item
  detailVisible.value = true
}
</script>

<style scoped>
.mobile-pesticide {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #fff;
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

.search-section {
  padding: 16px;
  background: #fff;
}

.quick-filter {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  overflow-x: auto;
  flex-wrap: wrap;
}

.quick-filter::-webkit-scrollbar {
  display: none;
}

.quick-filter .el-tag {
  cursor: pointer;
}

.result-list {
  padding: 12px 16px;
}

.pesticide-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reg-no {
  font-size: 12px;
  color: #9ca3af;
}

.pesticide-name {
  margin: 0 0 12px;
  font-size: 16px;
  color: #1f2937;
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
}

.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-content {
  padding: 8px;
}

.detail-header {
  margin-bottom: 12px;
}

.detail-name {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.detail-reg {
  margin: 8px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.detail-section {
  margin-top: 20px;
}

.detail-section h4 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.detail-row {
  display: flex;
  padding: 8px 0;
}

.detail-row .label {
  width: 80px;
  font-size: 13px;
  color: #6b7280;
}

.detail-row .value {
  font-size: 13px;
  color: #374151;
}

.usage-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.usage-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.crop {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.target, .method {
  font-size: 12px;
  color: #6b7280;
}

.warning-list {
  margin: 0;
  padding-left: 16px;
}

.warning-list li {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 6px;
}

.valid-period {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}
</style>