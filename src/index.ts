import noble from "@abandonware/noble";
import { isHt5075, isHt5101, isValidPeripheral } from "./validation";
import { decodeAny } from "./decode";

process.env.NOBLE_REPORT_ALL_HCI_EVENTS = "1"; // needed on Linux including Raspberry Pi

const h5075_uuid = "ec88";
const h5101_uuid = "0001";

let DEBUG = false;

let discoverCallback: undefined | Function; 
let scanStartCallback: undefined | Function;
let scanStopCallback: undefined | Function;

const registered_device_names  = [ 'GVH5075_03BC', 'GVH5102_57AE', 'Govee_H5074_7272', 'Govee_H5074_0779' ];

noble.on("discover", async (peripheral) => {
    if ( typeof peripheral.advertisement.localName == 'undefined' && !peripheral.advertisement.localName ) {
      return;
    }

    if ( !registered_device_names.includes( peripheral.advertisement.localName ) ) {
      return;
    }

    const { id, uuid, address, state, rssi, advertisement } = peripheral;
    if (DEBUG) {
        console.log("discovered", id, uuid, address, state, rssi);
    }

    if (!isValidPeripheral(peripheral)) {
        if (DEBUG) {
            let mfgData;
            if (advertisement.manufacturerData) {
                mfgData = advertisement.manufacturerData.toString("hex");
            }
            console.log(`invalid peripheral, manufacturerData=[${mfgData}]`);
        }
        return;
    }

    const { localName, manufacturerData } = advertisement;

    const streamUpdate = manufacturerData.toString("hex");

    if (DEBUG) {
        console.log(`${id}: ${streamUpdate}`);
    }

    const decodedValues = decodeAny(streamUpdate);

    const current = {
        uuid,
        address,
        model: localName,
        battery: decodedValues.battery,
        humidity: decodedValues.humidity,
        tempInC: decodedValues.tempInC,
        tempInF: decodedValues.tempInF,
        rssi,
    };

    if (discoverCallback) {
        discoverCallback(current);
    }
});

noble.on("scanStart", () => {
    if (DEBUG) {
        console.log("scanStart");
    }
    if (scanStartCallback) {
        scanStartCallback();
    }
});

noble.on("scanStop", () => {
    if (DEBUG) {
        console.log("scanStop");
    }
    if (scanStopCallback) {
        scanStopCallback();
    }
});

export const debug = (on: boolean) => {
    DEBUG = on;
};

export const startDiscovery = async ( callback: Function ) => {
    discoverCallback = callback;
    await noble.startScanningAsync([h5075_uuid, h5101_uuid], true);
};

export const stopDiscovery = async () => {
    await noble.stopScanningAsync();

    discoverCallback = undefined;
    scanStartCallback = undefined;
    scanStopCallback = undefined;
};

export const registerScanStart = (callback: Function) => {
    scanStartCallback = callback;
};

export const registerScanStop = (callback: Function) => {
    scanStopCallback = callback;
};