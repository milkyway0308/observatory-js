import { AddonBase, EventRegistrar } from "./addon-base.js";

class AddonManager {
  constructor() {
    /** @type {AddonBase[]} */
    this.enabledAddons = [];
    /** @type {AddonBase[]} */
    this.addons = [];
    /** @type {EventRegistrar} */
    this.registrar = new EventRegistrar();
    /** @type {boolean} */
    this.doesInitCalled = false;
  }

  /**
   * Find loaded addon.
   * @param {string} addonName Target addon name
   * @returns {AddonBase|undefined} Found addon or undefined
   */
  findAddon(addonName) {
    for (let addon of this.addons) {
      if (addon.getName() === addonName) {
        return addon;
      }
    }
    return undefined;
  }

  /**
   * Find enabled addon.
   * @param {string} addonName Target addon name
   * @returns {AddonBase|undefined} Found addon or undefined
   */
  findEnabledAddon(addonName) {
    for (let addon of this.enableAddon) {
      if (addon.getName() === addonName) {
        return addon;
      }
    }
    return undefined;
  }

  /**
   * Import addon. This function do not trigger init.
   * @param {string} addonUrl Target addon URL
   * @returns {Promise<AddonBase|Error>} Loaded addon or error
   */
  async importAddon(addonUrl) {
    try {
      const loaded = await import(addonUrl);
      if (!loaded.default) {
        return new Error("No exported module found");
      }
      if (loaded.default instanceof AddonBase) {
        return loaded.default;
      }
      return new Error("Not a addon");
    } catch (e) {
      return e;
    }
  }

  /**
   * Import addon, and add to loaded list. This function do not trigger init.
   * @param {string} addonUrl Target addon URL
   * @returns {Promise<AddonBase|Error>} Loaded addon or error
   */
  async loadAddon(addonUrl) {
    const addon = await importAddon(addonUrl);
    if (addon instanceof AddonBase) {
      addons += addon;
    }
    return addon;
  }

  /**
   * Load addon and trigger initialization.
   * @param {string} addonUrl Target addon URL
   * @returns {Promise<AddonBase|Error>} Loaded addon or error
   */
  async enableAddon(addonUrl) {
    const addon = await importAddon(addonUrl);
    if (addon instanceof AddonBase) {
      if (this.findEnabledAddon(addon)) {
        return new Error(`Already enabled (${addon.getName()})`);
      }
      if (!this.findAddon(addon)) {
        this.addons += addon;
      }
      this.enableAddon += addon;
      addon.onInit(new AddonEvent(), registrar, doesInitCalled);
    }
    return addon;
  }

  /**
   * Disable addon.
   * @param {AddonBase} addon Addon instance to disable
   * @returns {boolean} true if success, false if not enabled
   */
  async disableAddon(addon) {
    const index = this.enabledAddons.indexOf(addon);
    if (index === -1) {
      return false;
    }
    addon.onDisable(registrar);
    this.enableAddon.splice(index, 1);
    return true;
  }
}
