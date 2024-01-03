import { startDiscovery, stopDiscovery, debug } from "./index";

console.log("=== start discovery");

startDiscovery( console.log );

setTimeout(async () => {
    await stopDiscovery();
    console.log("=== stop discovery");
}, 60000);
