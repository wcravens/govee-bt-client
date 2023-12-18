import noble from "@abandonware/noble";

// Govee H5074
const h5074_uuid_rev  = "88ec";
export const isHt5074 = (hex: string) => hex.includes(h5074_uuid_rev) && hex.length == 18; 

// Govee H5072/H5075
const h5075_uuid_rev  = "88ec";
export const isHt5075 = (hex: string) => hex.includes(h5075_uuid_rev) && hex.length == 16;

// Govee H5100/H5101/H5102
const h5101_uuid_rev  = "0100";
export const isHt5101 = (hex: string) => hex.includes(h5101_uuid_rev); 

// Govee H5179
const h5179_uuid_rev  = "0188";
export const isHt5179 = (hex: string) => hex.includes(h5179_uuid_rev) && hex.length == 22; 

export const isValidPeripheral = (peripheral: noble.Peripheral) => {
    const { address, advertisement } = peripheral;

    if (!advertisement || !advertisement.manufacturerData) {
        return false;
    }

    const hex = advertisement.manufacturerData.toString("hex");

    if (!isHt5074(hex) && !isHt5075(hex) && !isHt5101(hex) && !isHt5179(hex)) {
        return false;
    }

    return true;
};