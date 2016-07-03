<?php

    $routes = array(
        "marketcap" => "marketcap",
        "detailed_overview" => "detailed_overview",
        "stock_search" => "stock_search",
        "stock_view" => "stock_view"
    );

    $descriptions = array(
        "portfolio" => "Total value of your holdings.",
        "detailed_overview" => "Detailed overview of your owned stock and options.",
        "stock_search" => "Search for stocks by symbol",
        "stock_view" => "View historical data & ownership information"
    );

    if (!isset($_GET['r']) || !in_array($_GET['r'], $routes)) {
        $route = "portfolio";
    } else {
        $route = htmlspecialchars($_GET['r']);
    }

?>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!-->
<html lang="en">
    <!--<![endif]-->
    <!-- BEGIN HEAD -->
    <head>
        <meta charset="utf-8" />
        <title>Stockmarket Simulator | <?= ucwords($route) ?></title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="" name="description" />
        <meta content="" name="author" />
        <!-- BEGIN LAYOUT FIRST STYLES -->
        <link href="//fonts.googleapis.com/css?family=Oswald:400,300,700" rel="stylesheet" type="text/css" />
        <!-- END LAYOUT FIRST STYLES -->
        <!-- BEGIN GLOBAL MANDATORY STYLES -->
        <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/simple-line-icons/simple-line-icons.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/bootstrap/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css" rel="stylesheet" type="text/css" />
        <!-- END GLOBAL MANDATORY STYLES -->
        <!-- BEGIN THEME GLOBAL STYLES -->
        <link href="assets/global/css/components.min.css" rel="stylesheet" id="style_components" type="text/css" />
        <link href="assets/global/css/plugins.min.css" rel="stylesheet" type="text/css" />
        <!-- END THEME GLOBAL STYLES -->
        <!-- BEGIN THEME LAYOUT STYLES -->
        <link href="assets/layouts/layout5/css/layout.min.css" rel="stylesheet" type="text/css" />
        <link href="assets/layouts/layout5/css/custom.min.css" rel="stylesheet" type="text/css" />
        <!-- END THEME LAYOUT STYLES -->
        <link rel="shortcut icon" href="favicon.ico" /> </head>
    <!-- END HEAD -->

    <body class="page-header-fixed page-sidebar-closed-hide-logo">
        <!-- BEGIN CONTAINER -->
        <div class="wrapper">
            <!-- BEGIN HEADER -->
            <header class="page-header">
                <nav class="navbar mega-menu" role="navigation">
                    <div class="container-fluid">
                        <div class="clearfix navbar-fixed-top">
                            <!-- Brand and toggle get grouped for better mobile display -->
                            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="toggle-icon">
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </span>
                            </button>
                            <!-- End Toggle Button -->
                            <!-- BEGIN LOGO -->
                            <a id="index" class="page-logo" href="?r=portfolio">
                                <img src="assets/layouts/layout5/img/logo.png" alt="Logo"> </a>
                            <!-- END LOGO -->
                            <!-- BEGIN SEARCH
                            <form class="search" action="extra_search.html" method="GET">
                                <input type="name" class="form-control" name="query" placeholder="Search...">
                                <a href="javascript:;" class="btn submit md-skip">
                                    <i class="fa fa-search"></i>
                                </a>
                            </form>
                            END SEARCH -->
                        </div>
                        <!-- BEGIN HEADER MENU -->
                        <div class="nav-collapse collapse navbar-collapse navbar-responsive-collapse">
                            <ul class="nav navbar-nav">
                                <li class="dropdown dropdown-fw <?php 
                                    if (in_array($route, ["portfolio", "detailed_overview"])) {
                                        echo "active open selected";
                                    }
                                ?>">
                                    <a href="javascript:;" class="text-uppercase">
                                        <i class="icon-home"></i> Your Portfolio </a>
                                    <ul class="dropdown-menu dropdown-menu-fw">
                                        <li>
                                            <a href=".">
                                                <i class="icon-bar-chart"></i> Overview </a>
                                        </li>
                                        <li>
                                            <a href="?r=detailed_overview">
                                                <i class="icon-bulb"></i> Detailed overview </a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="dropdown dropdown-fw <?php 
                                    if (in_array($route, ["stock_search", "stock_view"])) {
                                        echo "active open selected";
                                    }
                                ?>">
                                    <a href="javascript:;" class="text-uppercase">
                                        <i class="icon-book-open"></i> Stock Information </a>
                                    <ul class="dropdown-menu dropdown-menu-fw">
                                        <li>
                                            <a href="?r=stock_search">
                                                <i class="icon-magnifier"></i> Search </a>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <!-- END HEADER MENU -->
                    </div>
                    <!--/container-->
                </nav>
            </header>
            <!-- END HEADER -->
            <div class="container-fluid">
                <div class="page-content">
                    <!-- BEGIN BREADCRUMBS -->
                    <div class="breadcrumbs">
                        <h1><?= str_replace("_", " ", $route) ?> <br> <small style="color: #696969"><?= $descriptions[$route] ?></small></h1>
                        <!-- Sidebar Toggle Button
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".page-sidebar">
                            <span class="sr-only">Toggle navigation</span>
                            <span class="toggle-icon">
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </span>
                        </button>
                        Sidebar Toggle Button -->
                    </div>
                    <!-- END BREADCRUMBS -->
                    <!-- BEGIN SIDEBAR CONTENT LAYOUT -->
                    <div class="page-content-container">
                        <?php

                            require 'fragments/' . $route . '.html';


                        ?>
                    </div>
                    <!-- END SIDEBAR CONTENT LAYOUT -->
                </div>
                <!-- BEGIN FOOTER -->
                <p class="copyright"> © 2016 <a href="https://carey.li">Carey Li</a> |  
                    <?= exec('git rev-parse --verify HEAD 2> /dev/null', $output) ?> @ <?= exec('git log -1 --format=%cd --date=relative') ?>
                </p>
                <a href="#index" class="go2top">
                    <i class="icon-arrow-up"></i>
                </a>
                <!-- END FOOTER -->
            </div>
        </div>
        <!-- END CONTAINER -->
        <!--[if lt IE 9]>
<script src="assets/global/plugins/respond.min.js"></script>
<script src="assets/global/plugins/excanvas.min.js"></script> 
<![endif]-->
        <!-- BEGIN CORE PLUGINS -->
        <script src="assets/global/plugins/jquery.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/js.cookie.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/jquery.blockui.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
        <!-- END CORE PLUGINS -->
        <!-- BEGIN THEME GLOBAL SCRIPTS -->
        <script src="assets/global/scripts/app.min.js" type="text/javascript"></script>
        <!-- END THEME GLOBAL SCRIPTS -->
        <!-- BEGIN THEME LAYOUT SCRIPTS -->
        <script src="assets/layouts/layout5/scripts/layout.min.js" type="text/javascript"></script>
        <script src="assets/layouts/global/scripts/quick-sidebar.min.js" type="text/javascript"></script>
        <!-- END THEME LAYOUT SCRIPTS -->

        <script>
            "use strict;"

            let commit = "<?= exec('git rev-parse --verify HEAD 2> /dev/null', $output) ?>";

            $(window).ready(function() {
                ss.pages.<?= $route ?>();
            });
        </script>

        <script src="assets/global/plugins/highcharts/js/highcharts.js" type="text/javascript"></script>
        <script src="assets/global/plugins/highcharts/js/highcharts-3d.js" type="text/javascript"></script>
        <script src="assets/global/plugins/highcharts/js/highcharts-more.js" type="text/javascript"></script>
        <script src="assets/global/plugins/typeahead/handlebars.min.js" type="text/javascript"></script>
        <script src="assets/global/plugins/typeahead/typeahead.bundle.min.js" type="text/javascript"></script>

        <script src="stocksim/js/const.js"></script>
        <script src="stocksim/js/app.js"></script>
    </body>

</html>