
function initApp() {
    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.

        var displayName = user.displayName;
        var email = user.email;
        document.getElementById('email_edit-input').placeholder = email;
        if (displayName) {
          document.getElementById('name_edit').style.display='none';
          document.getElementById('name_title').textContent = displayName;
        } else {
          document.getElementById('name_title').textContent = email;
        }
        if (displayName) {
          document.getElementById('name_edit-input').placeholder = displayName;
        } else {
          document.getElementById('name_edit-input').placeholder = 'Edita tu nombre';
        }
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        if (!emailVerified) {
          // Debes de verificar tu email
          document.getElementById("email_verify").style.visibility = "visible";
        }else{
          document.getElementById("email_verify").style.visibility = "hidden";
        }
        // carga de los datos de la tap grupos
        var database = firebase.database();
        database.ref('/grupos/'+displayName+'/numero').once('value',function(snapshot){
          snapshot.forEach(function(childsnapshot){
            var childkey = childsnapshot.val();
            for (let index = 1; index < childkey+1; index++) {
              var database = firebase.database();

              database.ref('/grupos/' + displayName+'/'+index).once('value').then(function(snapshot) {
                var username = snapshot.val();
                document.getElementById('article_groups').insertAdjacentHTML('afterbegin', `<div class="groups__ind">
                    <a href="./add_alumnos.html?v=`+ index +`&Carrera=`+ username['Carrera'] +`&Grado=`+username['Grado']+`&Grupo=`+username['Grupo']+`"  id="">
                      <p>`+ username['Carrera'] +`</p>
                      <p>`+ username['Grado'] +`°`+username['Grupo']+`</p>
                    </a>
                  </div> `);
              });
            }
          });
        }); 
      } else {
        // User is signed out.
        window.location.replace("https://salaxer.com/Iniciosesion.html");
      }
      // [START_EXCLUDE silent]
      // [END_EXCLUDE]
    });
    // [END authstatelistener]
  }
  window.onload = function() {
    initApp();
  };
  function EditName(){
    alert('Recuerda que solo podras cambiar tu nombre una vez, escogelo bien');
    document.getElementById('name_edit-input').disabled = false;
    document.getElementById('save_changes').disabled = false; 
    document.getElementById('cancel_changes').disabled = false; 
  }
  function EditEmail(){
    document.getElementById('email_edit-input').disabled = false;
    document.getElementById('save_changes').disabled = false; 
    document.getElementById('cancel_changes').disabled = false; 
  }
  function cancel(){
    var user = firebase.auth().currentUser;
    var displayName = user.displayName;
    var email = user.email;
    document.getElementById('email_edit-input').placeholder = email;
    if (displayName) {
      document.getElementById('name_edit-input').placeholder = displayName;
    } else {
      document.getElementById('name_edit-input').placeholder = 'Edita tu nombre';
    }
    document.getElementById('email_edit-input').disabled = true;
    document.getElementById('name_edit-input').disabled = true;
    document.getElementById('save_changes').disabled = true; 
    document.getElementById('cancel_changes').disabled = true; 
  }
  function save(){
    var name = document.getElementById('name_edit-input').value;
    var email = document.getElementById('email_edit-input').value;
    var user = firebase.auth().currentUser;
    if (name) {
        user.updateProfile({
        displayName: name,
      }).then(function() {
        // Update successful
        var userId = firebase.auth().currentUser;
        var database = firebase.database();
        var numero=0;
        database.ref('/alumnos/' + userId.displayName +"/numero" ).set({
          numero: numero
        },function(error) {
          if (error) {
            alert('No se pudieron guardar los datos');
          } else {
            alert('Los datos se guardaron correctamente');
            // Data saved successfully!
          }
        });
        database.ref('/grupos/' + userId.displayName +"/numero" ).set({
          numero: numero
        },function(error) {
          if (error) {
            alert('No se pudieron guardar los datos');
          } else {
            alert('Los datos se guardaron correctamente');
            // Data saved successfully!
          }
        });
        database.ref('/fechas/' + userId.displayName ).set({
          numero: numero
        },function(error) {
          if (error) {
            alert('No se pudieron guardar los datos');
          } else {
            alert('Los datos se guardaron correctamente');
            // Data saved successfully!
          }
        });
        alert('Se actualizo correctamente tu nombre, Ya no podras volverlo a cambiar')
        cancel();
      }).catch(function(error) {
        alert('Tuvimos un error al prosesar tu nombre, porfavor intenta con otro')
      });
    }
    if (email) {
      user.updateEmail(email).then(function() {
        alert('se actualizo tu correo electronico correctamente')
        firebase.auth().signOut();
        
      }).catch(function(error) {
        alert('porfavor vuelve a intentarlo con otro correo electronico')
      });
    }
  }
  document.getElementById('name_edit').addEventListener('click', EditName, false);
  document.getElementById('email_edit').addEventListener('click', EditEmail, false);
  document.getElementById('cancel_changes').addEventListener('click', cancel, false);
  document.getElementById('save_changes').addEventListener('click', save, false);
  function sendPasswordReset() {
    var user = firebase.auth().currentUser;
    var email = user.email;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Se ha enviado enviando a tu correo un link para reestablecer tu contraseña');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }
  function addNewgroup(){
    var carr = document.getElementById('carrera').value;
    var grad = document.getElementById('grado').value;
    var group = document.getElementById('grupo').value;
    
    var userId = firebase.auth().currentUser;
    if (!userId.displayName) {
      alert('Necesitas un nombre de usuario para poder crear un grupo, selecione uno en el apartado "Cuenta" ') 
      return;    
    }
    var database = firebase.database();
    var numero=0;
    database.ref('/grupos/'+ userId.displayName+'/numero').once('value',function(snapshot){
      snapshot.forEach(function(childsnapshot){
        var childkey = childsnapshot.val();
        numero = childkey+1;
        database.ref('/grupos/' + userId.displayName +'/'+numero ).set({
          Carrera: carr,
          Grado: grad,
          Grupo: group
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            alert('Grupo agregado correctamente');
            // Data saved successfully!
          }
        });
        database.ref('/grupos/' + userId.displayName +'/numero' ).set({
          numero: numero
        },function(error) {
          if (error) {
            alert('Valio');
          } else {
            alert('Grupo agregado correctamente');
            location.reload(true);
            // Data saved successfully!
          }
        });
      });
    }); 
  }
  document.getElementById('password_edit').addEventListener('click', sendPasswordReset, false);
  document.getElementById('add_group').addEventListener('click', addNewgroup, false);
function editfinger() {
  document.getElementById('huellas_dactilares').disabled = false;
  document.getElementById('Agregar_huellas').disabled = false;
}
function addfingerprint() {
  var id = document.getElementById('huellas_dactilares').value;
  var userId = firebase.auth().currentUser;
    if (!userId.displayName) {
      alert('Necesitas un nombre de usuario para poder crear un grupo, selecione uno en el apartado "Cuenta" ') 
      return;    
    }
    var database = firebase.database();
    database.ref('/Huella/' + id).set({
      profe: userId.displayName
    },function(error) {
      if (error) {
        alert('Valio');
      } else {
        alert('Dispositivo agregado correctamente');
        location.reload(true);
        // Data saved successfully!
      }
    });
}
  document.getElementById('huellas_edit').addEventListener('click', editfinger, false);
  document.getElementById('Agregar_huellas').addEventListener('click', addfingerprint, false);

