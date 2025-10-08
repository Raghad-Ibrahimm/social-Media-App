
import bootstrap from "./app.controller";

///============================ first way to create uniqe===> OTP third part module=================================
// import { v4 as uuidv4 } from 'uuid';  
// console.log(uuidv4().replace(/\D/g,"").slice(0,6));
///============================ second way to create uniqe===> OTP js method =================================
// console.log(Math.floor(Math.random()* (999999 -100000 +1)+10000));


bootstrap()