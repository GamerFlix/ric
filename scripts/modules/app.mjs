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
    const confirm= await foundry.applications.api.DialogV2.confirm({
      title: game.i18n.localize("RIC.APP.CONFIRM.AUTOFIX.TITLE"),
      content: game.i18n.localize("RIC.APP.CONFIRM.AUTOFIX.CONTENT")
    });
    if (confirm){
      const doc=errorData.collection.getInvalid(errorData.source._id)
      doc.update(doc.toObject(),{diff:false,recursive:false})
      ui.notifications.info(game.i18n.localize("RIC.NOTIF.AUTOFIX"))
    }

    // TODO.
  }

    /**
   * Handle manually fixing an error.
   * @this {RicApp}
   * @param {PointerEvent} event      The triggering click event.
   * @param {HTMLElement} target      The element that defined the data-action.
   */
    static #manualFix(event, target) {
      const {collectionName, id} = target.closest(".error").dataset;
      const errorData = this.retrieveError(collectionName, id);
      const failure=errorData.error.getFailure()
      let stuff=RicApp._traverseFailure(failure,{},0)
      
      console.log(stuff)

      // TODO.
    }
    static _traverseFailure(currentLevel,paths,depth){
      let maxDepth=10//arbitrary
      const currentValue=currentLevel.invalidValue
      if (currentValue===undefined){//not the actually invalid value
        for (const [key,value] of Object.entries(currentLevel.fields)){
          let newObj={}
          paths[key]=newObj
          console.log(paths)
          return RicApp._traverseFailure(value,newObj,depth+1)
        }
      }else{//Reached the invalid value
        console.log(paths)
        return paths, currentValue, depth
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
      title: game.i18n.localize("RIC.APP.CONFIRM.DELETION.TITLE"),
      content: game.i18n.localize("RIC.APP.CONFIRM.DELETION.CONTENT")
    });
    if (confirm){
      await errorData.collection.getInvalid(errorData.source._id).delete()
      ui.notifications.info(game.i18n.localize("RIC.NOTIF.DELETE"))
    }
  }
}
