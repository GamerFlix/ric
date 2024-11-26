import {MODULE} from "../module.mjs"
export class RicApp {
    static NAME="RicApp"
    static renderApp(data){

      
      const buttons = data.map((data,index) => {
        console.log("source:",data.source)
        return {
          action: index,
          label: data.source?.name??data.source._id,
          callback: (event) => {
            _deleteInvalidDoc(event, ...arguments);
          },
        };
      });
      console.log(buttons)
      foundry.applications.api.DialogV2.wait({
        buttons: buttons,
        content: "...",
        render: (event, html) => html.querySelector(".form-footer").classList.add("flexcol"),
      });
    }

    _deleteInvalidDoc(collection,id){
      console.log(collection,id)
    }

    static register(){
        game.modules.get(MODULE.id).api.app=this.renderApp
    }
}