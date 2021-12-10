<?php
include "connection.php";
$json = [];
$ids='';
$filt='';

if(isset($_REQUEST['blefilter'])){
    $filt = $_REQUEST['blefilter'];
    if($filt == ''){
        $filt = "WHERE bd.idBleDev = 0";
    }
    else if($filt==0){
        $filt = "";
    } else {
        $filt = "WHERE bd.idBleDev in ($filt)";
    }
}

switch($_REQUEST['action']){

    case 'clients':{
        if(isset ($_REQUEST['blefilter'])){
            $bles = $_REQUEST['blefilter'];
            $filter = '';
            if($bles != 0){
                $filter = "and idBleDev in $bles";
            } 
            $stmt = $mysqli->prepare("SELECT * from ble_devices where (BleDev_Name like '%Metka%' or BleDev_Name like '%Smart_Tag%') $filter");
            $stmt->execute();
            $result = $stmt->get_result();
            while($row = $result->fetch_assoc()){
                array_push($json,$row);
            }
        }
        break;
    }


    case 'devs':{

        //Получаем набор девайсов
        if(isset ($_REQUEST['devs'])){
          $ids = $_REQUEST['devs'];
          $stmt = $mysqli->prepare(
          "SELECT bd.idBleDev,bd.BleDev_Name
           FROM ble_devices bd where idBleDev in ($ids)"
           );
        } else {
				if(isset ($_REQUEST['date_range'])){
					$datesplit = explode('-',$_REQUEST['date_range']);
					$stmt = $mysqli->prepare(
					"Select bd.idBleDev,bd.BleDev_Name FROM ble_devices bd 
					 INNER JOIN ( select distinct BleEvt_BleDev ev_dev_id, BleEvt_Time ev_time from ble_events where BleEvt_Time between $datesplit[0] and $datesplit[1] group by ev_dev_id order by ev_time limit 5 ) be 
					 on bd.idBLeDev = ev_dev_id $filt  ORDER BY bd.idBleDev"
				);
				} else {
					$stmt = $mysqli->prepare(
						"Select bd.idBleDev,bd.BleDev_Name FROM ble_devices bd 
						 INNER JOIN ( select distinct BleEvt_BleDev ev_dev_id, BleEvt_Time ev_time from ble_events where DATE(FROM_UNIXTIME(BleEvt_Time/1000)) = (select max(DATE(FROM_UNIXTIME(BleEvt_Time/1000))) from ble_events) group by ev_dev_id order by ev_time limit 5 ) be 
						 on bd.idBLeDev = ev_dev_id $filt  ORDER BY bd.idBleDev"
					);
				}
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
                    WHERE DATE(FROM_UNIXTIME(be.BleEvt_Time/1000)) = (select max(DATE(FROM_UNIXTIME(BleEvt_Time/1000))) from ble_events)
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