<?php
include "connection.php";
$json = [];
$ids='';
$cltfilter='';
$blefilter='';
$skipflag;

//Пункт 4 фильтер по клиентам

if(isset ($_REQUEST['cltfilter'])){
    if ($_REQUEST['cltfilter'] == ''){
        $cltfilter = "AND cd.idCltDev = 0";
    }
    else if ($_REQUEST['cltfilter'] == '0'){
        $cltfilter = '';
    } else {
        $cltfilter = $_REQUEST['cltfilter'];
        $cltfilter = "AND cd.idCltDev in ($cltfilter)";
    }
}
if(isset ($_REQUEST['blefilter'])){
    if ($_REQUEST['blefilter'] == ''){
        $blefilter = "AND be.BleEvt_BleDev = 0";
    }
    else if ($_REQUEST['blefilter'] == '0'){
        $blefilter = '';
    } else {
        $blefilter = $_REQUEST['blefilter'];
        $blefilter = "AND be.BleEvt_BleDev in ($blefilter)";
    }
}



switch($_REQUEST['action']){

    case 'clients':{
        if(isset ($_REQUEST['cltfilter'])){
            $clts = $_REQUEST['cltfilter'];
            $filter = '';
            if($clts != 0){
                $filter = "where idCltDev in $clts";
            } 
            $stmt = $mysqli->prepare("SELECT * from client_devices $filter");
            $stmt->execute();
            $result = $stmt->get_result();
            while($row = $result->fetch_assoc()){
                array_push($json,$row);
            }
        }
        break;
    }


    case 'devs':{

        //Получаем набор cltDev
        if(isset ($_REQUEST['devs'])){
          $ids = $_REQUEST['devs'];
          $stmt = $mysqli->prepare("SELECT idCltDev id, CltDev_Model model, CltDev_Brand brand, CltDev_CompanyName company, CltDev_UserName username,
           CltDev_Phone phone from client_devices as cd where cd.idCltDev in ($ids) $cltfilter");
        } else {
            //Берём первые пять за
				if(isset ($_REQUEST['date_range'])){
					$datesplit = explode('-',$_REQUEST['date_range']);
					$stmt = $mysqli->prepare(
					"SELECT idCltDev id, CltDev_Model model, CltDev_Brand brand, CltDev_CompanyName company, CltDev_UserName username, CltDev_Phone phone from client_devices as cd where cd.idCltDev in
                    (Select distinct GpsEvt_CltDev from gps_events where GpsEvt_time
                    between $datesplit[0] and  $datesplit[1]) $cltfilter
                    order by idCltDev limit 5"
				);
				} else {
					$stmt = $mysqli->prepare(
						"SELECT idCltDev id, CltDev_Model model, CltDev_Brand brand, CltDev_CompanyName company, CltDev_UserName username, CltDev_Phone phone from client_devices as cd where cd.idCltDev in
                        (Select distinct GpsEvt_CltDev from gps_events where date(from_unixtime(GpsEvt_time/1000)) = (select max(date(from_unixtime(GpsEvt_time/1000))) from gps_events))
                        $cltfilter
                        order by idCltDev limit 5");
				}
            }
        $stmt->execute();
        $result = $stmt->get_result();
        $json_part_dev = [];
        // if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_dev,$row);
            }
            // array_push($json,$json_part_dev);
        foreach($json_part_dev as $dev){
                    $json_clt = [];
                    $clt_id = $dev['id'];
                    array_push($json_clt,$dev);

                    $json_clt_info = [];
                    if(!isset ($_REQUEST['date_range'])){
                                $stmt = $mysqli->prepare(
                                    "SELECT * from ble_events as be inner join (
                                        SELECT idBleDev,BleDev_Name,BleDev_SerialNumber from ble_devices) as beD
                                        on be.BleEvt_BleDev = bed.idBleDev 
                                        where BleEvt_CltDev = $clt_id and date(from_unixtime(BleEvt_Time/1000)) = (select max(date(from_unixtime(GpsEvt_Time/1000))) from gps_events) $blefilter order by be.BleEvt_Time"
                                );
                            } else {
                                $datesplit = explode('-',$_REQUEST['date_range']);
                                $stmt = $mysqli->prepare(
                                    "SELECT * from ble_events as be inner join (
                                        SELECT idBleDev,BleDev_Name,BleDev_SerialNumber from ble_devices) as beD
                                        on be.BleEvt_BleDev = bed.idBleDev 
                                        where BleEvt_CltDev = $clt_id and BleEvt_Time between $datesplit[0] and $datesplit[1] $blefilter order by be.BleEvt_Time"
                                );
                            }
                        $stmt->execute();
                        $result = $stmt->get_result();
                        $json_clt_ble = [];
                        if($result->num_rows>0){
                            while($row = $result->fetch_assoc()){
                                array_push($json_clt_ble,$row);
                            }
                        }
                        
    
                        //Получаем набор событий GPS_EVENTS
                        if(!isset ($_REQUEST['date_range'])){
                            $stmt = $mysqli->prepare(
                                "SELECT * from gps_events as ge where ge.GpsEvt_CltDev = $clt_id and date(from_unixtime(ge.GpsEvt_Time/1000)) = (select max(date(from_unixtime(GpsEvt_Time/1000))) from gps_events)
                                order by ge.GpsEvt_Time"
                            );
                        } else {
                            $datesplit = explode('-',$_REQUEST['date_range']);
                            $stmt = $mysqli->prepare(
                                "SELECT * from gps_events as ge where ge.GpsEvt_CltDev = $clt_id and ge.GpsEvt_Time between $datesplit[0] and $datesplit[1]
                                order by ge.GpsEvt_Time"
                            );
                        }
                        $stmt->execute();
                        $result = $stmt->get_result();
                        $json_clt_gps = [];
                        if($result->num_rows>0){
                            while($row = $result->fetch_assoc()){
                                array_push($json_clt_gps,$row);
                            }
                        }
                        
                        //Получаем набор cообщений Messages

                        if(!isset ($_REQUEST['date_range'])){
                            $stmt = $mysqli->prepare(
                                "SELECT idMessage, message_Time, message_Lat, message_Long, message_Alt, message_Text,
                                case when message_Image is null then 0 else 1 end
                                message_image from messages where message_CltDev = $clt_id and date(from_unixtime(message_Time/1000)) = (select max(date(from_unixtime(GpsEvt_Time/1000))) from gps_events)
                                order by message_Time desc"
                            );
                        } else {
                            $datesplit = explode('-',$_REQUEST['date_range']);
                            $stmt = $mysqli->prepare(
                                "SELECT idMessage, message_Time, message_Lat, message_Long, message_Alt, message_Text,
                                case when message_Image is null then 0 else 1 end
                                message_image from messages where message_CltDev = $clt_id and message_Time between $datesplit[0] and $datesplit[1]
                                order by message_Time desc"
                            );
                        }
                        $stmt->execute();
                        $result = $stmt->get_result();
                        $json_clt_msgs = [];
                        if($result->num_rows>0){
                            while($row = $result->fetch_assoc()){
                                array_push($json_clt_msgs,$row);
                            }
                        }

                        array_push($json_clt_info,$json_clt_ble);
                        array_push($json_clt_info,$json_clt_gps);
                        array_push($json_clt_info,$json_clt_msgs);

                        array_push($json_clt,$json_clt_info);
                        array_push($json,$json_clt);
            }
        }
    break;

    case 'img':{
     $msgId = $_REQUEST['msgId'];
     $stmt = $mysqli->prepare("SELECT message_Image from messages where idMessage = $msgId");
     $stmt->execute();
     $result = $stmt->get_result();
     // if($result->num_rows>0){
    while($row = $result->fetch_assoc()){
          $json = $row;
    }
    break;
    }

    }




print(json_encode($json));

?>