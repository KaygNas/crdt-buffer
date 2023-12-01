use hex;
use serde::{Deserialize, Serialize};

pub type Uuid = u8;
pub type Color = Option<u8>;
pub type Timestamp = u8;
pub type Width = u16;
#[derive(Serialize, Deserialize)]
pub enum DataItem {
    Pixel(Uuid, Timestamp, Color),
    Blank(u16),
}
#[derive(Serialize, Deserialize)]
pub struct CRDTData {
    pub uuids: Vec<String>,
    pub palette: Vec<String>,
    pub width: Width,
    // pub data: Vec<DataItem>,
}

pub mod chunk {

    use super::*;
    use hex;

    trait Chunkable {
        fn parse(data: &CRDTData) -> Result<Box<Self>, String>
        where
            Self: Sized;
        fn to_be_bytes(&self) -> Result<Vec<u8>, String>;
    }

    pub fn to_bytes(data: &CRDTData) -> Result<Vec<u8>, String> {
        let chunks: Vec<Box<dyn Chunkable>> = vec![
            InfoChunk::parse(data)?,
            UuidChunk::parse(data)?,
            PaletteChunk::parse(data)?,
            // TODO: recover
            // DataChunk::parse(data),
        ];
        let mut bytes = Vec::new();
        for chunk in chunks {
            bytes.extend(chunk.to_be_bytes()?);
            println!("len: {}", bytes.len());
        }
        Ok(bytes)
    }

    pub struct InfoChunk {
        magic_number: [u8; 4],
        artboard_width: [u8; 2],
    }
    impl Chunkable for InfoChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, String> {
            Ok(Box::new(InfoChunk {
                magic_number: str_to_ascii_bytes("CRDT"),
                artboard_width: data.width.to_be_bytes(),
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, String> {
            let mut bytes = Vec::new();
            bytes.extend(&self.magic_number);
            bytes.extend(&self.artboard_width);
            Ok(bytes)
        }
    }

    pub struct UuidChunk {
        type_name: [u8; 4],
        length: [u8; 2],
        uuids: Vec<[u8; 16]>,
    }
    impl Chunkable for UuidChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, String> {
            let mut uuids = Vec::new();
            for uuid in &data.uuids {
                let mut uuid_bytes = [0u8; 16];
                let uuid_bytes_in_hex = match hex::decode(uuid) {
                    Ok(bytes) => bytes,
                    Err(err) => return Err(err.to_string()),
                };
                for (i, b) in uuid_bytes_in_hex.iter().enumerate() {
                    uuid_bytes[i] = *b;
                }
                uuids.push(uuid_bytes);
            }

            Ok(Box::new(UuidChunk {
                type_name: str_to_ascii_bytes("UUID"),
                length: len_to_bytes(uuids.len() as u16),
                uuids,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, String> {
            let mut bytes = Vec::new();
            bytes.extend(&self.type_name);
            bytes.extend(&self.length);
            for uuid in &self.uuids {
                bytes.extend(uuid);
            }
            Ok(bytes)
        }
    }

    pub struct PaletteChunk {
        type_name: [u8; 4],
        length: [u8; 2],
        palettes: Vec<[u8; 3]>,
    }
    impl Chunkable for PaletteChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, String> {
            let mut palettes: Vec<[u8; 3]> = Vec::new();
            palettes.push([0, 0, 0]);
            for palette in &data.palette {
                let hex_bytes = match hex::decode(&palette) {
                    Ok(bytes) => bytes,
                    Err(err) => return Err(err.to_string()),
                };
                let mut bytes = [0u8; 3];
                bytes.copy_from_slice(&hex_bytes[..]);
                palettes.push(bytes);
            }

            Ok(Box::new(PaletteChunk {
                type_name: str_to_ascii_bytes("PLTT"),
                length: len_to_bytes(palettes.len() as u16),
                palettes,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, String> {
            let mut bytes = Vec::new();
            bytes.extend(&self.type_name);
            bytes.extend(&self.length);
            for palette in &self.palettes {
                bytes.extend(palette);
            }
            Ok(bytes)
        }
    }

    enum DataChunkItem {
        Pixel([u8; 4]),
        Blank([u8; 3]),
    }
    pub struct DataChunk {
        type_name: [u8; 4],
        length: [u8; 2],
        data: Vec<DataChunkItem>,
    }
    // TODO: recover
    // impl Chunkable for DataChunk {
    //     fn parse(data: &CRDTData) -> Box<Self> {
    //         let mut data_chunk_items = Vec::new();
    //         for data_item in &data.data {
    //             match data_item {
    //                 DataItem::Pixel(uuid, timestamp, palette) => {
    //                     data_chunk_items.push(DataChunkItem::Pixel([
    //                         0,
    //                         1,
    //                         uuid.to_be_bytes()[0],
    //                         uuid.to_be_bytes()[1],
    //                         timestamp.to_be_bytes()[0],
    //                         timestamp.to_be_bytes()[1],
    //                         palette.unwrap_or(0).to_be_bytes()[0],
    //                         palette.unwrap_or(0).to_be_bytes()[1],
    //                     ]));
    //                 }
    //                 DataItem::Blank(n) => {
    //                     data_chunk_items.push(DataChunkItem::Blank([
    //                         0,
    //                         0,
    //                         n.to_be_bytes()[0],
    //                         n.to_be_bytes()[1],
    //                         n.to_be_bytes()[2],
    //                         n.to_be_bytes()[3],
    //                     ]));
    //                 }
    //             }
    //         }

    //         Box::new(DataChunk {
    //             type_name: str_to_ascii_bytes("DATA"),
    //             length: len_to_bytes(data_chunk_items.len() as u32),
    //             data: data_chunk_items,
    //         })
    //     }
    //     fn to_be_bytes(&self) -> Vec<u8> {
    //         let mut bytes = Vec::new();
    //         bytes.extend(&self.type_name);
    //         bytes.extend(&self.length);
    //         for data_chunk_item in &self.data {
    //             match data_chunk_item {
    //                 DataChunkItem::Pixel(bs) => bytes.extend(bs),
    //                 DataChunkItem::Blank(bs) => bytes.extend(bs),
    //             }
    //         }
    //         bytes
    //     }
    // }

    /// take a utf-8 &str, assert it has 4 chars, transform the &str to ascii in bytes
    /// each char should be represent by 2 bytes.
    fn str_to_ascii_bytes(s: &str) -> [u8; 4] {
        assert_eq!(
            s.chars().count(),
            4,
            "Input string must have exactly 4 characters"
        );

        let mut bytes = [0u8; 4];
        for (i, c) in s.chars().enumerate() {
            // transform char to ascii into 2 bytes in the type of u8;
            let mut ascii_bytes = c.to_ascii_uppercase().to_string().into_bytes();
            assert_eq!(
                ascii_bytes.len(),
                1,
                "Each character must be represented by 2 bytes"
            );

            bytes[i] = ascii_bytes[0];
        }

        bytes
    }

    fn len_to_bytes(n: u16) -> [u8; 2] {
        n.to_be_bytes()
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn hex_to_bytes_should_work() {
        let hex = "ffffff";
        let bytes = hex::decode(hex).unwrap();
        assert_eq!(bytes.len(), 3);
    }
    #[test]
    fn to_bytes_should_work() {
        let data = CRDTData {
            uuids: vec![
                "0442197c814447f7ae64340a2df3d796".to_string(),
                "4ae8bd76e84c4652bcd8a5e339c574f3".to_string(),
            ],
            palette: vec!["fff".to_string(), "6c4fff".to_string()],
            width: 100,
            // TODO: recover
            // data: vec![
            //     DataItem::Pixel(0, 3, Some(0)),
            //     DataItem::Pixel(0, 4, Some(0)),
            //     DataItem::Pixel(0, 2, None),
            //     DataItem::Blank(97),
            //     DataItem::Pixel(1, 2, Some(1)),
            //     DataItem::Pixel(1, 3, Some(1)),
            // ],
        };
        let data_in_bytes = chunk::to_bytes(&data).unwrap();

        assert_eq!(data_in_bytes.len(), 176);
    }
}
