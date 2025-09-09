## observatory.js

Light-weight, fast external addon framework

### What is this?

observatory.js is addon framework supports external imported addon with no additional dependency.

It's similar with Minecraft Plugin logic.

### Why I have to use it?

No, you don't need it probably.

observatory.js made for support external theme development for pastebin-like services.

### What if I HAVE TO use it?

Okay, don't say i didn't warned you.

observatory.js uses / supports external script from another dev, so it can cause serious damage to user, so first you have to make service filter.

Service filter is not part of observatory.js, so you have to make it - like regex filter, or site restriction, or else source code verification.

If service use this addon for self-developed addon system, it's fine to not use them.

### How can I make addon with it?

You have to include observatory.js at your public asset, or use CDN with it.

Unfortunatly, observatory.js not uploaded to CDN at this time - maybe I'll upload later.

If you successfully included / found script, import AddonBase from addon-base.js.

Do not forget only one addon allowed per file.

Here's some example addon:

```js
// You must configure addon.js url
// This sample built with same directory addon.
// It's recommended to edit sample code for smooth type support with JSDoc.
import {
  AddonBase,
  AddonEvent,
  GenericType,
  EventRegistrar,
} from "./addon-base.js";
export class SampleAddon extends AddonBase {
  /**
   * Returns name of addon.
   * @returns {string} Addon name
   */
  getName() {
    return "Sample addon";
  }

  /**
   * Returns description of addon.
   * @returns {string} Addon description
   */
  getDescription() {
    return "Hello, I'm sample addon!";
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
  onInit(event, registrar, isInitCalled) {
    /** @type {(event: AddonEvent) => any} */
    const initFunction = (event) => {
      console.log("Hello, observatory.js!");
    };
    // If it's late-init, just call initialization function
    if (isInitCalled) {
      initFunction();
    } else {
      // Or not, attatch initialization handler
      registrar.attachListener("init", initFunction);
    }
  }

  /**
   * Addon finalizer.
   * Addon manager will call this when addon removed.
   * @param {AddonEvent} event Disable event
   * @param {EventRegistrar} registrar Current registrar
   */
  onDisable(event, registrar) {
    console.log("Goodbye, observatory.js!");
  }
}

// !!IMPORTANT!! obserbatory.js detects addon with export default.
// You MUST export addon instance as default.
export default new SampleAddon();
```

## Enough - Then how can I register this addons?

It's simple, just create AddonManager instance and call register function.

Here's some example:

```js
import { AddonManager } from "./addon-management.js";

const manager = new AddonManager();
manager.enableAddon("./sample-addon.js");
```

And you're done. Enjoy your addon solution with security nightmares.

Good luck!
