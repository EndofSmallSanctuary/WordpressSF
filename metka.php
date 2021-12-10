<head>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>

         <!--HighCharts - графики -->
	<script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts-more.js"></script>
    
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\datepicker\jquery.datetimepicker.full.min.js"></script>



    <script src="\wp-content\themes\astra\templates\jslibs\grid.js"></script>
    <link href="\wp-content\themes\astra\templates\metka_template\mermaid.min.css" rel="stylesheet" />

    <script type="text/javascript" src="\wp-content\themes\astra\assets\views\bottomNavigationComponents.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\metka_template\metkaConf.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\metka_template\metka.js"></script>




    <link rel="stylesheet" href="\wp-content\themes\astra\templates\metka_template\metka.css"></link>
    <link rel="stylesheet" href="\wp-content\themes\astra\templates\jslibs\datepicker\jquery.datetimepicker.min.css"></link>
</head>


<?php
/*
* Template Name: Metka
* Template Post Type: page    
*/
if(!isset($_GET['mobile']))
get_header();
?>



    <div id='metka_overall_container'> 

    <div id='metka_table_container'>
            <div id='metka_devs_container'></div>
            <div id="metka_table" class="ag-theme-alpine"></div>
    </div>


    <div id='metka_chart_container'>
        <div id='metka_gunt'></div>
        <div id='metka_chart'></div>
    </div>



</div>

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
if(!isset($_GET['mobile']))
get_footer();
?>