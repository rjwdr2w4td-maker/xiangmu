<template>
  <div class="mobile-notice">
    <div class="page-header">
      <el-icon @click="goBack"><ArrowLeft /></el-icon>
      <h3>通知公告</h3>
      <el-badge :value="unreadCount" :max="99" />
    </div>

    <div class="filter-bar">
      <el-radio-group v-model="filterType" size="small">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="unread">未读</el-radio-button>
        <el-radio-button label="read">已读</el-radio-button>
      </el-radio-group>
    </div>

    <div class="notice-list">
      <div
        class="notice-card"
        v-for="notice in filteredNotices"
        :key="notice.id"
        :class="{ unread: !notice.isRead }"
        @click="handleNoticeClick(notice)"
      >
        <div class="notice-header">
          <el-tag :type="notice.type" size="small">{{ notice.typeName }}</el-tag>
          <span class="notice-time">{{ notice.time }}</span>
        </div>
        <h4 class="notice-title">{{ notice.title }}</h4>
        <p class="notice-summary">{{ notice.summary }}</p>
        <div class="notice-footer">
          <span class="notice-source">{{ notice.source }}</span>
          <el-icon v-if="!notice.isRead" color="#ef4444"><Warning /></el-icon>
        </div>
      </div>

      <el-empty v-if="filteredNotices.length === 0" description="暂无通知公告" />
    </div>

    <el-dialog v-model="detailVisible" title="通知详情" width="100%" fullscreen>
      <div class="notice-detail" v-if="currentNotice">
        <div class="detail-header">
          <el-tag :type="currentNotice.type">{{ currentNotice.typeName }}</el-tag>
          <span class="detail-time">{{ currentNotice.time }}</span>
        </div>
        <h3 class="detail-title">{{ currentNotice.title }}</h3>
        <div class="detail-meta">
          <span>来源：{{ currentNotice.source }}</span>
          <span>发布人：{{ currentNotice.publisher }}</span>
        </div>
        <div class="detail-content">
          <p>{{ currentNotice.content }}</p>
        </div>
        <div class="detail-attachments" v-if="currentNotice.attachments?.length">
          <h4>附件</h4>
          <div class="attachment-item" v-for="file in currentNotice.attachments" :key="file.name">
            <el-icon><Document /></el-icon>
            <span>{{ file.name }}</span>
            <el-button type="primary" text size="small">下载</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const entryType = computed(() => route.params.entry || 'wanzhengtong')
const filterType = ref('all')
const detailVisible = ref(false)
const currentNotice = ref(null)

const notices = ref([
  {
    id: 1,
    type: 'warning',
    typeName: '紧急通知',
    title: '关于做好低温雨雪冰冻天气防范应对工作的紧急通知',
    summary: '据气象部门预报，未来一周我省将出现持续低温雨雪冰冻天气，请各地农业农村部门做好防范应对工作...',
    content: '据气象部门预报，未来一周我省将出现持续低温雨雪冰冻天气，请各地农业农村部门高度重视，及时组织做好防范应对工作。一要加强预警信息发布，二要指导农户做好设施农业防护，三要做好畜禽养殖保暖工作，四要加强应急值守。',
    source: '省农业农村厅',
    publisher: '办公室',
    time: '2024-01-15 09:30',
    isRead: false,
    attachments: [{ name: '防范措施清单.pdf' }]
  },
  {
    id: 2,
    type: 'primary',
    typeName: '政策通知',
    title: '2024年粮食生产补贴政策调整通知',
    summary: '根据国家及省有关政策规定，现对2024年粮食生产补贴政策进行调整，具体调整内容如下...',
    content: '根据国家及省有关政策规定，现对2024年粮食生产补贴政策进行调整。一、小麦种植补贴标准调整为每亩150元；二、水稻种植补贴标准调整为每亩180元；三、新增大豆种植补贴每亩100元。请各地做好宣传解读工作。',
    source: '省农业农村厅',
    publisher: '计划财务处',
    time: '2024-01-14 14:20',
    isRead: false,
    attachments: []
  },
  {
    id: 3,
    type: 'success',
    typeName: '工作通知',
    title: '关于开展春季农资打假专项治理行动的通知',
    summary: '为保障春耕生产顺利进行，维护农民合法权益，决定在全省范围内开展春季农资打假专项治理行动...',
    content: '为保障春耕生产顺利进行，维护农民合法权益，决定在全省范围内开展春季农资打假专项治理行动。重点检查种子、农药、肥料等农资产品，严厉打击制售假冒伪劣农资行为。',
    source: '省农业农村厅',
    publisher: '农业综合执法局',
    time: '2024-01-13 10:00',
    isRead: true,
    attachments: [{ name: '专项治理行动方案.docx' }]
  },
  {
    id: 4,
    type: 'info',
    typeName: '系统通知',
    title: '系统维护升级公告',
    summary: '系统将于2024年1月20日凌晨2:00-6:00进行维护升级，届时系统将暂停服务...',
    content: '系统将于2024年1月20日凌晨2:00-6:00进行维护升级，届时系统将暂停服务。请各单位提前做好相关安排，避免影响正常工作。',
    source: '系统管理员',
    publisher: '技术支持',
    time: '2024-01-12 16:00',
    isRead: true,
    attachments: []
  }
])

const unreadCount = computed(() => notices.value.filter(n => !n.isRead).length)

const filteredNotices = computed(() => {
  if (filterType.value === 'unread') {
    return notices.value.filter(n => !n.isRead)
  } else if (filterType.value === 'read') {
    return notices.value.filter(n => n.isRead)
  }
  return notices.value
})

const goBack = () => router.back()

const handleNoticeClick = (notice) => {
  currentNotice.value = notice
  notice.isRead = true
  detailVisible.value = true
}
</script>

<style scoped>
.mobile-notice {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: #1a3a5c;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.filter-bar {
  padding: 12px 16px;
  background: #fff;
}

.notice-list {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-card {
  background: #fff;
  border-radius: 4px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.notice-card.unread {
  border-left: 3px solid #3b82f6;
}

.notice-card:active {
  background: #f9fafb;
}

.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.notice-time {
  font-size: 12px;
  color: #9ca3af;
}

.notice-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.notice-summary {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notice-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.notice-source {
  font-size: 12px;
  color: #9ca3af;
}

.notice-detail {
  padding: 16px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-time {
  font-size: 13px;
  color: #9ca3af;
}

.detail-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.detail-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  font-size: 13px;
  color: #6b7280;
}

.detail-content {
  padding: 16px;
  background: #f9fafb;
  border-radius: 4px;
  line-height: 1.8;
  color: #374151;
}

.detail-content p {
  margin: 0;
}

.detail-attachments {
  margin-top: 20px;
}

.detail-attachments h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #1f2937;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 4px;
  margin-bottom: 8px;
}

.attachment-item span {
  flex: 1;
  font-size: 14px;
  color: #374151;
}
</style>