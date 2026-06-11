export const changePlots = [
  {
    id: 'PLOT20260315001',
    plotNo: 'AH-2026-00123',
    location: {
      province: '安徽省',
      city: '合肥市',
      county: '长丰县',
      town: '水湖镇',
      village: 'XX村',
      coordinate: [117.36, 31.86]
    },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 120,
    riskLevel: 'high',
    riskReason: '位于永久基本农田内，面积超过100亩',
    discoveryTime: '2026-03-15 10:30:00',
    beforeImage: 'https://example.com/before1.jpg',
    afterImage: 'https://example.com/after1.jpg',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '长丰县农业农村局',
    assignTime: '2026-03-15 14:00:00',
    deadline: '2026-03-22 18:00:00'
  },
  {
    id: 'PLOT20260315002',
    plotNo: 'AH-2026-00124',
    location: {
      province: '安徽省',
      city: '合肥市',
      county: '肥东县',
      town: '店埠镇',
      village: 'XX村',
      coordinate: [117.42, 31.82]
    },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 85,
    riskLevel: 'medium',
    riskReason: '位于一般耕地，面积中等',
    discoveryTime: '2026-03-15 10:35:00',
    beforeImage: 'https://example.com/before2.jpg',
    afterImage: 'https://example.com/after2.jpg',
    status: 'checking',
    statusName: '核查中',
    assignee: '肥东县农业农村局',
    assignTime: '2026-03-15 14:10:00',
    deadline: '2026-03-22 18:00:00'
  },
  {
    id: 'PLOT20260315003',
    plotNo: 'AH-2026-00125',
    location: {
      province: '安徽省',
      city: '芜湖市',
      county: '繁昌区',
      town: 'XX镇',
      village: 'XX村',
      coordinate: [118.25, 31.15]
    },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 156,
    riskLevel: 'high',
    riskReason: '位于高标准农田内，面积超过100亩',
    discoveryTime: '2026-03-15 10:40:00',
    beforeImage: 'https://example.com/before3.jpg',
    afterImage: 'https://example.com/after3.jpg',
    status: 'reported',
    statusName: '已上报',
    assignee: '繁昌区农业农村局',
    assignTime: '2026-03-15 14:20:00',
    deadline: '2026-03-22 18:00:00',
    checkResult: {
      checker: '李明',
      checkTime: '2026-03-18 15:30:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 150,
      description: '该地块确为撂荒状态，原承包户外出务工，土地闲置',
      photos: ['https://example.com/check1.jpg', 'https://example.com/check2.jpg'],
      gpsLocation: [118.25, 31.15]
    }
  },
  {
    id: 'PLOT20260315004',
    plotNo: 'AH-2026-00126',
    location: {
      province: '安徽省',
      city: '蚌埠市',
      county: '怀远县',
      town: 'XX镇',
      village: 'XX村',
      coordinate: [117.25, 33.05]
    },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 92,
    riskLevel: 'medium',
    riskReason: '位于一般耕地',
    discoveryTime: '2026-03-15 10:45:00',
    beforeImage: 'https://example.com/before4.jpg',
    afterImage: 'https://example.com/after4.jpg',
    status: 'rectifying',
    statusName: '整改中',
    assignee: '怀远县农业农村局',
    assignTime: '2026-03-15 14:30:00',
    deadline: '2026-03-22 18:00:00',
    checkResult: {
      checker: '王强',
      checkTime: '2026-03-19 09:00:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 90,
      description: '该地块原计划种植小麦，因灌溉设施损坏未能及时播种',
      photos: ['https://example.com/check3.jpg'],
      gpsLocation: [117.25, 33.05]
    },
    rectifyMeasure: '协调修复灌溉设施，4月15日前完成播种'
  },
  {
    id: 'PLOT20260315005',
    plotNo: 'AH-2026-00127',
    location: {
      province: '安徽省',
      city: '合肥市',
      county: '肥西县',
      town: '上派镇',
      village: 'XX村',
      coordinate: [117.50, 31.88]
    },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 68,
    riskLevel: 'low',
    riskReason: '面积较小',
    discoveryTime: '2026-03-15 10:50:00',
    beforeImage: 'https://example.com/before5.jpg',
    afterImage: 'https://example.com/after5.jpg',
    status: 'completed',
    statusName: '已整改',
    assignee: '肥西县农业农村局',
    assignTime: '2026-03-15 14:40:00',
    deadline: '2026-03-22 18:00:00',
    checkResult: {
      checker: '张华',
      checkTime: '2026-03-20 10:00:00',
      result: 'unconfirmed',
      resultName: '问题不属实',
      actualArea: 68,
      description: '该地块为冬闲田，计划种植水稻，目前正在进行整地',
      photos: ['https://example.com/check4.jpg'],
      gpsLocation: [117.50, 31.88]
    }
  }
]

export const growthComparisons = [
  {
    id: 'GROWTH20260315001',
    region: '合肥市',
    cropType: 'wheat',
    currentYearIndex: 0.85,
    lastYearIndex: 0.82,
    normalIndex: 0.80,
    comparison: '今年长势好于去年',
    trend: 'up',
    area: 3500000,
    goodArea: 2800000,
    normalArea: 500000,
    poorArea: 200000
  },
  {
    id: 'GROWTH20260315002',
    region: '芜湖市',
    cropType: 'wheat',
    currentYearIndex: 0.78,
    lastYearIndex: 0.80,
    normalIndex: 0.80,
    comparison: '今年长势略差于去年',
    trend: 'down',
    area: 2800000,
    goodArea: 1800000,
    normalArea: 700000,
    poorArea: 300000
  },
  {
    id: 'GROWTH20260315003',
    region: '蚌埠市',
    cropType: 'wheat',
    currentYearIndex: 0.88,
    lastYearIndex: 0.85,
    normalIndex: 0.82,
    comparison: '今年长势明显好于去年',
    trend: 'up',
    area: 4200000,
    goodArea: 3500000,
    normalArea: 500000,
    poorArea: 200000
  }
]

export const taskProcessRecords = [
  {
    id: 'PROC20260315001',
    plotId: 'PLOT20260315001',
    statusFlow: [
      { status: 'discovered', time: '2026-03-15 10:30:00', operator: '系统', action: 'AI智能识别发现疑似图斑' },
      { status: 'assigned', time: '2026-03-15 14:00:00', operator: '省农业农村厅', action: '任务下发至长丰县农业农村局' },
      { status: 'checking', time: '2026-03-16 09:00:00', operator: '长丰县农业农村局', action: '开始现场核查' }
    ]
  },
  {
    id: 'PROC20260315002',
    plotId: 'PLOT20260315003',
    statusFlow: [
      { status: 'discovered', time: '2026-03-15 10:40:00', operator: '系统', action: 'AI智能识别发现疑似图斑' },
      { status: 'assigned', time: '2026-03-15 14:20:00', operator: '省农业农村厅', action: '任务下发至繁昌区农业农村局' },
      { status: 'checked', time: '2026-03-18 15:30:00', operator: '李明', action: '完成现场核查，问题属实' },
      { status: 'reviewed', time: '2026-03-19 10:00:00', operator: '芜湖市农业农村局', action: '审核通过' },
      { status: 'rectifying', time: '2026-03-19 14:00:00', operator: '繁昌区农业农村局', action: '制定整改措施，限期整改' }
    ]
  }
]