export const silagePlantingRecords = [
  {
    id: 'SILAGE2026001',
    subjectId: 'SUBJ001',
    subjectName: '张明家庭农场',
    variety: 'silage_corn',
    varietyName: '青贮玉米',
    area: 150,
    expectedYield: 600,
    plantingDate: '2026-04-15',
    plotLocation: [117.36, 31.86],
    plotGeom: [
      [117.35, 31.85],
      [117.37, 31.85],
      [117.37, 31.87],
      [117.35, 31.87]
    ],
    status: 'approved',
    statusName: '已审核',
    reporter: '张明',
    reportTime: '2026-03-20 10:00:00',
    reviewer: '肥东县农业农村局',
    reviewTime: '2026-03-20 15:00:00'
  },
  {
    id: 'SILAGE2026002',
    subjectId: 'SUBJ002',
    subjectName: '李华种植专业合作社',
    variety: 'silage_corn',
    varietyName: '青贮玉米',
    area: 280,
    expectedYield: 1120,
    plantingDate: '2026-04-18',
    plotLocation: [117.42, 31.82],
    plotGeom: [
      [117.41, 31.81],
      [117.43, 31.81],
      [117.43, 31.83],
      [117.41, 31.83]
    ],
    status: 'approved',
    statusName: '已审核',
    reporter: '李华',
    reportTime: '2026-03-21 09:00:00',
    reviewer: '长丰县农业农村局',
    reviewTime: '2026-03-21 14:30:00'
  },
  {
    id: 'SILAGE2026003',
    subjectId: 'SUBJ005',
    subjectName: '赵刚农业发展有限公司',
    variety: 'silage_corn',
    varietyName: '青贮玉米',
    area: 400,
    expectedYield: 1600,
    plantingDate: '2026-04-20',
    plotLocation: [117.60, 31.78],
    plotGeom: [
      [117.59, 31.77],
      [117.61, 31.77],
      [117.61, 31.79],
      [117.59, 31.79]
    ],
    status: 'pending',
    statusName: '待审核',
    reporter: '赵刚',
    reportTime: '2026-03-22 16:00:00'
  }
]

export const silageStorageRecords = [
  {
    id: 'STORAGE2026001',
    subjectId: 'SUBJ009',
    subjectName: '安徽XX乳业有限公司',
    variety: 'silage_corn',
    varietyName: '青贮玉米',
    price: 450,
    weight: 500,
    totalAmount: 225000,
    sourceFarmer: '张明家庭农场',
    storageDate: '2026-08-20',
    status: 'approved',
    statusName: '已备案',
    reporter: '安徽XX乳业有限公司',
    reportTime: '2026-08-18 10:00:00',
    reviewer: '肥东县农业农村局',
    reviewTime: '2026-08-18 16:00:00'
  },
  {
    id: 'STORAGE2026002',
    subjectId: 'SUBJ010',
    subjectName: '安徽XX农牧有限公司',
    variety: 'silage_corn',
    varietyName: '青贮玉米',
    price: 420,
    weight: 800,
    totalAmount: 336000,
    sourceFarmer: '李华种植专业合作社',
    storageDate: '2026-08-22',
    status: 'pending',
    statusName: '待审核',
    reporter: '安徽XX农牧有限公司',
    reportTime: '2026-08-20 14:00:00'
  }
]