const STORAGE_KEY = 'grainSecurityPlots'

const initialPlots = [
  {
    id: 'PLOT20260623001',
    plotNo: 'AH-2026-01001',
    location: {
      province: '安徽省',
      city: '合肥市',
      county: '长丰县',
      town: '水湖镇',
      village: '阮巷村',
      coordinate: [117.15, 32.48]
    },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 135,
    riskLevel: 'high',
    riskReason: '位于永久基本农田核心区，面积超过100亩，连续两季未耕种',
    discoveryTime: '2026-06-23 08:15:00',
    beforeImage: 'https://picsum.photos/seed/before001/800/600',
    afterImage: 'https://picsum.photos/seed/after001/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '长丰县农业农村局',
    assignTime: '2026-06-23 09:30:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 08:15:00', action: '遥感识别发现疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 09:30:00', action: '任务下发至长丰县农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623002',
    plotNo: 'AH-2026-02002',
    location: { province: '安徽省', city: '芜湖市', county: '繁昌区', town: '繁阳镇', village: '戴店村', coordinate: [118.20, 31.10] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 92,
    riskLevel: 'medium',
    riskReason: '位于高标准农田项目区，春播计划面积未达标',
    discoveryTime: '2026-06-23 08:22:00',
    beforeImage: 'https://picsum.photos/seed/before002/800/600',
    afterImage: 'https://picsum.photos/seed/after002/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '繁昌区农业农村局',
    assignTime: '2026-06-23 09:45:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 08:22:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 09:45:00', action: '任务下发至繁昌区农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623003',
    plotNo: 'AH-2026-03003',
    location: { province: '安徽省', city: '蚌埠市', county: '怀远县', town: '荆山镇', village: '支湖社区', coordinate: [117.19, 32.97] },
    problemType: 'illegal_use',
    problemTypeName: '涉嫌违规用地',
    area: 48,
    riskLevel: 'high',
    riskReason: '基本农田上疑似建设养殖大棚，破坏耕作层',
    discoveryTime: '2026-06-23 08:30:00',
    beforeImage: 'https://picsum.photos/seed/before003/800/600',
    afterImage: 'https://picsum.photos/seed/after003/800/600',
    status: 'pending_review',
    statusName: '待审核',
    assignee: '怀远县农业农村局',
    assignTime: '2026-06-23 09:50:00',
    deadline: '2026-06-28 18:00:00',
    checkResult: {
      checker: '陈建国',
      checkTime: '2026-06-24 15:40:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 50,
      description: '现场确认存在违规搭建养鸡棚，占用基本农田约50亩，已责令拆除',
      photos: ['https://picsum.photos/seed/check003a/800/600', 'https://picsum.photos/seed/check003b/800/600'],
      gpsLocation: [117.19, 32.97]
    },
    flowLogs: [
      { time: '2026-06-23 08:30:00', action: '遥感识别发现涉嫌违规用地图斑', operator: '系统' },
      { time: '2026-06-23 09:50:00', action: '任务下发至怀远县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-24 15:40:00', action: '现场核查完成，确认问题属实', operator: '陈建国' },
      { time: '2026-06-24 16:30:00', action: '核查结果上报，等待审核', operator: '怀远县农业农村局' }
    ]
  },
  {
    id: 'PLOT20260623004',
    plotNo: 'AH-2026-04004',
    location: { province: '安徽省', city: '淮南市', county: '寿县', town: '寿春镇', village: '九龙村', coordinate: [116.78, 32.57] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 210,
    riskLevel: 'high',
    riskReason: '位于粮食生产功能区，面积超过200亩，季节性撂荒严重',
    discoveryTime: '2026-06-23 08:36:00',
    beforeImage: 'https://picsum.photos/seed/before004/800/600',
    afterImage: 'https://picsum.photos/seed/after004/800/600',
    status: 'rectifying',
    statusName: '整改中',
    assignee: '寿县农业农村局',
    assignTime: '2026-06-23 10:00:00',
    deadline: '2026-07-07 18:00:00',
    checkResult: {
      checker: '赵永红',
      checkTime: '2026-06-25 09:15:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 208,
      description: '该地块因承包户全家外出务工导致撂荒，已联系村集体统一流转',
      photos: ['https://picsum.photos/seed/check004/800/600'],
      gpsLocation: [116.78, 32.57]
    },
    rectifyMeasure: '由村集体统一流转给种植大户，7月5日前完成复耕播种水稻',
    rectifyDeadline: '2026-07-05',
    reviewResult: 'approved',
    reviewTime: '2026-06-25 11:30:00',
    reviewer: '淮南市农业农村局',
    flowLogs: [
      { time: '2026-06-23 08:36:00', action: '遥感识别发现大面积疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 10:00:00', action: '任务下发至寿县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-25 09:15:00', action: '现场核查完成，确认208亩撂荒', operator: '赵永红' },
      { time: '2026-06-25 11:30:00', action: '审核通过，进入整改阶段', operator: '淮南市农业农村局' }
    ]
  },
  {
    id: 'PLOT20260623005',
    plotNo: 'AH-2026-05005',
    location: { province: '安徽省', city: '马鞍山市', county: '当涂县', town: '姑孰镇', village: '藏汉村', coordinate: [118.49, 31.55] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 76,
    riskLevel: 'medium',
    riskReason: '一般耕地，春播作物未按计划种植',
    discoveryTime: '2026-06-23 08:42:00',
    beforeImage: 'https://picsum.photos/seed/before005/800/600',
    afterImage: 'https://picsum.photos/seed/after005/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '当涂县农业农村局',
    assignTime: '2026-06-23 10:15:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 08:42:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 10:15:00', action: '任务下发至当涂县农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623006',
    plotNo: 'AH-2026-06006',
    location: { province: '安徽省', city: '淮北市', county: '濉溪县', town: '濉溪镇', village: '八里村', coordinate: [116.77, 33.92] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 162,
    riskLevel: 'high',
    riskReason: '位于永久基本农田，面积大且连续两季未耕作',
    discoveryTime: '2026-06-23 08:48:00',
    beforeImage: 'https://picsum.photos/seed/before006/800/600',
    afterImage: 'https://picsum.photos/seed/after006/800/600',
    status: 'pending_review',
    statusName: '待审核',
    assignee: '濉溪县农业农村局',
    assignTime: '2026-06-23 10:30:00',
    deadline: '2026-06-30 18:00:00',
    checkResult: {
      checker: '刘志强',
      checkTime: '2026-06-24 10:20:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 160,
      description: '地块因煤矿沉陷区治理项目影响，暂未复垦耕种',
      photos: ['https://picsum.photos/seed/check006a/800/600', 'https://picsum.photos/seed/check006b/800/600'],
      gpsLocation: [116.77, 33.92]
    },
    flowLogs: [
      { time: '2026-06-23 08:48:00', action: '遥感识别发现疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 10:30:00', action: '任务下发至濉溪县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-24 10:20:00', action: '现场核查完成，确认问题属实', operator: '刘志强' }
    ]
  },
  {
    id: 'PLOT20260623007',
    plotNo: 'AH-2026-07007',
    location: { province: '安徽省', city: '铜陵市', county: '枞阳县', town: '枞阳镇', village: '长安村', coordinate: [117.21, 30.70] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 88,
    riskLevel: 'medium',
    riskReason: '位于丘陵地区一般耕地，部分地块闲置',
    discoveryTime: '2026-06-23 08:54:00',
    beforeImage: 'https://picsum.photos/seed/before007/800/600',
    afterImage: 'https://picsum.photos/seed/after007/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '枞阳县农业农村局',
    assignTime: '2026-06-23 10:45:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 08:54:00', action: '遥感识别发现疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 10:45:00', action: '任务下发至枞阳县农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623008',
    plotNo: 'AH-2026-08008',
    location: { province: '安徽省', city: '安庆市', county: '怀宁县', town: '高河镇', village: '全丰村', coordinate: [116.83, 30.73] },
    problemType: 'illegal_use',
    problemTypeName: '涉嫌违规用地',
    area: 35,
    riskLevel: 'high',
    riskReason: '疑似在基本农田上挖塘养鱼，改变土地用途',
    discoveryTime: '2026-06-23 09:00:00',
    beforeImage: 'https://picsum.photos/seed/before008/800/600',
    afterImage: 'https://picsum.photos/seed/after008/800/600',
    status: 'pending_review',
    statusName: '待审核',
    assignee: '怀宁县农业农村局',
    assignTime: '2026-06-23 11:00:00',
    deadline: '2026-06-28 18:00:00',
    checkResult: {
      checker: '周建国',
      checkTime: '2026-06-25 14:30:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 37,
      description: '现场核实为违规开挖鱼塘，涉及基本农田约37亩',
      photos: ['https://picsum.photos/seed/check008/800/600'],
      gpsLocation: [116.83, 30.73]
    },
    flowLogs: [
      { time: '2026-06-23 09:00:00', action: '遥感识别发现涉嫌违规用地图斑', operator: '系统' },
      { time: '2026-06-23 11:00:00', action: '任务下发至怀宁县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-25 14:30:00', action: '现场核查完成，确认问题属实', operator: '周建国' }
    ]
  },
  {
    id: 'PLOT20260623009',
    plotNo: 'AH-2026-09009',
    location: { province: '安徽省', city: '黄山市', county: '歙县', town: '徽城镇', village: '七川村', coordinate: [118.43, 29.86] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 42,
    riskLevel: 'low',
    riskReason: '山区梯田面积小，茶叶改种粮食计划未完成',
    discoveryTime: '2026-06-23 09:06:00',
    beforeImage: 'https://picsum.photos/seed/before009/800/600',
    afterImage: 'https://picsum.photos/seed/after009/800/600',
    status: 'rectifying',
    statusName: '整改中',
    assignee: '歙县农业农村局',
    assignTime: '2026-06-23 11:15:00',
    deadline: '2026-07-07 18:00:00',
    checkResult: {
      checker: '汪明辉',
      checkTime: '2026-06-25 16:00:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 40,
      description: '原计划退茶还粮的梯田尚未完成改造，需加快进度',
      photos: ['https://picsum.photos/seed/check009a/800/600', 'https://picsum.photos/seed/check009b/800/600'],
      gpsLocation: [118.43, 29.86]
    },
    rectifyMeasure: '加快梯田改造工程，7月5日前完成土壤改良并播种玉米',
    rectifyDeadline: '2026-07-05',
    reviewResult: 'approved',
    reviewTime: '2026-06-26 09:00:00',
    reviewer: '黄山市农业农村局',
    flowLogs: [
      { time: '2026-06-23 09:06:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 11:15:00', action: '任务下发至歙县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-25 16:00:00', action: '现场核查完成', operator: '汪明辉' },
      { time: '2026-06-26 09:00:00', action: '审核通过，进入整改阶段', operator: '黄山市农业农村局' }
    ]
  },
  {
    id: 'PLOT20260623010',
    plotNo: 'AH-2026-10010',
    location: { province: '安徽省', city: '滁州市', county: '定远县', town: '定城镇', village: '城南村', coordinate: [117.68, 32.53] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 180,
    riskLevel: 'high',
    riskReason: '位于江淮分水岭粮食主产区，大面积闲置',
    discoveryTime: '2026-06-23 09:12:00',
    beforeImage: 'https://picsum.photos/seed/before010/800/600',
    afterImage: 'https://picsum.photos/seed/after010/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '定远县农业农村局',
    assignTime: '2026-06-23 11:30:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 09:12:00', action: '遥感识别发现疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 11:30:00', action: '任务下发至定远县农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623011',
    plotNo: 'AH-2026-11011',
    location: { province: '安徽省', city: '阜阳市', county: '临泉县', town: '城关镇', village: '于寨村', coordinate: [115.26, 33.06] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 240,
    riskLevel: 'high',
    riskReason: '位于皖北粮食主产区，面积超过200亩，影响粮食安全',
    discoveryTime: '2026-06-23 09:18:00',
    beforeImage: 'https://picsum.photos/seed/before011/800/600',
    afterImage: 'https://picsum.photos/seed/after011/800/600',
    status: 'rectifying',
    statusName: '整改中',
    assignee: '临泉县农业农村局',
    assignTime: '2026-06-23 11:45:00',
    deadline: '2026-07-07 18:00:00',
    checkResult: {
      checker: '杨志刚',
      checkTime: '2026-06-24 08:30:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 238,
      description: '大面积耕地因土地流转纠纷闲置，已协调镇村介入调解',
      photos: ['https://picsum.photos/seed/check011a/800/600', 'https://picsum.photos/seed/check011b/800/600'],
      gpsLocation: [115.26, 33.06]
    },
    rectifyMeasure: '协调解决土地流转纠纷，7月5日前由村集体经济组织统一耕种玉米',
    rectifyDeadline: '2026-07-05',
    reviewResult: 'approved',
    reviewTime: '2026-06-24 10:15:00',
    reviewer: '阜阳市农业农村局',
    flowLogs: [
      { time: '2026-06-23 09:18:00', action: '遥感识别发现大面积疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 11:45:00', action: '任务下发至临泉县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-24 08:30:00', action: '现场核查完成', operator: '杨志刚' },
      { time: '2026-06-24 10:15:00', action: '审核通过，进入整改阶段', operator: '阜阳市农业农村局' }
    ]
  },
  {
    id: 'PLOT20260623012',
    plotNo: 'AH-2026-12012',
    location: { province: '安徽省', city: '宿州市', county: '砀山县', town: '砀城镇', village: '北郊村', coordinate: [116.34, 34.42] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 95,
    riskLevel: 'medium',
    riskReason: '一般耕地，夏播面积与计划差距较大',
    discoveryTime: '2026-06-23 09:24:00',
    beforeImage: 'https://picsum.photos/seed/before012/800/600',
    afterImage: 'https://picsum.photos/seed/after012/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '砀山县农业农村局',
    assignTime: '2026-06-23 11:55:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 09:24:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 11:55:00', action: '任务下发至砀山县农业农村局', operator: '省农业农村厅' }
    ]
  },
  {
    id: 'PLOT20260623013',
    plotNo: 'AH-2026-13013',
    location: { province: '安徽省', city: '六安市', county: '霍邱县', town: '城关镇', village: '泽沟村', coordinate: [116.27, 32.35] },
    problemType: 'illegal_use',
    problemTypeName: '涉嫌违规用地',
    area: 28,
    riskLevel: 'medium',
    riskReason: '耕地内违规种植苗木，影响粮食生产',
    discoveryTime: '2026-06-23 09:30:00',
    beforeImage: 'https://picsum.photos/seed/before013/800/600',
    afterImage: 'https://picsum.photos/seed/after013/800/600',
    status: 'completed',
    statusName: '已结案',
    assignee: '霍邱县农业农村局',
    assignTime: '2026-06-23 12:10:00',
    deadline: '2026-06-30 18:00:00',
    checkResult: {
      checker: '马文斌',
      checkTime: '2026-06-24 11:00:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 28,
      description: '农户在耕地上违规种植桂花苗木，已责令限期移栽',
      photos: ['https://picsum.photos/seed/check013/800/600'],
      gpsLocation: [116.27, 32.35]
    },
    rectifyMeasure: '苗木已于6月26日前全部移栽至非耕地，地块恢复粮食种植条件',
    rectifyDeadline: '2026-06-26',
    rectifyCompleteTime: '2026-06-26 17:00:00',
    rectifyPhotos: ['https://picsum.photos/seed/rectify013/800/600'],
    reviewResult: 'approved',
    reviewTime: '2026-06-24 15:00:00',
    reviewer: '六安市农业农村局',
    flowLogs: [
      { time: '2026-06-23 09:30:00', action: '遥感识别发现涉嫌违规用地图斑', operator: '系统' },
      { time: '2026-06-23 12:10:00', action: '任务下发至霍邱县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-24 11:00:00', action: '现场核查完成，确认问题属实', operator: '马文斌' },
      { time: '2026-06-24 15:00:00', action: '审核通过，进入整改阶段', operator: '六安市农业农村局' },
      { time: '2026-06-26 17:00:00', action: '整改完成，提交复查申请', operator: '霍邱县农业农村局' },
      { time: '2026-06-27 10:00:00', action: '复查通过，任务结案', operator: '六安市农业农村局' }
    ]
  },
  {
    id: 'PLOT20260623014',
    plotNo: 'AH-2026-14014',
    location: { province: '安徽省', city: '亳州市', county: '涡阳县', town: '城关镇', village: '马寨村', coordinate: [116.21, 33.51] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 130,
    riskLevel: 'high',
    riskReason: '位于皖北粮食主产区，夏玉米播种面积未达标',
    discoveryTime: '2026-06-23 09:36:00',
    beforeImage: 'https://picsum.photos/seed/before014/800/600',
    afterImage: 'https://picsum.photos/seed/after014/800/600',
    status: 'pending_review',
    statusName: '待审核',
    assignee: '涡阳县农业农村局',
    assignTime: '2026-06-23 12:25:00',
    deadline: '2026-06-30 18:00:00',
    checkResult: {
      checker: '孙大伟',
      checkTime: '2026-06-25 10:45:00',
      result: 'confirmed',
      resultName: '问题属实',
      actualArea: 128,
      description: '农户因种植中药材收益高，擅自将粮食种植计划改为中药材',
      photos: ['https://picsum.photos/seed/check014a/800/600', 'https://picsum.photos/seed/check014b/800/600'],
      gpsLocation: [116.21, 33.51]
    },
    flowLogs: [
      { time: '2026-06-23 09:36:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 12:25:00', action: '任务下发至涡阳县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-25 10:45:00', action: '现场核查完成，确认问题属实', operator: '孙大伟' }
    ]
  },
  {
    id: 'PLOT20260623015',
    plotNo: 'AH-2026-15015',
    location: { province: '安徽省', city: '池州市', county: '东至县', town: '尧渡镇', village: '梅城村', coordinate: [117.01, 30.10] },
    problemType: 'fallow',
    problemTypeName: '疑似撂荒',
    area: 55,
    riskLevel: 'low',
    riskReason: '皖南山区小块耕地，面积较小',
    discoveryTime: '2026-06-23 09:42:00',
    beforeImage: 'https://picsum.photos/seed/before015/800/600',
    afterImage: 'https://picsum.photos/seed/after015/800/600',
    status: 'completed',
    statusName: '已结案',
    assignee: '东至县农业农村局',
    assignTime: '2026-06-23 12:40:00',
    deadline: '2026-06-30 18:00:00',
    checkResult: {
      checker: '徐家明',
      checkTime: '2026-06-24 16:20:00',
      result: 'unconfirmed',
      resultName: '问题不属实',
      actualArea: 55,
      description: '该地块为冬闲田轮作休耕区，已列入休耕轮作试点，不属撂荒',
      photos: ['https://picsum.photos/seed/check015/800/600'],
      gpsLocation: [117.01, 30.10]
    },
    flowLogs: [
      { time: '2026-06-23 09:42:00', action: '遥感识别发现疑似撂荒图斑', operator: '系统' },
      { time: '2026-06-23 12:40:00', action: '任务下发至东至县农业农村局', operator: '省农业农村厅' },
      { time: '2026-06-24 16:20:00', action: '现场核查完成，问题不属实', operator: '徐家明' },
      { time: '2026-06-25 09:00:00', action: '审核确认核查结论，消除误报', operator: '池州市农业农村局' },
      { time: '2026-06-25 10:30:00', action: '任务关闭，误报问题已消除', operator: '系统' }
    ]
  },
  {
    id: 'PLOT20260623016',
    plotNo: 'AH-2026-16016',
    location: { province: '安徽省', city: '宣城市', county: '郎溪县', town: '建平镇', village: '南山村', coordinate: [119.17, 31.14] },
    problemType: 'not_plant',
    problemTypeName: '种植计划未落实',
    area: 62,
    riskLevel: 'medium',
    riskReason: '皖东南一般耕地，水稻种植面积不足',
    discoveryTime: '2026-06-23 09:48:00',
    beforeImage: 'https://picsum.photos/seed/before016/800/600',
    afterImage: 'https://picsum.photos/seed/after016/800/600',
    status: 'pending_check',
    statusName: '待核查',
    assignee: '郎溪县农业农村局',
    assignTime: '2026-06-23 12:55:00',
    deadline: '2026-06-30 18:00:00',
    flowLogs: [
      { time: '2026-06-23 09:48:00', action: '遥感识别发现种植计划未落实图斑', operator: '系统' },
      { time: '2026-06-23 12:55:00', action: '任务下发至郎溪县农业农村局', operator: '省农业农村厅' }
    ]
  }
]

export function getPlots() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlots))
  return initialPlots
}

export function savePlots(plots) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plots))
}

export function updatePlotStatus(plotId, newStatus, newStatusName, extraData = {}) {
  const plots = getPlots()
  const plot = plots.find(p => p.id === plotId)
  if (plot) {
    plot.status = newStatus
    plot.statusName = newStatusName
    Object.assign(plot, extraData)
    if (!plot.flowLogs) plot.flowLogs = []
    plot.flowLogs.push({
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      action: getStatusAction(newStatus),
      operator: extraData.operator || '系统'
    })
    savePlots(plots)
    return plot
  }
  return null
}

function getStatusAction(status) {
  const actions = {
    pending_check: '待核查',
    checking: '核查中',
    pending_review: '待审核',
    rectifying: '整改中',
    pending_review_rectify: '整改待复查',
    completed: '已结案'
  }
  return `状态变更为：${actions[status] || status}`
}

export function getPlotById(plotId) {
  const plots = getPlots()
  return plots.find(p => p.id === plotId)
}

export { initialPlots }