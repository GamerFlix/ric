import {MODULE} from "../module.mjs"

export class ButtonInjector{
    /**
     *
     * @param {Application} app
     * @param {HTMLElement|jQuery} html
     * @param {FuckIfIknow} stuff
     */
    static _buttonInjection(app,html,stuff){
        if (game.release.generation < 13) html = html[0];
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
        //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        //https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
        const button = document.createElement("BUTTON");
        button.classList.add("ric", "fix-button");
        button.type = "button";
        button.innerHTML = `<i class="fa-solid fa-screwdriver-wrench"></i> Inspect, Reflect, Correct!`;

        button.addEventListener("click", event => {game.modules.get(MODULE.id).api.Application.create()});
        const parentElement=html.querySelector('div[data-tab="documents"]')
        parentElement.insertAdjacentElement("afterbegin", button);

        if (foundry.utils.isEmpty(game.modules.get(MODULE.id).api.invalidDocs)){
             button.disabled=true // disable button
             button.dataset.tooltip="RIC.LAUNCHER.DISABLED"
        }else{
             button.dataset.tooltip="RIC.LAUNCHER.ENABLED"
        }
    }
    /**
     *
     */
    static register(){
        Hooks.on("renderSupportDetails",ButtonInjector._buttonInjection)
    }
}
