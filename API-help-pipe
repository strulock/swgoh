var unitsUrl = "https://api.swgoh.help/swgoh/units";
var guildUrl = "https://api.swgoh.help/swgoh/guild";
var playerUrl = "https://api.swgoh.help/swgoh/player";  

var token = null;


/** doGet - MAIN **/
function doGet(e) {
  //Check params
  if( !e || !e.parameter || !e.parameter.allycode ) { throw new Error('Please provide an allycode in url args'); } 

  var JSON_REPLY = null;
  var report = e.parameter.report || '';
  
  switch( report ) {
      
    case "guild":
      //Request guild from params
      JSON_REPLY = fetchGuild({
        allycodes:[ e.parameter.allycode || null ],
        language:e.parameter.language || null,
        enums:e.parameter.enums || null   
      });
      break;
    
    case "guildUnits":
      //Request guild from params
      JSON_REPLY = fetchGuildRoster({
        allycodes:[ e.parameter.allycode || null ],
        language:e.parameter.language || null,
        enums:e.parameter.enums || null,
        units:true
      });
      break;
    
    case "guildRoster":
      //Request guild from params
      JSON_REPLY = fetchGuildRoster({
        allycodes:[ e.parameter.allycode || null ],
        language:e.parameter.language || null,
        enums:e.parameter.enums || null,
        roster:true
      });
      break;
    
    case "units":
      //Request guild from params
      JSON_REPLY = fetchUnits({
        allycodes:[ e.parameter.allycode || null ],
        language:e.parameter.language || null,
        enums:e.parameter.enums || null   
      });
      break;
    
    default:
      //Request player from params
      JSON_REPLY = fetchPlayer({
        allycodes:[ e.parameter.allycode || null ],
        language:e.parameter.language || null,
        enums:e.parameter.enums || null   
      });
      
  }
  
  //Return result with JSON WEB SERVICES
  return ContentService.createTextOutput(JSON_REPLY).setMimeType(ContentService.MimeType.JSON);  
}


function convertUnits( units ) {
  units = JSON.parse(units);

  for( var k in units ) {
    var converted = [];
    for( var u = 0; u < units[k].length; ++u ) {
      converted.push({
        id:units[k][u].allyCode,
        gear_level:units[k][u].gearLevel,
        power:units[k][u].gp,
        level:units[k][u].level,
        combat_type:units[k][u].type === 'SHIP' ? 2 : units[k][u].type === 'CHARACTER' ? 1 : units[k][u].type,
        rarity:units[k][u].starLevel,
        player:units[k][u].player,
        mods:units[k][u].mods,
        zetas:units[k][u].zetas
      });
    }
    units[k] = converted;    
  }
  
  return JSON.stringify(units);
}


/** Fetch guild from API **/
function fetchUnits(payload) {
  //Check for token and login if not found
  if( !token ) { token = login(); }
  
  //Request player data from API
  var units = UrlFetchApp.fetch(unitsUrl, {
    'method':'POST',
    'contentType':'application/json',
    'headers':{
      'Authorization':'Bearer '+token
    },
    'payload':JSON.stringify(payload)
  });
  
  return convertUnits( units );
}


/** Fetch guild from API **/
function fetchGuildRoster(payload) {
  var guild = JSON.parse(fetchGuild(payload));
  return !guild || !guild.roster ? null : Array.isArray(guild.roster) ? JSON.stringify(guild.roster) : convertUnits( JSON.stringify(guild.roster) );
}


/** Fetch guild from API **/
function fetchGuild(payload) {
  //Check for token and login if not found
  if( !token ) { token = login(); }
  
  //Request player data from API
  return UrlFetchApp.fetch(guildUrl, {
    'method':'POST',
    'contentType':'application/json',
    'headers':{
      'Authorization':'Bearer '+token
    },
    'payload':JSON.stringify(payload)
  });
}


/** Fetch player from API **/
function fetchPlayer(payload) {
  //Check for token and login if not found
  if( !token ) { token = login(); }
  
  //Request player data from API
  return UrlFetchApp.fetch(playerUrl, {
    'method':'POST',
    'contentType':'application/json',
    'headers':{
      'Authorization':'Bearer '+token
    },
    'payload':JSON.stringify(payload)
  });
}


/** Login to API and acquire token **/
function login() {
  //Check sheet for current credentials
  var userData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("pipe").getDataRange().getValues();
  
  //Set token if existing and return
  token = userData[2][1] || null;
  if( token && token.length > 0 ) { return token; }
  
  //Otherwise, set user and pass
  var user = userData[0][1] || null;
  var pass = userData[1][1] || null;
  if( !user && !pass ) { throw new Error('API user and password required'); }
  
  //Request access token from API
  var signinUrl = "https://api.swgoh.help/auth/signin";
  var response = UrlFetchApp.fetch(signinUrl, {
    'method':'POST',
    'contentType':'application/x-www-form-urlencoded',
    'payload':"username="+user+"&password="+pass+"&grant_type=password&client_id=abc&client_secret=123"
  });
  
  //Set token in mem
  token = JSON.parse(response.getContentText()).access_token || null;  
  //Set token in sheet
  SpreadsheetApp.getActiveSheet().getRange('B3').setValue(token);
  
  //Set trigger to expire token in an hour
  ScriptApp.newTrigger('timeoutToken')
    .timeBased()
    .everyHours(1)
    .create();
  
  //Return the token
  return token;
}


/** Expire the token - Delete it **/
function timeoutToken() {
  //Remove from mem
  token = null;
  //Remove from sheet
  SpreadsheetApp.getActiveSheet().getRange('B3').setValue('');
}
