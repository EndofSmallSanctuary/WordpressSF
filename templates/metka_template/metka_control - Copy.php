<?php
include "connection.php";
$json = [];
$ids='';
switch($_REQUEST['action']){
    case 'devs':{

        //Получаем набор девайсов
        if(isset ($_REQUEST['devs'])){
          $ids = $_REQUEST['devs'];
          $stmt = $mysqli->prepare(
          "SELECT bd.idBleDev,bd.BleDev_Name
           FROM ble_devices bd where idBleDev in ($ids)"
           );
        } else {
            $stmt = $mysqli->prepare(
                "SELECT bd.idBleDev,bd.BleDev_Name
                 FROM ble_devices bd ORDER BY bd.idBleDev LIMIT 5"
            );
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $json_part_dev = [];
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_dev,$row);
            }
            array_push($json,$json_part_dev);

            if($ids==''){
                foreach($json_part_dev as $dev){
                    $ids.=$dev['idBleDev'].',';
                }
                $ids = rtrim($ids,',');
            }
           
            //Получаем набор эвентов для этих девайсов
            if(!isset ($_REQUEST['date_range'])){
                $stmt = $mysqli->prepare(
                    "SELECT  be.BleEvt_BleDev, be.idBleEvt id,
                    be.BleEvt_Time time, be.BleEvt_NumMsg num,
                    be.BleEvt_RSSI rssi, be.BleEvt_Lat lat, be.BleEvt_Long 'long', BleEvt_Alt alt 
                    FROM ble_events be INNER JOIN(
                    SELECT idBleDev devid FROM ble_devices bd WHERE bd.idBleDev IN ($ids) ORDER by bd.idBleDev
                    ) t on be.BleEvt_BleDev = devid
                    WHERE DATE(FROM_UNIXTIME(be.BleEvt_Time/1000)) = CURDATE()
                    ORDER BY time"
                );
            } else {
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare(
                    "SELECT  be.BleEvt_BleDev, be.idBleEvt id,
                    be.BleEvt_Time time, be.BleEvt_NumMsg num,
                    be.BleEvt_RSSI rssi, be.BleEvt_Lat lat, be.BleEvt_Long 'long', BleEvt_Alt alt 
                    FROM ble_events be INNER JOIN(
                    SELECT idBleDev devid FROM ble_devices bd WHERE bd.idBleDev IN ($ids) ORDER by bd.idBleDev
                    ) t on be.BleEvt_BleDev = devid
                    WHERE be.BleEvt_Time BETWEEN $datesplit[0] AND $datesplit[1]
                    ORDER BY time"
                );
            }
        $stmt->execute();
        $result = $stmt->get_result();
        $json_part_dev = [];
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_dev,$row);
            }
            array_push($json,$json_part_dev);
        }

        } else {
        }
        break;

    }
}

print(json_encode($json));

?>