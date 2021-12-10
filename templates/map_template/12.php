<?php
include "connection.php";
$json = [];
$ids='';
$skipflag;
switch($_REQUEST['action']){
    case 'devs':{

        //Получаем набор cltDev
        if(isset ($_REQUEST['devs'])){
          $ids = $_REQUEST['devs'];
        } else {
            //Берём первые пять за
				if(isset ($_REQUEST['date_range'])){
					$datesplit = explode('-',$_REQUEST['date_range']);
					$stmt = $mysqli->prepare(
					"SELECT idCltDev, CltDev_Model from client_devices as cd where cd.idCltDev in
                    (Select distinct BleEvt_CltDev from ble_events where BleEvt_Time between $datesplit[0] and  $datesplit[1])
                    order by idCltDev limit 5"
				);
				} else {
					$stmt = $mysqli->prepare(
						"SELECT idCltDev, CltDev_Model from client_devices as cd where cd.idCltDev in
                        (Select distinct BleEvt_CltDev from ble_events where date(from_unixtime(BleEvt_Time/1000 )) = Curdate())
                        order by idCltDev limit 5"
					);
				}
        $stmt->execute();
        $result = $stmt->get_result();
        $json_part_dev = [];
        // if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_dev,$row);
            }
             array_push($json,$json_part_dev);

            if($ids==''){
                foreach($json_part_dev as $dev){
                    $ids.=$dev['idCltDev'].',';
                }
                $ids = rtrim($ids,',');
            }
        }
            if($ids!=''){
                //Получаем набор СОБЫТИЙ BLE_EVT
                if(!isset ($_REQUEST['date_range'])){
                    $stmt = $mysqli->prepare(
                        "SELECT * from ble_events as be inner join (
                            SELECT idBleDev,BleDev_Name from ble_devices) as beD
                            on be.BleEvt_BleDev = bed.idBleDev 
                            where BleEvt_CltDev in ($ids) and date(from_unixtime(BleEvt_Time/1000)) = Curdate() order by be.BleEvt_Time"
                    );
                } else {
                    $datesplit = explode('-',$_REQUEST['date_range']);
                    $stmt = $mysqli->prepare(
                        "SELECT * from ble_events as be inner join (
                            SELECT idBleDev,BleDev_Name from ble_devices) as beD
                            on be.BleEvt_BleDev = bed.idBleDev 
                            where BleEvt_CltDev in ($ids) and BleEvt_Time between $datesplit[0] and $datesplit[1] order by be.BleEvt_Time"
                    );
                }
            $stmt->execute();
            $result = $stmt->get_result();
            $json_part_evt = [];
            if($result->num_rows>0){
                while($row = $result->fetch_assoc()){
                    array_push($json_part_evt,$row);
                }
            }


            //Получаем набор событий GPS_EVENTS
            if(!isset ($_REQUEST['date_range'])){
                $stmt = $mysqli->prepare(
                    "SELECT * from gps_events as ge where ge.GpsEvt_CltDev in ($ids) and date(from_unixtime(ge.GpsEvt_Time/1000)) = Curdate()
                    order by ge.GpsEvt_Time"
                );
            } else {
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare(
                    "SELECT * from gps_events as ge where ge.GpsEvt_CltDev in ($ids) and ge.GpsEvt_Time between $datesplit[0] and $datesplit[1]
                    order by ge.GpsEvt_Time"
                );
            }
            $stmt->execute();
            $result = $stmt->get_result();
            if($result->num_rows>0){
                while($row = $result->fetch_assoc()){
                    array_push($json_part_evt,$row);
                }
            }

            array_push($json,$json_part_evt);
            // } else {
            // }
            break;

        }
    }
}

print(json_encode($json));

?>