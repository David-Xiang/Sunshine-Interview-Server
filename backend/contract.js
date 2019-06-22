contract SunshineInterview{
  function onCreate(arg){
    Global.videoHash = {};
      Global.verifyedCount = {};
      Global.owner = requester;
    Global.verifier = [];
    Global.verifier.push(requester);
}
export function getPubKey(arg){
    return requester;
}
export function addVerifier(arg){
    if (Global.owner != requester)
      return "permission denied";
      Global.verifier.push(arg);
}
export function log(arg){
    return arg;
}

//{"action":"recordHash","arg":"{\"videoID\":\"videoIDSample1\",\"index\":\"1\",\"hash\":\"hh2\"}"}
export function recordHash(arg){
  if (Global.verifier.indexOf(requester)==-1)
    return "permission denied";
  print("[recordHash] arg");
  print(arg);
  arg = JSON.parse(arg);
  if (arg.hash == undefined)
    return "failed due to invalid hash";
  if (arg.videoID == undefined){
    print("[recordHash] failed, no such videoID: ");
    print(arg.videoID);
    return "failed due to invalid videoID";
  }
  if (arg.index == undefined){
    print("[recordHash] failed, no arg.index: ");
    return "failed due to invalid index";
  }
  
  if (Global.videoHash[arg.videoID] == undefined)
    Global.videoHash[arg.videoID] = [];
  var arr = Global.videoHash[arg.videoID];
  if (arr === undefined)
    arr = new Array();
  print("[recordHash] arr[" + arg.index + "] = " + arg.hash);
  arr[arg.index] = arg.hash;
  print(arr);
  return "success";
}

//{"action":"getHashs","arg":"{\"videoID\":\"videoIDSample1\"}
export function getHashs(arg){
  print("[getHashs]");
  if (Global.verifier.indexOf(requester)==-1)
    return "permission denied";
  arg = JSON.parse(arg);
  var vID = arg.videoID;
  if (vID == undefined)
    return "failed due to invalid videoID";
  if (Global.videoHash[vID]==undefined){
    print("[getHashs] failed, no such videoID: ");
    print(vID);
    return "failed, no such videoID";
  }
    
  var arr = Global.videoHash[vID];
  print("arr");
  print(arr);
  return JSON.stringify(arr);
}

// {"action":"verifyHashs","arg":"{\"videoID\":\"videoIDSample1\", \"hashs\":[\"hh1\",\"hh2\"]}"}
export function verifyHashs(arg){
  if (Global.verifier.indexOf(requester)==-1)
    return "permission denied";
  arg = JSON.parse(arg);
  var vID = arg.videoID;
  if (vID == undefined)
    return "failed due to invalid videoID";
  if (Global.videoHash[vID]==undefined){
    print("[verifyHashs] failed, no such videoID: ");
    print(vID);
    return "failed, no such videoID";
  }
  if (Global.verifyedCount[vID]==undefined){
      Global.verifyedCount[vID] = 1;
  }else {
      var count = Global.verifyedCount[vID];
        count++;
      Global.verifyedCount[vID]=count;
  }
  var arr = Global.videoHash[vID];
  var result = [];
  for (var i=0;i<arr.length;i++){
    if (arr[i] != arg.hashs[i]){
      result.push("failure");
    } else {
      result.push("success");
    }
  }
    return JSON.stringify(result);
}
// {"action":"verifyOneHash","arg":"{\"videoID\":\"videoIDSample1\",index:1, \"hash\":\"hh1\"}"}
export function verifyOneHash(arg){
    if (Global.verifier.indexOf(requester)==-1)
      return "permission denied";
    arg = JSON.parse(arg);
    var vID = arg.videoID;
    if (vID == undefined)
      return "failed due to invalid videoID";
    if (Global.videoHash[vID]==undefined){
      return "failed, no such videoID";
    }
      
    var arr = Global.videoHash[vID];
    var index = arg.index;
    if (arr[index] != arg.hash)
      return "failed";
    return "success";
}
// {"action":"getVerifyCount","arg":"videoIDSample1"}
export function getVerifyCount(arg){
    if (Global.verifier.indexOf(requester)==-1)
      return "permission denied";
    if (!Global.verifyedCount[arg]==undefined){
        return -1;
    }
      return Global.verifyedCount[arg];
}
// {"action":"GC","arg":"."}
export function GC(arg){
    if (Global.verifier.indexOf(requester)==-1)
      return "permission denied";
    var removeList = [];
   
      for (var key in Global.verifyedCount) {
        var count  =  Global.verifyedCount[key];
        if (count>=3){
          Global.videoHash[key] = undefined;
          removeList.push(key);
    }
    for (var i=0;i<removeList.length;i++){
        Global.verifyedCount[removeList[i]] = undefined;
    }
      return "success";
}