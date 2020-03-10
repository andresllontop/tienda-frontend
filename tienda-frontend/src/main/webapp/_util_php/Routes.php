<?php
class Routes
{

    public function getResourceForContainer()
    {
        $routes = new Routes();
        //$routes = $routes->isURLValidate();
				$path_resource = "views/subprojects/app/";
				$path_scripts = "";
				$path_style = "";
        //VALIDAMOS SI ES UNA URL CORRECTA
        if ($routes->isURLValidate()) {
            $version_proyect = "1.1";
            /*
            $version_proyect = 1.0; -> antes del 27/07/2019
            $version_proyect = 1.01; -> 27/06/2019 01:58:00
            $version_proyect = 1.02; -> 14/09/2019 01:58:00
            $version_proyect = 1.03; -> 14/09/2019 10:58:00
            $version_proyect = 1.04; -> 14/09/2019 10:58:00
            */
            /*CAMBIAR EL CONTEXTO DE ACUERDO AL PROYECTO. DEJAR EN <</>> CUANDO ESTA EN PRODUCCIÓN */
            $context = 'tienda-frontend./';
            //EXTRAEMOS EL CONTEXTO + EL PATH
            $context_path = $_SERVER['REQUEST_URI'];
            
            //EXTRAEMOS SOLO EL PATH DEL (CONTEXTO + PATH)
            $path = substr($context_path, strlen($context));
            //HACEMOS UN SPLIT PARA DEJAR EL PATH SIN PARAMETROS
            $values_path = explode("?", $path);
            //TOMAMOS LA PRIMERA PARTICIÓN
            $path = $values_path[0];
            //VERIFICAMOS SI EL ULTIMO CARACTER ES /
            if (substr($path, strlen($path) - 1, strlen($path)) == "/") {
                //EXTRAEMOS EL PATH SIN EL CARACTER PARA QUE VALIDE BIEN NUESTRA ITERACIÓN DE ABAJO
                $path = substr($path, 0, strlen($path) - 1);
            }
            /*
            AQUÍ ES DONDE VAMOS A CONFIGURAR NUESTRAS PAGINAS
            //EXAMPLE -> new BeanResource(path,path_resource);
            //array_push($list_pages, $resource);
             */
            $list_pages = array();

            /* AUTH */
            //login
            $resource = new BeanResource('auth/login', 'auth/login/login.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.login.js?v='.$version_proyect,$path_resource . 'auth/login/login.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource); 
            //signup
            $resource = new BeanResource('auth/signup', 'auth/signup/signup.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.login.js?v='.$version_proyect,$path_resource . 'auth/signup/signup.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource); 
            //recovery
            $resource = new BeanResource('auth/recovery', 'auth/recovery/recovery.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.login.js?v='.$version_proyect,$path_resource . 'auth/recovery/recovery.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource); 
            /* MODULO DE MANAGER */
            //index
            $resource = new BeanResource('app/tienda/index', 'tienda/index/index.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.js?v='.$version_proyect,'scripts/session/session.validate.init.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource);
          
            //categoria
            $resource = new BeanResource('app/mantenimientos/categorias', 'tienda/mantenimientos/categoria/categoria.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.js?v='.$version_proyect,'scripts/session/session.validate.init.js?v='.$version_proyect,$path_resource . 'tienda/mantenimientos/categoria/categoria.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource);
            //producto
            $resource = new BeanResource('app/mantenimientos/productos', 'tienda/mantenimientos/producto/producto.html', array('plugins/spectrum-colorpicker/js/spectrum.js','assets/js/custom/color-pickers.js','plugins/moment/min/moment.min.js','plugins/moment/min/locales.min.js','plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js','assets/js/custom/datetime-pickers.js','scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.js?v='.$version_proyect,'scripts/session/session.validate.init.js?v='.$version_proyect,$path_resource . 'tienda/mantenimientos/producto/producto.js?v='.$version_proyect,$path_resource . 'tienda/mantenimientos/producto/categoria_c.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect,'plugins/spectrum-colorpicker/css/spectrum.css?v='.$version_proyect,'plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css?v='.$version_proyect));
            array_push($list_pages, $resource);
            //UnidadMedida
            $resource = new BeanResource('app/mantenimientos/unidadmedidas', 'tienda/mantenimientos/unidadmedida/unidadmedida.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.js?v='.$version_proyect,'scripts/session/session.validate.init.js?v='.$version_proyect,$path_resource . 'tienda/mantenimientos/unidadmedida/unidadmedida.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource);
            //Personal
            $resource = new BeanResource('app/mantenimientos/personales', 'tienda/mantenimientos/personal/personal.html', array('scripts/session/change.cookie.js?v='.$version_proyect,'scripts/session/js.cookie.js?v='.$version_proyect,'scripts/session/session.validate.js?v='.$version_proyect,'scripts/session/session.validate.init.js?v='.$version_proyect,$path_resource . 'tienda/mantenimientos/personal/personal.js?v='.$version_proyect), array('css/styles_tienda.css?v='.$version_proyect));
            array_push($list_pages, $resource);

            $exists = false;
            foreach ($list_pages as $_resource) {
                if ($path == $_resource->path) {
                    $exists = true;
				    $path_resource .= $_resource->path_resource;
					$path_scripts = $_resource->path_scripts;
					$path_style = $_resource->path_styles;
                    break;
                }
            }
            if (!$exists) {
                $path_resource = './zinclude_error/app_404.html';
            }
        } else {
            /*URL NO VALIDO */
            $path_resource = './zinclude_error/app_404.html';
        }
        $resources =  new BeanResource($path, $path_resource,  $path_scripts,$path_style); 
        return $resources;
    }

    public function isURLValidate()
    {
        $url_actual = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        if (filter_var($url_actual, FILTER_VALIDATE_URL)) {
            return true;
        } else {
            return false;
        }
    }
}