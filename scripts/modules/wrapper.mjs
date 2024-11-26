import {MODULE} from "../module.mjs"
export class Wrapper {
    static NAME="Wrapper"

    static _trackValidationFailureWrapper(module){
        const orig = ClientIssues.prototype._trackValidationFailure;
        ClientIssues.prototype._trackValidationFailure = function(collection,source,error) {
          if (!module.api.invalidDocs[collection.name]) module.api.invalidDocs[collection.name] = new Map();
          module.api.invalidDocs[collection.name].set(source._id, {collection, source, error});
          orig.call(this,collection,source,error)
        }
    }

    static register(){
      const module = game.modules.get(MODULE.id);
      module.api.invalidDocs = {};
      this._trackValidationFailureWrapper(module);
    }
}