//MOSFET Additions
function onEdit(e) {
  var cell=e.range.getA1Notation();
  Logger.log(cell);
  var sheet=e.range.getSheet().getName();
  Logger.log(sheet);
  if (cell === 'A1' & sheet == 'Individual Team Advisor' ){
      ss.getRange("B1").setValue('UPDATING');
      ss.getSheetByName('Individual Team Advisor').getRangeList(['A5','F5','K5','P5','U5','Z5','AE5','AJ5']).clear({contentsOnly: true});
      copyGuildSavedData();
      ss.getRange("B1").setValue('Done');
    }
  }


function colSavedGuildMember() {
  var SelectorSheet = ss.getSheetByName('Individual Team Advisor');
  var SaveSheet = ss.getSheetByName('Saved Team Selections');
  var data = SaveSheet.getDataRange().getValues();
  var GuildMember = SelectorSheet.getRange("A1").getValue();
  for (var i = 0; i<data.length;i++){
    if(data[1][i] == GuildMember){
      Logger.log((i+1))
      return i+1;
    }
  }
}

function copyGuildSavedData() {
  var SaveSheet = ss.getSheetByName('Saved Team Selections');
  var SelectorSheet = ss.getSheetByName('Individual Team Advisor');
  var GuildMember = SelectorSheet.getRange("A1").getValue();
  var GuildMemberCol = colSavedGuildMember();
  GuildMemberCol = +GuildMemberCol;
  SaveSheet.getRange(16,GuildMemberCol).copyValuesToRange(SelectorSheet,1,1,5,5);
  SaveSheet.getRange(17,GuildMemberCol).copyValuesToRange(SelectorSheet,6,6,5,5);
  SaveSheet.getRange(18,GuildMemberCol).copyValuesToRange(SelectorSheet,11,11,5,5);
  SaveSheet.getRange(19,GuildMemberCol).copyValuesToRange(SelectorSheet,16,16,5,5);
  SaveSheet.getRange(20,GuildMemberCol).copyValuesToRange(SelectorSheet,21,21,5,5);
  SaveSheet.getRange(21,GuildMemberCol).copyValuesToRange(SelectorSheet,26,26,5,5);
  SaveSheet.getRange(22,GuildMemberCol).copyValuesToRange(SelectorSheet,31,31,5,5);
  SaveSheet.getRange(23,GuildMemberCol).copyValuesToRange(SelectorSheet,36,36,5,5);
}

function copySavedtoPlan() {
  var TeamSheet = ss.getSheetByName('Team Selector - BattlePlan');
  TeamSheet.getRange(7,4,50).copyValuesToRange(TeamSheet,3,3,7,56);
  TeamSheet.getRange(7,7,50).copyValuesToRange(TeamSheet,6,6,7,56);
  TeamSheet.getRange(7,10,50).copyValuesToRange(TeamSheet,9,9,7,56);
  TeamSheet.getRange(7,13,50).copyValuesToRange(TeamSheet,12,12,7,56);
  TeamSheet.getRange(7,16,50).copyValuesToRange(TeamSheet,15,15,7,56);
  TeamSheet.getRange(7,19,50).copyValuesToRange(TeamSheet,18,18,7,56);
  TeamSheet.getRange(7,22,50).copyValuesToRange(TeamSheet,21,21,7,56);
  TeamSheet.getRange(7,25,50).copyValuesToRange(TeamSheet,24,24,7,56);
}

function SaveTeamstoBattlePlan() {
  var SaveSheet = ss.getSheetByName('Saved Team Selections');
  var SelectorSheet = ss.getSheetByName('Individual Team Advisor');
  var GuildMember = SelectorSheet.getRange("A1").getValue();
  var GuildMemberCol = colSavedGuildMember();
  GuildMemberCol = +GuildMemberCol;
  SaveSheet.getRange(3,GuildMemberCol,8).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,16,23);
  SelectorSheet.getRange(5,2).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,27,27);
  SelectorSheet.getRange(5,7).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,28,28);
  SelectorSheet.getRange(5,12).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,29,29);
  SelectorSheet.getRange(5,17).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,30,30);
  SelectorSheet.getRange(5,22).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,31,31);
  SelectorSheet.getRange(5,27).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,32,32);
  SelectorSheet.getRange(5,32).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,33,33);
  SelectorSheet.getRange(5,37).copyValuesToRange(SaveSheet,GuildMemberCol,GuildMemberCol,34,34); 
}

function IterateThroughGuild() {
  var SelectorSheet = ss.getSheetByName('Test');
  var RosterSheet = ss.getSheetByName('Members');
  var data = RosterSheet.getRange(6,2,50).getValues();
  var GuildMember = SelectorSheet.getRange("A1").getValue();
  for (var i = 0; i<data.length;i++){
    SelectorSheet.getRange("A1").setValue(i) 
    SaveTeamstoBattlePlan()
    testWait()
    {
      Logger.log((i+1))
      return i+1;
    }
  }
}

//holds processing of next script till last one has completed
function testWait(){
  var lock = LockService.getScriptLock(); lock.waitLock(300000); 
  SpreadsheetApp.flush(); lock.releaseLock();
}
