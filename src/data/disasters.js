export const disasterRecords = [
  {
    id: 'DISA20260315001',
    type: 'frost',
    typeName: '倒春寒',
    level: 'high',
    occurTime: '2026-03-15 02:00:00',
    region: {
      code: '340100',
      name: '合肥市',
      counties: ['长丰县', '肥东县', '肥西县']
    },
    affectedArea: 58000,
    disasterArea: 32000,
    totalLossArea: 8500,
    affectedCrops: ['小麦', '油菜'],
    estimatedLoss: 4200000,
    status: 'resolved',
    photos: [
      'https://example.com/disaster/frost_hf_01.jpg',
      'https://example.com/disaster/frost_hf_02.jpg'
    ],
    reporter: '张明',
    reportTime: '2026-03-15 08:30:00',
    measures: '已组织喷施磷酸二氢钾和芸苔素内酯，覆盖地膜保温，清理冻伤叶片，发放抗寒补贴每亩80元'
  },
  {
    id: 'DISA20260320001',
    type: 'drought',
    typeName: '淮北春旱',
    level: 'high',
    occurTime: '2026-03-20 00:00:00',
    region: {
      code: '341300',
      name: '宿州市',
      counties: ['砀山县', '萧县', '灵璧县', '泗县']
    },
    affectedArea: 120000,
    disasterArea: 78000,
    totalLossArea: 22000,
    affectedCrops: ['小麦', '玉米'],
    estimatedLoss: 12000000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/drought_sz_01.jpg',
      'https://example.com/disaster/drought_sz_02.jpg',
      'https://example.com/disaster/drought_sz_03.jpg'
    ],
    reporter: '刘建国',
    reportTime: '2026-03-20 09:15:00',
    measures: '启动引淮入宿应急调水，组织机井全天候灌溉，推广滴灌节水技术，发放抗旱柴油补贴，气象局待命人工增雨'
  },
  {
    id: 'DISA20260405001',
    type: 'pest',
    typeName: '小麦条锈病',
    level: 'medium',
    occurTime: '2026-04-05 00:00:00',
    region: {
      code: '341200',
      name: '阜阳市',
      counties: ['太和县', '临泉县', '阜南县']
    },
    affectedArea: 35000,
    disasterArea: 18000,
    totalLossArea: 4500,
    affectedCrops: ['小麦'],
    estimatedLoss: 2800000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/pest_fy_01.jpg',
      'https://example.com/disaster/pest_fy_02.jpg'
    ],
    reporter: '陈文博',
    reportTime: '2026-04-05 14:20:00',
    measures: '组织植保无人机统防统治，喷施戊唑醇和三唑酮混配药剂，设立条锈病监测点50处，培训农户识别早期症状'
  },
  {
    id: 'DISA20260510001',
    type: 'heat',
    typeName: '干热风',
    level: 'medium',
    occurTime: '2026-05-10 12:00:00',
    region: {
      code: '341600',
      name: '亳州市',
      counties: ['涡阳县', '蒙城县', '利辛县']
    },
    affectedArea: 95000,
    disasterArea: 45000,
    totalLossArea: 11000,
    affectedCrops: ['小麦'],
    estimatedLoss: 6800000,
    status: 'resolved',
    photos: [
      'https://example.com/disaster/heat_bz_01.jpg'
    ],
    reporter: '王翠花',
    reportTime: '2026-05-11 07:40:00',
    measures: '指导农户早晚小水勤浇增加田间湿度，喷施磷酸二氢钾增强麦株抗逆性，叶面喷施FA旱地龙抗旱剂，提前收割减少损失'
  },
  {
    id: 'DISA20250615001',
    type: 'flood',
    typeName: '梅雨洪涝',
    level: 'high',
    occurTime: '2026-06-15 08:00:00',
    region: {
      code: '341500',
      name: '六安市',
      counties: ['霍邱县', '舒城县', '金寨县']
    },
    affectedArea: 78000,
    disasterArea: 52000,
    totalLossArea: 18000,
    affectedCrops: ['水稻', '蔬菜', '茶叶'],
    estimatedLoss: 15000000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/flood_la_01.jpg',
      'https://example.com/disaster/flood_la_02.jpg',
      'https://example.com/disaster/flood_la_03.jpg'
    ],
    reporter: '赵长江',
    reportTime: '2026-06-15 16:00:00',
    measures: '启动防汛Ⅲ级应急响应，组织群众转移低洼地带秧苗，启用排涝泵站24小时排水，调拨救灾种子10000公斤，开展灾后补种'
  },
  {
    id: 'DISA20250620001',
    type: 'flood',
    typeName: '暴雨洪涝',
    level: 'high',
    occurTime: '2026-06-20 20:00:00',
    region: {
      code: '340800',
      name: '安庆市',
      counties: ['桐城市', '怀宁县', '望江县', '宿松县']
    },
    affectedArea: 105000,
    disasterArea: 68000,
    totalLossArea: 25000,
    affectedCrops: ['水稻', '棉花', '蔬菜'],
    estimatedLoss: 21000000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/flood_aq_01.jpg',
      'https://example.com/disaster/flood_aq_02.jpg'
    ],
    reporter: '杨志远',
    reportTime: '2026-06-21 08:00:00',
    measures: '启动防汛Ⅱ级应急响应，长江干堤巡堤查险24小时不间断，华阳河蓄滞洪区做好分洪准备，转移受灾群众3200人，抢排田间积水，调运救灾物资'
  },
  {
    id: 'DISA20260710001',
    type: 'typhoon',
    typeName: '台风灾害',
    level: 'high',
    occurTime: '2026-07-10 14:00:00',
    region: {
      code: '341800',
      name: '宣城市',
      counties: ['宁国市', '广德市', '泾县', '绩溪县']
    },
    affectedArea: 62000,
    disasterArea: 38000,
    totalLossArea: 14000,
    affectedCrops: ['水稻', '玉米', '山核桃'],
    estimatedLoss: 18000000,
    status: 'resolved',
    photos: [
      'https://example.com/disaster/typhoon_xc_01.jpg',
      'https://example.com/disaster/typhoon_xc_02.jpg',
      'https://example.com/disaster/typhoon_xc_03.jpg'
    ],
    reporter: '黄山松',
    reportTime: '2026-07-11 06:30:00',
    measures: '提前转移地质灾害点群众1200人，加固大棚和畜禽圈舍，台风过后组织扶正倒伏水稻、抢修受损农业设施，发放灾后恢复生产补贴'
  },
  {
    id: 'DISA20260715001',
    type: 'heat',
    typeName: '水稻高温热害',
    level: 'medium',
    occurTime: '2026-07-15 11:00:00',
    region: {
      code: '340200',
      name: '芜湖市',
      counties: ['南陵县', '无为市', '湾沚区']
    },
    affectedArea: 45000,
    disasterArea: 22000,
    totalLossArea: 6000,
    affectedCrops: ['水稻'],
    estimatedLoss: 5200000,
    status: 'monitoring',
    photos: [
      'https://example.com/disaster/heat_wh_01.jpg'
    ],
    reporter: '李稻香',
    reportTime: '2026-07-16 09:00:00',
    measures: '指导农户日灌夜排、深水护苗，喷施磷酸二氢钾和硅肥提高耐热性，密切监测稻飞虱等次生虫害，做好水源调度保障灌溉用水'
  },
  {
    id: 'DISA20260801001',
    type: 'pest',
    typeName: '稻飞虱爆发',
    level: 'high',
    occurTime: '2026-08-01 00:00:00',
    region: {
      code: '340300',
      name: '蚌埠市',
      counties: ['怀远县', '五河县', '固镇县']
    },
    affectedArea: 55000,
    disasterArea: 32000,
    totalLossArea: 9000,
    affectedCrops: ['水稻'],
    estimatedLoss: 7500000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/pest_bb_01.jpg',
      'https://example.com/disaster/pest_bb_02.jpg'
    ],
    reporter: '钱明辉',
    reportTime: '2026-08-02 10:30:00',
    measures: '紧急调拨吡虫啉、噻嗪酮等应急药剂30吨，组织植保服务队200支开展统防统治，设立虫情测报灯100盏加密监测，指导农户选用抗虫品种'
  },
  {
    id: 'DISA20260820001',
    type: 'typhoon',
    typeName: '台风暴雨',
    level: 'high',
    occurTime: '2026-08-20 22:00:00',
    region: {
      code: '341000',
      name: '黄山市',
      counties: ['歙县', '休宁县', '黟县', '祁门县']
    },
    affectedArea: 48000,
    disasterArea: 28000,
    totalLossArea: 9500,
    affectedCrops: ['茶叶', '水稻', '菊花', '枇杷'],
    estimatedLoss: 25000000,
    status: 'processing',
    photos: [
      'https://example.com/disaster/typhoon_hs_01.jpg',
      'https://example.com/disaster/typhoon_hs_02.jpg',
      'https://example.com/disaster/typhoon_hs_03.jpg'
    ],
    reporter: '吴徽州',
    reportTime: '2026-08-21 05:00:00',
    measures: '转移山区地质灾害隐患点群众，清理茶园塌方和排水沟，抢修损毁梯田茶园，组织茶农修剪受损枝条，联系保险公司启动快速理赔通道'
  },
  {
    id: 'DISA20260910001',
    type: 'drought',
    typeName: '秋旱',
    level: 'medium',
    occurTime: '2026-09-10 00:00:00',
    region: {
      code: '340600',
      name: '淮北市',
      counties: ['濉溪县']
    },
    affectedArea: 38000,
    disasterArea: 20000,
    totalLossArea: 5000,
    affectedCrops: ['玉米', '大豆'],
    estimatedLoss: 4500000,
    status: 'monitoring',
    photos: [
      'https://example.com/disaster/drought_hb_01.jpg',
      'https://example.com/disaster/drought_hb_02.jpg'
    ],
    reporter: '孙建国',
    reportTime: '2026-09-11 08:00:00',
    measures: '调度淮水北调工程加大供水量，组织农户利用沟渠井塘灌溉，推广秸秆覆盖保墒技术，加强气象监测适时人工增雨'
  },
  {
    id: 'DISA20261005001',
    type: 'frost',
    typeName: '低温冻害',
    level: 'medium',
    occurTime: '2026-10-05 03:00:00',
    region: {
      code: '340400',
      name: '淮南市',
      counties: ['寿县', '凤台县']
    },
    affectedArea: 28000,
    disasterArea: 15000,
    totalLossArea: 4000,
    affectedCrops: ['蔬菜', '晚稻'],
    estimatedLoss: 3800000,
    status: 'resolved',
    photos: [
      'https://example.com/disaster/frost_hn_01.jpg'
    ],
    reporter: '马大伟',
    reportTime: '2026-10-05 08:00:00',
    measures: '指导菜农覆盖大棚双层膜保温，抢收已成熟蔬菜减少损失，晚稻田灌深水护苗防冻，烟雾熏蒸防霜，发放受灾蔬菜补贴'
  }
]

export const weatherWarnings = [
  {
    id: 'WARN20260315001',
    type: 'frost',
    typeName: '倒春寒霜冻预警',
    level: 'orange',
    title: '安徽省气象台发布倒春寒橙色预警',
    content: '受强冷空气影响，预计未来48小时合肥、六安、滁州、蚌埠等地最低气温将降至0℃以下，出现严重霜冻天气。当前小麦正处于拔节期、油菜处于初花期，低温将对农作物造成较重冻害，请注意防范。',
    affectRegion: ['合肥市', '六安市', '滁州市', '蚌埠市', '淮南市'],
    issueTime: '2026-03-14 18:00:00',
    expireTime: '2026-03-16 18:00:00',
    suggestions: [
      '小麦田及时灌溉增加土壤热容量，减轻冻害影响',
      '油菜田覆盖稻草或地膜保温，喷施硼肥和磷酸二氢钾',
      '蔬菜大棚加固棚膜，必要时启用增温设备',
      '茶园覆盖遮阳网防霜，熏烟驱霜'
    ]
  },
  {
    id: 'WARN20260320001',
    type: 'drought',
    typeName: '淮北春旱预警',
    level: 'yellow',
    title: '安徽省气象台发布淮北地区春旱黄色预警',
    content: '入春以来，宿州、淮北、亳州、阜阳等淮北地区降水量较常年偏少七成，土壤墒情持续下降，预计未来10天仍无明显有效降水过程，春旱将进一步发展，对小麦拔节孕穗和春玉米播种造成不利影响。',
    affectRegion: ['宿州市', '淮北市', '亳州市', '阜阳市'],
    issueTime: '2026-03-20 16:00:00',
    expireTime: '2026-03-30 16:00:00',
    suggestions: [
      '启动抗旱应急预案，调度水源保障农田灌溉',
      '有灌溉条件地区及时浇好拔节水和孕穗水',
      '推广节水灌溉技术，提高水资源利用效率',
      '气象部门做好人工增雨作业准备，抓住有利时机实施增雨'
    ]
  },
  {
    id: 'WARN20260428001',
    type: 'pest',
    typeName: '赤霉病预警',
    level: 'yellow',
    title: '安徽省植保总站发布小麦赤霉病流行黄色预警',
    content: '4月下旬我省江淮地区进入小麦抽穗扬花期，结合菌源量和气象条件综合分析，预计合肥、滁州、六安、淮南等地小麦赤霉病偏重发生风险高。当前田间菌源充足，抽穗扬花期若遇连阴雨将有利于赤霉病流行蔓延。',
    affectRegion: ['合肥市', '滁州市', '六安市', '淮南市'],
    issueTime: '2026-04-28 10:00:00',
    expireTime: '2026-05-10 10:00:00',
    suggestions: [
      '坚持"见花打药"，在小麦齐穗至扬花初期主动用药预防',
      '推荐使用氰烯菌酯、戊唑醇、咪鲜胺等高效低毒药剂',
      '若扬花期遇雨，雨后及时补防一次',
      '植保无人机统防统治，确保作业质量和防治效果'
    ]
  },
  {
    id: 'WARN20260508001',
    type: 'heat',
    typeName: '干热风预警',
    level: 'orange',
    title: '安徽省气象台发布淮北干热风橙色预警',
    content: '预计5月10日至14日，亳州、宿州、淮北、阜阳等地将出现持续性干热风天气，日最高气温达35℃以上，14时相对湿度低于30%，风速大于3m/s。此时小麦正处于灌浆乳熟期，干热风将导致小麦高温逼熟、千粒重下降，预计减产一至两成。',
    affectRegion: ['亳州市', '宿州市', '淮北市', '阜阳市', '蚌埠市'],
    issueTime: '2026-05-08 11:00:00',
    expireTime: '2026-05-14 20:00:00',
    suggestions: [
      '及时浇灌麦黄水，以水调温增湿减轻干热风危害',
      '喷施磷酸二氢钾和FA旱地龙，增强小麦抗干热风能力',
      '蜡熟期及时收割，做到成熟一块收获一块',
      '做好麦田防火工作，严禁焚烧秸秆'
    ]
  },
  {
    id: 'WARN20250610001',
    type: 'flood',
    typeName: '江淮梅雨暴雨预警',
    level: 'orange',
    title: '安徽省气象台发布江淮地区暴雨橙色预警',
    content: '我省江淮地区6月10日正式入梅，较常年偏早5天。预计10日至16日，六安、合肥、安庆、滁州等地有大到暴雨，局部大暴雨，累计雨量150-250毫米，局地超过300毫米。强降雨可能导致城市内涝、农田渍涝和山洪地质灾害。',
    affectRegion: ['六安市', '合肥市', '安庆市', '滁州市', '芜湖市'],
    issueTime: '2026-06-10 08:00:00',
    expireTime: '2026-06-16 08:00:00',
    suggestions: [
      '水稻田及时疏通排水沟渠，防止秧苗受淹',
      '蔬菜基地加固大棚，提前清理田间排水沟',
      '沿江沿河低洼地带做好防洪排涝准备',
      '山区茶园注意防范山洪和滑坡地质灾害',
      '农业设施和畜禽圈舍做好防风加固'
    ]
  },
  {
    id: 'WARN20250618001',
    type: 'flood',
    typeName: '长江汛情预警',
    level: 'red',
    title: '安徽省防汛抗旱指挥部发布长江安徽段洪水红色预警',
    content: '受上游持续强降雨影响，长江安庆站、芜湖站、马鞍山站水位持续上涨，已超过警戒水位，预计未来48小时将超过保证水位。沿江安庆、池州、铜陵、芜湖、马鞍山等地面临严重洪涝威胁，请立即做好防汛抗洪和群众转移安置工作。',
    affectRegion: ['安庆市', '池州市', '铜陵市', '芜湖市', '马鞍山市'],
    issueTime: '2026-06-18 06:00:00',
    expireTime: '2026-06-22 06:00:00',
    suggestions: [
      '立即转移沿江低洼地带群众至安全区域',
      '长江干堤和重点圩口24小时不间断巡堤查险',
      '华阳河蓄滞洪区做好启用分洪准备',
      '农业部门组织抢收已成熟作物，减少损失',
      '备足防汛物资，抢险队伍进入临战状态'
    ]
  },
  {
    id: 'WARN20260708001',
    type: 'typhoon',
    typeName: '皖南台风预警',
    level: 'orange',
    title: '安徽省气象台发布台风橙色预警',
    content: '今年第6号台风"烟花"将于7月10日前后在浙江沿海登陆，之后北上影响我省皖南地区。预计宣城、黄山、池州等地将出现8-10级大风和暴雨到大暴雨，局部特大暴雨，过程雨量200-350毫米。强风雨将对我省南陵、东至等传统水稻产区和黄山茶叶产区造成严重影响。',
    affectRegion: ['宣城市', '黄山市', '池州市', '芜湖市'],
    issueTime: '2026-07-08 14:00:00',
    expireTime: '2026-07-11 14:00:00',
    suggestions: [
      '皖南山区提前转移地质灾害危险区群众',
      '水稻田提前排水降墒，减轻台风暴雨影响',
      '茶园清沟排水，加固梯田防止塌方',
      '设施大棚加固压膜绳，防止大风吹毁',
      '水产养殖加强巡塘，防止漫塘逃鱼'
    ]
  },
  {
    id: 'WARN20260718001',
    type: 'heat',
    typeName: '水稻高温热害预警',
    level: 'yellow',
    title: '安徽省气象台发布水稻高温热害黄色预警',
    content: '出梅后我省受副热带高压控制，预计7月20日至28日芜湖、马鞍山、铜陵、池州、宣城等沿江地区将出现持续高温天气，日最高气温37-39℃。当前单季稻正处于抽穗扬花期，持续高温将导致花粉败育、结实率下降，预计影响产量15%-25%。',
    affectRegion: ['芜湖市', '马鞍山市', '铜陵市', '池州市', '宣城市'],
    issueTime: '2026-07-18 10:00:00',
    expireTime: '2026-07-28 18:00:00',
    suggestions: [
      '扬花期稻田保持8-10厘米深水层，日灌夜排降温增湿',
      '喷施磷钾肥、硅肥和芸苔素内酯提高水稻耐热性',
      '有条件地区可采用喷灌降温',
      '密切监测稻飞虱、纹枯病等高温次生病虫害'
    ]
  },
  {
    id: 'WARN20260825001',
    type: 'flood',
    typeName: '淮河秋汛预警',
    level: 'yellow',
    title: '安徽省防汛抗旱指挥部发布淮河秋汛黄色预警',
    content: '受连续降雨影响，淮河王家坝站、润河集站水位持续上涨，预计未来72小时淮河安徽段将全线超警戒水位。阜阳、六安、蚌埠、淮南等沿淮地区需加强防范秋汛带来的洪涝灾害。秋粮作物处于产量形成关键期，渍涝将严重影响产量。',
    affectRegion: ['阜阳市', '六安市', '蚌埠市', '淮南市'],
    issueTime: '2026-08-25 08:00:00',
    expireTime: '2026-08-30 08:00:00',
    suggestions: [
      '沿淮洼地农田及时清沟排水，防止内涝',
      '玉米大豆田遭受渍涝后及时中耕散墒',
      '蒙洼蓄洪区做好启用准备，确保群众安全',
      '已成熟作物抢晴收获，防止穗上发芽霉变'
    ]
  },
  {
    id: 'WARN20261001001',
    type: 'frost',
    typeName: '寒潮霜冻预警',
    level: 'blue',
    title: '安徽省气象台发布寒潮蓝色预警',
    content: '受强冷空气影响，预计10月5日至7日我省自北向南将出现强降温天气，48小时最低气温降幅达10-12℃，沿淮淮北最低气温降至2-4℃，可能出现初霜冻。当前皖北晚秋蔬菜、南部晚稻仍在生长，低温冻害风险较大。',
    affectRegion: ['淮北市', '宿州市', '亳州市', '阜阳市', '蚌埠市'],
    issueTime: '2026-10-03 18:00:00',
    expireTime: '2026-10-07 18:00:00',
    suggestions: [
      '露天蔬菜及时覆盖薄膜、稻草等防寒物资',
      '大棚蔬菜加固棚膜，必要时启用增温设备',
      '晚稻田灌深水保温护苗，霜后缓慢排水',
      '已成熟蔬菜和晚稻抢晴收获，避免冻害损失'
    ]
  },
  {
    id: 'WARN20261015001',
    type: 'drought',
    typeName: '秋冬连旱预警',
    level: 'yellow',
    title: '安徽省气象台发布秋冬连旱黄色预警',
    content: '9月以来我省降水量较常年偏少六至八成，预计秋冬季节降水仍将偏少，淮北、江淮地区可能发生秋冬连旱。当前正值秋种关键期，土壤墒情不足将影响小麦播种出苗和油菜移栽成活，对来年夏粮生产构成威胁。',
    affectRegion: ['宿州市', '淮北市', '亳州市', '阜阳市', '蚌埠市', '淮南市'],
    issueTime: '2026-10-15 10:00:00',
    expireTime: '2026-11-15 10:00:00',
    suggestions: [
      '抢墒造墒播种，墒情不足地块采取抗旱播种技术',
      '推广小麦免耕沟播、镇压保墒等节水技术',
      '油菜移栽后及时浇定根水，提高成活率',
      '统筹调度水源，优先保障秋种灌溉用水'
    ]
  }
]

export const agriculturalAdvices = [
  {
    id: 'ADVI20260315001',
    region: '合肥市',
    cropType: 'wheat',
    growthStage: '拔节期',
    weather: '晴转多云，气温8-16℃，北风3级',
    advices: [
      '小麦拔节期是需水需肥关键期，墒情不足地块及时灌溉拔节水，每亩追施尿素8-10公斤',
      '近期气温波动较大，注意防范倒春寒，低温来临前喷施磷酸二氢钾+芸苔素内酯',
      '加强纹枯病、条锈病田间调查，达防治指标（病株率5%）及时用药',
      '结合化学除草，防除猪殃殃、播娘蒿等阔叶杂草，注意除草剂低温安全性'
    ],
    createTime: '2026-03-15 06:00:00'
  },
  {
    id: 'ADVI20260320001',
    region: '宿州市',
    cropType: 'wheat',
    growthStage: '拔节孕穗期',
    weather: '晴，气温12-22℃，相对湿度30%，南风3-4级',
    advices: [
      '当前墒情不足，有灌溉条件地块立即浇好拔节水，结合灌溉追施拔节孕穗肥',
      '淮北地区春旱持续发展，无灌溉条件地块喷施抗旱剂减少水分蒸发',
      '密切监测麦蜘蛛和蚜虫发生动态，百株蚜量达500头时及时防治',
      '做好小麦吸浆虫淘土调查，达标地块孕穗期撒施毒土防治'
    ],
    createTime: '2026-03-20 06:30:00'
  },
  {
    id: 'ADVI20260402001',
    region: '阜阳市',
    cropType: 'corn',
    growthStage: '播种期',
    weather: '多云，气温14-24℃，墒情适宜',
    advices: [
      '当前墒情适宜，抢墒播种春玉米，推荐选用郑单958、先玉335等耐密高产品种',
      '播种深度3-5厘米，每亩留苗4000-4500株，种肥同播施足底肥',
      '播种后及时喷施封闭除草剂，防除马唐、稗草等一年生杂草',
      '密切关注气温变化，若遇低温可覆盖地膜增温保墒促进出苗'
    ],
    createTime: '2026-04-02 07:00:00'
  },
  {
    id: 'ADVI20260415001',
    region: '芜湖市',
    cropType: 'rapeseed',
    growthStage: '盛花期',
    weather: '阴有小雨，气温15-23℃，偏东风2-3级',
    advices: [
      '油菜盛花期是菌核病防治关键期，抓紧雨停间隙喷施菌核净或多菌灵+咪鲜胺',
      '结合菌核病防治，加喷硼肥和磷酸二氢钾，防止花而不实、提高结实率',
      '连阴雨天气做好田间清沟排水，防止渍害导致根系早衰',
      '花后注意防治蚜虫，百株蚜量达1000头时喷施吡虫啉或啶虫脒'
    ],
    createTime: '2026-04-15 06:00:00'
  },
  {
    id: 'ADVI20260505001',
    region: '亳州市',
    cropType: 'wheat',
    growthStage: '灌浆期',
    weather: '晴热，气温22-34℃，相对湿度25%，西南风4级',
    advices: [
      '灌浆期注意预防干热风，有灌溉条件地块小水细浇麦黄水，增加田间湿度',
      '叶面喷施磷酸二氢钾200克/亩+尿素1%，增强抗干热风能力延缓叶片衰老',
      '密切监测穗蚜发生，百穗蚜量达500头时用吡虫啉或啶虫脒喷雾防治',
      '小麦蜡熟末期及时收割，防止干热风导致枯熟落粒'
    ],
    createTime: '2026-05-05 06:00:00'
  },
  {
    id: 'ADVI20250612001',
    region: '六安市',
    cropType: 'rice',
    growthStage: '返青分蘖期',
    weather: '阴有中雨，气温22-28℃，偏东风3级',
    advices: [
      '刚移栽稻田保持浅水层2-3厘米促进返青，返青后浅水湿润灌溉促进分蘖',
      '梅雨期注意排水防涝，保持田间水层不超过秧苗叶耳，防止受淹缺氧',
      '分蘖期每亩追施尿素8-10公斤促进早生快发，注意氮肥不可过量防止贪青',
      '加强稻蓟马和螟虫监测，枯鞘率达5%时及时用阿维菌素或氯虫苯甲酰胺防治'
    ],
    createTime: '2026-06-12 07:00:00'
  },
  {
    id: 'ADVI20260625001',
    region: '安庆市',
    cropType: 'cotton',
    growthStage: '蕾期',
    weather: '多云有阵雨，气温25-33℃，偏南风2-3级',
    advices: [
      '棉花蕾期及时整枝抹杈，去除叶枝和赘芽，改善田间通风透光条件',
      '蕾期追施花铃肥，每亩施尿素15-20公斤+氯化钾10公斤，促进蕾铃发育',
      '雨后及时清沟排水，长江棉区地下水位高，注意防止渍涝导致蕾铃脱落',
      '加强棉铃虫和盲蝽蟓监测，二代棉铃虫百株卵量达30粒时及时防治'
    ],
    createTime: '2026-06-25 06:30:00'
  },
  {
    id: 'ADVI20260715001',
    region: '黄山市',
    cropType: 'tea',
    growthStage: '夏茶采摘期',
    weather: '晴间多云，气温26-36℃，偏南风2级',
    advices: [
      '夏茶采摘遵循"分批多次、采养结合"原则，留1-2片真叶采，避免强采损伤茶树',
      '持续高温天气茶园早晚喷灌降温，地面覆盖稻草或防草布减少水分蒸发',
      '夏季茶树易受茶小绿叶蝉和茶尺蠖危害，及时悬挂诱虫板和频振灯诱杀',
      '采茶后及时追施夏肥，每亩施复合肥25-30公斤，补充茶树养分消耗'
    ],
    createTime: '2026-07-15 06:00:00'
  },
  {
    id: 'ADVI20260720001',
    region: '芜湖市',
    cropType: 'rice',
    growthStage: '抽穗扬花期',
    weather: '晴热高温，气温30-39℃，微风',
    advices: [
      '抽穗扬花期遭遇高温热害风险极大，稻田务必保持10厘米深水层降温增湿',
      '叶面喷施磷酸二氢钾+芸苔素内酯+氨基酸水溶肥，增强花粉活力和耐热性',
      '有条件地区可在午间进行喷灌降温，降低穗层温度2-3℃',
      '高温期间注意稻飞虱和稻纵卷叶螟暴发，加密田间调查频次，达标立即防治'
    ],
    createTime: '2026-07-20 08:00:00'
  },
  {
    id: 'ADVI20260815001',
    region: '蚌埠市',
    cropType: 'soybean',
    growthStage: '结荚鼓粒期',
    weather: '多云，气温24-33℃，偏北风3级',
    advices: [
      '大豆结荚鼓粒期是需水临界期，遇旱及时灌溉，保持土壤含水量70%-80%',
      '鼓粒期追施叶面肥，喷施磷酸二氢钾+硼钼微肥，促进籽粒饱满',
      '加强大豆食心虫和豆荚螟防治，成虫盛发期用高效氯氟氰菊酯+甲维盐喷雾',
      '田间病株及时拔除，重点防控大豆霜霉病和紫斑病'
    ],
    createTime: '2026-08-15 06:00:00'
  },
  {
    id: 'ADVI20260920001',
    region: '淮北市',
    cropType: 'corn',
    growthStage: '灌浆成熟期',
    weather: '晴，气温18-28℃，东北风2-3级',
    advices: [
      '夏玉米灌浆期遇旱及时浇灌浆水，保证籽粒灌浆充实，提高千粒重',
      '密切监测玉米螟和棉铃虫，虫穗率达10%时用氯虫苯甲酰胺或甲维盐灌心防治',
      '注意防治玉米南方锈病和大斑病，发病初期用戊唑醇或嘧菌酯喷雾',
      '玉米苞叶变白、籽粒乳线消失时适时晚收，延长灌浆时间增加粒重'
    ],
    createTime: '2026-09-20 07:00:00'
  },
  {
    id: 'ADVI20261002001',
    region: '淮南市',
    cropType: 'vegetables',
    growthStage: '秋季采收期',
    weather: '多云转阴，气温14-22℃，东北风3-4级',
    advices: [
      '大白菜、萝卜等秋冬蔬菜进入快速生长期，保持土壤见干见湿，追施水溶肥促生长',
      '近期冷空气活动频繁，提前做好防寒准备，大棚蔬菜加固棚膜防止大风揭膜',
      '叶菜类注意防治霜霉病和小菜蛾，选用生物农药或低毒化学药剂',
      '茄果类蔬菜适时采收，霜冻来临前抢收完毕，防止冻害造成损失'
    ],
    createTime: '2026-10-02 06:00:00'
  },
  {
    id: 'ADVI20261015001',
    region: '滁州市',
    cropType: 'rapeseed',
    growthStage: '移栽期',
    weather: '晴，气温12-22℃，东北风2级',
    advices: [
      '油菜适期移栽，苗龄30-35天，每亩移栽6000-8000株，做到带肥带药带水移栽',
      '移栽前精细整地施足基肥，每亩施45%复合肥30-40公斤+硼砂1公斤',
      '移栽后及时浇定根水确保成活，墒情差的地块连续浇水2-3天',
      '移栽后注意防治跳甲和蚜虫，发现害虫及时用啶虫脒或高效氯氰菊酯防治'
    ],
    createTime: '2026-10-15 06:30:00'
  }
]
