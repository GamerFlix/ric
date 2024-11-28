export default class RicApp extends foundry.applications.api.HandlebarsApplicationMixin(
  foundry.applications.api.ApplicationV2
) {
  /**
   * Register this module in the api.
   */
  static register() {
    game.modules.get("ric").api.Application = RicApp;
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    errorData: null,
    classes: ["ric"],
    window: {
      title: "RIC.APP.TITLE",
      icon: "fa-solid fa-wand-magic-sparkles",
    },
    position: {
      width: 800,
      height: "auto",
      left: 150,
      top: 150,
    },
    actions: {
      autoFix: RicApp.#autoFix,
      copyError: RicApp.#copyError,
      deleteError: RicApp.#deleteError,
      manualFix:RicApp.#manualFix
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    main: {
      template: "modules/ric/templates/ric-app-main.hbs",
      scrollable: [""],
      templates: [],
    },
  };

  /* -------------------------------------------------- */

  /**
   * Create a new instance of this application.
   * @returns {Promise<RicApp>}     A promise that resolves to the created application.
   */
  static async create() {
    const application = new this();
    return application.render({force: true});
  }

  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _prepareContext(options) {
    const context = {};

    const data = game.modules.get("ric").api.invalidDocs;

    const errors = [];
    for (const [name, map] of Object.entries(data)) {
      for (const data of map.values()) {
        errors.push({
          collectionName: name,
          id: data.source._id,
          label: data.source.name ?? data.source._id,
          error: data.error.message,
        });
      }
    }

    context.errors = errors;

    return context;
  }

  /* -------------------------------------------------- */

  /**
   * Retrieve error data.
   * @param {string} collectionName     The name of the collection.
   * @param {string} id                 The document's `_id` property.
   * @returns {ErrorData}
   */
  retrieveError(collectionName, id) {
    const data = game.modules.get("ric").api.invalidDocs[collectionName].get(id);
    return data;
  }

  /* -------------------------------------------------- */
  /*   Event handlers.                                  */
  /* -------------------------------------------------- */

  /**
   * Handle attempts to auto-fix an error.
   * @this {RicApp}
   * @param {PointerEvent} event      The triggering click event.
   * @param {HTMLElement} target      The element that defined the data-action.
   */
  static async #autoFix(event, target) {
    const {collectionName, id} = target.closest(".error").dataset;
    const errorData = this.retrieveError(collectionName, id);
    let paths={}
    RicApp._traverseFailure(errorData.error.getFailure(),paths)
    paths=foundry.utils.flattenObject(paths[""])//Can't use retrieveInvalidValues as it includes the irrelevant array check
    if (Object.keys(paths).includes("type")){
      ui.notifications.warn(game.i18n.format("RIC.NOTIF.CUSTOMTYPE"))
      return
    }

    const confirm= await foundry.applications.api.DialogV2.confirm({
      window:{title: "RIC.APP.CONFIRM.AUTOFIX.TITLE",icon:"a-solid fa-screwdriver-wrench"},
      content: game.i18n.localize("RIC.APP.CONFIRM.AUTOFIX.CONTENT"),
      modal:true
    });
    if (confirm){
      const doc=errorData.collection.getInvalid(errorData.source._id)
      doc.update(doc.toObject(),{diff:false,recursive:false})
      ui.notifications.info(game.i18n.localize("RIC.NOTIF.AUTOFIX"))
    }

    
  }

    /**
   * Handle manually fixing an error.
   * @this {RicApp}
   * @param {PointerEvent} event      The triggering click event.
   * @param {HTMLElement} target      The element that defined the data-action.
   */
    static async #manualFix(event, target) {
      const {collectionName, id} = target.closest(".error").dataset;
      const errorData = this.retrieveError(collectionName, id);
      const paths=RicApp._retrieveInvalidValues(errorData.error.getFailure())
      console.log(paths)
      if (Object.keys(paths).includes("type")){
        ui.notifications.warn(game.i18n.format("RIC.NOTIF.CUSTOMTYPE"))
        return
      }
      const doc=errorData.collection.getInvalid(errorData.source._id)
      //TODO: Localize this
      let content=`<p>${game.i18n.format("RIC.APP.CONFIRM.MANUALFIX.CONTENT")}</p>`
      for (const [path,value] of Object.entries(paths)){
        const field=path.startsWith("system.") ? doc.system.schema.getField(path.slice(7)) : doc.schema.getField(path);
        content+=field.toFormGroup({label: game.i18n.format(field.label) || "Invalid Value",hint:game.i18n.format(field.hint) || ""}, {name:path}).outerHTML+`<p class="hint">The current value is ${value}.</p>`
      }
      const data = await foundry.applications.api.DialogV2.prompt({
        window: {title: "RIC.APP.CONFIRM.MANUALFIX.TITLE",icon:"fa-solid fa-pen-to-square"},
        content: content,
        ok: {
          callback: (event, button) => new FormDataExtended(button.form).object
        }
      });
      console.log(data)
      await doc.update(data)
      ui.notifications.info(game.i18n.format("RIC.NOTIF.MANUALFIX"))
    }

    /**
   * Retrieve the invalid values and path to them
   * @this {RicApp}
   * @param {Failure} failure      ValidationFailure provided by Foundry
   * @returns {Object} paths Flattened object with the relevant paths as the key and the invalid value as the value
   */
    static _retrieveInvalidValues(failure) {
      if (foundry.utils.isEmpty(failure.fields)&&foundry.utils.isEmpty(failure.elements)&&!failure.invalidValue){
        ui.notifications.error(game.i18n.format("RIC.NOTIF.UNSALVAGEABLE"))
        return
      }
      //This entire section is a mess and a hack but it works
      let paths={}
      const [level,obj,key,containsArray]=RicApp._traverseFailure(failure,paths)
      
      if (containsArray){
        ui.notifications.warn(game.i18n.format("RIC.NOTIF.ARRAY"))
        return
      }
      paths=paths[""]//Did I mention this was a mess yet?
      paths=foundry.utils.flattenObject(paths)
      return paths
    }



  /**
   * Traverse the failure to retrieve the invalid value and path to the value.
   * @this {RicApp}
   * @param {Object} currentLevel
   * @param {Object} paths
   * @param {String} currentKey
   * @param {boolean} containsArray Whether the invalid path contains an array 
   * @return {Object,Object,String,Boolean}
   */
    static _traverseFailure(currentLevel,paths,currentKey="",containsArray=false){
      let maxDepth=10//arbitrary
      console.log("uncorrected level",currentLevel)
      if (!currentLevel.fields){//If field doesn't exist we have the weird structure you get from an array na dhave to go deeper
         currentLevel=currentLevel.failure
         containsArray=true
      }
      const currentValue=currentLevel.invalidValue
      if (currentValue===undefined){
        let fields=Object.entries(currentLevel.fields)
        fields=fields.concat(Object.entries(currentLevel.elements))
        for (const [key,value] of fields){
          paths[currentKey]={}
          return RicApp._traverseFailure(value,paths[currentKey],key,containsArray)
        }
      }else{
        paths[currentKey]=currentValue
        return [currentLevel,paths,currentKey,containsArray]
      }
    }
  /* -------------------------------------------------- */

  /**
   * Handle copying an error.
   * @this {RicApp}
   * @param {PointerEvent} event      The triggering click event.
   * @param {HTMLElement} target      The element that defined the data-action.
   */
  static #copyError(event, target) {
    const {collectionName, id} = target.closest(".error").dataset;
    const errorData = this.retrieveError(collectionName, id);
    const message = errorData.error.toString();
    game.clipboard.copyPlainText(message);
    ui.notifications.info("RIC.APP.COPIED_ERROR", {localize: true});
  }

  /**
   * Handle deletion.
   * @this {RicApp}
   * @param {PointerEvent} event      The triggering click event.
   * @param {HTMLElement} target      The element that defined the data-action.
   */
  static async #deleteError(event, target) {
    const {collectionName, id} = target.closest(".error").dataset;
    const errorData = this.retrieveError(collectionName, id);
    const confirm= await foundry.applications.api.DialogV2.confirm({
      window:{title: "RIC.APP.CONFIRM.DELETION.TITLE",icon:"fa-solid fa-trash"},
      content: game.i18n.localize("RIC.APP.CONFIRM.DELETION.CONTENT"),
      modal:true
    });
    if (confirm){
      await errorData.collection.getInvalid(errorData.source._id).delete()
      ui.notifications.info(game.i18n.localize("RIC.NOTIF.DELETE"))
    }
  }
}
