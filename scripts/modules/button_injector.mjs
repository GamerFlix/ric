import {MODULE} from "../module.mjs"

export class ButtonInjector{
    /**
     * 
     * @param {Application} app 
     * @param {Jquery Object} html 
     * @param {FuckIfIknow} stuff 
     */
    static _buttonInjection(app,html,stuff){
        //console.log(html)
        //https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
        //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
        //https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement
        const button = document.createElement("BUTTON");
        button.classList.add("ric", "fix-button");
        button.type = "button";
        button.innerHTML = `<i class="fa-solid fa-screwdriver-wrench"></i> Inspect, Reflect, Correct!`;

        button.addEventListener("click", event => {game.modules.get(MODULE.id).api.Application.create()});
        let parentElement
        if(foundry.utils.isNewerVersion(game.version,"13")){
            parentElement=html.querySelector('div[data-tab="documents"]')
        }else{
            parentElement=html[0].querySelector('div[data-tab="documents"]')
        }
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
