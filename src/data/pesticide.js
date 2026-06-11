export const productionCompanies = [
  {
    id: 'COMP2026001',
    name: '安徽XX农药有限公司',
    creditCode: '91340100MA2XXXXX1X',
    address: '合肥市高新区XX路XX号',
    legalPerson: '张三',
    phone: '0551-12345678',
    productionScope: '杀虫剂、杀菌剂、除草剂',
    licenseNo: '农药生许（皖）0001号',
    licenseExpiry: '2028-12-31',
    status: 'active',
    createTime: '2020-01-15'
  },
  {
    id: 'COMP2026002',
    name: '安徽YY化工有限公司',
    creditCode: '91340100MA2XXXXX2X',
    address: '芜湖市经开区XX路XX号',
    legalPerson: '李四',
    phone: '0553-23456789',
    productionScope: '杀虫剂、杀菌剂',
    licenseNo: '农药生许（皖）0002号',
    licenseExpiry: '2027-06-30',
    status: 'active',
    createTime: '2019-06-20'
  },
  {
    id: 'COMP2026003',
    name: '安徽ZZ生物科技有限公司',
    creditCode: '91340100MA2XXXXX3X',
    address: '蚌埠市淮上区XX路XX号',
    legalPerson: '王五',
    phone: '0552-34567890',
    productionScope: '生物农药',
    licenseNo: '农药生许（皖）0003号',
    licenseExpiry: '2029-03-31',
    status: 'active',
    createTime: '2021-03-10'
  }
]

export const businessCompanies = [
  {
    id: 'BIZ2026001',
    name: '合肥XX农资经营部',
    creditCode: '92340100MA2XXXXX4X',
    address: '合肥市肥东县店埠镇XX路XX号',
    legalPerson: '赵六',
    phone: '13800138010',
    businessType: '农药零售',
    licenseNo: '农药经许（皖）0001号',
    licenseExpiry: '2026-12-31',
    status: 'active',
    createTime: '2022-05-15'
  },
  {
    id: 'BIZ2026002',
    name: '芜湖XX农资有限公司',
    creditCode: '91340200MA2XXXXX5X',
    address: '芜湖市鸠江区XX路XX号',
    legalPerson: '钱七',
    phone: '13800138011',
    businessType: '农药批发',
    licenseNo: '农药经许（皖）0002号',
    licenseExpiry: '2027-06-30',
    status: 'active',
    createTime: '2021-08-20'
  },
  {
    id: 'BIZ2026003',
    name: '蚌埠XX农业服务部',
    creditCode: '92340300MA2XXXXX6X',
    address: '蚌埠市怀远县XX镇XX路XX号',
    legalPerson: '孙八',
    phone: '13800138012',
    businessType: '农药零售',
    licenseNo: '农药经许（皖）0003号',
    licenseExpiry: '2026-09-30',
    status: 'active',
    createTime: '2023-03-10'
  }
]

export const pesticideProducts = [
  {
    id: 'PROD2026001',
    name: '吡虫啉',
    registrationNo: 'PD201XXXXX1',
    toxicity: 'low',
    toxicityName: '低毒',
    formulation: 'WP',
    formulationName: '可湿性粉剂',
    content: '70%',
    usageScope: '小麦、水稻、蔬菜',
    targetPests: '蚜虫、飞虱、粉虱',
    companyId: 'COMP2026001',
    companyName: '安徽XX农药有限公司',
    status: 'active'
  },
  {
    id: 'PROD2026002',
    name: '高效氯氟氰菊酯',
    registrationNo: 'PD201XXXXX2',
    toxicity: 'medium',
    toxicityName: '中等毒',
    formulation: 'EC',
    formulationName: '乳油',
    content: '25g/L',
    usageScope: '小麦、玉米、蔬菜',
    targetPests: '蚜虫、棉铃虫、菜青虫',
    companyId: 'COMP2026001',
    companyName: '安徽XX农药有限公司',
    status: 'active'
  },
  {
    id: 'PROD2026003',
    name: '戊唑醇',
    registrationNo: 'PD201XXXXX3',
    toxicity: 'low',
    toxicityName: '低毒',
    formulation: 'SC',
    formulationName: '悬浮剂',
    content: '430g/L',
    usageScope: '小麦、水稻',
    targetPests: '纹枯病、锈病、稻瘟病',
    companyId: 'COMP2026002',
    companyName: '安徽YY化工有限公司',
    status: 'active'
  },
  {
    id: 'PROD2026004',
    name: '草甘膦',
    registrationNo: 'PD201XXXXX4',
    toxicity: 'low',
    toxicityName: '低毒',
    formulation: 'SL',
    formulationName: '水剂',
    content: '41%',
    usageScope: '果园、农田、非耕地',
    targetPests: '一年生和多年生杂草',
    companyId: 'COMP2026002',
    companyName: '安徽YY化工有限公司',
    status: 'active'
  },
  {
    id: 'PROD2026005',
    name: '枯草芽孢杆菌',
    registrationNo: 'PD201XXXXX5',
    toxicity: 'low',
    toxicityName: '低毒',
    formulation: 'WP',
    formulationName: '可湿性粉剂',
    content: '1000亿孢子/克',
    usageScope: '蔬菜、果树',
    targetPests: '灰霉病、白粉病',
    companyId: 'COMP2026003',
    companyName: '安徽ZZ生物科技有限公司',
    status: 'active'
  }
]

export const productionBatches = [
  {
    id: 'BATCH2026001',
    batchNo: 'BN20260315001',
    productId: 'PROD2026001',
    productName: '吡虫啉',
    registrationNo: 'PD201XXXXX1',
    companyId: 'COMP2026001',
    companyName: '安徽XX农药有限公司',
    productionDate: '2026-03-15',
    quantity: 1000,
    unit: '箱',
    specification: '100g/袋×50袋/箱',
    qualityReport: 'https://example.com/quality1.pdf',
    inventory: 200,
    sales: [
      { company: '合肥XX农资经营部', quantity: 500, date: '2026-03-20', orderNo: 'SO20260320001' },
      { company: '芜湖XX农资有限公司', quantity: 300, date: '2026-03-22', orderNo: 'SO20260322001' }
    ]
  },
  {
    id: 'BATCH2026002',
    batchNo: 'BN20260318001',
    productId: 'PROD2026002',
    productName: '高效氯氟氰菊酯',
    registrationNo: 'PD201XXXXX2',
    companyId: 'COMP2026001',
    companyName: '安徽XX农药有限公司',
    productionDate: '2026-03-18',
    quantity: 800,
    unit: '箱',
    specification: '100ml/瓶×40瓶/箱',
    qualityReport: 'https://example.com/quality2.pdf',
    inventory: 500,
    sales: [
      { company: '蚌埠XX农业服务部', quantity: 300, date: '2026-03-25', orderNo: 'SO20260325001' }
    ]
  }
]

export const businessFlows = [
  {
    id: 'FLOW2026001',
    flowType: 'in',
    flowTypeName: '入库',
    companyId: 'BIZ2026001',
    companyName: '合肥XX农资经营部',
    productId: 'PROD2026001',
    productName: '吡虫啉',
    registrationNo: 'PD201XXXXX1',
    batchNo: 'BN20260315001',
    quantity: 100,
    unit: '箱',
    source: '安徽XX农药有限公司',
    transactionDate: '2026-03-20',
    orderNo: 'PO20260320001',
    operator: '赵六'
  },
  {
    id: 'FLOW2026002',
    flowType: 'out',
    flowTypeName: '出库',
    companyId: 'BIZ2026001',
    companyName: '合肥XX农资经营部',
    productId: 'PROD2026001',
    productName: '吡虫啉',
    registrationNo: 'PD201XXXXX1',
    batchNo: 'BN20260315001',
    quantity: 10,
    unit: '箱',
    buyer: '张明家庭农场',
    buyerPhone: '13800138001',
    buyerIdCard: '340123198501011234',
    transactionDate: '2026-03-25',
    orderNo: 'SO20260325001',
    operator: '赵六'
  },
  {
    id: 'FLOW2026003',
    flowType: 'in',
    flowTypeName: '入库',
    companyId: 'BIZ2026002',
    companyName: '芜湖XX农资有限公司',
    productId: 'PROD2026003',
    productName: '戊唑醇',
    registrationNo: 'PD201XXXXX3',
    batchNo: 'BN20260320001',
    quantity: 200,
    unit: '箱',
    source: '安徽YY化工有限公司',
    transactionDate: '2026-03-22',
    orderNo: 'PO20260322001',
    operator: '钱七'
  },
  {
    id: 'FLOW2026004',
    flowType: 'out',
    flowTypeName: '出库',
    companyId: 'BIZ2026002',
    companyName: '芜湖XX农资有限公司',
    productId: 'PROD2026003',
    productName: '戊唑醇',
    registrationNo: 'PD201XXXXX3',
    batchNo: 'BN20260320001',
    quantity: 20,
    unit: '箱',
    buyer: '李华种植专业合作社',
    buyerPhone: '13800138002',
    buyerIdCard: '340123197805152345',
    transactionDate: '2026-03-28',
    orderNo: 'SO20260328001',
    operator: '钱七'
  }
]