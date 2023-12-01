#![feature(slice_flatten)]

use wasm_bindgen::prelude::*;
mod crdt_data;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
}

#[wasm_bindgen]
pub fn data_to_bytes(value: JsValue) -> Vec<u8> {
    let result = serde_wasm_bindgen::from_value::<crdt_data::CRDTData>(value);
    match result {
        Ok(data) => crdt_data::chunk::to_bytes(&data),
        Err(err) => {
            error(&err.to_string());
            Vec::new()
        }
    }
}