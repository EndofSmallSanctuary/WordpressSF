<?php
include "connection.php";
$json = [];
$devuis='';
switch($_REQUEST['action']){
    case 'devs':{

        if(isset ($_REQUEST['devs'])){
            $devuis = implode("','",explode(',',strval($_REQUEST['devs'])));


            if(isset($_REQUEST['date_range'])){
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare("SELECT id,deveui,device_type,time1,core_voltage,freq,lsnr,rssi,hex(data) data FROM sensors_data sd 
                 WHERE UNIX_TIMESTAMP(sd.time1)*1000
                 BETWEEN  $datesplit[0] and $datesplit[1] and sd.deveui in ('$devuis') ORDER BY sd.deveui");
            }

            else {
                $stmt = $mysqli->prepare("SELECT id,deveui,device_type,time1,core_voltage,freq,lsnr,rssi,hex(data) data FROM sensors_data sd WHERE date(sd.time1) = date(CURDATE()) and deveui in ('$devuis') ORDER BY sd.deveui");
                 }

        } else {
            if(isset($_REQUEST['date_range'])){
                $datesplit = explode('-',$_REQUEST['date_range']);
                $stmt = $mysqli->prepare("SELECT id,deveui,device_type,time1,core_voltage,freq,lsnr,rssi,hex(data) data,sync FROM sensors_data sd
				inner join (select distinct deveui d from sensors_data WHERE UNIX_TIMESTAMP(time1)*1000
                BETWEEN  $datesplit[0] and $datesplit[1] order by deveui limit 5) sd2 on sd.deveui = sd2.d 
				WHERE UNIX_TIMESTAMP(sd.time1)*1000
                BETWEEN  $datesplit[0] and $datesplit[1]  ORDER BY sd.deveui");
            }
            else {
                $stmt = $mysqli->prepare("SELECT id,deveui,device_type,time1,core_voltage,freq,lsnr,rssi,hex(data) data FROM sensors_data sd 
				inner join (select distinct deveui d from sensors_data WHERE date(time1) = date(CURDATE()) order by deveui limit 5) sd2 on sd.deveui = sd2.d 
                WHERE date(sd.time1) = date(CURDATE()) ORDER BY sd.deveui");
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