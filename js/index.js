let nombre=prompt("ingrese su nombre")
let apellido=prompt("indique su apellido")
let edad=prompt("indique su edad")
if(edad<=17){
    console.log("no puede solicitar un credito, su edad no se lo permite")
}
let ingresos=prompt("indique sus ingresos")
let cantidad=prompt("ingrese la cantidad de cuotas")



if (ingresos<=500000){
    console.log("puede obtener un credito de 2000000")
}
else if(ingresos>500000 && ingresos <=1000000){
    console.log("puede obtener un credito de 5000000")
}
//se asume que el usuario tiene un ingreso mayor a mayor a 1000000
else{
    console.log("puede obtener un credito de 10000000")
}

//bucles
const montoInicial = 2000000;
const tasaMensual = 0.04;
const meses = 6;
let monto = montoInicial;
for (let i = 1; i <= meses; i++){
    monto += monto * tasaMensual;
    monto += monto * tasaMensual;
    monto += monto * tasaMensual;
    monto += monto * tasaMensual;
    monto += monto * tasaMensual;
    monto += monto * tasaMensual
    monto += monto
        console.log("usted pagara por mes 400000")
}