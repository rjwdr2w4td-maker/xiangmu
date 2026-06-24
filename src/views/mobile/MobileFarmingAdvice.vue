<template>
  <div class="mobile-farming-advice">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>个性化农事建议</h3>
      <el-icon class="refresh-icon" @click="handleRefresh"><Refresh /></el-icon>
    </div>

    <div class="date-info">
      <span class="current-date">{{ currentDate }}</span>
      <span class="week-day">{{ weekDay }}</span>
    </div>

    <div class="filter-section">
      <div class="filter-row">
        <el-select v-model="selectedCity" placeholder="选择城市" class="city-selector" @change="filterAdvices">
          <el-option label="全部城市" value="" />
          <el-option v-for="city in cities" :key="city" :label="city" :value="city" />
        </el-select>
        <el-select v-model="selectedCrop" placeholder="选择作物" class="crop-selector" @change="filterAdvices">
          <el-option label="全部作物" value="" />
          <el-option v-for="crop in cropTypes" :key="crop.value" :label="crop.label" :value="crop.value" />
        </el-select>
      </div>
    </div>

    <div class="advice-summary">
      <span>共 {{ filteredAdvices.length }} 条农事建议</span>
    </div>

    <div class="advice-list">
      <div
        v-for="item in filteredAdvices"
        :key="item.id"
        class="advice-card"
        :class="{ expanded: expandedCards.includes(item.id) }"
      >
        <div class="card-header" @click="toggleCard(item.id)">
          <div class="header-left">
            <div class="region-tag">{{ item.region }}</div>
            <div class="crop-badge" :style="{ background: getCropColor(item.cropType) }">
              {{ getCropLabel(item.cropType) }}
            </div>
          </div>
          <el-icon class="expand-icon" :class="{ rotated: expandedCards.includes(item.id) }">
            <ArrowDown />
          </el-icon>
        </div>

        <div class="card-body">
          <div class="growth-stage">
            <el-icon><Calendar /></el-icon>
            <span>生长阶段：{{ item.growthStage }}</span>
          </div>
          <div class="weather-context">
            <el-icon><Cloudy /></el-icon>
            <span>{{ item.weather }}</span>
          </div>

          <div class="advices-section">
            <div class="section-title">农事建议</div>
            <div class="advice-items">
              <div v-for="(advice, index) in item.advices" :key="index" class="advice-item">
                <span class="advice-number">{{ index + 1 }}</span>
                <span class="advice-text">{{ advice }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="expandedCards.includes(item.id)" class="detailed-guidance">
          <div class="guidance-title">详细指导</div>
          <div class="guidance-content">
            <div v-for="(advice, index) in item.advices" :key="index" class="guidance-item">
              <div class="guidance-header">
                <span class="guidance-number">步骤{{ index + 1 }}</span>
              </div>
              <div class="guidance-detail">{{ getDetailedGuidance(item.cropType, item.growthStage, index) }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredAdvices.length === 0" class="empty-state">
        <el-icon class="empty-icon"><Document /></el-icon>
        <p>暂无符合条件的农事建议</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { agriculturalAdvices } from '@/data/disasters'

const router = useRouter()

const selectedCity = ref('')
const selectedCrop = ref('')
const expandedCards = ref([])
const isRefreshing = ref(false)

const cities = [
  '合肥市', '宿州市', '阜阳市', '芜湖市', '亳州市',
  '六安市', '安庆市', '黄山市', '蚌埠市', '淮北市',
  '淮南市', '滁州市'
]

const cropTypes = [
  { value: 'wheat', label: '小麦' },
  { value: 'rice', label: '水稻' },
  { value: 'corn', label: '玉米' },
  { value: 'soybean', label: '大豆' },
  { value: 'rapeseed', label: '油菜' },
  { value: 'vegetables', label: '蔬菜' },
  { value: 'tea', label: '茶叶' }
]

const filteredAdvices = ref([...agriculturalAdvices])

const currentDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
})

const weekDay = computed(() => {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return days[new Date().getDay()]
})

const getCropLabel = (cropType) => {
  const crop = cropTypes.find(c => c.value === cropType)
  return crop ? crop.label : cropType
}

const getCropColor = (cropType) => {
  const colors = {
    wheat: '#f59e0b',
    rice: '#10b981',
    corn: '#eab308',
    soybean: '#8b5cf6',
    rapeseed: '#f97316',
    vegetables: '#22c55e',
    tea: '#059669'
  }
  return colors[cropType] || '#6b7280'
}

const filterAdvices = () => {
  let result = [...agriculturalAdvices]

  if (selectedCity.value) {
    result = result.filter(item => item.region === selectedCity.value)
  }

  if (selectedCrop.value) {
    result = result.filter(item => item.cropType === selectedCrop.value)
  }

  filteredAdvices.value = result
}

const toggleCard = (id) => {
  const index = expandedCards.value.indexOf(id)
  if (index > -1) {
    expandedCards.value.splice(index, 1)
  } else {
    expandedCards.value.push(id)
  }
}

const getDetailedGuidance = (cropType, growthStage, adviceIndex) => {
  const detailedGuidance = {
    wheat: {
      '拔节期': [
        '选择晴好天气上午10点前或下午4点后进行灌溉，每亩灌水量30-40方，确保田间不积水。追肥结合灌溉进行，尿素撒施后立即浇水，提高肥料利用率。',
        '密切关注天气预报，当最低气温预报低于5℃时，提前1-2天喷施防冻剂。每亩用磷酸二氢钾100克+芸苔素内酯10毫升+水30公斤叶面喷雾，增强小麦抗寒能力。',
        '纹枯病调查采用五点取样法，每点调查50株，当病株率达5%时，选用井冈霉素或噻呋酰胺对水喷雾，重点喷洒小麦茎基部。条锈病发现中心病株立即用药封锁。',
        '除草剂选择以唑草酮、苯磺隆为主，气温稳定在10℃以上施药。选择无风晴天上午10点至下午3点施药，避免低温或高温时段施药造成药害。'
      ],
      '拔节孕穗期': [
        '拔节水灌溉宜少量多次，每亩每次灌水20-30方，保持田间土壤湿润但不积水。追肥结合灌水进行，尿素用量每亩8-10公斤，促进穗分化。',
        '无灌溉条件地块叶面喷施抗旱剂，每亩用黄腐酸100克或旱地龙50毫升对水30公斤喷雾，减少叶片水分蒸腾，增强抗旱能力。',
        '麦蜘蛛调查采用33厘米长单行取样，当每米行长有虫200头时，用阿维菌素或哒螨灵喷雾防治。蚜虫调查采用五点取样，百株蚜量达500头时用吡虫啉或啶虫脒防治。',
        '吸浆虫淘土调查每亩取5个样点，每点10×10×20厘米土样，当每样方有虫5头以上时，用毒死蜱颗粒剂拌细土撒施于麦行间，结合浇水提高防效。'
      ],
      '灌浆期': [
        '麦黄水灌溉在灌浆初期进行，每亩灌水15-20方，选择无风天气早晚时段灌溉，避免高温时段浇水导致根系早衰。灌水后田间不宜积水。',
        '叶面喷肥选择阴天或早晚进行，每亩用磷酸二氢钾200克+尿素1公斤对水30公斤喷雾。间隔7-10天再喷一次，共喷2-3次，延缓叶片衰老，增加粒重。',
        '穗蚜调查采用随机取样法，百穗蚜量达500头时立即防治。用吡虫啉、啶虫脒或高效氯氰菊酯喷雾，重点喷洒穗部，注意轮换用药防止抗药性。',
        '蜡熟末期判断标准：籽粒含水量25%-30%，胚乳呈蜡状，指甲掐无痕迹。选择晴天及时收割，防止干热风导致枯熟落粒和穗发芽。'
      ]
    },
    rice: {
      '返青分蘖期': [
        '移栽后保持浅水层2-3厘米，促进秧苗扎根返青。返青后采用浅水湿润灌溉，每次灌水后自然落干1-2天再灌，促进根系发育和分蘖早生快发。',
        '梅雨季节密切关注田间水层变化，暴雨前疏通排水沟渠，保持田间水层不超过秧苗叶耳。受淹田块及时排水，冲洗叶片淤泥，补施速效氮肥促进恢复生长。',
        '分蘖肥在移栽后7-10天施用，每亩追施尿素8-10公斤。施肥时田间保持薄水层，施肥后自然落干再灌水，提高肥料利用率。注意氮肥不可过量，防止后期贪青晚熟。',
        '稻蓟马调查采用五点取样，每点调查10丛，当卷叶株率达15%时防治。二化螟调查枯鞘率，当枯鞘率达5%时用阿维菌素或氯虫苯甲酰胺喷雾防治。'
      ],
      '抽穗扬花期': [
        '高温热害防御关键期保持稻田深水层8-10厘米，日灌夜排，白天深水降温增湿，夜间排水通气，降低高温对花粉活力的影响。',
        '叶面喷肥每亩用磷酸二氢钾150克+芸苔素内酯10毫升+氨基酸水溶肥50毫升对水30公斤喷雾，上午9点前或下午5点后喷施，增强花粉活力和耐热性。',
        '有喷灌条件的田块，午间11-15点进行喷灌降温，每次喷水15-20分钟，可降低穗层温度2-3℃，减轻高温热害。',
        '高温期间稻飞虱和稻纵卷叶螟易暴发，加密田间调查频次至每2天一次。稻飞虱百丛虫量达1000头时，用吡蚜酮或噻虫嗪防治；卷叶螟卷叶率5%时用甲维盐防治。'
      ]
    },
    corn: {
      '播种期': [
        '春玉米播种选择郑单958、先玉335、隆平206等耐密高产品种。播种深度3-5厘米，沙壤土稍深、粘土稍浅。每亩留苗4000-4500株，种肥同播，每亩施复合肥30-40公斤。',
        '播种后立即喷施乙草胺或异丙甲草胺封闭除草，防除马唐、稗草等一年生禾本科杂草。喷药时土壤湿度60%-70%效果最好，干旱地块适当加大水量。',
        '播种后覆盖地膜可提高地温2-3℃，促进出苗。地膜选择厚度0.008毫米、宽度80厘米的透明地膜，覆盖时压紧压实，出苗后及时放苗防止高温烫伤。'
      ],
      '灌浆成熟期': [
        '夏玉米灌浆期需水量大，遇旱及时浇灌浆水，每亩灌水30-40方，保证籽粒灌浆充实。灌溉选择早晚进行，避免高温时段浇水伤根。',
        '玉米螟防治在心叶期进行，用辛硫磷颗粒剂丢心，每株丢2-3粒。穗期虫穗率达10%时，用氯虫苯甲酰胺或甲维盐灌心防治，每株灌药液5-10毫升。',
        '南方锈病发病初期用戊唑醇或嘧菌酯喷雾防治，每隔7天喷一次，连喷2-3次。大斑病发病初期用苯醚甲环唑或代森锰锌喷雾，重点喷洒中下部叶片。',
        '适时晚收标准：苞叶变白干枯，籽粒乳线消失，籽粒含水量30%左右。晚收可延长灌浆时间，每推迟1天收获可增产1%-1.5%。'
      ]
    },
    soybean: {
      '结荚鼓粒期': [
        '结荚鼓粒期需水量占全生育期50%以上，遇旱及时灌溉，保持土壤相对含水量70%-80%。灌溉采用沟灌或喷灌，避免漫灌造成土壤板结。',
        '鼓粒期叶面喷肥每亩用磷酸二氢钾150克+硼砂100克+钼酸铵10克对水30公斤喷雾，每隔7-10天喷一次，共喷2-3次，促进籽粒饱满增重。',
        '大豆食心虫和豆荚螟成虫盛发期，用高效氯氟氰菊酯+甲维盐混合喷雾，重点喷洒豆荚和叶片背面。每隔7天喷一次，连喷2-3次。',
        '霜霉病和紫斑病发病初期，用甲霜灵锰锌或代森锰锌喷雾防治。及时拔除病株带出田外销毁，减少田间菌源。'
      ]
    },
    rapeseed: {
      '盛花期': [
        '菌核病防治关键期，在油菜盛花期和终花期各喷药一次。用药选择菌核净、多菌灵或咪鲜胺，每亩用药液量30-40公斤，重点喷洒植株中下部茎秆。',
        '硼肥喷施每亩用硼砂100克对水30公斤，盛花期喷雾一次。磷酸二氢钾每亩用150克，与硼肥混合喷施，提高结实率和千粒重。',
        '清沟排水保持田间沟渠通畅，雨后及时排除积水。地下水位高的田块加深围沟和腰沟，降低田间湿度，减少菌核病发生。',
        '蚜虫防治在油菜终花期进行，百株蚜量达1000头时用吡虫啉或啶虫脒喷雾。重点喷洒花轴和嫩荚，控制蚜虫危害。'
      ],
      '移栽期': [
        '油菜移栽苗龄30-35天，选择壮苗带土移栽。移栽密度每亩6000-8000株，行距40厘米、株距20厘米。移栽时做到带肥、带药、带水，提高成活率。',
        '移栽前精细整地，每亩施45%复合肥30-40公斤+硼砂1公斤作基肥。翻耕深度20-25厘米，耕细耙平，做到土碎地平。',
        '移栽后立即浇定根水，每株浇水0.5-1公斤。墒情差的地块连续浇水2-3天，确保移栽成活率。成活后中耕松土促进根系发育。',
        '移栽后注意防治跳甲和蚜虫，发现害虫及时用啶虫脒或高效氯氰菊酯喷雾防治。地下害虫用地欣或辛硫磷颗粒剂拌毒土撒施防治。'
      ]
    },
    vegetables: {
      '秋季采收期': [
        '大白菜、萝卜等秋冬蔬菜保持土壤见干见湿，每次灌水量不宜过大。追肥结合灌水进行，每亩施水溶肥5-10公斤，促进快速生长。',
        '冷空气来临前检查大棚设施，加固棚膜和压膜线。大棚蔬菜夜间覆盖保温被或草帘，白天适时揭帘通风降湿，防止病害发生。',
        '霜霉病用甲霜灵锰锌或代森锰锌喷雾防治，每隔7天喷一次，连喷2-3次。小菜蛾用甲维盐或氯虫苯甲酰胺防治，傍晚喷药效果更好。',
        '茄果类蔬菜适时采收，成熟一批采收一批。霜冻来临前抢收完毕，防止冻害造成损失。采收后及时上市销售或低温储存保鲜。'
      ]
    },
    tea: {
      '夏茶采摘期': [
        '夏茶采摘遵循分批多次原则，每隔5-7天采摘一次。采摘标准为一芽二叶，留1-2片真叶养树，避免强采损伤茶树生长势。',
        '高温天气茶园早晚喷灌降温增湿，每次喷水30-40分钟。地面覆盖稻草或防草布，厚度5-8厘米，减少水分蒸发，保持土壤湿润。',
        '茶小绿叶蝉用黄板诱杀，每亩悬挂20-30块。茶尺蠖用频振灯诱杀成虫，发生初期用联苯菊酯或苦参碱喷雾防治。',
        '夏茶采摘后及时追肥，每亩施复合肥25-30公斤。在茶行间开沟施入，施后覆土，促进茶树恢复生长和养分积累。'
      ]
    }
  }

  const cropGuidance = detailedGuidance[cropType]
  if (cropGuidance && cropGuidance[growthStage]) {
    return cropGuidance[growthStage][adviceIndex] || '暂无详细指导'
  }
  return '暂无详细指导'
}

const handleRefresh = () => {
  isRefreshing.value = true
  setTimeout(() => {
    filterAdvices()
    isRefreshing.value = false
  }, 800)
}

const goBack = () => router.back()

onMounted(() => {
  filterAdvices()
})
</script>

<style scoped>
.mobile-farming-advice {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 20px;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 0 0 4px 4px;
}

.page-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.page-header .el-icon {
  font-size: 22px;
  cursor: pointer;
}

.refresh-icon {
  animation: rotate 0.8s linear;
}

.refresh-icon:active {
  animation: rotate 0.8s linear;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.date-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 8px;
}

.current-date {
  font-size: 15px;
  font-weight: 600;
  color: #1a3a5c;
}

.week-day {
  font-size: 14px;
  color: #6b7280;
  background: #f0fdf4;
  padding: 4px 12px;
  border-radius: 4px;
}

.filter-section {
  padding: 12px 16px;
  background: #fff;
  margin-bottom: 8px;
}

.filter-row {
  display: flex;
  gap: 12px;
}

.city-selector,
.crop-selector {
  flex: 1;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

.advice-summary {
  padding: 10px 16px;
  font-size: 13px;
  color: #6b7280;
  background: #fff;
}

.advice-list {
  padding: 0 16px;
}

.advice-card {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  cursor: pointer;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.region-tag {
  background: #1a3a5c;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.crop-badge {
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.expand-icon {
  font-size: 18px;
  color: #6b7280;
  transition: transform 0.3s;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

.card-body {
  padding: 14px 16px;
}

.growth-stage,
.weather-context {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #4b5563;
}

.growth-stage .el-icon,
.weather-context .el-icon {
  font-size: 16px;
  color: #10b981;
}

.advices-section {
  margin-top: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a3a5c;
  margin-bottom: 10px;
  padding-left: 8px;
  border-left: 3px solid #10b981;
}

.advice-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 4px;
}

.advice-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #10b981;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.advice-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.6;
  flex: 1;
}

.detailed-guidance {
  padding: 0 16px 16px;
  border-top: 1px solid #e5e7eb;
  background: #fafafa;
}

.guidance-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a3a5c;
  margin: 14px 0 12px;
  padding-left: 8px;
  border-left: 3px solid #f59e0b;
}

.guidance-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guidance-item {
  background: #fff;
  border-radius: 4px;
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.guidance-header {
  margin-bottom: 8px;
}

.guidance-number {
  font-size: 12px;
  font-weight: 600;
  color: #f59e0b;
  background: #fef3c7;
  padding: 3px 8px;
  border-radius: 4px;
}

.guidance-detail {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 60px;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>