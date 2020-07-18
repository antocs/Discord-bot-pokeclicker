const pokemonTypeIcons = {
  'Normal': '<:normal_icon:733983301890605068>',
  'Fire': '<:fire_icon:733983301085298749>',
  'Water': '<:water_icon:733983302641254400>',
  'Electric': '<:electric_icon:733983301345345566>',
  'Grass': '<:grass_icon:733983301290688513>',
  'Ice': '<:ice_icon:733983301647466537>',
  'Fighting': '<:fighting_icon:733983301160927235>',
  'Poison': '<:poison_icon:733983301831753759>',
  'Ground': '<:ground_icon:733983301404065813>',
  'Flying': '<:flying_icon:733983301437620254>',
  'Psychic': '<:psychic_icon:733983302310035517>',
  'Bug': '<:bug_icon:733983300393107468>',
  'Rock': '<:rock_icon:733983302335070239>',
  'Ghost': '<:ghost_icon:733983301446008893>',
  'Dragon': '<:dragon_icon:733983300963663923>',
  'Dark': '<:dark_icon:733983300947017738>',
  'Steel': '<:steel_icon:733983302326812683>',
  'Fairy': '<:fairy_icon:733983301244813362>',
};

const findShardBestRoute = (RouteShardTypes, type, onlyRegion = -1) => {
  let highestPercent = 0;
  let bestRoute = 0;
  Object.entries(RouteShardTypes).forEach(([region, routes]) => {
    if (onlyRegion >= 0 && onlyRegion != region) return;
    Object.entries(routes).forEach(([route, types]) => {
      if (types[type] && types[type] > highestPercent) {
        bestRoute = route;
        highestPercent = types[type];
      }
    });
  });
  return { route: bestRoute, chance: highestPercent };
};

const findShardRoutes = (RouteShardTypes, type) => {
  const regions = {};
  Object.entries(RouteShardTypes).forEach(([region, routes]) => {
    regions[region] = {};
    Object.entries(routes).forEach(([route, types]) => {
      if (types[type] > 0) {
        regions[region][route] = types[type];
      }
    });
  });
  return regions;
};

class SeededRand {
  static next() {
    this.state = (this.state * this.MULTIPLIER + this.OFFSET) % this.MOD;
    return this.state / this.MOD;
  }
  static seedWithDate(d) {
    this.state = Number((d.getFullYear() - 1900) * d.getDate() + 1000 * d.getMonth() + 100000 * d.getDate());
  }
  static seed(state) {
    this.state = state;
  }
  static intBetween(min, max) {
    return Math.floor((max - min + 1) * SeededRand.next() + min);
  }
  static boolean() {
    return !!this.intBetween(0, 1);
  }
  static fromArray(arr) {
    return arr[SeededRand.intBetween(0, arr.length - 1)];
  }
  static fromEnum(arr) {
    arr = Object.keys(arr).map(Number).filter(item => item >= 0);
    return this.fromArray(arr);
  }
}
SeededRand.state = 12345;
SeededRand.MOD = 233280;
SeededRand.OFFSET = 49297;
SeededRand.MULTIPLIER = 9301;

class DailyDeal {
  constructor() {
    this.item1 = DailyDeal.randomItem();
    this.amount1 = DailyDeal.randomAmount();
    this.item2 = DailyDeal.randomItem();
    this.amount2 = DailyDeal.randomAmount();
  }
  static randomItem() {
    return UndergroundItem.list[Math.floor(UndergroundItem.list.length * SeededRand.next())];
  }
  static randomAmount() {
    return Math.floor(3 * SeededRand.next()) + 1;
  }
  static generateDeals(maxDeals, date) {
    SeededRand.seedWithDate(date);
    DailyDeal.list = [];
    const temp = [];
    const maxTries = maxDeals * 10;
    let i = 0;
    while (i < maxTries && temp.length < maxDeals) {
      const deal = new DailyDeal();
      if (deal.isValid(temp)) {
        temp.push(deal);
      }
      i++;
    }
    DailyDeal.list.push(...temp);
  }
  isValid(dealList) {
    return ((this.item1.name !== this.item2.name) && !DailyDeal.reverseDealExists(this.item1.name, this.item2.name, dealList) && !this.item1.isStone);
  }
  static reverseDealExists(name1, name2, dealList) {
    for (const deal of dealList) {
      if (deal.item2.name == name1) {
        if (deal.item1.name == name2) {
          return true;
        } else {
          return DailyDeal.reverseDealExists(deal.item1.name, name2, dealList);
        }
      }
    }
    return false;
  }
}
DailyDeal.list = [];

// Import: copy(JSON.stringify({list: UndergroundItem.list}))
const UndergroundItem = {'list':[{'name':'Helix Fossil','id':1,'value':0,'valueType':'Mine Egg','isStone':false},{'name':'Dome Fossil','id':2,'value':0,'valueType':'Mine Egg','isStone':false},{'name':'Old Amber','id':3,'value':0,'valueType':'Mine Egg','isStone':false},{'name':'Root Fossil','id':4,'value':0,'valueType':'Mine Egg','isStone':false},{'name':'Claw Fossil','id':5,'value':0,'valueType':'Mine Egg','isStone':false},{'name':'Rare Bone','id':8,'value':3,'valueType':'Diamond','isStone':false},{'name':'Star Piece','id':9,'value':5,'valueType':'Diamond','isStone':false},{'name':'Revive','id':10,'value':2,'valueType':'Diamond','isStone':false},{'name':'Max Revive','id':11,'value':4,'valueType':'Diamond','isStone':false},{'name':'Iron Ball','id':12,'value':2,'valueType':'Diamond','isStone':false},{'name':'Heart Scale','id':13,'value':10,'valueType':'Diamond','isStone':false},{'name':'Light Clay','id':14,'value':2,'valueType':'Diamond','isStone':false},{'name':'Odd Keystone','id':15,'value':6,'valueType':'Diamond','isStone':false},{'name':'Hard Stone','id':16,'value':4,'valueType':'Diamond','isStone':false},{'name':'Fire Stone','id':17,'value':1,'valueType':'Fire_stone','isStone':true},{'name':'Water Stone','id':18,'value':1,'valueType':'Water_stone','isStone':true},{'name':'Thunder Stone','id':19,'value':1,'valueType':'Thunder_stone','isStone':true},{'name':'Leaf Stone','id':20,'value':1,'valueType':'Leaf_stone','isStone':true},{'name':'Moon Stone','id':21,'value':1,'valueType':'Moon_stone','isStone':true},{'name':'Sun Stone','id':22,'value':1,'valueType':'Sun_stone','isStone':true},{'name':'Oval Stone','id':23,'value':3,'valueType':'Diamond','isStone':false},{'name':'Everstone','id':24,'value':3,'valueType':'Diamond','isStone':false},{'name':'Smooth Rock','id':25,'value':2,'valueType':'Diamond','isStone':false},{'name':'Heat Rock','id':26,'value':2,'valueType':'Diamond','isStone':false},{'name':'Icy Rock','id':27,'value':2,'valueType':'Diamond','isStone':false},{'name':'Damp Rock','id':28,'value':2,'valueType':'Diamond','isStone':false},{'name':'Draco Plate','id':29,'value':100,'valueType':'dragon','isStone':false},{'name':'Dread Plate','id':30,'value':100,'valueType':'dark','isStone':false},{'name':'Earth Plate','id':31,'value':100,'valueType':'ground','isStone':false},{'name':'Fist Plate','id':32,'value':100,'valueType':'fighting','isStone':false},{'name':'Flame Plate','id':33,'value':100,'valueType':'fire','isStone':false},{'name':'Icicle Plate','id':34,'value':100,'valueType':'ice','isStone':false},{'name':'Insect Plate','id':35,'value':100,'valueType':'bug','isStone':false},{'name':'Iron Plate','id':36,'value':100,'valueType':'steel','isStone':false},{'name':'Meadow Plate','id':37,'value':100,'valueType':'grass','isStone':false},{'name':'Mind Plate','id':38,'value':100,'valueType':'psychic','isStone':false},{'name':'Sky Plate','id':39,'value':100,'valueType':'flying','isStone':false},{'name':'Splash Plate','id':40,'value':100,'valueType':'water','isStone':false},{'name':'Spooky Plate','id':41,'value':100,'valueType':'ghost','isStone':false},{'name':'Stone Plate','id':42,'value':100,'valueType':'rock','isStone':false},{'name':'Toxic Plate','id':43,'value':100,'valueType':'poison','isStone':false},{'name':'Zap Plate','id':44,'value':100,'valueType':'electric','isStone':false},{'name':'Pixie Plate','id':45,'value':100,'valueType':'fairy','isStone':false},{'name':'Trade Stone','id':46,'value':1,'valueType':'Trade_stone','isStone':true},{'name':'Dragon Scale','id':47,'value':1,'valueType':'Dragon_scale','isStone':true},{'name':'Metal Coat','id':48,'value':1,'valueType':'Metal_coat','isStone':true},{'name':'Kings Rock','id':49,'value':1,'valueType':'Kings_rock','isStone':true},{'name':'Upgrade','id':50,'value':1,'valueType':'Upgrade','isStone':true},{'name':'Time Stone','id':51,'value':1,'valueType':'Time_stone','isStone':true}]};

module.exports = {
  pokemonTypeIcons,
  findShardBestRoute,
  findShardRoutes,
  SeededRand,
  DailyDeal,
  UndergroundItem,
};
