<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta tags -->
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />
    <meta
      name="description"
      content="Drift - A fully responsive, HTML5 based admin template"
    />
    <meta
      name="keywords"
      content="Responsive, HTML5, admin theme, business, professional, jQuery, web design, CSS3, sass"
    />
    <!-- /meta tags -->
    <title>Drift - Admin Template</title>

    <!-- Site favicon -->
    <link
      rel="shortcut icon"
      href="<?php echo(SERVERURL); ?>assets/images/favicon.ico"
      type="image/x-icon"
    />
    <!-- /site favicon -->

    <!-- Font Icon Styles -->
    <link
      rel="stylesheet"
      href="<?php echo(SERVERURL); ?>plugins/flag-icon-css/css/flag-icon.min.css"
    />
    <link
      rel="stylesheet"
      href="<?php echo(SERVERURL); ?>vendors/gaxon-icon/styles.css"
    />
    <!-- /font icon Styles -->

    <!-- Perfect Scrollbar stylesheet -->
    <link
      rel="stylesheet"
      href="<?php echo(SERVERURL); ?>plugins/perfect-scrollbar/css/perfect-scrollbar.css"
    />
    <!-- /perfect scrollbar stylesheet -->

    <!-- Load Styles -->
    <link
      rel="stylesheet"
      href="<?php echo(SERVERURL); ?>plugins/owl.carousel/dist/assets/owl.carousel.min.css"
    />
    <link
      rel="stylesheet"
      href="<?php echo(SERVERURL); ?>plugins/chartist/dist/chartist.min.css"
    />

    <?php
    require_once "_util_php/BeanResource.php";
    require_once "_util_php/Routes.php";
    //INSTANCIA PARA AGREGAR HTML DIMAMICO
    $routes = new Routes();
    $beanResource = $routes->getResourceForContainer();
                //INCLUIMOS LOS STYLES
                $array_styles = $beanResource->path_styles; 
                if ($array_styles !="") { 
                  foreach ($array_styles as $path_style) { 
                    echo '
                    <link
                    rel="stylesheet"
                    href="'.SERVERURL.$path_style . '"
                  />
                
                '; 
              } }
              ?>
    <!-- /load styles -->
  </head>
  <body >
    <!-- Loader -->
    <div class="dt-loader-container" style="display: none;">
      <div class="dt-loader">
        <svg class="circular" viewBox="25 25 50 50">
          <circle
            class="path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke-width="2"
            stroke-miterlimit="10"
          ></circle>
        </svg>
      </div>
    </div>
    <!-- /loader -->

    <!-- Root -->
    <div class="dt-root">
      <div class="dt-root__inner">
        <header id="app-header" >
        
        </header>

        <!-- Site Main -->
        <main class="dt-main">
          <!-- Sidebar -->
          <aside id="main-sidebar" >
           
          </aside>
          <!-- /sidebar -->

          <!-- Site Content Wrapper -->
          <div class="dt-content-wrapper">
            <!-- Site Content -->
            <div id="app_container" class="dt-content pt-2" >
              <?php
               include($beanResource->path_resource);
              ?>
            </div>
            <!-- /site content -->

            <!-- Footer -->
            <footer class="dt-footer">
              Copyright Company Andres © 2020 v1.0
            </footer>
            <!-- /footer -->
          </div>
          <!-- /site content wrapper -->

          <!-- Theme Chooser -->
          <div class="dt-customizer-toggle">
            <a href="javascript:void(0)" data-toggle="customizer">
              <i class="icon icon-customizer animation-customizer"></i>
            </a>
          </div>
          <!-- /theme chooser -->

          <!-- Customizer Sidebar -->
          <aside class="dt-customizer dt-drawer position-right">
            <div class="dt-customizer__inner">
              <!-- Customizer Header -->
              <div class="dt-customizer__header">
                <!-- Customizer Title -->
                <div class="dt-customizer__title">
                  <h3 class="mb-0">Theme Settings</h3>
                </div>
                <!-- /customizer title -->

                <!-- Close Button -->
                <button type="button" class="close" data-toggle="customizer">
                  <span aria-hidden="true">×</span>
                </button>
                <!-- /close button -->
              </div>
              <!-- /customizer header -->

              <!-- Customizer Body -->
              <div
                class="dt-customizer__body ps-custom-scrollbar ps ps--active-y"
              >
                <!-- Customizer Body Inner  -->
                <div class="dt-customizer__body-inner">
                  <!-- Section -->
                  <section>
                    <h4>Theme</h4>

                    <!-- List -->
                    <ul class="dt-list dt-list-sm" id="theme-chooser">
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-theme="light"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/theme-light.png"
                              alt="Light"
                            />
                          </a>
                          <span class="choose-option__name">Light</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option active">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-theme="semidark"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/theme-normal.png"
                              alt="Normal"
                            />
                          </a>
                          <span class="choose-option__name">Semi-dark</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-theme="dark"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/theme-dark.png"
                              alt="Dark"
                            />
                          </a>
                          <span class="choose-option__name">Dark</span>
                        </div>
                      </li>
                    </ul>
                    <!-- /list -->
                  </section>
                  <!-- /section -->

                  <!-- Section -->
                  <section>
                    <h4>Style</h4>

                    <!-- List -->
                    <ul class="dt-list dt-list-sm">
                      <li class="dt-list__item d-none d-lg-block">
                        <div class="choose-option active">
                          <a
                            href="javascript:void(0)"
                            id="toggle-fixed-sidebar"
                            class="choose-option__icon"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/fix-sidebar.png"
                              alt="Fix Sidebar"
                            />
                          </a>
                          <span class="choose-option__name">Fix Sidebar</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option active">
                          <a
                            href="javascript:void(0)"
                            id="toggle-fixed-header"
                            class="choose-option__icon"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/fix-header.png"
                              alt="Fix Header"
                            />
                          </a>
                          <span class="choose-option__name">Fix Header</span>
                        </div>
                      </li>
                    </ul>
                    <!-- /list -->
                  </section>
                  <!-- /section -->

                  <!-- Section -->
                  <section id="theme-style-chooser">
                    <h4>Color</h4>

                    <!-- List -->
                    <ul class="dt-list dt-list-sm dt-color-options">
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-1"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-2"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-3"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-4"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-5"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-6"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-7"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option active"
                          data-style="style-8"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-9"
                        ></span>
                      </li>
                      <li class="dt-list__item">
                        <span
                          class="dt-color-option"
                          data-style="style-10"
                        ></span>
                      </li>
                    </ul>
                    <!-- /list -->
                  </section>
                  <!-- /section -->

                  <!-- Section -->
                  <section class="d-none d-lg-block" id="sidebar-layout">
                    <h4>Sidebar Layout</h4>

                    <!-- List -->
                    <ul class="dt-list dt-list-sm">
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            id="sl-option1"
                            data-value="folded"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/folded.png"
                              alt="Folded"
                            />
                          </a>
                          <span class="choose-option__name">Folded</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option active">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            id="sl-option2"
                            data-value="default"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/default.png"
                              alt="Default"
                            />
                          </a>
                          <span class="choose-option__name">Default</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            id="sl-option3"
                            data-value="drawer"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/drawer.png"
                              alt="Drawer"
                            />
                          </a>
                          <span class="choose-option__name">Drawer</span>
                        </div>
                      </li>
                    </ul>
                    <!-- /list -->
                  </section>
                  <!-- /section -->

                  <!-- Section -->
                  <section class="d-none d-lg-block" id="layout-chooser">
                    <h4>Layout</h4>

                    <!-- List -->
                    <ul class="dt-list dt-list-sm">
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-layout="framed"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/framed.png"
                              alt="Framed"
                            />
                          </a>
                          <span class="choose-option__name">Framed</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option active">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-layout="full-width"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/full-width.png"
                              alt="Full Width"
                            />
                          </a>
                          <span class="choose-option__name">Full Width</span>
                        </div>
                      </li>
                      <li class="dt-list__item">
                        <div class="choose-option">
                          <a
                            href="javascript:void(0)"
                            class="choose-option__icon"
                            data-layout="boxed"
                          >
                            <img
                              src="<?php echo(SERVERURL); ?>assets/images/customizer-icons/boxed.png"
                              alt="Boxed"
                            />
                          </a>
                          <span class="choose-option__name">Boxed</span>
                        </div>
                      </li>
                    </ul>
                    <!-- /list -->
                  </section>
                  <!-- /section -->
                </div>
                <!-- /customizer body inner -->
                <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                  <div
                    class="ps__thumb-x"
                    tabindex="0"
                    style="left: 0px; width: 0px;"
                  ></div>
                </div>
                <div
                  class="ps__rail-y"
                  style="top: 0px; height: 553px; right: 0px;"
                >
                  <div
                    class="ps__thumb-y"
                    tabindex="0"
                    style="top: 0px; height: 231px;"
                  ></div>
                </div>
              </div>
              <!-- /customizer body -->
            </div>
          </aside>
          <!-- /customizer sidebar -->
        </main>
      </div>
    </div>
    <!-- /root -->
    <!--Scripts TiendaIniciales-->
    <script src="<?php echo(SERVERURL); ?>scripts/util/functions.js"></script>
    <script src="<?php echo(SERVERURL); ?>scripts/util/functions_operational.js"></script>
    <script src="<?php echo(SERVERURL); ?>scripts/util/configuration_api.js"></script>
    <script src="<?php echo(SERVERURL); ?>scripts/util/functions_alerts.js"></script>
    <script src="<?php echo(SERVERURL); ?>scripts/init_parameters.js"></script>
    <!-- Optional JavaScript -->
    <script src="<?php echo(SERVERURL); ?>plugins/jquery/dist/jquery.min.js"></script>
    <script src="<?php echo(SERVERURL); ?>plugins/jquery-pagination/jquery.Pagination.min.js"></script>
    <script src="<?php echo(SERVERURL); ?>plugins/moment/moment.js"></script>
    <script src="<?php echo(SERVERURL); ?>plugins/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Perfect Scrollbar jQuery -->
    <script src="<?php echo(SERVERURL); ?>plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
    <!-- /perfect scrollbar jQuery -->

    <!-- masonry script -->
    <script src="<?php echo(SERVERURL); ?>plugins/masonry-layout/dist/masonry.pkgd.min.js"></script>
    <script src="<?php echo(SERVERURL); ?>plugins/sweetalert2/dist/sweetalert2.js"></script>
    <script src="<?php echo(SERVERURL); ?>assets/js/functions.js"></script>
    <script src="<?php echo(SERVERURL); ?>assets/js/customizer.js"></script>
    <!-- Custom JavaScript -->
    <script src="<?php echo(SERVERURL); ?>plugins/owl.carousel/dist/owl.carousel.min.js"></script>
    <script src="<?php echo(SERVERURL); ?>assets/js/script.js"></script>
    <script src="<?php echo(SERVERURL); ?>assets/js/custom/charts/dashboard-listing.js"></script>
    <!--Scripts RedTienda-->

    <?php
            //INCLUIMOS LOS SCRIPTS
            $array_scripts = $beanResource->path_scripts; if ($array_scripts !=
    "") { foreach ($array_scripts as $path_script) { echo '
    <script type="text/javascript" src="'.SERVERURL.$path_script . '"></script>
    '; } } ?>
  </body>
</html>
