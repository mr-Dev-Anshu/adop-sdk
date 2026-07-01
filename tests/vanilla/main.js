import RastaDikhao from "../../src/index.js";
import BuilderMode from "../../src/builder/BuilderMode.js";
import PauseManager from "../../src/builder/PauseManager.js";
import RouteObserver from "../../src/Observer/RouteObserver.js";

const sdk = RastaDikhao.init({
  apiKey: "tenant123",
  debug: true,
});

// const observer = new RouteObserver((route) => {
//   console.log("Builder received:", route);
// });

// observer.start();
