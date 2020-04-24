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
			createHTML_TIENDA(usuario.tipo_perfil);
			break;

		default:
			break;
	}
}

function createHTML_TIENDA(typeProfile) {
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
        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/tienda/servicios/compras" class="dt-side-nav__link" title="Compras">
                <i class="icon icon-user-add icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Compra</span>
            </a>
        </li>
        <!-- Menu Item -->
        <!-- Menu Item -->
        <li class="dt-side-nav__item">
            <a href="${contextPah}app/tienda/servicios/ventas" class="dt-side-nav__link" title="Ventas">
                <i class="icon icon-user-add icon-fw icon-lg"></i>
                <span class="dt-side-nav__text">Venta</span>
            </a>
        </li>
        <!-- Menu Item -->
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
                <a href="${contextPah}app/tienda/mantenimientos/categorias" class="dt-side-nav__link" title="Categorias">
                    <i class="icon icon-user-add icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Categorias</span>
                </a>
            </li>
            <!-- Menu Item -->
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/mantenimientos/marcas" class="dt-side-nav__link" title="Marcas">
                    <i class="icon icon-user-add icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Marcas</span>
                </a>
            </li>
            <!-- Menu Item -->
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/mantenimientos/productos" class="dt-side-nav__link" title="Productos">
                    <i class="icon icon-news icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Productos</span>
                </a>
            </li>
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/mantenimientos/unidadmedidas" class="dt-side-nav__link" title="Unidad de Medida">
                    <i class="icon icon-camera icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Unidad de Medida</span>
                </a>
            </li>
            <li class="dt-side-nav__item">
                <a href="${contextPah}app/tienda/mantenimientos/personal" class="dt-side-nav__link" title="Personal">
                    <i class="icon icon-camera icon-fw icon-lg"></i>
                    <span class="dt-side-nav__text">Personal</span>
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
