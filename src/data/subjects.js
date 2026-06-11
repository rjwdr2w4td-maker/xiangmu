export const plantingSubjects = [
  {
    id: 'SUBJ001',
    name: '张明家庭农场',
    type: 'family_farm',
    owner: '张明',
    phone: '13800138001',
    idCard: '340123198501011234',
    totalArea: 520,
    plots: [
      { plotId: 'PLOT001', area: 150, cropType: 'wheat', location: [117.36, 31.86] },
      { plotId: 'PLOT002', area: 180, cropType: 'wheat', location: [117.37, 31.87] },
      { plotId: 'PLOT003', area: 190, cropType: 'rice', location: [117.38, 31.85] }
    ],
    address: '肥东县店埠镇XX村',
    createTime: '2023-03-15'
  },
  {
    id: 'SUBJ002',
    name: '李华种植专业合作社',
    type: 'cooperative',
    owner: '李华',
    phone: '13800138002',
    idCard: '340123197805152345',
    totalArea: 1280,
    plots: [
      { plotId: 'PLOT004', area: 420, cropType: 'wheat', location: [117.42, 31.82] },
      { plotId: 'PLOT005', area: 380, cropType: 'wheat', location: [117.43, 31.83] },
      { plotId: 'PLOT006', area: 280, cropType: 'corn', location: [117.44, 31.81] },
      { plotId: 'PLOT007', area: 200, cropType: 'soybean', location: [117.45, 31.80] }
    ],
    address: '长丰县水湖镇XX村',
    createTime: '2022-06-20'
  },
  {
    id: 'SUBJ003',
    name: '王强规模种植大户',
    type: 'large_farmer',
    owner: '王强',
    phone: '13800138003',
    idCard: '340123199003203456',
    totalArea: 850,
    plots: [
      { plotId: 'PLOT008', area: 350, cropType: 'wheat', location: [117.50, 31.88] },
      { plotId: 'PLOT009', area: 300, cropType: 'rice', location: [117.51, 31.89] },
      { plotId: 'PLOT010', area: 200, cropType: 'rapeseed', location: [117.52, 31.87] }
    ],
    address: '肥西县上派镇XX村',
    createTime: '2024-01-10'
  },
  {
    id: 'SUBJ004',
    name: '刘芳普通农户',
    type: 'ordinary_farmer',
    owner: '刘芳',
    phone: '13800138004',
    idCard: '340123199205184567',
    totalArea: 45,
    plots: [
      { plotId: 'PLOT011', area: 25, cropType: 'wheat', location: [117.55, 31.92] },
      { plotId: 'PLOT012', area: 20, cropType: 'rapeseed', location: [117.56, 31.93] }
    ],
    address: '庐江县庐城镇XX村',
    createTime: '2020-05-08'
  },
  {
    id: 'SUBJ005',
    name: '赵刚农业发展有限公司',
    type: 'enterprise',
    owner: '赵刚',
    phone: '13800138005',
    idCard: '340123198207285678',
    totalArea: 2100,
    plots: [
      { plotId: 'PLOT013', area: 800, cropType: 'wheat', location: [117.60, 31.78] },
      { plotId: 'PLOT014', area: 600, cropType: 'wheat', location: [117.61, 31.79] },
      { plotId: 'PLOT015', area: 400, cropType: 'rice', location: [117.62, 31.77] },
      { plotId: 'PLOT016', area: 300, cropType: 'corn', location: [117.63, 31.76] }
    ],
    address: '巢湖市中庙街道XX村',
    createTime: '2021-09-15'
  },
  {
    id: 'SUBJ006',
    name: '陈伟家庭农场',
    type: 'family_farm',
    owner: '陈伟',
    phone: '13800138006',
    idCard: '340123198809126789',
    totalArea: 380,
    plots: [
      { plotId: 'PLOT017', area: 200, cropType: 'wheat', location: [117.65, 31.95] },
      { plotId: 'PLOT018', area: 180, cropType: 'rice', location: [117.66, 31.96] }
    ],
    address: '肥东县石塘镇XX村',
    createTime: '2022-11-20'
  },
  {
    id: 'SUBJ007',
    name: '周敏种植专业合作社',
    type: 'cooperative',
    owner: '周敏',
    phone: '13800138007',
    idCard: '340123197504077890',
    totalArea: 1560,
    plots: [
      { plotId: 'PLOT019', area: 500, cropType: 'wheat', location: [117.70, 31.72] },
      { plotId: 'PLOT020', area: 460, cropType: 'wheat', location: [117.71, 31.73] },
      { plotId: 'PLOT021', area: 400, cropType: 'rice', location: [117.72, 31.71] },
      { plotId: 'PLOT022', area: 200, cropType: 'soybean', location: [117.73, 31.70] }
    ],
    address: '长丰县岗集镇XX村',
    createTime: '2023-02-28'
  },
  {
    id: 'SUBJ008',
    name: '吴涛规模种植大户',
    type: 'large_farmer',
    owner: '吴涛',
    phone: '13800138008',
    idCard: '340123199107238901',
    totalArea: 720,
    plots: [
      { plotId: 'PLOT023', area: 400, cropType: 'wheat', location: [117.75, 31.68] },
      { plotId: 'PLOT024', area: 320, cropType: 'corn', location: [117.76, 31.69] }
    ],
    address: '肥西县三河镇XX村',
    createTime: '2024-03-05'
  }
]

export const subjectTypes = [
  { code: 'large_farmer', name: '规模种植大户', minArea: 100 },
  { code: 'family_farm', name: '家庭农场', minArea: 50 },
  { code: 'cooperative', name: '农民专业合作社', minArea: 200 },
  { code: 'ordinary_farmer', name: '普通农户', minArea: 0 },
  { code: 'enterprise', name: '农业企业', minArea: 500 }
]