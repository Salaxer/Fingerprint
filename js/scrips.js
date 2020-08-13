// Parte de mi cabecera dinamica
$(document).ready(function(){
    // Mi document agarra toda mi pagina para hacer un anueva funcion
    // .offset()devuelve un objeto que contiene las propiedades topy left. en mi caso utizo mi top para ver si llega al valor > 0
	var altura = $('.sidebar').offset().top;
	
	$(window).on('scroll', function(){
		if ( $(window).scrollTop() > altura ){
        // La clase sidebar2 no lleva punto debido a que este lo especificamos con el addClass 
			$('.sidebar').addClass('sidebar2');
		} else {
			$('.sidebar').removeClass('sidebar2');
		}
	});
 
});
// Parte de mis pestañas o taps
$('.sidebar__ul li a:first').addClass('active');
$('.sidebar__ul li a:first').removeClass('a');
$('.secciones article').hide();
$('.secciones article:first').show();
$('.sidebar__ul li a').click(function(){
    // Aqui veririco si mi tab esta activa o no
    $('.sidebar__ul li a').removeClass('active');
    $('.sidebar__ul li a').addClass('a');
    
    $(this).addClass('active');
    $(this).removeClass('a');
	$('.secciones article').hide();
	var activeTab = $(this).attr('href');
	$(activeTab).show();
    return false;
});
    
// Parte de mi calendario
let monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'];

let currentDate = new Date();
let currentDay = currentDate.getDate();
let monthNumber = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

let dates = document.getElementById('dates');
let month = document.getElementById('month');
let year = document.getElementById('year');

let prevMonthDOM = document.getElementById('prev-month');
let nextMonthDOM = document.getElementById('next-month');

month.textContent = monthNames[monthNumber];
year.textContent = currentYear.toString();

prevMonthDOM.addEventListener('click', ()=>lastMonth());
nextMonthDOM.addEventListener('click', ()=>nextMonth());



const writeMonth = (month) => {

    for(let i = startDay(); i>0;i--){
        dates.innerHTML += ` <div class="calendar__item calendar__last-days">
            ${getTotalDays(monthNumber-1)-(i-1)}
        </div>`;
    }
    for(let i=1; i<=getTotalDays(month); i++){
        if(i===currentDay) {
            dates.innerHTML += `<label class="check-currentday"><input style="display:none" id="input${i}" type="checkbox">
            <div class="calendar__date calendar__item calendar__today" >${i}</div></label>`;
        }else{
            dates.innerHTML += `<label class="check-currentday"><input style="display:none" id="input${i}" type="checkbox">
            <div class="calendar__date calendar__item" >${i}</div></label>`;
        }
    }
}

const getTotalDays = month => {
    if(month === -1) month = 11;

    if (month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11) {
        return  31;

    } else if (month == 3 || month == 5 || month == 8 || month == 10) {
        return 30;

    } else {

        return isLeap() ? 29:28;
    }
}

const isLeap = () => {
    return ((currentYear % 100 !==0) && (currentYear % 4 === 0) || (currentYear % 400 === 0));
}

const startDay = () => {
    let start = new Date(currentYear, monthNumber, 1);
    return ((start.getDay()-1) === -1) ? 6 : start.getDay()-1;
}

const lastMonth = () => {
    if(monthNumber !== 0){
        monthNumber--;
    }else{
        monthNumber = 11;
        currentYear--;
    }

    setNewDate();
}

const nextMonth = () => {
    if(monthNumber !== 11){
        monthNumber++;
    }else{
        monthNumber = 0;
        currentYear++;
    }

    setNewDate();
}

const setNewDate = () => {
    currentDate.setFullYear(currentYear,monthNumber,currentDay);
    month.textContent = monthNames[monthNumber];
    year.textContent = currentYear.toString();
    dates.textContent = '';
    writeMonth(monthNumber);
}

writeMonth(monthNumber);


