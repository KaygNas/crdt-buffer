use std::collections::HashMap;

use serde::{Deserialize, Serialize};

pub type PixelDataState = HashMap<String, (String, u8, Option<String>)>;

pub type Uuid = u8;
pub type Color = Option<u8>;
pub type Timestamp = u8;
pub type Width = u16;
#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub enum DataItem {
    Pixel(Uuid, Timestamp, Color),
    Blank(u16),
}
#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct CRDTData {
    pub uuids: Vec<String>,
    pub palette: Vec<String>,
    pub width: Width,
    pub data: Vec<DataItem>,
}

impl CRDTData {
    pub fn to_pixel_data_state(&self) -> PixelDataState {
        let mut pixel_data_state = PixelDataState::new();
        let mut index: u16 = 0;
        for data in self.data.iter() {
            let x = index % self.width;
            let y = index / self.width;
            match data {
                DataItem::Pixel(uuid, timestamp, color) => {
                    pixel_data_state.insert(
                        format!("{},{}", x, y),
                        (
                            self.uuids[*uuid as usize].clone(),
                            *timestamp,
                            if let Some(color) = color {
                                Some(self.palette[*color as usize].clone())
                            } else {
                                None
                            },
                        ),
                    );
                    index += 1;
                }
                DataItem::Blank(n) => {
                    index += n;
                }
            }
        }
        pixel_data_state
    }

    pub fn from_pixel_data_state(pixel_data_state: &PixelDataState, width: u16) -> Self {
        let mut uuids: Vec<String> = Vec::new();
        let mut palette: Vec<String> = Vec::new();
        let mut data: Vec<DataItem> = Vec::new();

        let mut coords: Vec<(u16, u16)> = pixel_data_state
            .keys()
            .map(|key| {
                let key = key.split(",").collect::<Vec<&str>>();
                let x = key[0].parse::<u16>().unwrap();
                let y = key[1].parse::<u16>().unwrap();
                (x, y)
            })
            .collect();
        coords.sort_by(|a, b| {
            let (ax, ay) = a;
            let (bx, by) = b;
            if ay == by {
                ax.cmp(&bx)
            } else {
                ay.cmp(&by)
            }
        });

        let mut prev_pixel_index: u16 = 0;
        for coord in coords {
            let (x, y) = coord;
            let (uuid, timestamp, color) = pixel_data_state.get(&format!("{},{}", x, y)).unwrap();
            let pixel_index = y * width + x;
            let mut uuid_index = uuids.iter().position(|u| u == uuid);
            let mut color_index = palette.iter().position(|c| {
                if let Some(color) = color {
                    c == color
                } else {
                    false
                }
            });

            if uuid_index == None {
                uuids.push(uuid.clone());
                uuid_index = Some(uuids.len() - 1);
            }

            if color_index == None && color != &None {
                if let Some(color) = color {
                    palette.push(color.clone());
                    color_index = Some(palette.len() - 1);
                }
            }

            if pixel_index - prev_pixel_index > 1 {
                data.push(DataItem::Blank(pixel_index - prev_pixel_index - 1));
            }

            let uuid_index = uuid_index.unwrap() as u8;
            let color_index = if let Some(index) = color_index {
                Some(index as u8)
            } else {
                None
            };
            data.push(DataItem::Pixel(uuid_index, timestamp.clone(), color_index));

            prev_pixel_index = pixel_index;
        }

        CRDTData {
            uuids,
            palette,
            width,
            data,
        }
    }
}

pub mod chunk {

    use super::*;
    use hex;

    pub fn to_bytes(data: &CRDTData) -> Result<Vec<u8>, ChunkError> {
        let chunks: Vec<Box<dyn Chunkable>> = vec![
            InfoChunk::parse(data)?,
            UuidChunk::parse(data)?,
            PaletteChunk::parse(data)?,
            DataChunk::parse(data)?,
        ];
        let mut bytes = Vec::new();
        for chunk in chunks {
            bytes.extend(chunk.to_be_bytes()?);
        }
        Ok(bytes)
    }

    pub fn from_bytes(bytes: &Vec<u8>) -> Result<CRDTData, String> {
        let iter = &mut bytes.iter();
        let info_chunk = InfoChunk::parse_bytes(iter)?;
        let uuid_chunk = UuidChunk::parse_bytes(iter)?;
        let palette_chunk = PaletteChunk::parse_bytes(iter)?;
        let data_chunk = DataChunk::parse_bytes(iter)?;
        Ok(CRDTData {
            uuids: uuid_chunk.to_be_data()?.uuids.unwrap(),
            palette: palette_chunk.to_be_data()?.palette.unwrap(),
            width: info_chunk.to_be_data()?.width.unwrap(),
            data: data_chunk.to_be_data()?.data.unwrap(),
        })
    }

    type ChunkError = String;
    struct PartialCRDTData {
        uuids: Option<Vec<String>>,
        palette: Option<Vec<String>>,
        width: Option<Width>,
        data: Option<Vec<DataItem>>,
    }
    trait Chunkable {
        fn parse(data: &CRDTData) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized;
        fn parse_bytes(bytes: &mut dyn Iterator<Item = &u8>) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized;
        fn to_be_bytes(&self) -> Result<Vec<u8>, ChunkError>;
        fn to_be_data(&self) -> Result<PartialCRDTData, ChunkError>;
    }

    pub struct InfoChunk {
        magic_number: [u8; 4],
        artboard_width: [u8; 2],
    }
    impl Chunkable for InfoChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, ChunkError> {
            Ok(Box::new(InfoChunk {
                magic_number: str_to_ascii_bytes("CRDT"),
                artboard_width: data.width.to_be_bytes(),
            }))
        }
        fn parse_bytes(bytes: &mut dyn Iterator<Item = &u8>) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized,
        {
            let mut magic_number = [0u8; 4];
            for i in 0..4 {
                if let Some(byte) = bytes.next() {
                    magic_number[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for magic_number".to_string());
                }
            }

            if magic_number != str_to_ascii_bytes("CRDT") {
                return Err("Magic number is not CRDT".to_string());
            }

            let mut artboard_width = [0u8; 2];
            for i in 0..2 {
                if let Some(byte) = bytes.next() {
                    artboard_width[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for artboard_width".to_string());
                }
            }
            Ok(Box::new(InfoChunk {
                magic_number,
                artboard_width,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, ChunkError> {
            let mut bytes = Vec::new();
            bytes.extend(&self.magic_number);
            bytes.extend(&self.artboard_width);
            Ok(bytes)
        }
        fn to_be_data(&self) -> Result<PartialCRDTData, ChunkError> {
            Ok(PartialCRDTData {
                uuids: None,
                palette: None,
                width: Some(u16::from_be_bytes(self.artboard_width)),
                data: None,
            })
        }
    }

    pub struct UuidChunk {
        type_name: [u8; 4],
        length: [u8; 2],
        uuids: Vec<[u8; 16]>,
    }
    impl Chunkable for UuidChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, ChunkError> {
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
        fn parse_bytes(bytes: &mut dyn Iterator<Item = &u8>) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized,
        {
            let mut type_name = [0u8; 4];
            for i in 0..4 {
                if let Some(byte) = bytes.next() {
                    type_name[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for UuidChunk type_name".to_string());
                }
            }

            if type_name != str_to_ascii_bytes("UUID") {
                return Err("Type name is not UUID".to_string());
            }

            let mut length = [0u8; 2];
            for i in 0..2 {
                if let Some(byte) = bytes.next() {
                    length[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for UuidChunk length".to_string());
                }
            }

            let mut uuids = Vec::new();
            for _ in 0..u16::from_be_bytes(length) {
                let mut uuid = [0u8; 16];
                for i in 0..16 {
                    if let Some(byte) = bytes.next() {
                        uuid[i] = byte.clone();
                    } else {
                        return Err("Not enough bytes for UuidChunk uuids".to_string());
                    }
                }
                uuids.push(uuid);
            }

            Ok(Box::new(UuidChunk {
                type_name,
                length,
                uuids,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, ChunkError> {
            let mut bytes = Vec::new();
            bytes.extend(&self.type_name);
            bytes.extend(&self.length);
            for uuid in &self.uuids {
                bytes.extend(uuid);
            }
            Ok(bytes)
        }

        fn to_be_data(&self) -> Result<PartialCRDTData, ChunkError> {
            let mut uuids = Vec::new();
            for uuid in &self.uuids {
                let mut uuid_str = String::new();
                for b in uuid {
                    uuid_str.push_str(&format!("{:02x}", b));
                }
                uuids.push(uuid_str);
            }
            Ok(PartialCRDTData {
                uuids: Some(uuids),
                palette: None,
                width: None,
                data: None,
            })
        }
    }

    pub struct PaletteChunk {
        type_name: [u8; 4],
        length: [u8; 2],
        palettes: Vec<[u8; 3]>,
    }
    impl Chunkable for PaletteChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, ChunkError> {
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
        fn parse_bytes(bytes: &mut dyn Iterator<Item = &u8>) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized,
        {
            let mut type_name = [0u8; 4];
            for i in 0..4 {
                if let Some(byte) = bytes.next() {
                    type_name[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for PaletteChunk type_name".to_string());
                }
            }

            if type_name != str_to_ascii_bytes("PLTT") {
                return Err("Type name is not PLTT".to_string());
            }

            let mut length = [0u8; 2];
            for i in 0..2 {
                if let Some(byte) = bytes.next() {
                    length[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for PaletteChunk length".to_string());
                }
            }

            let mut palettes = Vec::new();
            for _ in 0..u16::from_be_bytes(length) {
                let mut palette = [0u8; 3];
                for i in 0..3 {
                    if let Some(byte) = bytes.next() {
                        palette[i] = byte.clone();
                    } else {
                        return Err("Not enough bytes for PaletteChunk palettes".to_string());
                    }
                }
                palettes.push(palette);
            }

            Ok(Box::new(PaletteChunk {
                type_name,
                length,
                palettes,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, ChunkError> {
            let mut bytes = Vec::new();
            bytes.extend(&self.type_name);
            bytes.extend(&self.length);
            for palette in &self.palettes {
                bytes.extend(palette);
            }
            Ok(bytes)
        }
        fn to_be_data(&self) -> Result<PartialCRDTData, ChunkError> {
            let mut palettes = Vec::new();
            for (i, palette) in self.palettes.iter().enumerate() {
                if i > 0 {
                    palettes.push(format!(
                        "{:02x}{:02x}{:02x}",
                        palette[0], palette[1], palette[2]
                    ));
                }
            }
            Ok(PartialCRDTData {
                uuids: None,
                palette: Some(palettes),
                width: None,
                data: None,
            })
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
    impl Chunkable for DataChunk {
        fn parse(data: &CRDTData) -> Result<Box<Self>, ChunkError> {
            let mut data_chunk_items = Vec::new();
            let mut length: u16 = 0;
            for data_item in &data.data {
                match data_item {
                    DataItem::Pixel(uuid, timestamp, palette) => {
                        data_chunk_items.push(DataChunkItem::Pixel([
                            1,
                            uuid.clone(),
                            timestamp.clone(),
                            if let Some(index) = palette {
                                index + 1
                            } else {
                                0
                            },
                        ]));
                        length += 4;
                    }
                    DataItem::Blank(n) => {
                        data_chunk_items.push(DataChunkItem::Blank([
                            0,
                            n.to_be_bytes()[0],
                            n.to_be_bytes()[1],
                        ]));
                        length += 3;
                    }
                }
            }

            Ok(Box::new(DataChunk {
                type_name: str_to_ascii_bytes("DATA"),
                length: len_to_bytes(length),
                data: data_chunk_items,
            }))
        }
        fn parse_bytes(bytes: &mut dyn Iterator<Item = &u8>) -> Result<Box<Self>, ChunkError>
        where
            Self: Sized,
        {
            let mut type_name = [0u8; 4];
            for i in 0..4 {
                if let Some(byte) = bytes.next() {
                    type_name[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for DataChunk type_name".to_string());
                }
            }

            if type_name != str_to_ascii_bytes("DATA") {
                return Err("Type name is not DATA".to_string());
            }

            let mut length = [0u8; 2];
            for i in 0..2 {
                if let Some(byte) = bytes.next() {
                    length[i] = byte.clone();
                } else {
                    return Err("Not enough bytes for DataChunk length".to_string());
                }
            }

            let length_u16 = u16::from_be_bytes(length);
            let mut data = Vec::with_capacity(length_u16 as usize);

            while let Some(data_chunk_item_type) = bytes.next() {
                let data_chunk_item_type = data_chunk_item_type.clone();
                if data_chunk_item_type == 1 {
                    let mut data_chunk_item = [0u8; 4];
                    data_chunk_item[0] = data_chunk_item_type;
                    for i in 1..4 {
                        if let Some(byte) = bytes.next() {
                            data_chunk_item[i] = byte.clone();
                        } else {
                            return Err(
                                "Not enough bytes for DataChunk data_chunk_item_pixel".to_string()
                            );
                        }
                    }
                    println!("data_chunk_item {:?}", data_chunk_item);
                    data.push(DataChunkItem::Pixel(data_chunk_item));
                } else {
                    let mut data_chunk_item = [0u8; 3];
                    data_chunk_item[0] = data_chunk_item_type;
                    for i in 1..3 {
                        if let Some(byte) = bytes.next() {
                            data_chunk_item[i] = byte.clone();
                        } else {
                            return Err(
                                "Not enough bytes for DataChunk data_chunk_item_blank".to_string()
                            );
                        }
                    }
                    println!("data_chunk_item {:?}", data_chunk_item);
                    data.push(DataChunkItem::Blank(data_chunk_item));
                }
            }

            Ok(Box::new(DataChunk {
                type_name,
                length,
                data,
            }))
        }
        fn to_be_bytes(&self) -> Result<Vec<u8>, ChunkError> {
            let mut bytes = Vec::new();
            bytes.extend(&self.type_name);
            bytes.extend(&self.length);
            for data_chunk_item in &self.data {
                match data_chunk_item {
                    DataChunkItem::Pixel(bs) => bytes.extend(bs),
                    DataChunkItem::Blank(bs) => bytes.extend(bs),
                }
            }
            Ok(bytes)
        }
        fn to_be_data(&self) -> Result<PartialCRDTData, ChunkError> {
            let mut data = Vec::new();
            for data_chunk_item in &self.data {
                match data_chunk_item {
                    DataChunkItem::Pixel(bs) => {
                        data.push(DataItem::Pixel(
                            bs[1],
                            bs[2],
                            if bs[3] == 0 { None } else { Some(bs[3] - 1) },
                        ));
                    }
                    DataChunkItem::Blank(bs) => {
                        data.push(DataItem::Blank(u16::from_be_bytes([bs[1], bs[2]])));
                    }
                }
            }
            Ok(PartialCRDTData {
                uuids: None,
                palette: None,
                width: None,
                data: Some(data),
            })
        }
    }

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
            // transform char to ascii into 1 bytes in the type of u8;
            let ascii_bytes = c.to_ascii_uppercase().to_string().into_bytes();
            assert_eq!(
                ascii_bytes.len(),
                1,
                "Each character must be represented by 1 bytes"
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
            palette: vec!["ffffff".to_string(), "6c4fff".to_string()],
            width: 100,
            data: vec![
                DataItem::Pixel(0, 3, Some(0)),
                DataItem::Pixel(0, 4, Some(0)),
                DataItem::Pixel(0, 2, None),
                DataItem::Blank(97),
                DataItem::Pixel(1, 2, Some(1)),
                DataItem::Pixel(1, 3, Some(1)),
            ],
        };
        let data_in_bytes = chunk::to_bytes(&data).unwrap();

        assert_eq!(data_in_bytes.len(), 88);
    }

    #[test]
    fn from_bytes_should_work() {
        let data = CRDTData {
            uuids: vec![
                "0442197c814447f7ae64340a2df3d796".to_string(),
                "4ae8bd76e84c4652bcd8a5e339c574f3".to_string(),
            ],
            palette: vec!["ffffff".to_string(), "6c4fff".to_string()],
            width: 100,
            data: vec![
                DataItem::Pixel(0, 3, Some(0)),
                DataItem::Pixel(0, 4, Some(0)),
                DataItem::Pixel(0, 2, None),
                DataItem::Blank(97),
                DataItem::Pixel(1, 2, Some(1)),
                DataItem::Pixel(1, 3, Some(1)),
            ],
        };
        let data_in_bytes = chunk::to_bytes(&data).unwrap();
        let data_from_bytes = chunk::from_bytes(&data_in_bytes).unwrap();
        assert_eq!(data, data_from_bytes);
    }
}
