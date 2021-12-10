<head>
     <!--HighCharts - графики -->
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts-more.js"></script>


    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>

    <script src="\wp-content\themes\astra\templates\jslibs\grid.js"></script>
    <link href="\wp-content\themes\astra\templates\glubina_template\mermaid.min.css" rel="stylesheet" />

    
    <script type="text/javascript" src="\wp-content\themes\astra\templates\glubina_template\glubina.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\glubina_template\glubinaConf.js"></script>
    <link rel="stylesheet" href="\wp-content\themes\astra\templates\glubina_template\glubina.css"></link>
</head>


<?php
/*
* Template Name: Glubina
* Template Post Type: page    
*/
get_header();
?>

    <div id='glubina_overall_container'> 
    <div id="glubina_table" class="ag-theme-alpine"></div>
    <div id='glubina_chart_container'>
        <h2 id='glubina_chart_avaliable'>Доступные станции</h2>
        <div id='glubina_chart_configuration'> 
        </div>
    </div>
    </div>

<?php
the_content();
get_footer();
?>