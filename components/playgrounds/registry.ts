import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Lessons without an entry here use the Gym Shop (see ShopLauncher).
export const playgrounds: Record<string, ComponentType> = {
  "01-setup": dynamic(() => import("./01-setup")),
  "02-test-anatomy": dynamic(() => import("./02-test-anatomy")),
  "03-selectors": dynamic(() => import("./03-selectors")),
  "04-forms": dynamic(() => import("./04-forms")),
  "07-assertions": dynamic(() => import("./07-assertions")),
  "09-toast": dynamic(() => import("./09-toast")),
  "10-keyboard-mouse": dynamic(() => import("./10-keyboard-mouse")),
  "11-dialogs-files": dynamic(() => import("./11-dialogs-files")),
  "12-iframe": dynamic(() => import("./12-iframe")),
  "13-shadow-dom": dynamic(() => import("./13-shadow-dom")),
  "14-popups": dynamic(() => import("./14-popups")),
  "22-visual": dynamic(() => import("./22-visual")),
  "23-accessibility": dynamic(() => import("./23-accessibility")),
  "24-emulation-clock": dynamic(() => import("./24-emulation-clock")),
  "25-debugging": dynamic(() => import("./25-debugging")),
  "26-contexts": dynamic(() => import("./26-contexts")),
  "27-config-ci": dynamic(() => import("./27-config-ci")),
  "28-flaky-clinic": dynamic(() => import("./28-flaky-clinic"))
};
