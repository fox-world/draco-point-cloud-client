import axios from 'axios';
// import { styleText } from 'node:util';

export const loadDataInfo = async (url) => {
    try {
        const { data: response } = await axios.get(url);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// export const decodeDracoData = (rawBuffer, decoder) => {
//     const buffer = new decoderModule.DecoderBuffer();
//     buffer.Init(new Float32Array(rawBuffer), rawBuffer.byteLength);
//     const geometryType = decoder.GetEncodedGeometryType(buffer);

//     let dracoGeometry = null;
//     let status;
//     if (geometryType === decoderModule.TRIANGULAR_MESH) {
//         dracoGeometry = new decoderModule.Mesh();
//         status = decoder.DecodeBufferToMesh(buffer, dracoGeometry);
//     } else if (geometryType === decoderModule.POINT_CLOUD) {
//         dracoGeometry = new decoderModule.PointCloud();
//         status = decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
//     } else {
//         const errorMsg = 'Error: Unknown geometry type.';
//         console.error(errorMsg);
//     }
//     decoderModule.destroy(buffer);

//     const attrs = {
//         POSITION: 3
//     };
//     const numPoints = dracoGeometry.num_points();
//     Object.keys(attrs).forEach((attr) => {
//         const decoderAttr = decoderModule[attr];
//         const attrId = decoder.GetAttributeId(dracoGeometry, decoderAttr);
//         const stride = attrs[attr];
//         const numValues = numPoints * stride;

//         const attribute = decoder.GetAttribute(dracoGeometry, attrId);
//         const attributeData = new decoderModule.DracoFloat32Array();
//         decoder.GetAttributeFloatForAllPoints(dracoGeometry, attribute, attributeData);
//         let points = [];
//         for (let i = 0; i < numValues; i = i + stride) {
//             for (let j = i; j < i + stride; j++) {
//                 points.push(attributeData.GetValue(j));
//             }
//         }
//         decoderModule.destroy(attributeData);
//     });
//     let endTime = new Date();
//     let timeCost = styleText('green', `${endTime - startTime}`);
//     console.log(`Encode finished,time cost: ${timeCost}ms, decode point size: ` + styleText('green', `${numPoints}`));
//     decoderModule.destroy(decoder);
//     decoderModule.destroy(dracoGeometry);
// }