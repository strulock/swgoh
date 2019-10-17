// ****************************************
// Webhooks Functions
// ****************************************
var RareMax = 15;
var HighMin = 10;
var DiscordWebhookCol = 5;
var WebhookTitleRow = 3;
var WebhookDepthRow = 4;
var MaxPlayers = 52;
var MaxPlatoons = 6;
var PlatoonZoneRowOffset = 18;
var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
var PhaseSheet = SpreadsheetApp.getActive().getSheetByName('Zone Assignments'); 

// Get the webhook address
function GetWebhook()
{
  var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
  var value = DiscordSheet.getRange(1, DiscordWebhookCol).getValue();
  return value;
}

// Get the role to mention
function GetRole()
{
  var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
  var value = DiscordSheet.getRange(2, DiscordWebhookCol).getValue();
  return value;
}

// Get the template for a webhooks
function GetWebhookTemplate(phase, row, defaultVal)
{
  var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
  var text = DiscordSheet.getRange(row, DiscordWebhookCol).getValue();

  if (text.length == 0)
  {
    text = defaultVal;
  }
  else
  {
    text = text.replace("{0}", phase);
  }
  
  return text;
}

// Get the title for the webhooks
function GetWebhookTitle(phase)
{
  var defaultVal = "__**Heroic Sith Triumvirate Raid: " + phase + "**__";
  return GetWebhookTemplate(phase, WebhookTitleRow, defaultVal);
}

// Get the intro for the depth webhook
function GetWebhookDepthIntro(phase, mention)
{
  var defaultVal = "Here are the assignments for __" + phase + "__. **Do not use any other teams at this time.**";
  return "\n\n" + GetWebhookTemplate(phase, WebhookDepthRow, defaultVal) + " " + mention;
}

// Get the Description for the phase
function GetWebhookDesc(phase)
{
  var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
  var text = DiscordSheet.getRange(WebhookDescRow + phase - 1, DiscordWebhookCol).getValue();

  return "\n\n" + text;
}

// Get the player Discord IDs for mentions
function GetPlayerMentions()
{
  var DiscordSheet = SpreadsheetApp.getActive().getSheetByName('Discord');
  var data = DiscordSheet.getRange(2, 1, MaxPlayers, 2).getValues();
  var result = [];
  
  for (var i = 0, iLen = data.length; i < iLen; ++i)
  {
    var name = data[i][0];
    
    // only stores unique names, we can't differentiate with duplicates
    if (name != null && name.length > 0 && result[name] == null)
    {
      // store the ID if it exists, otherwise store the player's name
      result[name] = (data[i][1] == null || data[i][1].length == 0) ? name : data[i][1];
    }
  }
  
  return result;
}

// Get a string representing the platoon assignements
function GetTeamString(team)
{
  var result = "";
  var PhaseSheet = SpreadsheetApp.getActive().getSheetByName('Zone Assignments'); 
  var MaxTeams = PhaseSheet.getRange(2, 2).getValue();
  
  // cycle through the heroes
  for (var h = 0; h < MaxTeams; ++h)
  {
    if (result.length > 0)
    {
      result += "\n";
    }
    
    // remove the gear
    var name = team[h][0];
    var endIdx = name.indexOf(" (");
    if (endIdx > 0)
    {
      name = name.substring(0, endIdx);
    }
    
    // add the assignement
    result += "**" + name + "**: " + team[h][2];
  }
 
  return result;
}


// Send a Webhook to Discord
function SendPlatoonDepthWebhook()
{
  var PhaseSheet = SpreadsheetApp.getActive().getSheetByName('Zone Assignments'); 
  var phase = PhaseSheet.getRange(2, 1).getValue();
  var MaxTeams = PhaseSheet.getRange(2, 2).getValue();
  
  // get the webhook
  var webhookURL = GetWebhook();
  if (webhookURL.length == 0)
  {
    // we need a url to proceed
    var ui = SpreadsheetApp.getUi();
    var result = ui.alert(
      'Discord Webhook not found (Discord!E1)',
      ui.ButtonSet.OK);    
    return;
  }
  

  
  // mentions only works if you get the id in Settings - Appearance - Enable Developer Mode, type: \@rolename, copy the value <@$####>
  var mentions = GetRole();
  
  var title = GetWebhookTitle(phase);
  var descriptionText = title + GetWebhookDepthIntro(phase, mentions);
  
  // get data from the platoons  
  var fields = [];
  for (var z = 0; z < 1; ++z)
  {
    var teamRow = z;
    
    if (z == 0 && z == 1)
    {
      continue;
    }
    
    for (var p = 0; p < 1; ++p)
    {
      var teamData = PhaseSheet.getRange(5, 1, MaxTeams, 3).getValues();
      var team = GetTeamString(teamData);
  
      if (team.length >0)
      { 
        var phaseDescription = "__" + phase + "__ Guild Member - Team";
        fields[fields.length] = 
          {
            "name": phaseDescription,
            "value": team,
            "inline": true,
          };
      }
    }  
  }
  
  var jsonString = 
  {
    "content": descriptionText,
    "embeds": [
    {
      "fields": fields
    }]
  }

  var options = 
  {
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(jsonString),
    muteHttpExceptions: false
  };

  // exectute the command
  try
  {
    UrlFetchApp.fetch(webhookURL, options);
  }
  catch (e)
  {
    // log the error
    Logger.log(e);
    
    // error sending to Discord
    var ui = SpreadsheetApp.getUi();
    var result = ui.alert(
      'Error sending webhook to Discord. Make sure Teams are populated and can be filled by the guild.',
      ui.ButtonSet.OK);    
  }
}


// Send the message to Discord
function PostMessage(webhookURL, message)
{
  var jsonString = 
  {
    "content": message.trim(),
  }

  var options = 
  {
    'method' : 'post',
    'contentType': 'application/json',
    // Convert the JavaScript object to a JSON string.
    'payload' : JSON.stringify(jsonString),
    muteHttpExceptions: false
  };

  // exectute the command
  try
  {
    UrlFetchApp.fetch(webhookURL, options);
  }
  catch (e)
  {
    // this can be used to debug issues with sending the webhooks.
    // disable "muteHttpExceptions" above to allow the exception to trigger.
    
    // log the error
    Logger.log(e);

    // split the message, so we can see what it choked on
    var parts = message.split(",");
    
    // error sending to Discord
    var ui = SpreadsheetApp.getUi();
    var result = ui.alert(
      'Error sending webhook to Discord. Make sure Platoons are populated and can be filled by the guild.',
      ui.ButtonSet.OK);    
  }
}

