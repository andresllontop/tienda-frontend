//console.log("Validando sessión...");
//console.image("http://blogs.larioja.com/ganas-de-vivir/wp-content/uploads/sites/48/2018/03/stop.png");
//console.meme("Seguro me quieres hackear!", "Y solo porque sabes programar.", "Not Sure Fry", 400, 300);
let contextPah = getContextAPP();
let user_session;

if (Cookies.get('tienda_token') === undefined) {
	location.href = contextPah + 'auth/login';
} else if (parseJwt(Cookies.get('tienda_token'))) {
	//CARGAMOS LOS DATOS DEL USUARIO
	user_session = Cookies.getJSON('tienda_user');
	let user = user_session;
	//SET DATOS USER
	document.querySelectorAll('.name-user-session').forEach((element) => {
		element.innerHTML = getStringCapitalize(
			user.usuario.split(' ')[0].toLowerCase()
		);
	});
	document.querySelectorAll('.name-type-user-session').forEach((element) => {
		element.innerHTML = getStringTipoUsuario(user.tipo_usuario);
	});
	let url_foto;
	if (user.foto != '') {
		//url_foto = getHostAPI() + 'resources/img/FOTOS/' + user.foto;
	} else {
		//url_foto = getHostAPI() + 'resources/img/150x150.png';
	}
	//setUrlFotoUserSession(url_foto);

	//ADD ITEMS MENU AL SIDEBAR
	addMenus(user);
} else {
	closeSession();
}

function getStringTipoUsuario(tipo_usuario) {
	let st = '';
	switch (tipo_usuario) {
		case 1:
			st = 'Usuario UNPRG';
			break;
		case 2:
			st = 'Usuario TIENDA';
			break;
		default:
			st = 'User';
			break;
	}
	//st = getStringCapitalize(st.toLowerCase());
	return st;
}

function addMenus(usuario) {
	switch (usuario.tipo_usuario) {
		case 1:
			createHTML_ATE(usuario.tipo_perfil);
			break;
		case 2:
			//tienda
			createHTML_HEADER();
			createHTML_TIENDA(usuario.tipo_perfil);
			break;

		default:
			break;
	}
}

function createHTML_TIENDA(typeProfile) {
	//INICIO PARA TODOS
	document.querySelector('#main-sidebar').classList.add('dt-sidebar');
	document.querySelector('#main-sidebar').innerHTML = `
  <div class="dt-sidebar__container" >
      <!-- Sidebar Navigation -->
      <ul class="dt-side-nav" id="menus_tienda">
      </ul>
      <!-- /sidebar navigation -->
  </div>
  `;
	//document.querySelector('#a-mis-datos').style.display = 'none';
	document.querySelector('#menus_tienda').innerHTML = `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Dashboard</span>
        </li>
        <!-- /menu header -->

        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/tienda/index" class="dt-side-nav__link a-index-no" title="Inicio">
                <i class="icon icon-home icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Inicio</span>
            </a>
        </li>
        <!-- /menu item -->
    `;
	//SERVICIOS
	///inicio
	document.querySelector('#menus_tienda').innerHTML += `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Servicios</span>
        </li>
        <!-- /menu header -->
    `;

	////social
	if (
		typeProfile == 0 ||
		typeProfile == 1 ||
		typeProfile == 11 ||
		typeProfile == 5
	) {
		document.querySelector('#menus_tienda').innerHTML += `
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link dt-side-nav__arrow" title="Social">
                    <i class="icon icon-users icon-fw icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Social</span>
                </a>
                <!-- Sub-menu -->
                <ul class="dt-side-nav__sub-menu">
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/tienda/servicios/social/fichas" class="dt-side-nav__link" title="Fichas">
                            <i class="icon icon-list icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Fichas</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/tienda/servicios/social/usuarios" class="dt-side-nav__link" title="Atendidos">
                            <i class="icon icon-contacts-app icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Atendidos</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/tienda/servicios/social/citas" class="dt-side-nav__link" title="Citas">
                            <i class="icon icon-sweet-alert icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Citas</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/tienda/servicios/social/reservas-cu" class="dt-side-nav__link" title="Reservas C.U">
                            <i class="icon icon-list icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Reservas C.U</span>
                        </a>
                    </li>
                    <li class="dt-side-nav__item">
                        <a href="${contextPah}app/tienda/servicios/social/convocatorias-cu" class="dt-side-nav__link" title="Convocatorias">
                            <i class="icon icon-list icon-fw icon-lg"></i>
                            <span class="dt-side-nav__text">Convocatorias C.U</span>
                        </a>
                    </li>
                </ul>
                <!-- /sub-menu -->
            </li>
        `;
	}

	////mantenimientos seguridad (todos)
	if (typeProfile == 0 || typeProfile == 1) {
		document.querySelector('#menus_tienda').innerHTML += `
            <!-- Menu Header -->
            <li class="dt-side-nav__item dt-side-nav__header">
                <span class="dt-side-nav__text">Mantenimientos</span>
            </li>
            <!-- /menu header -->

            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/mantenimientos/categorias" class="dt-side-nav__link" title="Categorias">
                    <i class="icon icon-user-add icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Categorias</span>
                </a>
            </li>
            <!-- Menu Item -->
           
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/mantenimientos/productos" class="dt-side-nav__link" title="Productos">
                    <i class="icon icon-news icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Productos</span>
                </a>
            </li>
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/mantenimientos/video/tutorial" class="dt-side-nav__link" title="Video Tutorial">
                    <i class="icon icon-camera icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Video Tutorial</span>
                </a>
            </li>
            <!-- /menu item -->
        
            <!-- Menu Header -->
            <!--li class="dt-side-nav__item dt-side-nav__header">
                <span class="dt-side-nav__text">Seguridad</span>
            </li-->
            <!-- /menu header -->

            <!-- Menu Item -->
            <!--li class="dt-side-nav__item">
                <a href="basic-form.html" class="dt-side-nav__link" title="Basic Form">
                    <i class="icon icon-settings icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Perfiles</span>
                </a>
            </li-->
            <!-- /menu item -->
        
            <!-- Menu Header -->
            <li class="dt-side-nav__item dt-side-nav__header">
                <span class="dt-side-nav__text">Configuraciones</span>
            </li>
            <!-- /menu header -->

            <!-- Menu Item -->
            <!--li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/configuraciones/correo-tienda" class="dt-side-nav__link" title="Correo SISBU">
                    <i class="icon icon-mail icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Correo SISBU</span>
                </a>
            </li-->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/configuraciones/cicloacademico" class="dt-side-nav__link" title="Ciclos Académicos">
                    <i class="icon icon-tag-o icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Ciclos Académicos</span>
                </a>
            </li>
            <!-- /menu item -->
        
            <!-- Menu Header -->
            <li class="dt-side-nav__item dt-side-nav__header">
                <span class="dt-side-nav__text">Procesos</span>
            </li>
            <!-- /menu header -->

            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/procesos/upload" class="dt-side-nav__link" title="Importar Alumnos">
                    <i class="icon icon-wall icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Importar Alumnos</span>
                </a>
            </li>
            <!-- /menu item -->
        
        
        `;
	}
	////informes
	if (typeProfile != 100) {
		//diferente de invitado
		document.querySelector('#menus_tienda').innerHTML += `
            <!-- Menu Header -->
            <li class="dt-side-nav__item dt-side-nav__header">
                <span class="dt-side-nav__text">Informes</span>
            </li>
            <!-- /menu header -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link" title="Reportes">
                    <i class="icon icon-profilepage icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Reportes</span>
                </a>
            </li>
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link" title="Estadísticas">
                    <i class="icon icon-profilepage icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Estadísticas</span>
                </a>
            </li>
            <!-- /menu item -->   
        `;
	}

	/*
     document.querySelector("#menus_tienda").innerHTML +=
     `
     
     `;
     */
}

function createHTML_ATE(typeProfile) {
	document
		.querySelector('#a-mi-perfil')
		.setAttribute('href', `${contextPah}app/ate/perfil`);
	document
		.querySelector('#a-mis-datos')
		.setAttribute('href', `${contextPah}app/ate/datos`);
	//INICIO PARA TODOS
	document.querySelector('#main-sidebar').classList.add('dt-sidebar');
	document.querySelector('#main-sidebar').innerHTML = `
    <div class="dt-sidebar__container" >
        <!-- Sidebar Navigation -->
        <ul class="dt-side-nav" id="menus_tienda">
        </ul>
        <!-- /sidebar navigation -->
    </div>
    `;
	document.querySelector('#menus_tienda').innerHTML = `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Dashboard</span>
        </li>
        <!-- /menu header -->

        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ate/index" class="dt-side-nav__link a-index-no" title="Inicio">
                <i class="icon icon-home icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Inicio</span>
            </a>
        </li>
        <!-- /menu item -->
       
        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ate/perfil" class="dt-side-nav__link a-index-no" title="Mi Perfil">
                <i class="icon icon-user icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Mi Perfil</span>
            </a>
        </li>
        <!-- /menu item -->
    
        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/ate/datos" class="dt-side-nav__link a-index-no" title="Mis Datos">
                <i class="icon icon-user-account icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Mis Datos</span>
            </a>
        </li>
        <!-- /menu item -->
    `;

	if (typeProfile == 1000) {
		document.querySelector('#menus_tienda').innerHTML += `
             <!-- Menu Item -->
                <li class="dt-side-nav__item">
                    <a href="${contextPah}app/ate/evaluaciones" class="dt-side-nav__link" title="Evaluaciones Virtuales">
                        <i class="icon icon-description icon-fw icon-lg"></i>
                        <span class="dt-side-nav__text">Evaluaciones<br> Virtuales</span>
                    </a>
                </li>
            <!-- /menu item -->
        `;
	}

	//SERVICIOS
	document.querySelector('#menus_tienda').innerHTML += `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Servicios</span>
        </li>
        <!-- /menu header -->
    
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/ate/reservas" class="dt-side-nav__link" title="Reservas de Citas">
                    <i class="icon icon-calendar icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text" style="text-transform: none">Reserva de Citas</span>
                </a>
            </li>
        <!-- /menu item -->
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/ate/menu-semanal" class="dt-side-nav__link" title="Menú Semanal del Comedor">
                    <i class="icon icon-burger icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text" style="text-transform: none">Menu Semanal<br>del Comedor</span>
                </a>
            </li>
        <!-- /menu item -->
    `;

	//EXTRAS
	document.querySelector('#menus_tienda').innerHTML += `
        <!-- Menu Header -->
        <li class="dt-side-nav__item dt-side-nav__header">
            <span class="dt-side-nav__text">Extras</span>
        </li>
        <!-- /menu header -->
    
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/ate/noticias-eventos" class="dt-side-nav__link" title="Noticias y Eventos">
                    <i class="icon icon-attach-v icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text" style="text-transform: none">Noticias y Eventos</span>
                </a>
            </li>
        <!-- /menu item -->
    `;

	if (typeProfile == 1000) {
		document.querySelector('#menus_tienda').innerHTML += `
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/ate/documentos" class="dt-side-nav__link" title="Documentos">
                    <i class="icon icon-assignment icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text" style="text-transform: none">Documentos</span>
                </a>
            </li>
        <!-- /menu item -->
        `;
	}
	//icon icon-arrow-right icon-fw mr-2 mr-sm-1
	document.querySelector('#menus_tienda').innerHTML += `
        <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="javascript:void(0)" class="dt-side-nav__link a-close-session" title="Cerrar Sessión">
                    <i class="icon icon-arrow-right icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text" style="text-transform: none">Cerrar Sesión</span>
                </a>
            </li>
        <!-- /menu item -->
        `;
}
function createHTML_HEADER() {
	document.querySelector('#app-header').classList.add('dt-header');

	document.querySelector('#app-header').innerHTML = `
    <!-- Header container -->
    <div class="dt-header__container">
      <!-- Brand -->
      <div class="dt-brand">
        <!-- Brand tool -->
        <div class="dt-brand__tool" data-toggle="main-sidebar">
          <div class="hamburger-inner"></div>
        </div>
        <!-- /brand tool -->

        <!-- Brand logo -->
        <span class="dt-brand__logo">
          <a class="dt-brand__logo-link active" href="index.html">
            <img
              class="dt-brand__logo-img d-none d-sm-inline-block"
              src="https://via.placeholder.com/334x119"
              alt="Drift"
            />
            <img
              class="dt-brand__logo-symbol d-sm-none"
              src="https://via.placeholder.com/133x119"
              alt="Drift"
            />
          </a>
        </span>
        <!-- /brand logo -->
      </div>
      <!-- /brand -->

      <!-- Header toolbar-->
      <div class="dt-header__toolbar">
        <!-- Header Menu Wrapper -->
        <div class="dt-nav-wrapper">
       
          <!-- Header Menu -->
          <ul class="dt-nav">
            <li class="dt-nav__item dt-notification dropdown">
              <!-- Dropdown Link -->
              <a
                href="#"
                class="dt-nav__link dropdown-toggle no-arrow"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i
                  class="icon icon-notification2 icon-fw dt-icon-alert"
                ></i>
              </a>
              <!-- /dropdown link -->

              <!-- Dropdown Option -->
              <div
                class="dropdown-menu dropdown-menu-right dropdown-menu-media"
              >
                <!-- Dropdown Menu Header -->
                <div class="dropdown-menu-header">
                  <h4 class="title">Notifications (9)</h4>

                  <div class="ml-auto action-area">
                    <a href="javascript:void(0)">Mark All Read</a>
                    <a class="ml-2" href="javascript:void(0)">
                      <i
                        class="icon icon-settings icon-lg text-light-gray"
                      ></i>
                    </a>
                  </div>
                </div>
                <!-- /dropdown menu header -->

                <!-- Dropdown Menu Body -->
                <div class="dropdown-menu-body ps-custom-scrollbar ps">
                  <div class="h-auto">
                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body">
                        <span class="message">
                          <span class="user-name">Stella Johnson</span>
                          and <span class="user-name">Chris Harris</span>
                          have birthdays today. Help them celebrate!
                        </span>
                        <span class="meta-date">8 hours ago</span>
                      </span>
                      <!-- /media body -->
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body">
                        <span class="message">
                          <span class="user-name">Jonathan Madano</span>
                          commented on your post.
                        </span>
                        <span class="meta-date">9 hours ago</span>
                      </span>
                      <!-- /media body -->
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body">
                        <span class="message">
                          <span class="user-name">Chelsea Brown</span>
                          sent a video recomendation.
                        </span>
                        <span class="meta-date">
                          <i
                            class="icon icon-play-circle text-primary icon-fw mr-1"
                          ></i>
                          13 hours ago
                        </span>
                      </span>
                      <!-- /media body -->
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body">
                        <span class="message">
                          <span class="user-name">Alex Dolgove</span> and
                          <span class="user-name">Chris Harris</span>
                          like your post.
                        </span>
                        <span class="meta-date">
                          <i
                            class="icon icon-like text-light-blue icon-fw mr-1"
                          ></i>
                          yesterday at 9:30
                        </span>
                      </span>
                      <!-- /media body -->
                    </a>
                    <!-- /media -->
                  </div>

                  <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                    <div
                      class="ps__thumb-x"
                      tabindex="0"
                      style="left: 0px; width: 0px;"
                    ></div>
                  </div>
                  <div class="ps__rail-y" style="top: 0px; right: 0px;">
                    <div
                      class="ps__thumb-y"
                      tabindex="0"
                      style="top: 0px; height: 0px;"
                    ></div>
                  </div>
                </div>
                <!-- /dropdown menu body -->

                <!-- Dropdown Menu Footer -->
                <div class="dropdown-menu-footer">
                  <a href="javascript:void(0)" class="card-link">
                    See All <i class="icon icon-arrow-right icon-fw"></i>
                  </a>
                </div>
                <!-- /dropdown menu footer -->
              </div>
              <!-- /dropdown option -->
            </li>

            <li class="dt-nav__item dt-notification dropdown">
              <!-- Dropdown Link -->
              <a
                href="#"
                class="dt-nav__link dropdown-toggle no-arrow"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i class="icon icon-open-mail icon-fw"></i>
              </a>
              <!-- /dropdown link -->

              <!-- Dropdown Option -->
              <div
                class="dropdown-menu dropdown-menu-right dropdown-menu-media"
              >
                <!-- Dropdown Menu Header -->
                <div class="dropdown-menu-header">
                  <h4 class="title">Messages (6)</h4>

                  <div class="ml-auto action-area">
                    <a href="javascript:void(0)">Mark All Read</a>
                    <a class="ml-2" href="javascript:void(0)">
                      <i
                        class="icon icon-settings icon-lg text-light-gray"
                      ></i
                    ></a>
                  </div>
                </div>
                <!-- /dropdown menu header -->

                <!-- Dropdown Menu Body -->
                <div class="dropdown-menu-body ps-custom-scrollbar ps">
                  <div class="h-auto">
                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body text-truncate">
                        <span class="user-name mb-1">Chris Mathew</span>
                        <span
                          class="message text-light-gray text-truncate"
                          >Okay.. I will be waiting for your...</span
                        >
                      </span>
                      <!-- /media body -->

                      <span class="action-area h-100 min-w-80 text-right">
                        <span class="meta-date mb-1">8 hours ago</span>
                        <!-- Toggle Button -->
                        <span
                          class="toggle-button"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="Mark as read"
                        >
                          <span class="show"
                            ><i
                              class="icon icon-dot-o icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                          <span class="hide"
                            ><i
                              class="icon icon-dot icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                        </span>
                        <!-- /toggle button -->
                      </span>
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body text-truncate">
                        <span class="user-name mb-1">Alia Joseph</span>
                        <span
                          class="message text-light-gray text-truncate"
                        >
                          Alia Joseph just joined Messenger! Be the first
                          to send a welcome message or sticker.
                        </span>
                      </span>
                      <!-- /media body -->

                      <span class="action-area h-100 min-w-80 text-right">
                        <span class="meta-date mb-1">9 hours ago</span>
                        <!-- Toggle Button -->
                        <span
                          class="toggle-button"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="Mark as read"
                        >
                          <span class="show"
                            ><i
                              class="icon icon-dot-o icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                          <span class="hide"
                            ><i
                              class="icon icon-dot icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                        </span>
                        <!-- /toggle button -->
                      </span>
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body text-truncate">
                        <span class="user-name mb-1">Joshua Brian</span>
                        <span
                          class="message text-light-gray text-truncate"
                        >
                          Alex will explain you how to keep the HTML
                          structure and all that.
                        </span>
                      </span>
                      <!-- /media body -->

                      <span class="action-area h-100 min-w-80 text-right">
                        <span class="meta-date mb-1">12 hours ago</span>
                        <!-- Toggle Button -->
                        <span
                          class="toggle-button"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="Mark as read"
                        >
                          <span class="show"
                            ><i
                              class="icon icon-dot-o icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                          <span class="hide"
                            ><i
                              class="icon icon-dot icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                        </span>
                        <!-- /toggle button -->
                      </span>
                    </a>
                    <!-- /media -->

                    <!-- Media -->
                    <a href="javascript:void(0)" class="media">
                      <!-- Avatar -->
                      <img
                        class="dt-avatar mr-3"
                        src="https://via.placeholder.com/150x150"
                        alt="User"
                      />
                      <!-- avatar -->

                      <!-- Media Body -->
                      <span class="media-body text-truncate">
                        <span class="user-name mb-1">Domnic Brown</span>
                        <span
                          class="message text-light-gray text-truncate"
                          >Okay.. I will be waiting for your...</span
                        >
                      </span>
                      <!-- /media body -->

                      <span class="action-area h-100 min-w-80 text-right">
                        <span class="meta-date mb-1">yesterday</span>
                        <!-- Toggle Button -->
                        <span
                          class="toggle-button"
                          data-toggle="tooltip"
                          data-placement="left"
                          title=""
                          data-original-title="Mark as read"
                        >
                          <span class="show"
                            ><i
                              class="icon icon-dot-o icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                          <span class="hide"
                            ><i
                              class="icon icon-dot icon-fw f-10 text-light-gray"
                            ></i
                          ></span>
                        </span>
                        <!-- /toggle button -->
                      </span>
                    </a>
                    <!-- /media -->
                  </div>

                  <div class="ps__rail-x" style="left: 0px; bottom: 0px;">
                    <div
                      class="ps__thumb-x"
                      tabindex="0"
                      style="left: 0px; width: 0px;"
                    ></div>
                  </div>
                  <div class="ps__rail-y" style="top: 0px; right: 0px;">
                    <div
                      class="ps__thumb-y"
                      tabindex="0"
                      style="top: 0px; height: 0px;"
                    ></div>
                  </div>
                </div>
                <!-- /dropdown menu body -->

                <!-- Dropdown Menu Footer -->
                <div class="dropdown-menu-footer">
                  <a href="javascript:void(0)" class="card-link">
                    See All <i class="icon icon-arrow-right icon-fw"></i>
                  </a>
                </div>
                <!-- /dropdown menu footer -->
              </div>
              <!-- /dropdown option -->
            </li>
          </ul>
          <!-- /header menu -->

          <!-- Header Menu -->
          <ul class="dt-nav">
            <li class="dt-nav__item dropdown">
              <!-- Dropdown Link -->
              <a
                href="#"
                class="dt-nav__link dropdown-toggle no-arrow dt-avatar-wrapper"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img
                  class="dt-avatar size-30"
                  src="https://via.placeholder.com/150x150"
                  alt="Domnic Harris"
                />
                <span class="dt-avatar-info d-none d-sm-block">
                  <span class="dt-avatar-name">Bob Hyden</span>
                </span>
              </a>
              <!-- /dropdown link -->

              <!-- Dropdown Option -->
              <div class="dropdown-menu dropdown-menu-right">
                <div
                  class="dt-avatar-wrapper flex-nowrap p-6 mt-n2 bg-gradient-purple text-white rounded-top"
                >
                  <img
                    class="dt-avatar"
                    src="https://via.placeholder.com/150x150"
                    alt="Domnic Harris"
                  />
                  <span class="dt-avatar-info">
                    <span class="dt-avatar-name">Bob Hyden</span>
                    <span class="f-12">Administrator</span>
                  </span>
                </div>
                <a class="dropdown-item" href="javascript:void(0)">
                  <i class="icon icon-user icon-fw mr-2 mr-sm-1"></i
                  >Account
                </a>
                <a class="dropdown-item" href="javascript:void(0)">
                  <i class="icon icon-settings icon-fw mr-2 mr-sm-1"></i
                  >Setting
                </a>
                <a class="dropdown-item" href="page-login.html">
                  <i class="icon icon-editors icon-fw mr-2 mr-sm-1"></i
                  >Logout
                </a>
              </div>
              <!-- /dropdown option -->
            </li>
          </ul>
          <!-- /header menu -->
        </div>
        <!-- Header Menu Wrapper -->
      </div>
      <!-- /header toolbar -->
    </div>
    <!-- /header container -->`;
}
