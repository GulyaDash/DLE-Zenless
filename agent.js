

const attributeImages = {
  fire: "Data/Image/Attribute/Fire.webp",
  ice: "Data/Image/Attribute/Ice.webp",
  electric: "Data/Image/Attribute/Electric.webp",
  physical: "Data/Image/Attribute/Physical.webp",
  ether: "Data/Image/Attribute/Ether.webp",
  wind: "Data/Image/Attribute/Wind.webp",
  lumin: "Data/Image/Attribute/Lumin.webp"
};

const rankImages = {
  A: "Data/Image/Rank/A.png",
  S: "Data/Image/Rank/S.png"
};

const races = {
  construct: "Data/Image/Race/Construct.svg",
  thiren: "Data/Image/Race/Thiren.svg",
  people: "Data/Image/Race/People.svg",
  others: "Data/Image/Race/Others.svg"
};

const specialtyImages = {
  anomaly: "Data/Image/Specialty/Anomaly.webp",
  attack: "Data/Image/Specialty/Attack.webp",
  defense: "Data/Image/Specialty/Defense.webp",
  rupture: "Data/Image/Specialty/Rupture.webp",
  stun: "Data/Image/Specialty/Stun.webp",
  support: "Data/Image/Specialty/Support.webp"
  //lumin: "Data/Image/Attribute/Lumin.webp"
};

const attackTypeImages = {
  pierce: "Data/Image/AttackTypes/Pierce.png",
  slash: "Data/Image/AttackTypes/Slash.png",
  strike: "Data/Image/AttackTypes/Strike.png",
  strike_slash: "Data/Image/AttackTypes/Strike_Slash.png",
  pierce_slash: "Data/Image/AttackTypes/Pierce_Slash.png"
};

const factionImages = {
  angels: "Data/Image/Factions/Angels.webp",
  APD: "Data/Image/Factions/APD.webp",
  belobog: "Data/Image/Factions/Belobog.webp",
  hares: "Data/Image/Factions/Hares.webp",
  ESD: "Data/Image/Factions/ESD.webp",
  krampus: "Data/Image/Factions/Krampus.webp",
  mockingbird: "Data/Image/Factions/Mockingbird.webp",
  
  CISRT: "Data/Image/Factions/CISRT.webp",
  MOD: "Data/Image/Factions/MOD.webp",
  rover  : "Data/Image/Factions/Rover.webp",
  
  obol: "Data/Image/Factions/Obol.webp",
  silver: "Data/Image/Factions/Silver.webp",
    
  phaethon: "Data/Image/Factions/Phaethon.webp",
  section6: "Data/Image/Factions/Section6.webp",
  SOL: "Data/Image/Factions/SOL.webp",
  calydon: "Data/Image/Factions/Calydon.webp",
  spooky: "Data/Image/Factions/Spooky.webp",
  victoria: "Data/Image/Factions/Victoria.webp",
  yunkui: "Data/Image/Factions/Yunkui.webp",
  COD: "Data/Image/Factions/COD.webp"
};

const weeklyBoss = {
  bringer: "Data/Image/Boss/Bringer.webp",
  butcher: "Data/Image/Boss/Butcher.webp",
  complex: "Data/Image/Boss/Complex.webp",
  girtablullu: "Data/Image/Boss/Girtablullu.webp",
  hunter: "Data/Image/Boss/Hunter.webp",
  marionettes: "Data/Image/Boss/Marionettes.webp",
  pompey: "Data/Image/Boss/Pompey.webp",
  priest: "Data/Image/Boss/Priest.webp",
  sweeper: "Data/Image/Boss/Sweeper.webp",
  ye_shiyuan: "Data/Image/Boss/Ye_Shiyuan.webp"
};

const materials = {
  advance: "Data/Image/Material/Advance.gif",
  awe: "Data/Image/Material/Awe.gif",
  circuit: "Data/Image/Material/Circuit.webp",
  cleave: "Data/Image/Material/Cleave.gif",
  core: "Data/Image/Material/Core.gif",
  dragon: "Data/Image/Material/Dragon.gif",
  dreamsteel: "Data/Image/Material/Dreamsteel.gif",
  edge: "Data/Image/Material/Edge.gif",
  elytron: "Data/Image/Material/Elytron.gif",
  feather: "Data/Image/Material/Feather.gif",
  fist: "Data/Image/Material/Fist.gif",
  malice: "Data/Image/Material/Malice.gif",
  obituary : "Data/Image/Material/Obituary .gif",
  phantom: "Data/Image/Material/Phantom.gif",
  pursuit: "Data/Image/Material/Pursuit.gif",
};


const agents = [




//Cunning Hares
{
  name:"Anby Demara",
  race: "people",
  rank: "A",
  specialty: "stun",
  attribute: "electric",
  attackType: "slash",
  faction: "hares",
  weeklyBoss: "butcher" ,
  material: "obituary",
  image: "Data/Image/Agent/Anby.webp"
},

{
  name:"Nicole Demara",
  race: "people",
  rank: "A",
  specialty: "support",
  attribute: "ether",
  attackType: "strike",
  faction: "hares",
  weeklyBoss: "butcher" ,
  material: "obituary",
  image: "Data/Image/Agent/Nicole.webp"
},

{
  name:"Billy Kid",
  race: "construct",
  rank: "A",
  specialty: "attack",
  attribute: "physical",
  attackType: "pierce",
  faction: "hares",
  weeklyBoss: "butcher" ,
  material: "pursuit",
  image: "Data/Image/Agent/Billy.webp"
},

{
  name:"Nekomiya Mana",
  race: "thiren",
  rank: "S",
  specialty: "attack",
  attribute: "physical",
  attackType: "slash",
  faction: "hares",
  weeklyBoss: "butcher" ,
  material: "awe",
  image: "Data/Image/Agent/Nekomi.webp"
},

{
  name:"Starlight - Billy Kid",
  race: "construct",
  rank: "S",
  specialty: "rupture",
  attribute: "physical",
  attackType: "slash",
  faction: "hares",
  weeklyBoss: "ye_shiyuan" ,
  material: "feather",
  image: "Data/Image/Agent/Starlight.webp"
},

//Victoria

{
  name: "Alexandrina Sebastiane",
  race: "people",
  rank: "S",
  specialty: "support",
  attribute: "electric",
  attackType: "strike",
  faction: "victoria",
  weeklyBoss: "marionettes" ,
  material: "advance",
  image: "Data/Image/Agent/rina.webp"
},

{
  name: "Ellen Joe",
  race: "thiren",
  rank: "S",
  specialty: "attack",
  attribute: "ice",
  attackType: "slash",
  faction: "victoria",
  weeklyBoss: "butcher" ,
  material: "obituary",
  image: "Data/Image/Agent/Ellen.webp"
},

{
  name: "Von Lycaon",
  race: "thiren",
  rank: "S",
  specialty: "stun",
  attribute: "ice",
  attackType: "strike",
  faction: "victoria",
  weeklyBoss: "marionettes" ,
  material: "pursuit",
  image: "Data/Image/Agent/Lycaon.webp"
},

{
  name: "Corin Wickes",
  race: "others",
  rank: "A",
  specialty: "attack",
  attribute: "physical",
  attackType: "slash",
  faction: "victoria",
  weeklyBoss: "marionettes" ,
  material: "awe",
  image: "Data/Image/Agent/Corin.webp"
},

//Belobog
{
  name: "Grace Howard",
  race: "people",
  rank: "S",
  specialty: "anomaly",
  attribute: "electric",
  attackType: "pierce",
  faction: "belobog",
  weeklyBoss: "complex" ,
  material: "advance",
  image: "Data/Image/Agent/Grace.webp"
},

{
  name: "Koleda Belobog",
  race: "people",
  rank: "S",
  specialty: "stun",
  attribute: "fire",
  attackType: "strike",
  faction: "belobog",
  weeklyBoss: "complex" ,
  material: "malice",
  image: "Data/Image/Agent/Koleda.webp"
},

{
  name: "Ben Bigger",
  race: "thiren",
  rank: "A",
  specialty: "defense",
  attribute: "fire",
  attackType: "strike",
  faction: "belobog",
  weeklyBoss: "complex" ,
  material: "malice",
  image: "Data/Image/Agent/Ben.webp"
},

{
  name: "Anton Ivanov",
  race: "people",
  rank: "A",
  specialty: "attack",
  attribute: "electric",
  attackType: "pierce",
  faction: "belobog",
  weeklyBoss: "complex" ,
  material: "advance",
  image: "Data/Image/Agent/Anton.webp"
},

//Calydon

{
  name: "Burnice White",
  race: "people",
  rank: "S",
  specialty: "anomaly",
  attribute: "fire",
  attackType: "pierce",
  faction: "calydon",
  weeklyBoss: "pompey" ,
  material: "phantom",
  image: "Data/Image/Agent/Burnice.webp"
},

{
  name: "Lighter",
  race: "people",
  rank: "S",
  specialty: "stun",
  attribute: "fire",
  attackType: "strike",
  faction: "calydon",
  weeklyBoss: "pompey" ,
  material: "awe",
  image: "Data/Image/Agent/Lighter.webp"
},

{
  name: "Caesar King",
  race: "people",
  rank: "S",
  specialty: "defense",
  attribute: "physical",
  attackType: "strike_slash",
  faction: "calydon",
  weeklyBoss: "pompey" ,
  material: "phantom",
  image: "Data/Image/Agent/Caesar.webp"
},

{
  name: "Pulchra Fellini",
  race: "thiren",
  rank: "A",
  specialty: "stun",
  attribute: "physical",
  attackType: "slash",
  faction: "calydon",
  weeklyBoss: "pompey" ,
  material: "phantom",
  image: "Data/Image/Agent/Pulchra.webp"
},

{
  name: "Piper Wheel",
  race: "people",
  rank: "A",
  specialty: "anomaly",
  attribute: "physical",
  attackType: "slash",
  faction: "calydon",
  weeklyBoss: "marionettes" ,
  material: "awe",
  image: "Data/Image/Agent/Piper.webp"
},

{
  name: "Luciana de Montefio",
  race: "people",
  rank: "A",
  specialty: "support",
  attribute: "fire",
  attackType: "strike",
  faction: "calydon",
  weeklyBoss: "butcher" ,
  material: "malice",
  image: "Data/Image/Agent/Luciana.webp"
},

// Obol Squad

{
  name: "Seed",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "electric",
  attackType: "strike_slash",
  faction: "obol",
  weeklyBoss: "priest" ,
  material: "cleave",
  image: "Data/Image/Agent/Seed.webp"
},

{
  name: "Soldier 0 - Anby",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "electric",
  attackType: "slash",
  faction: "silver",
  weeklyBoss: "complex" ,
  material: "cleave",
  image: "Data/Image/Agent/Soldier0.webp"
},

{
  name: "Trigger",
  race: "people",
  rank: "S",
  specialty: "stun",
  attribute: "electric",
  attackType: "pierce",
  faction: "obol",
  weeklyBoss: "butcher" ,
  material: "cleave",
  image: "Data/Image/Agent/Trigger.webp"
},


{
  name: "Orphie Magnusson & Magus",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "fire",
  attackType: "pierce_slash",
  faction: "obol",
  weeklyBoss: "pompey" ,
  material: "elytron",
  image: "Data/Image/Agent/Orphie.webp"
},

{
  name: "Soldier 11",
  race: "people",
  rank: "A",
  specialty: "attack",
  attribute: "fire",
  attackType: "slash",
  faction: "obol",
  weeklyBoss: "marionettes" ,
  material: "advance",
  image: "Data/Image/Agent/Soldier11.webp"
},

//Section 6

{
  name: "Tsukishiro Yanagi",
  race: "people",
  rank: "S",
  specialty: "anomaly",
  attribute: "electric",
  attackType: "slash",
  faction: "section6",
  weeklyBoss: "complex" ,
  material: "advance",
  image: "Data/Image/Agent/Yanagi.webp"
},

{
  name: "Asaba Harumasa",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "electric",
  attackType: "pierce_slash",
  faction: "section6",
  weeklyBoss: "bringer" ,
  material: "dragon",
  image: "Data/Image/Agent/Harumasa.webp"
},

{
  name: "Hoshimi Miyabi",
  race: "thiren",
  rank: "S",
  specialty: "anomaly",
  attribute: "ice",
  attackType: "slash",
  faction: "section6",
  weeklyBoss: "bringer" ,
  material: "dragon",
  image: "Data/Image/Agent/Miyabi.webp"
},

{
  name: "Soukaku",
  race: "others",
  rank: "A",
  specialty: "support",
  attribute: "ice",
  attackType: "slash",
  faction: "section6",
  weeklyBoss: "marionettes" ,
  material: "obituary",
  image: "Data/Image/Agent/Soukaku.webp"
},

//polic 

{
  name: "Cissia",
  race: "thiren",
  rank: "S",
  specialty: "attack",
  attribute: "electric",
  attackType: "slash",
  faction: "MOD",
  weeklyBoss: "priest" ,
  material: "feather",
  image: "Data/Image/Agent/Cissia.webp"
},

{
  name: "Jane Doe",
  race: "thiren",
  rank: "S",
  specialty: "anomaly",
  attribute: "physical",
  attackType: "slash",
  faction: "rover",
  weeklyBoss: "butcher" ,
  material: "fist",
  image: "Data/Image/Agent/Jane.webp"
},

{
  name: "Qingyi",
  race: "construct",
  rank: "S",
  specialty: "stun",
  attribute: "electric",
  attackType: "strike",
  faction: "CISRT",
  weeklyBoss: "complex" ,
  material: "pursuit",
  image: "Data/Image/Agent/Qingyi.webp"
},

{
  name: "Zhu Yuan",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "ether",
  attackType: "pierce",
  faction: "CISRT",
  weeklyBoss: "complex" ,
  material: "pursuit",
  image: "Data/Image/Agent/Zhu.webp"
},

{
  name: "Seth Lowell",
  race: "thiren",
  rank: "A",
  specialty: "defense",
  attribute: "electric",
  attackType: "slash",
  faction: "CISRT",
  weeklyBoss: "complex" ,
  material: "fist",
  image: "Data/Image/Agent/Seth.webp"
},

//SOL

{
  name: "Evelyn Chevalier",
  race: "people",
  rank: "S",
  specialty: "attack",
  attribute: "fire",
  attackType: "slash",
  faction: "SOL",
  weeklyBoss: "pompey" ,
  material: "malice",
  image: "Data/Image/Agent/Evelyn.webp"
},

{
  name: "Astra Yao",
  race: "people",
  rank: "S",
  specialty: "support",
  attribute: "ether",
  attackType: "strike",
  faction: "SOL",
  weeklyBoss: "marionettes" ,
  material: "dragon",
  image: "Data/Image/Agent/Astra.webp"
},

//mockingbird

{
  name: "Vivian Banshee",
  race: "others",
  rank: "S",
  specialty: "anomaly",
  attribute: "ether",
  attackType: "slash",
  faction: "mockingbird",
  weeklyBoss: "bringer" ,
  material: "dragon",
  image: "Data/Image/Agent/Vivian.webp"
},

{
  name: "Hugo Vlad",
  race: "others",
  rank: "S",
  specialty: "attack",
  attribute: "ice",
  attackType: "slash",
  faction: "mockingbird",
  weeklyBoss: "marionettes" ,
  material: "obituary",
  image: "Data/Image/Agent/Hugo.webp"
},

//yunkui

{
  name: "Ye Shunguang",
  race: "thiren",
  rank: "S",
  specialty: "attack",
  attribute: "physical",
  attackType: "slash",
  faction: "yunkui",
  weeklyBoss: "ye_shiyuan" ,
  material: "core",
  image: "Data/Image/Agent/YeShu.webp"
},

{
  name: "Ju Fufu",
  race: "thiren",
  rank: "S",
  specialty: "stun",
  attribute: "fire",
  attackType: "strike",
  faction: "yunkui",
  weeklyBoss: "priest" ,
  material: "elytron",
  image: "Data/Image/Agent/Fufu.webp"
},

{
  name: "Yixuan",
  race: "people",
  rank: "S",
  specialty: "rupture",
  attribute: "ether",
  attackType: "strike",
  faction: "yunkui",
  weeklyBoss: "priest" ,
  material: "elytron",
  image: "Data/Image/Agent/Yixuan.webp"
},

{
  name: "Pan Yinhu",
  race: "thiren",
  rank: "A",
  specialty: "defense",
  attribute: "physical",
  attackType: "strike",
  faction: "yunkui",
  weeklyBoss: "priest" ,
  material: "elytron",
  image: "Data/Image/Agent/Pan.webp"
},

//spooky

{
  name: "Lucia Elowen",
  race: "thiren",
  rank: "S",
  specialty: "support",
  attribute: "ether",
  attackType: "strike",
  faction: "spooky",
  weeklyBoss: "hunter" ,
  material: "dreamsteel",
  image: "Data/Image/Agent/Lucia.webp"
},

{
  name: "Ukinami Yuzuha",
  race: "people",
  rank: "S",
  specialty: "support",
  attribute: "physical",
  attackType: "strike",
  faction: "spooky",
  weeklyBoss: "bringer" ,
  material: "edge",
  image: "Data/Image/Agent/Yuzuha.webp"
},

{
  name: "Alice Thymefield",
  race: "thiren",
  rank: "S",
  specialty: "anomaly",
  attribute: "physical",
  attackType: "slash",
  faction: "spooky",
  weeklyBoss: "bringer" ,
  material: "edge",
  image: "Data/Image/Agent/Alice.webp"
},

{
  name: "Yidhari Murphy",
  race: "thiren",
  rank: "S",
  specialty: "rupture",
  attribute: "ice",
  attackType: "strike",
  faction: "spooky",
  weeklyBoss: "hunter" ,
  material: "dreamsteel",
  image: "Data/Image/Agent/Yidhari.webp"
},

{
  name: "Komano Manato",
  race: "thiren",
  rank: "A",
  specialty: "rupture",
  attribute: "fire",
  attackType: "12",
  faction: "spooky",
  weeklyBoss: "hunter" ,
  material: "dreamsteel",
  image: "Data/Image/Agent/Manato.webp"
},

//krampus 

{
  name: "Promeia",
  race: "people",
  rank: "S",
  specialty: "anomaly",
  attribute: "ice",
  attackType: "slash",
  faction: "krampus",
  weeklyBoss: "sweeper" ,
  material: "edge",
  image: "Data/Image/Agent/Promeia.webp"
},

{
  name: "Dialyn",
  race: "people",
  rank: "S",
  specialty: "stun",
  attribute: "physical",
  attackType: "slash",
  faction: "krampus",
  weeklyBoss: "priest" ,
  material: "phantom",
  image: "Data/Image/Agent/Dialyn.webp"
},

{
  name: "Banyue",
  race: "construct",
  rank: "S",
  specialty: "rupture",
  attribute: "fire",
  attackType: "strike",
  faction: "krampus",
  weeklyBoss: "hunter" ,
  material: "elytron",
  image: "Data/Image/Agent/Banyue.webp"
},

{
  name: "Zhao",
  race: "thiren",
  rank: "S",
  specialty: "defense",
  attribute: "ice",
  attackType: "slash",
  faction: "krampus",
  weeklyBoss: "ye_shiyuan" ,
  material: "core",
  image: "Data/Image/Agent/Zhao.webp"
},

//angels

{
  name: "Nangong Yu",
  race: "thiren",
  rank: "S",
  specialty: "stun",
  attribute: "ether",
  attackType: "strike",
  faction: "angels",
  weeklyBoss: "sweeper" ,
  material: "core",
  image: "Data/Image/Agent/Nangong.webp"
},

{
  name: "Aria",
  race: "construct",
  rank: "S",
  specialty: "anomaly",
  attribute: "ether",
  attackType: "strike",
  faction: "angels",
  weeklyBoss: "ye_shiyuan" ,
  material: "fist",
  image: "Data/Image/Agent/Aria.webp"
},

{
  name: "Sunna",
  race: "people",
  rank: "S",
  specialty: "support",
  attribute: "physical",
  attackType: "strike",
  faction: "angels",
  weeklyBoss: "ye_shiyuan" ,
  material: "feather",
  image: "Data/Image/Agent/Sunna.webp"
},

//phaethon

{
  name: "Pyrois",
  race: "others",
  rank: "~",
  specialty: "attack",
  attribute: "ether",
  attackType: "slash",
  faction: "phaethon",
  weeklyBoss: "girtablullu" ,
  material: "circuit",
  image: "Data/Image/Agent/Pyrois.webp"
},

//ESD

{
  name: "Velina Airgid",
  race: "others",
  rank: "S",
  specialty: "anomaly",
  attribute: "wind",
  attackType: "slash",
  faction: "ESD",
  weeklyBoss: "girtablullu" ,
  material: "circuit",
  image: "Data/Image/Agent/Velina.webp"
},

{
  name: "Norma Hollowell",
  race: "people",
  rank: "S",
  specialty: "stun",
  attribute: "fire",
  attackType: "strike",
  faction: "ESD",
  weeklyBoss: "girtablullu" ,
  material: "circuit",
  image: "Data/Image/Agent/Norma.webp"
},

//COD

{
  name: "Remielle Dan",
  race: "thiren",
  rank: "S",
  specialty: "anomaly",
  attribute: "lumin",
  attackType: "slash",
  faction: "COD",
  weeklyBoss: "girtablullu" ,
  material: "circuit",
  image: "Data/Image/Agent/Remielle.webp"
},

//APD

{
  name: "Sigrid de L'Azur",
  race: "thiren",
  rank: "S",
  specialty: "attack",
  attribute: "ice",
  attackType: "pierce",
  faction: "APD",
  weeklyBoss: "12" ,
  material: "12",
  image: "Data/Image/Agent/Sigrid.webp"
},

  
];