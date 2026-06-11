export const disasterRecords = [
  {
    id: 'DISA20260315001',
    type: 'frost',
    typeName: '倒春寒',
    level: 'medium',
    occurTime: '2026-03-15 02:00:00',
    region: {
      code: '340100',
      name: '合肥市',
      counties: ['长丰县', '肥东县']
    },
    affectedArea: 25000,
    disasterArea: 12000,
    totalLossArea: 3000,
    affectedCrops: ['小麦'],
    estimatedLoss: 1500000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/photo1.jpg',
      'https://example.com/disaster/photo2.jpg'
    ],
    reporter: '张明',
    reportTime: '2026-03-15 08:30:00',
    measures: '已组织喷施叶面肥，加强田间管理'
  },
  {
    id: 'DISA20260320001',
    type: 'drought',
    typeName: '春旱',
    level: 'high',
    occurTime: '2026-03-20 00:00:00',
    region: {
      code: '340300',
      name: '蚌埠市',
      counties: ['怀远县', '五河县']
    },
    affectedArea: 45000,
    disasterArea: 28000,
    totalLossArea: 8000,
    affectedCrops: ['小麦', '油菜'],
    estimatedLoss: 3600000,
    status: 'resolved',
    photos: [],
    reporter: '李华',
    reportTime: '2026-03-20 10:00:00',
    measures: '已启动灌溉设施，发放抗旱补贴'
  }
]

export const weatherWarnings = [
  {
    id: 'WARN20260315001',
    type: 'frost',
    typeName: '霜冻预警',
    level: 'orange',
    title: '安徽省气象台发布霜冻橙色预警',
    content: '预计未来24小时，合肥、蚌埠、淮南等地将出现霜冻天气，最低气温降至-2℃，请注意防范',
    affectRegion: ['合肥市', '蚌埠市', '淮南市', '滁州市'],
    issueTime: '2026-03-14 18:00:00',
    expireTime: '2026-03-16 08:00:00',
    suggestions: [
      '及时覆盖农作物，做好防冻保暖',
      '加强温室大棚管理，保持适宜温度',
      '喷施防冻剂，提高作物抗寒能力'
    ]
  },
  {
    id: 'WARN20260318001',
    type: 'drought',
    typeName: '干旱预警',
    level: 'yellow',
    title: '安徽省气象台发布干旱黄色预警',
    content: '预计未来一周，皖北地区无明显降水过程，土壤墒情持续下降',
    affectRegion: ['蚌埠市', '淮北市', '宿州市', '阜阳市'],
    issueTime: '2026-03-18 10:00:00',
    expireTime: '2026-03-25 10:00:00',
    suggestions: [
      '及时灌溉，保持土壤湿润',
      '采用节水灌溉技术，提高水资源利用率',
      '加强田间管理，减少水分蒸发'
    ]
  },
  {
    id: 'WARN20260325001',
    type: 'pest',
    typeName: '病虫害预警',
    level: 'blue',
    title: '安徽省植保站发布小麦条锈病预警',
    content: '当前气象条件有利于小麦条锈病发生发展，请各地加强监测防治',
    affectRegion: ['合肥市', '芜湖市', '安庆市'],
    issueTime: '2026-03-25 09:00:00',
    expireTime: '2026-04-10 09:00:00',
    suggestions: [
      '加强田间调查，及时掌握病情动态',
      '发现病叶及时摘除，防止扩散',
      '适时开展药剂防治，控制病害蔓延'
    ]
  }
]

export const agriculturalAdvices = [
  {
    id: 'ADVI20260315001',
    region: '合肥市',
    cropType: 'wheat',
    growthStage: '拔节期',
    weather: '晴朗，气温12-18℃',
    advices: [
      '当前小麦处于拔节期，建议追施氮肥，促进生长',
      '注意防范倒春寒，可喷施磷酸二氢钾提高抗寒性',
      '适时除草，减少杂草竞争',
      '加强纹枯病监测，发现病株及时防治'
    ],
    createTime: '2026-03-15 06:00:00'
  },
  {
    id: 'ADVI20260315002',
    region: '合肥市',
    cropType: 'rapeseed',
    growthStage: '初花期',
    weather: '晴朗，气温12-18℃',
    advices: [
      '油菜进入初花期，注意防治菌核病',
      '喷施硼肥，防止花而不实',
      '清沟理墒，防止渍害',
      '适时叶面追肥，延长花期'
    ],
    createTime: '2026-03-15 06:00:00'
  }
]