<head>
    <meta charset="utf-8" />

    <script src="https://api-maps.yandex.ru/2.1/?apikey=c48a0c56-24a8-4889-88d5-ad7a900835cf&lang=ru_RU" type="text/javascript">
    </script>
   
   <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\datepicker\jquery.datetimepicker.full.min.js"></script>
    
    <script type="text/javascript" src="\wp-content\themes\astra\assets\views\bottomNavigationComponents.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\map_template\map.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\map_template\mapConf.js"></script>


    <link rel="stylesheet" href="\wp-content\themes\astra\templates\map_template\map.css"></link>
    <link rel="stylesheet" href="\wp-content\themes\astra\templates\jslibs\datepicker\jquery.datetimepicker.min.css"></link>


</head>



<?php
/*
* Template Name: Map
* Template Post Type: page    
*/
if(!isset($_GET['mobile']))
get_header();
?>



   
    <div id ='map'></div>
         <div id='bikini_bottom'>
             <div id='datepicker_container'>
                 <h2 class = 'datepicker_header'>Выбор даты</h2>
                 <div id ='datepicker_from_to_container'> 
                     <p> Начало: </p>
                     <input type = "text" class='input_datepicker' id ='datepicker_from'> </input>
                     <p> Конец: </p>
                     <input type = "text" class='input_datepicker' id ='datepicker_to'> </input>  
                 </div>
            </div>
            <div id='units_container'>
              
            </div>                 
            <button id='button_search'> Показать данные </button>
  
         </div>

<?php
the_content();
// if(!isset($_GET['mobile']))
// get_footer();
?>