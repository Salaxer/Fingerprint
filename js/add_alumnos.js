/**
* Funcion que captura las variables pasados por GET
* Devuelve un array de clave=>valor
*/
function initApp(){
  // Listening for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    // [START_EXCLUDE silent]
    // [END_EXCLUDE]
    if (user) {
      // User is signed in.

      var displayName = user.displayName;
      var database = firebase.database();
      var number = database.ref('/fechas/' + displayName+'/numero/').child('numero');
      var datoreal = 2;
      number.on('value', snap =>{
        datoreal = snap.val();
        console.log(datoreal);
        return;
      });
    }
  });
}

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
        const inicia = 0;
        database.ref('/alumnos/' + userId.displayName +'/'+numero+'/fechas' ).set({
          numero: inicia
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            alert('Datos guardados correctamente');
            location.reload(true);
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
            var number = database.ref('/fechas/' + displayName+'/numero/').child('numero');
            number.once('value', snap =>{
              datoreal = snap.val();
              var h = 1;
              // aqui completo las fechas asignadas de cada profesor
              for (let i = 1; i < datoreal+1; i++) {
                database.ref('/fechas/' + displayName+'/'+i).once('value').then(function(snapshot) {
                  var fechas = snapshot.val();
                  var valores=getGET();
                  if (valores['v']==fechas['grupo']) {
                    document.getElementById('column').innerHTML = h;
                    document.getElementById('table__get--dates').insertAdjacentHTML('beforeend', `<th><p class="verticalText" id="fechasprofe`+h+`">`+fechas['fecha']+`</p></th>`);
                    h = h+1;
                  }
                });
              }
            });
            // verifico cuantos numeros se encuentran disponibles para hacer un snapshot para cada alumno
            database.ref('/alumnos/'+displayName+'/numero').once('value',function(snapshot){
              snapshot.forEach(function(childsnapshot){
                var childkey = childsnapshot.val();
                let column = 0;
                // el index tiene el numero de alumnos registrados
                 for (let index = 1; index < childkey+1; index++) {
                    var database = firebase.database();
                    // obtengo los valores de cada alumno individualmente
                    database.ref('/alumnos/' + displayName+'/'+index).once('value').then(function(snapshot) {
                      var username = snapshot.val();
                      var valores=getGET();
                      if (username['Grupo']==valores['v']) {
                        document.getElementById('table__get--students').insertAdjacentHTML('beforeend', `<tr id='fechas`+index+`'>
                          <td>`+username['Nombre']+`</td>
                          <td>`+username['Matricula']+`</td>
                          <td id='idalumno${index}'>`+index+`</td>
                        </tr>`);
                        column = column + 1;
                        // aqui le agrego un valor a filas que seria la parte superior
                        document.getElementById('filas').innerHTML = column;
                        // recibo el numero de fechas a verificar qu
                        datoreal = document.getElementById('filas').innerHTML;
                        // despues de obtener el dato real de las fechas me voy a cada alumno
                        for (let j = 1; j < datoreal+1; j++) {
                           // de cada alumno obtengo las fechas que este tiene registradas
                          database.ref('/alumnos/' + displayName+'/'+index+'/fechas/'+j+'/fecha').once('value', snap =>{
                            var fechasprof =('fechasprofe'+j);
                            var f = fechasprof.toString()
                            var fechasprofe = document.getElementById(f).innerHTML;
                            var fechas = snap.val();
                            if (fechas == fechasprofe) {
                              document.getElementById('fechas'+index).insertAdjacentHTML('beforeend', `<td>
                                <label class="label"><input id="${index}check${j}" class="label__check" type="checkbox" checked><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                              `);
                            }else{
                              document.getElementById('fechas'+index).insertAdjacentHTML('beforeend', `<td>
                                <label class="label"><input id="${index}check${j}" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
                              `);
                            }
                          });
                        }
                      }
                    });
                }
              });
            }); 
        }
    });
}
// for (let number = 1; number < fecha_completa+1; number++) {
//   // de cada una voy a verificar cuales son las de este grupo
//   database.ref('/fechas/' + displayName+'/'+number).child('grupo').once('value', snap =>{
//     grupo=snap.val();
//     if (valores['v']==grupo) {
//       numerodefechas=numerodefechas+1;
//       // ya se cuantas fechas tengo actualmente
//       // despues de obtener el dato total de las fechas con su grupo me voy a cada alumno
//       database.ref('/alumnos/' + displayName+'/'+index+'/fechas/'+numerodefechas+'/fecha').once('value', snap =>{
//         var fechasprof =('fechasprofe'+numerodefechas);
//         var f = fechasprof.toString();
//         var fechasprofe = document.getElementById(f).innerHTML;
//         var fechass = snap.val();
//         console.log(numerodefechas);
//         console.log(index);
//         console.log(fechass);
//         console.log(fechasprofe);
//         if (fechas == fechasprofe) {
//           document.getElementById('fechas'+index).insertAdjacentHTML('beforeend', `<td>
//             <label class="label"><input id="${index}check${numerodefechas}" class="label__check" type="checkbox" checked><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
//           `);
//         }else{
//           document.getElementById('fechas'+index).insertAdjacentHTML('beforeend', `<td>
//             <label class="label"><input id="${index}check${numerodefechas}" class="label__check" type="checkbox"><i class="fas fa-check" id="accepted"></i><i id="notaccepted" class="fas fa-times"></i></label></td>
//           `);
//         }
//       });
//     }
//   });  
// }
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
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
    initApp();
}

document.getElementById('add_student').addEventListener('click', addNewstudent, false);

// aqui es para agregar las fechas en el grupo que requiero
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
      var datoreal = 0;
      var fecha_completa = (index+'-'+mescont+'-'+año);
      var userId = firebase.auth().currentUser;
      var database = firebase.database();
      var number = database.ref('/fechas/' + userId.displayName+'/numero/').child('numero');
      number.on('value', snap =>{
        datoreal = snap.val();
        console.log(datoreal);
        return;
      });
      var valores=getGET();
      var grupo = valores['v'];
      var numero = datoreal + 1; 
      database.ref('/fechas/' + userId.displayName +'/'+numero ).set({
        fecha: fecha_completa,
        grupo:grupo
      },function(error) {
        if (error) {
          alert('Valio');
        } else {
          console.log('datos guardados correctamente');
          // Data saved successfully!
        }
      });
      database.ref('/fechas/' + userId.displayName+'/numero').set({
        numero: numero
      },function(error) {
        if (error) {
          alert('Valio');
        } else {
          // Data saved successfully!
        }
      });
    }
  }
});

document.getElementById('justify_student').addEventListener('click', function(){
  var database = firebase.database();
  var userId = firebase.auth().currentUser;
  var filas = parseInt(document.getElementById('filas').innerHTML);
  var columnas = parseInt(document.getElementById('column').innerHTML);
  for (let filas1 = 1; filas1 < filas+1; filas1++) {
    for (let columna1 = 1; columna1 < columnas+1; columna1++) {
      var id = (filas1+'check'+columna1);
      var fechas1 = 'fechasprofe'+columna1;
      console.log(fechas1);
      var fechas = document.getElementById(fechas1).innerHTML;
      var element = document.getElementById(id).checked; 
      if(element==true){
        database.ref('/alumnos/' + userId.displayName +'/'+filas1+'/fechas/'+columna1).set({
          fecha: fechas
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            console.log('datos guardados correctamente');
            // Data saved successfully!
          }
        });
      }
    }
  }
});
