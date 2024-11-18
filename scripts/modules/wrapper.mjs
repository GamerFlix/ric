import {MODULE} from "../module.mjs"
export class Wrapper {
    static NAME="Wrapper"

    static _trackValidationFailureWrapper(module){
        const orig = ClientIssues.prototype._trackValidationFailure;
        ClientIssues.prototype._trackValidationFailure = function(collection,source,error) {
            if (!module.api.invalidDocs[collection.name]) module.api.invalidDocs[collection.name]=[]
            module.api.invalidDocs[collection.name].push({collection,source,error}) // add to the array
            //console.log(collection,source,error)
            orig.call(this,collection,source,error) 
        }
    }

    static register(){
        const module=game.modules.get(MODULE.id)
        if (!module.api) module.api={invalidDocs:{}}
        this._trackValidationFailureWrapper(module)
    }
}