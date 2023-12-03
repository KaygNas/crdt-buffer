#![feature(slice_flatten)]
#![feature(associated_type_defaults)]

use wasm_bindgen::prelude::*;
mod crdt_data;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

#[wasm_bindgen]
pub fn state_to_bytes(value: JsValue, width: JsValue) -> Vec<u8> {
    let result = serde_wasm_bindgen::from_value::<crdt_data::PixelDataState>(value);
    let width = serde_wasm_bindgen::from_value::<u16>(width);

    if let Err(err) = width {
        error(&err.to_string());
        return Vec::new();
    }

    let width = width.unwrap();

    match result {
        Ok(data) => {
            let data = crdt_data::CRDTData::from_pixel_data_state(&data, width);
            match crdt_data::chunk::to_bytes(&data) {
                Ok(bytes) => bytes,
                Err(err) => {
                    error(&err);
                    Vec::new()
                }
            }
        }
        Err(err) => {
            error(&err.to_string());
            Vec::new()
        }
    }
}

#[wasm_bindgen]
pub fn bytes_to_state(value: JsValue) -> JsValue {
    let bytes = match serde_wasm_bindgen::from_value::<Vec<u8>>(value) {
        Ok(bytes) => bytes,
        Err(err) => {
            error(&err.to_string());
            return JsValue::UNDEFINED;
        }
    };
    match crdt_data::chunk::from_bytes(&bytes) {
        Ok(data) => {
            let data = data.to_pixel_data_state();
            match serde_wasm_bindgen::to_value(&data) {
                Ok(value) => value,
                Err(err) => {
                    error(&err.to_string());
                    JsValue::UNDEFINED
                }
            }
        }
        Err(err) => {
            error(&err.to_string());
            JsValue::UNDEFINED
        }
    }
}
