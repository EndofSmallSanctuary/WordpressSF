<head>
    <meta charset="utf-8" />

 
   <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>


    <script type="text/javascript" src="\wp-content\themes\astra\templates\messages_template\messageViewComponents.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\messages_template\messageNavigationComponents.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\messages_template\messages.js"></script>
    <link rel="stylesheet" href="\wp-content\themes\astra\templates\messages_template\messages.css"></link>


</head>



<?php
/*
* Template Name: Messages
* Template Post Type: page    
*/
get_header();
?>

    <div id='messages_overall_container'> 
    <h1 class='message_h1'> Сообщения </h1>
        <div id = 'tabs'> 
            <div id ='tab_clts' active = 'y'>
                <h1 class='tab_header_active'>
                    Сообщения от клиентов
                </h1>
            </div>
            <div id ='tab_broadcast' active = 'n'>
                <h1 class='tab_header_inactive'>
                    Широковещательные сообщения
                </h1>
            </div>
        </div>
        <div id ='messages'></div>
    </div>

<?php
the_content();
get_footer();
?>