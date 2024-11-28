
/**
 * Main Module Organizational Tools
 */
//import { MyLogger } from './my-logger.js';

/**
 * Sub Modules
 */
import RicApp from "./modules/app.mjs";
import { ButtonInjector } from "./modules/button_injector.mjs";
import {Wrapper} from "./modules/wrapper.mjs"

/**
 * Sub Apps
 */
//import { MyDialog } from './apps/my-dialog.js';
export class MODULE {
  static id="ric"
  static SUB_MODULES = [
    RicApp,
    Wrapper,
    ButtonInjector
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
Hooks.once("init", () => {
  game.modules.get(MODULE.id).api = {};
  for (const SUB_MODULE of MODULE.SUB_MODULES) SUB_MODULE.register();

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

