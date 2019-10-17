function UpdateRoster() {
  
  var guildData = JSON.parse( UrlFetchApp.fetch("https://swgoh.gg/api/guild/" + getGuildID() ).getContentText() );
  var charData = [],
      shipData = [],
      memInfo =[],
      player,
      unit;
  
  for (var i in guildData.players) {
    player = guildData.players[i];
    for (var j in player.units) {
      unit = player.units[j].data;
      
      
      if (unit.gear.length == 0) {
        shipData.push( [ player.data.name, unit.base_id , unit.level, unit.rarity, unit.power] );
      } else {
        charData.push( [ player.data.name,"",  unit.level, unit.gear_level, unit.rarity, unit.power,"","","","", unit.base_id,(unit.zeta_abilities[0] || ""), 
                        (unit.zeta_abilities[1] || ""), (unit.zeta_abilities[2] || "")] );
        
      }
    }
    player = player.data;
    memInfo.push( [ player.name, "http://swgoh.gg/p/" + player.ally_code, player.galactic_power, player.character_galactic_power, player.ship_galactic_power, player.arena_rank ] );
  }
  
  UpdateUnits();
  UpdateShips();
  UpdateAbilities();
 
  
  saveData2Sheet(charData, ss.getSheetByName("GuildCharData"), 3, 1);
  if (shipData.length > 0) saveData2Sheet(shipData, ss.getSheetByName("GuildShipData"), 3, 1);
  while (memInfo.length < 50) { memInfo.push([ "", "", "", "", "", "" ]); }
  saveData2Sheet(memInfo, ss.getSheetByName("MemberInfo"), 5, 1, {column: 3, ascending: false});
}

function getGuildID() {
  var value = ss.getRange("MemberInfo!D1").getValue(),
      idMatch = /swgoh.gg\/g\/(\d+)/,
      id;
  if ( idMatch.test(value) ) id = idMatch.exec(value)[1];
  else id = value;
  return id;
}

function UpdateUnits() {
  
  var toonData = JSON.parse( UrlFetchApp.fetch("https://swgoh.gg/api/characters/").getContentText() );
   var characterData = [],
       toon;
  
  for (var i in toonData) {
    toon = toonData[i];
  
     {
        characterData.push( [ toon.base_id ,toon.name,  toon.power, toon.alignment, toon.role, toon.ship] );
      } 
  }
  
 
  saveData2Sheet(characterData, ss.getSheetByName("UnitData"), 2, 1);
}



function UpdateShips() {
  
  var craftData = JSON.parse( UrlFetchApp.fetch("https://swgoh.gg/api/ships/").getContentText() );
   var vesselData = [],
       craft;
  
  for (var i in craftData) {
    craft = craftData[i];
  
     {
        vesselData.push( [ craft.base_id, craft.name,  craft.power, craft.alignment, craft.role, craft.capital_ship] );
      } 
  }
  
 
  saveData2Sheet(vesselData, ss.getSheetByName("ShipData"), 2, 1);
}


function UpdateAbilities() {
  
  var abilityData = JSON.parse( UrlFetchApp.fetch("https://swgoh.gg/api/abilities/").getContentText() );
   var zetaomegaData = [],
       ability;
  
  for (var i in abilityData) {
    ability = abilityData[i];
  
     {
        zetaomegaData.push( [ ability.base_id, ability.name, ability.character_base_id, ability.is_zeta ] );
      } 
  }
  
 
  saveData2Sheet(zetaomegaData, ss.getSheetByName("AbilityData"), 2, 1);
}


function saveData2Sheet(data, sheet, row, col, sortSpec) { 
  
  // deletes rows in the sheet below the last cell used by 'data'
  var colName = columnName(col),
      cells;
  cells = sheet.getRange(row,col,data.length,data[0].length);
  cells.setValues(data);
  if (sortSpec) cells.sort(sortSpec);
  cells = sheet.getRange(colName + (data.length + row) + ":" + colName);
  if (cells.getValue() != "") {sheet.deleteRows(data.length + row, cells.getNumRows());}
}

function columnName(col) {
  var temp, letter = '';
  while (col > 0)
  {
    temp = (col) % 26 || 26;
    letter = String.fromCharCode(temp + 64) + letter;
    col = (col - temp) / 26;
  }
  return letter;
}


  
