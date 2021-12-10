<?php
include "connection.php";
$json = [];
$ids='';
$msgOnPageLimit = 10;
$filt='';

if(isset($_REQUEST['cltfilter'])){
    $filt = $_REQUEST['cltfilter'];
    if($filt == ''){
        $filt = 'WHERE idCltDev = 0';
    }
    else if ($filt == 0){
        $filt = '';
    }
    else{
        $filt = "WHERE idCltDev in ($filt)";
    }
}

switch($_REQUEST['action']){

    case 'reply':
        $msg = $_REQUEST['message'];
        if(!$msg['image']==''){
            $stmt = $mysqli->prepare("INSERT into messages (message_CltDev,message_Time,
            message_Lat, message_Long, message_Alt, message_Type, message_Text,message_Image,message_ReplyTo)
            values (0,'$msg[time]',0,0,0,0,'$msg[text]','$msg[image]','$msg[replyTo]')");
        } else {
            $stmt = $mysqli->prepare("INSERT into messages (message_CltDev,message_Time,
            message_Lat, message_Long, message_Alt, message_Type, message_Text,message_Image,message_ReplyTo)
            values (0,'$msg[time]',0,0,0,0,'$msg[text]',null,'$msg[replyTo]')");
        }
        
        $stmt->execute();
    break;
    

    case 'image':
        $msgId = $_REQUEST['msgId'];
        $stmt = $mysqli->prepare("Select message_image from messages where idMessage = $msgId");
        $stmt->execute();

        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
               $json = $row;
            }
        }
    break;


    case 'messageList':
        $defaultStatement = "SELECT idMEssage, CltDev_Brand, CltDev_Model, CltDev_CompanyName, CltDev_Phone, CltDev_Username, message_CltDev, message_Time, message_Text,
        case when message_image is not null then 1 else 0 end
        'image' FROM krotdb.messages m
        inner join (Select idCltDev,CltDev_Brand, CltDev_Model,CltDev_CompanyName,CltDev_Phone,CltDev_UserName from client_devices $filt) t
        on m.message_CltDev = t.idCltDev  where message_Text not like ('%Благодарим за регистрацию%') Order by message_Time desc";

        if(isset($_REQUEST['pseudolimit'])){
        $pseudolimit = $_REQUEST['pseudolimit'];
        $pseudolimitend = $msgOnPageLimit;
        $defaultStatement.= " limit $pseudolimit,$pseudolimitend";
        }

        $stmt = $mysqli->prepare($defaultStatement);
        $stmt->execute();

        $json_part_messages = [];
        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_messages,$row);
            }
        }

        
        $msgIds='';
        foreach ($json_part_messages as &$msg){
            $msgIds.=$msg['idMEssage'];
            $msgIds.=',';
        }
        $msgIds =  rtrim($msgIds,',');

        $stmt = $mysqli->prepare("SELECT idMEssage, message_Time,  message_Text, message_ReplyTo,
        case when message_image is not null then 1 else 0 end
        'image' FROM krotdb.messages m where message_ReplyTo in ($msgIds)" );
        $stmt->execute();

        $json_part_replies = [];
        $result = $stmt->get_result();
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                array_push($json_part_replies,$row);
            }
        }

        array_push($json,$json_part_messages);
        array_push($json,$json_part_replies);
    break;

}


print(json_encode($json));
?>