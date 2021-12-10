<head>
     <!--HighCharts - графики -->
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\highcharts-more.js"></script>


    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\jquery-3.6.0.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\moment.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\jslibs\utils.js"></script>

    <script src="\wp-content\themes\astra\templates\jslibs\grid.js"></script>
    <link href="\wp-content\themes\astra\templates\grunt_template\mermaid.min.css" rel="stylesheet" />

    
    <script type="text/javascript" src="\wp-content\themes\astra\templates\grunt_template\grunt.js"></script>
    <script type="text/javascript" src="\wp-content\themes\astra\templates\grunt_template\gruntConf.js"></script>
    <link rel="stylesheet" href="\wp-content\themes\astra\templates\grunt_template\grunt.css"></link>
</head>


<?php
/*
* Template Name: Grunt
* Template Post Type: page    
*/
get_header();
?>

    <div id='grunt_overall_container'> 
    <div id="grunt_table" class="ag-theme-alpine"></div>
    <div id='grunt_chart_container'>
        <div id='grunt_chart_configuration'> 
        </div>
    </div>
    </div>

<?php
the_content();
get_footer();
?>