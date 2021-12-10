<head>
    <meta charset="utf-8" />

 
   <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>
    
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
        <div id='message_header'>
            <h1 class='message_h1'> Сообщения </h1>
        </div>
        <div id ='messages'></div>
        <div id='bottom_navigation' class="message_navigation">
            <div id = 'navigationfrom' active = 'no' class='message_navigation_node'>Предыдущая страница</div> 
            <div id = 'navigationmark'></div>
            <div id = 'navigationto' active = 'yes' class='message_navigation_node'>Следующая страница</div> 
        </div>
    </div>

<?php
the_content();
get_footer();
?>