class DBHelper {
  
   explodeTimestamp(rawTimestamp){
     var emptyDateTime = { "month":"", "day":"", "year":"", "hour":"", "minute":"", "seconds":"" };
     try {
       dt = rawTimestamp.split(" ");
       date = dt[0];
       time = dt[1];
       
       explDate = date.split("/");
       explTime = time.split(":");
       
       return {
         "month":explDate[0],
         "day":explDate[1],
         "year":explDate[2],
         "hour":explTime[0],
         "minute":explTime[1],
         "seconds":explTime[2]
       }
       
     } catch(e){
       return emptyDateTime;
     }
   }
  
}