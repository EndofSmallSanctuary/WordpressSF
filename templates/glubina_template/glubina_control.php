<?php
include "connection.php";
$json = [];
$mod_ids='';
switch($_REQUEST['action']){
    case 'devs':{

        if(isset ($_REQUEST['devs'])){
            $mod_ids = $_REQUEST['devs'];
            //$mod_ids = implode("','",explode(',',strval($_REQUEST['devs'])));
            

            if(isset($_REQUEST['date_range'])){
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare("SELECT * FROM glubina_events ge 
                 WHERE ge.mod_time*1000
                 BETWEEN  $datesplit[0] and $datesplit[1] and ge.mod_id in ($mod_ids) ORDER BY ge.mod_time");
            }

            else {
                $stmt = $mysqli->prepare("SELECT * FROM glubina_events ge WHERE date(from_unixtime(mod_time)) = CURDATE() and ge.mod_id in ($mod_ids) ORDER BY ge.mod_time");
                 }

        } else {
            if(isset($_REQUEST['date_range'])){
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare("SELECT * from glubina_events ge inner join
                (select mod_id from glubina_events where mod_time*1000 between $datesplit[0]  and $datesplit[1]   group by mod_id order by mod_id limit 5) gejoin
                on ge.mod_id = gejoin.mod_id where mod_time*1000 between $datesplit[0]  and $datesplit[1]
                order by ge.mod_time");
            }
            else {
                $stmt = $mysqli->prepare("SELECT * from glubina_events ge inner join
                (select mod_id from glubina_events where date(from_unixtime(mod_time)) = curdate()   group by mod_id order by mod_id limit 5) gejoin
                on ge.mod_id = gejoin.mod_id where date(from_unixtime(mod_time)) = curdate()
                order by ge.mod_time");
            }
        }
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json,utf8ize($row));
            }
        } else {
        }
        break;

    }
}
    
    function utf8ize($d) {
    if (is_array($d)) {
       foreach ($d as $k => $v) {
         $d[$k] = utf8ize($v);
       }
    } else if (is_string ($d)) {
       return utf8_encode($d);
    }
     return $d;
  }
print(json_encode($json));
?>	
