export const plantingTasks = [
  {
    id: 'TASK2026001',
    year: 2026,
    name: '2026年度小麦播种计划',
    cropType: 'wheat',
    totalArea: 43000000,
    createTime: '2025-12-01',
    status: 'active',
    decomposition: [
      {
        code: '340100',
        name: '合肥市',
        planArea: 3500000,
        actualArea: 3420000,
        progress: 97.7,
        counties: [
          { code: '340121', name: '长丰县', planArea: 980000, actualArea: 965000, progress: 98.5 },
          { code: '340122', name: '肥东县', planArea: 1120000, actualArea: 1080000, progress: 96.4 },
          { code: '340123', name: '肥西县', planArea: 1050000, actualArea: 1020000, progress: 97.1 },
          { code: '340124', name: '庐江县', planArea: 350000, actualArea: 355000, progress: 101.4 }
        ]
      },
      {
        code: '340200',
        name: '芜湖市',
        planArea: 2800000,
        actualArea: 2750000,
        progress: 98.2,
        counties: [
          { code: '340222', name: '繁昌区', planArea: 750000, actualArea: 740000, progress: 98.7 },
          { code: '340223', name: '南陵县', planArea: 1250000, actualArea: 1220000, progress: 97.6 },
          { code: '340225', name: '无为市', planArea: 800000, actualArea: 790000, progress: 98.8 }
        ]
      },
      {
        code: '340300',
        name: '蚌埠市',
        planArea: 4200000,
        actualArea: 4080000,
        progress: 97.1,
        counties: [
          { code: '340321', name: '怀远县', planArea: 1800000, actualArea: 1750000, progress: 97.2 },
          { code: '340322', name: '五河县', planArea: 1400000, actualArea: 1360000, progress: 97.1 },
          { code: '340323', name: '固镇县', planArea: 1000000, actualArea: 970000, progress: 97.0 }
        ]
      },
      {
        code: '340400',
        name: '淮南市',
        planArea: 3100000,
        actualArea: 3000000,
        progress: 96.8,
        counties: [
          { code: '340421', name: '凤台县', planArea: 1600000, actualArea: 1550000, progress: 96.9 },
          { code: '340422', name: '寿县', planArea: 1500000, actualArea: 1450000, progress: 96.7 }
        ]
      },
      {
        code: '340500',
        name: '马鞍山市',
        planArea: 2200000,
        actualArea: 2150000,
        progress: 97.7,
        counties: [
          { code: '340521', name: '当涂县', planArea: 1000000, actualArea: 980000, progress: 98.0 },
          { code: '340522', name: '含山县', planArea: 700000, actualArea: 685000, progress: 97.9 },
          { code: '340523', name: '和县', planArea: 500000, actualArea: 485000, progress: 97.0 }
        ]
      }
    ]
  },
  {
    id: 'TASK2026002',
    year: 2026,
    name: '2026年度水稻播种计划',
    cropType: 'rice',
    totalArea: 38000000,
    createTime: '2026-03-01',
    status: 'pending',
    decomposition: [
      {
        code: '340100',
        name: '合肥市',
        planArea: 3200000,
        actualArea: 0,
        progress: 0,
        counties: []
      },
      {
        code: '340200',
        name: '芜湖市',
        planArea: 2600000,
        actualArea: 0,
        progress: 0,
        counties: []
      },
      {
        code: '340300',
        name: '蚌埠市',
        planArea: 3800000,
        actualArea: 0,
        progress: 0,
        counties: []
      }
    ]
  }
]

export const progressReports = [
  {
    id: 'PROG20260315001',
    taskId: 'TASK2026001',
    date: '2026-03-15',
    cityCode: '340100',
    cityName: '合肥市',
    cropType: 'wheat',
    planArea: 3500000,
    sowedArea: 3420000,
    harvestedArea: 0,
    sowingProgress: 97.7,
    harvestProgress: 0,
    reporter: '合肥市农业农村局',
    reportTime: '2026-03-15 17:30:00'
  },
  {
    id: 'PROG20260315002',
    taskId: 'TASK2026001',
    date: '2026-03-15',
    cityCode: '340200',
    cityName: '芜湖市',
    cropType: 'wheat',
    planArea: 2800000,
    sowedArea: 2750000,
    harvestedArea: 0,
    sowingProgress: 98.2,
    harvestProgress: 0,
    reporter: '芜湖市农业农村局',
    reportTime: '2026-03-15 17:30:00'
  },
  {
    id: 'PROG20260315003',
    taskId: 'TASK2026001',
    date: '2026-03-15',
    cityCode: '340300',
    cityName: '蚌埠市',
    cropType: 'wheat',
    planArea: 4200000,
    sowedArea: 4080000,
    harvestedArea: 0,
    sowingProgress: 97.1,
    harvestProgress: 0,
    reporter: '蚌埠市农业农村局',
    reportTime: '2026-03-15 17:30:00'
  }
]

export const harvestReports = [
  {
    id: 'HARV20260515001',
    taskId: 'TASK2026001',
    date: '2026-05-15',
    cityCode: '340100',
    cityName: '合肥市',
    cropType: 'wheat',
    planArea: 3500000,
    harvestedArea: 2800000,
    harvestProgress: 80.0,
    yield: 1260000,
    avgYield: 450,
    reporter: '合肥市农业农村局',
    reportTime: '2026-05-15 17:30:00'
  }
]