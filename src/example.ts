import { startDiscovery, stopDiscovery, debug } from "./index";

debug( false );

console.log("=== start discovery");

startDiscovery( console.log );

setTimeout(async () => {
    await stopDiscovery();
    console.log("=== stop discovery");
}, 10000 );
