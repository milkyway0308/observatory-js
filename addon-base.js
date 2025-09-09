export class AddonType {}

export class GenericType extends AddonType {
  static INSTANCE = new GenericType();
}

/**
 * Addon event class. Provides utility for addon related event listener.
 */
export class AddonEvent extends Event {
  constructor() {
    super("addon");
  }

  /**
   * Find element by id from document.
   * @param {string} id Target class id
   * @returns {HTMLElement|undefined} Found elements, undefined if not exists
   */
  ofId(id) {
    return document.getElementById(id);
  }

  /**
   * Find element by class from document.
   * @param {string} className Target class name
   * @returns {HTMLElement[]} Found elements as array, empty if not exists
   */
  ofClass(className) {
    return document.getElementsByClassName(className);
  }

  /**
   * Find element by query from document.
   * @param {string} query CSS selector query
   * @returns {HTMLElement[]} Found elements as array, empty if not exists
   */
  ofQuery(query) {
    return document.querySelectorAll(query);
  }
}

/**
 * Event for initialization.
 */
export class InitializeEvent extends AddonEvent {}

/**
 * Event registry with mapped array.
 */
export class EventRegistrar {
  constructor() {
    /** @type  {Map<string, ((event: any) => any)[]} Event receiver container */
    this.__map = new Map();
  }

  /**
   * Attach event listener to specific event name.
   * Event name is not a javascript name. If you finding JS event registry, go to FriendlyHandler.
   * @param {string} name Event name to handle
   * @param {(event: any) => any} listener Event listener lambda
   */
  attachListener(name, listener) {
    if (!this.__map.has(name)) {
      this.__map.set(name, []);
    }
    this.__map.get(name).push(listener);
  }

  /**
   * Call event listener by name.
   * DO NOT call unchecked or invalid event object, EventRegistrar designed to use with one single type per event.
   * @param {string} eventName Event name to call
   * @param {any} event Event instance
   */
  call(eventName, event) {
    if (this.__map.has(eventName)) {
      for (let handler of this.__map.get(eventName)) {
        try {
          handler(event);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }

  /**
   * Call initialization event.
   * "init" event **must not** call manually.
   */
  callInit() {
    this.call("init", new InitializeEvent());
  }
}

/**
 * Basic of addon class.
 * Addon meant be plug-in, can be manually injected from external.
 */
export class AddonBase {
  /**
   * Returns name of addon.
   * @returns {string} Addon name
   */
  getName() {
    return "Unspecified";
  }

  /**
   * Returns description of addon.
   * @returns {string} Addon description
   */
  getDescription() {
    return "No description provided";
  }

  /**
   * Returns version of addon.
   * @returns {string} Addon version
   */
  getVersion() {
    return "1.0.0";
  }

  /**
   * Returns type of addon.
   * @returns {AddonType} Addon type, if project required
   */
  getAddonType() {
    return GenericType.INSTANCE;
  }

  /**
   * Addon initializer.
   * Addon manager will call this function when initialized.
   * @param {AddonEvent} event Initialization event
   * @param {EventRegistrar} registrar Current registrar
   * @param {boolean} isInitCalled Value check, 'true' if addon is late-loaded, 'false' if addon registered before system initialization
   */
  onInit(event, registrar, isInitCalled) {}

  /**
   * Addon finalizer.
   * Addon manager will call this when addon removed.
   * @param {AddonEvent} event Disable event
   * @param {EventRegistrar} registrar Current registrar
   */
  onDisable(event, registrar) {}
}

/**
 * Friendly handler for any node or element.
 * FriendlyHandler supports multiple listener attatchment, and makes easier to unregister handler.
 */
export class FriendlyHandler {
  /**
   * Initialize FriendlyHandler.
   * Not recommended to use, Use FriendlyHandler.of instead
   * @param {Node} node Target node
   */
  constructor(node) {
    /** @type {Node} */
    this.node = node;
    /** @type {Map<string, ((event: any) => any)[]>} */
    this.handlers = new Map();
  }

  /**
   * Create or fetch FriendlyHandler from element.
   * @param {Node} element Target node
   * @returns {FriendlyHandler} Attached FriendlyHandler instance
   */
  static of(element) {
    /** @type {FriendlyHandler} */
    let item = element.friendlyHandler;
    if (!item) {
      element.friendlyHandler = item = new FriendlyHandler(element);
    }
    return item;
  }

  /**
   * Attach JS based event handler to element.
   * @param {string} eventName Event name
   * @param {(event: any) => any} handler Event handler
   * @returns {() => any} Unregister handler
   */
  attach(eventName, handler) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
      console.log(this.node);
      this.node.addEventListener(eventName, (event) => {
        const specificHandlers = this.handlers.get(eventName);
        if (specificHandlers) {
          for (let handler of specificHandlers) {
            handler(event);
          }
        }
      });
    }
    const handlerList = this.handlers.get(eventName);
    handlerList.push(handler);
    return () => {
      const index = handlerList.indexOf(handler);
      if (index !== -1) {
        handlerList.splice(index, 1);
      }
    };
  }
}

/**
 * Stylesheet injection for addons.
 */
export class StyleSheet {
  /**
   *
   * @param {string} name Stylesheet name - recommended to use unique value
   */
  constructor(name) {
    this.styleSheet = this.getStyleSheet(name);
  }

  /**
   * Create stylesheet and return if not exists.
   * @param {string} name Stylesheet name
   * @returns Stylesheet instance
   */
  getStyleSheet(name) {
    if (!document.getElementById(name)) {
      const style = document.createElement("style");
      style.title = name;
      document.getElementsByTagName("head")[0].appendChild(style);
      return style;
    }
    return undefined;
  }

  /**
   * Inject CSS style.
   * @param {string} css Fully written CSS style 
   */
  insertRule(css) {
    this.styleSheet.innerHTML += css;
  }
}
