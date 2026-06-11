export const administrativeDivisions = [
  {
    code: '340000',
    name: '安徽省',
    level: 'province',
    parentCode: null,
    children: [
      {
        code: '340100',
        name: '合肥市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340102', name: '瑶海区', level: 'county', parentCode: '340100' },
          { code: '340103', name: '庐阳区', level: 'county', parentCode: '340100' },
          { code: '340104', name: '蜀山区', level: 'county', parentCode: '340100' },
          { code: '340111', name: '包河区', level: 'county', parentCode: '340100' },
          { code: '340121', name: '长丰县', level: 'county', parentCode: '340100' },
          { code: '340122', name: '肥东县', level: 'county', parentCode: '340100' },
          { code: '340123', name: '肥西县', level: 'county', parentCode: '340100' }
        ]
      },
      {
        code: '340200',
        name: '芜湖市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340202', name: '镜湖区', level: 'county', parentCode: '340200' },
          { code: '340203', name: '弋江区', level: 'county', parentCode: '340200' },
          { code: '340207', name: '鸠江区', level: 'county', parentCode: '340200' },
          { code: '340222', name: '繁昌区', level: 'county', parentCode: '340200' },
          { code: '340223', name: '南陵县', level: 'county', parentCode: '340200' }
        ]
      },
      {
        code: '340300',
        name: '蚌埠市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340302', name: '龙子湖区', level: 'county', parentCode: '340300' },
          { code: '340303', name: '蚌山区', level: 'county', parentCode: '340300' },
          { code: '340304', name: '禹会区', level: 'county', parentCode: '340300' },
          { code: '340311', name: '淮上区', level: 'county', parentCode: '340300' },
          { code: '340321', name: '怀远县', level: 'county', parentCode: '340300' },
          { code: '340322', name: '五河县', level: 'county', parentCode: '340300' },
          { code: '340323', name: '固镇县', level: 'county', parentCode: '340300' }
        ]
      },
      {
        code: '340400',
        name: '淮南市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340402', name: '大通区', level: 'county', parentCode: '340400' },
          { code: '340403', name: '田家庵区', level: 'county', parentCode: '340400' },
          { code: '340404', name: '谢家集区', level: 'county', parentCode: '340400' },
          { code: '340405', name: '八公山区', level: 'county', parentCode: '340400' },
          { code: '340406', name: '潘集区', level: 'county', parentCode: '340400' },
          { code: '340421', name: '凤台县', level: 'county', parentCode: '340400' }
        ]
      },
      {
        code: '340500',
        name: '马鞍山市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340503', name: '花山区', level: 'county', parentCode: '340500' },
          { code: '340504', name: '雨山区', level: 'county', parentCode: '340500' },
          { code: '340506', name: '博望区', level: 'county', parentCode: '340500' },
          { code: '340521', name: '当涂县', level: 'county', parentCode: '340500' },
          { code: '340522', name: '含山县', level: 'county', parentCode: '340500' },
          { code: '340523', name: '和县', level: 'county', parentCode: '340500' }
        ]
      },
      {
        code: '340600',
        name: '淮北市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340602', name: '杜集区', level: 'county', parentCode: '340600' },
          { code: '340603', name: '相山区', level: 'county', parentCode: '340600' },
          { code: '340604', name: '烈山区', level: 'county', parentCode: '340600' },
          { code: '340621', name: '濉溪县', level: 'county', parentCode: '340600' }
        ]
      },
      {
        code: '340700',
        name: '铜陵市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340705', name: '铜官区', level: 'county', parentCode: '340700' },
          { code: '340706', name: '义安区', level: 'county', parentCode: '340700' },
          { code: '340711', name: '郊区', level: 'county', parentCode: '340700' },
          { code: '340722', name: '枞阳县', level: 'county', parentCode: '340700' }
        ]
      },
      {
        code: '340800',
        name: '安庆市',
        level: 'city',
        parentCode: '340000',
        children: [
          { code: '340802', name: '迎江区', level: 'county', parentCode: '340800' },
          { code: '340803', name: '大观区', level: 'county', parentCode: '340800' },
          { code: '340811', name: '宜秀区', level: 'county', parentCode: '340800' },
          { code: '340822', name: '怀宁县', level: 'county', parentCode: '340800' },
          { code: '340825', name: '太湖县', level: 'county', parentCode: '340800' },
          { code: '340826', name: '宿松县', level: 'county', parentCode: '340800' },
          { code: '340827', name: '望江县', level: 'county', parentCode: '340800' },
          { code: '340828', name: '岳西县', level: 'county', parentCode: '340800' },
          { code: '340881', name: '桐城市', level: 'county', parentCode: '340800' },
          { code: '340882', name: '潜山市', level: 'county', parentCode: '340800' }
        ]
      }
    ]
  }
]

export const cropTypes = [
  { code: 'wheat', name: '小麦', season: 'winter' },
  { code: 'rice', name: '水稻', season: 'summer' },
  { code: 'corn', name: '玉米', season: 'summer' },
  { code: 'soybean', name: '大豆', season: 'summer' },
  { code: 'rapeseed', name: '油菜', season: 'winter' },
  { code: 'silage_corn', name: '青贮玉米', season: 'summer' }
]

export const disasterTypes = [
  { code: 'flood', name: '洪涝', level: 'high' },
  { code: 'drought', name: '干旱', level: 'high' },
  { code: 'typhoon', name: '台风', level: 'high' },
  { code: 'frost', name: '霜冻', level: 'medium' },
  { code: 'heat', name: '高温热害', level: 'medium' },
  { code: 'pest', name: '病虫害', level: 'medium' }
]

export const plotTypes = [
  { code: 'fallow', name: '撂荒', risk: 'high' },
  { code: 'not_plant', name: '种植计划未落实', risk: 'high' },
  { code: 'illegal_use', name: '非法占用', risk: 'medium' }
]