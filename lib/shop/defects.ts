// Every planted Gym Shop defect, keyed by what it breaks. Each one lists the
// bug flags that switch it on (see lib/bug.ts). Several lessons may share one
// defect; the capstone flags reuse many of them.
export const defects = {
  // Navigation & catalog
  cartLinkWrong: ["05-navigation:1"],
  productLinkWrong: ["05-navigation:2"],
  accountNoRedirect: ["05-navigation:3.1"],
  loginIgnoresNext: ["05-navigation:3.2"],
  addsWrongProduct: ["06-locator-strategy:1"],
  searchIgnored: ["06-locator-strategy:2", "21-fixtures:1", "29-capstone:1"],
  saleBadgeMissing: ["06-locator-strategy:3"],
  catalogNeverLoads: ["08-auto-waiting:1"],
  reviewsNeverLoad: ["08-auto-waiting:2"],
  stockCheckHangs: ["08-auto-waiting:3"],
  ignoresApiResponse: ["15-network-mocking:1"],
  errorShownAsEmpty: ["15-network-mocking:2"],
  freeShownAsZero: ["15-network-mocking:3"],
  searchDropsLastResult: ["19-data-driven:1"],
  detailPriceWrong: ["29-capstone:2"],
  // API
  apiDropsKettlebell: ["16-api-testing:1"],
  cartPostIgnoresQuantity: ["16-api-testing:2", "21-fixtures:3.2"],
  loginAcceptsWrongPassword: ["16-api-testing:3", "29-capstone:7"],
  // Session
  loginStoresNoSession: ["17-auth-storage:1"],
  logoutKeepsSession: ["17-auth-storage:2"],
  sessionCookieWrongPath: ["17-auth-storage:3"],
  apiLoginNoCookie: ["21-fixtures:2"],
  loginLeaksGlobally: ["26-contexts:3"],
  // Cart
  cartStartsWithLeftover: ["18-hooks:1"],
  checkoutLinkMissing: ["18-hooks:2"],
  removeIgnored: ["18-hooks:3.1"],
  removeClearsCart: ["18-hooks:3.2"],
  gym20GivesTen: ["19-data-driven:2.1"],
  lowercaseCodeRejected: ["19-data-driven:2.2"],
  cartBadgeStale: ["20-page-objects:1"],
  totalNotRecalculated: ["20-page-objects:2", "20-page-objects:3.2", "29-capstone:3"],
  discountIgnored: ["20-page-objects:3.1", "29-capstone:4"],
  cartShowsQuantityOne: ["21-fixtures:3.1"],
  // Checkout & account
  usShippingWrong: ["19-data-driven:3.1"],
  germanyExpressWrong: ["19-data-driven:3.2"],
  checkoutAcceptsInvalidEmail: ["29-capstone:5"],
  orderNumberMissing: ["29-capstone:6"],
  settingsToastMissing: ["29-capstone:8"]
} as const;

export type Defect = keyof typeof defects;
