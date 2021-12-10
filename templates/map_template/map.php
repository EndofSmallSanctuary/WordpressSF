<head>
    <meta charset="utf-8" />

    <script src="https://api-maps.yandex.ru/2.1/?apikey=c48a0c56-24a8-4889-88d5-ad7a900835cf&lang=ru_RU" type="text/javascript">
    </script>
   
   <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>
    
    <script type="text/javascript" src="\wp-content\themes\astra\templates\map_template\map.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\map_template\placemarks.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\map_template\mapConf.js"></script>

    <link rel="stylesheet" href="\wp-content\themes\astra\templates\map_template\map.css"></link>


</head>



<?php
/*
* Template Name: Map
* Template Post Type: page    
*/
get_header();
?>

    <div id='map_overall_container'> 
        <div id ='map'></div>
    </div>

<?php
the_content();
get_footer();
?>