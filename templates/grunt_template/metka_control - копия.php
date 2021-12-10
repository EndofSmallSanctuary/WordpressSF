<?php
include "connection.php";
$json = [];
switch($_REQUEST['action']){
    case 'devs':{
        if(isset ($_REQUEST['devs'])){
          $IDS = $_REQUEST['devs'];
          $stmt = $mysqli->prepare("SELECT * FROM ble_devices where idBleDev in ($IDS)");
        } else {
            $stmt = $mysqli->prepare("SELECT * FROM ble_devices order by idBleDev limit 5");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json,$row);
            }
        } else {
        }
        break;
    }
    case 'events':{
        $IDS;
        if(isset ($_REQUEST['devs'])){
            $IDS = $_REQUEST['devs'];
        } else {
            if(isset($_REQUEST['date_from'])){
            } else {
                $stmt = $mysqli->prepare(
                "SELECT  t.BleDev_Name devname, 
                be.BleEvt_BleDev, be.idBleEvt id, DATE(FROM_UNIXTIME(be.BleEvt_Time/1000)), 
                be.BleEvt_Time time, be.BleEvt_NumMsg num, be.BleEvt_RSSI rssi, 
                be.BleEvt_Lat lat, be.BleEvt_Long 'long', BleEvt_Alt alt 
                FROM ble_events be INNER JOIN(
                SELECT bd.BleDev_Name, idBleDev devid FROM ble_devices bd ORDER BY bd.idBleDev LIMIT 5
                ) t on be.BleEvt_BleDev = devid
                WHERE DATE(FROM_UNIXTIME(be.BleEvt_Time/1000)) = CURDATE()
                ORDER BY time
              ");
            }
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json,$row);
            }
        } else {
            
        }
        break;
    }
}

print(json_encode($json));

?>