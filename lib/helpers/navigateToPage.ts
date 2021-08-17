import { NextRouter } from "next/dist/client/router";

export function navigateToPage(router: NextRouter, path) {
  router.push(path);
}
