
function showAlertTopEnd(type, message, timer = 4000) {
    showAlertTop(type, message, timer, 'top-end');
}

function showAlertTop(type, message, timer_, position_) {
    const Toast = Swal.mixin({
        toast: true,
        position: position_,
        showConfirmButton: false,
        timer: timer_
    });

    //8 PALABRAS COMO MAXIMO POR FILA
    if (message.split(' ').length > 6) {
        Toast.fire({
            type: type,
            title: getTextHtmlFormat(message, 6)
        })
    } else {
        Toast.fire({
            type: type,
            title: message
        })
    }
}

function showAlertDelete(idmodal) {
    Swal.fire({
        title: '¿Desea eliminar este registro?',
        text: "No podrás revertir una vez confirmado!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, continuar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.value) {
            $('#' + idmodal).modal("show");
        }
    })
    //$('.swal2-confirm').css("margin-right", "15px");
}

function getTextHtmlFormat(text, count_palabras_for_row) {
    let values_palabras = text.split(' ');
    let text_formatter = "";
    let multiplo = 1;
    values_palabras.forEach(function (value, index) {
        if (index == ((count_palabras_for_row * multiplo) - 1)) {
            text_formatter += " " + value + "<br>";
            multiplo++;
        } else {
            text_formatter += " " + value;
        }
    });
    return text_formatter;
}

function showAlertErrorRequest() {
    showAlertTopEnd('error', "Error interno al procesar la solicitud");
}
