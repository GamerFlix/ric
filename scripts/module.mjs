
/**
 * Main Module Organizational Tools
 */
//import { MyLogger } from './my-logger.js';

/**
 * Sub Modules
 */
import {Wrapper} from "./modules/wrapper.mjs"

/**
 * Sub Apps
 */
//import { MyDialog } from './apps/my-dialog.js';
export class MODULE {
  static id="ric"
  static SUB_MODULES = [
    Wrapper,
    //MyClass
  ];

  static SUB_APPS = {
     
  }
  
  static build() {
    //all startup tasks needed before sub module initialization
  }
}



/*
  Initialize Module
*/
MODULE.build();

/*
  Initialize all Sub Modules
*/
Hooks.on(`init`, () => {
  for (const SUB_MODULE of MODULE.SUB_MODULES) SUB_MODULE.register()

  //GlobalTesting (adds all imports to global scope)
  //Object.entries(MODULE.SUB_MODULES).forEach(([key, cl])=> window[key] = cl);
  //Object.entries(MODULE.SUB_APPS).forEach(([key, cl])=> window[key] = cl);
});



/*****Example Sub-Module Class******

export class MyClass {

  static register() {
    //all initialization tasks
  }
}

*/

