/**
* Funcion que captura las variables pasados por GET
* Devuelve un array de clave=>valor
*/


function getGET()
{
    // capturamos la url
    var loc = document.location.href;
    // si existe el interrogante
    if(loc.indexOf('?')>0)
    {
        // cogemos la parte de la url que hay despues del interrogante
        var getString = loc.split('?')[1];
        // obtenemos un array con cada clave=valor
        var GET = getString.split('&');
        var get = {};
        // recorremos todo el array de valores
        for(var i = 0, l = GET.length; i < l; i++){
            var tmp = GET[i].split('=');
            get[tmp[0]] = unescape(decodeURI(tmp[1]));
        }
        return get;
    }
}

function addNewstudent(){
    var name = document.getElementById('name').value;
    var enrollment = document.getElementById('enrollment').value;
    var valores=getGET();
    var database = firebase.database();
    var numero=0;
    var group = valores['v'];
    var userId = firebase.auth().currentUser;
    database.ref('/alumnos/'+ userId.displayName+'/numero').once('value',function(snapshot){
      snapshot.forEach(function(childsnapshot){
        var childkey = childsnapshot.val();
        numero = childkey+1;
        database.ref('/alumnos/' + userId.displayName +'/'+numero ).set({
          Nombre: name,
          Matricula: enrollment,
          Grupo: group
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            alert('Datos guardados correctamente');
            // Data saved successfully!
            location.reload(true);
          }
        });
        database.ref('/alumnos/' + userId.displayName +'/numero' ).set({
          numero: numero
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            alert('Datos guardados correctamente');

            // Data saved successfully!
          }
        });
      });
    }); 
}
function tabladealumnos(){
    firebase.auth().onAuthStateChanged(function(user) {
        // [START_EXCLUDE silent]
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
            var displayName = user.displayName;
            var database = firebase.database();
            // verifico cuantos numeros se encuentran disponibles para hacer un snapshot para cada alumno
            database.ref('/alumnos/'+displayName+'/numero').once('value',function(snapshot){
                snapshot.forEach(function(childsnapshot){
                    var childkey = childsnapshot.val();
                    for (let index = 1; index < childkey+1; index++) {
                        var database = firebase.database();
                        database.ref('/alumnos/' + displayName+'/'+index).once('value').then(function(snapshot) {
                            var username = snapshot.val();
                            var valores=getGET();
                            if (username['Grupo']==valores['v']) {
                              document.getElementById('table__get--students').insertAdjacentHTML('beforeend', `<tr>
                                <td>`+username['Nombre']+`</td>
                                <td id='fechas'>`+username['Matricula']+`</td>
                                <td>`+index+`</td>
                                <td><label class="label"><input id="check" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                                <td><label class="label"><input id="check" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                                <td><label class="label"><input id="check" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                                <td><label class="label"><input id="check" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                              </tr>`);
                            }
                          // $( "tr td:nth-child("+index+")" ).append( username['Nombre']);
                        });
                    }
                });
            }); 
        }
    });
}
window.onload = function(){
    // Cogemos los valores pasados por get
    var valores=getGET();
    if (valores['Carrera'] && valores['Grado'] && valores['Grupo']) {
        document.getElementById('title').innerHTML ="UTEZ | " + valores['Carrera']+" "+valores['Grado']+"°"+valores['Grupo'];
        document.getElementById('recivir').innerHTML= "Grupo:  " + valores['Carrera']+"  "+valores['Grado']+"°"+valores['Grupo'];
    } else {
        window.location.replace("https://salaxer.com/404.html");
    }

    tabladealumnos();
}
document.getElementById('add_student').addEventListener('click', addNewstudent, false);

function agregarfecha1(index,fecha_completa){

  var userId = firebase.auth().currentUser;
  if (!userId) {
    alert('Necesitas un nombre de usuario para poder crear un grupo, selecione uno en el apartado "Cuenta" ') 
    return;    
  }
  // var database = firebase.database();
  // var numero=0;
  // console.log('Primer paso');
  // database.ref('/fechas/'+ userId.displayName+'/numero').once('value',function(snapshot){
  //   snapshot.forEach(function(childsnapshot){
  //     var childkey = childsnapshot.val();
  //     numero = childkey+1;
  //     console.log('segundo paso');

  //     database.ref('/fechas/' + userId.displayName +'/'+numero ).set({
  //       fecha: fecha_completa
  //     },function(error) {
  //       if (error) {
  //         alert('Valio');
  //       } else {
  //         console.log('datos guardados correctamente');
  //         // Data saved successfully!
  //       }
  //     });
  //     database.ref('/fechas/' + userId.displayName+'/numero').set({
  //       numero: numero
  //     },function(error) {
  //       if (error) {
  //         alert('Valio');
  //       } else {
  //         // Data saved successfully!
  //       }
  //     });
  //   });
  // });                        
  // aqui me falta adios
}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

document.getElementById('save__calendar').addEventListener('click', function(){
  var dias = 32;
  for (let index = 1; index < dias; index++) {
    var id = ('input'+index);
    var element = document.getElementById(id).checked;
    if (element == true) {
      var mes = document.getElementById('month').innerHTML;
      var mesint = 0;
      // Se me dificulto la convercion mediante arrays y lo hice a mano por switch
      switch (mes) {
        case 'Enero':
          mesint = 1;
          break;
        case 'Febrero':
          mesint = 2;
          break;
        case 'Marzo':
          mesint = 3;
          break;
          case 'Abril':
          mesint = 4;
          break;
          case 'Mayo':
          mesint = 5;
          break;
          case 'Junio':
          mesint = 6;
          break;
          case 'Julio':
          mesint = 7;
          break;
          case 'Agosto':
          mesint = 8;
          break;
          case 'Septiembre':
          mesint = 9;
          break;
          case 'Octubre':
          mesint = 10;
          break;
          case 'Noviembre':
          mesint = 11;
          break;
          case 'Diciembre':
          mesint = 12;
          break;
        default:
          break;
      }
      var año = document.getElementById('year').innerHTML;
      // concateno mi mes con un cero  y con el slice solo agarro los ultimos dos digitos
      var mescont = ('0'+mesint).slice(-2);
      var fecha_completa = (index+'-'+mescont+'-'+año);
      console.log(index);
      agregarfecha1(index,fecha_completa);
      sleep(4000);
    }
  }
});