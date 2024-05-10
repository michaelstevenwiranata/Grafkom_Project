// import utils from './utils';
// import { Octree } from 'three/addons/math/Octree.js';
// import { Capsule } from 'three/addons/math/Capsule.js';

// async function loadModels(loader, scene, worldOctree) {
//     let ruangan, meja;
//     try {

//         // load model ruangan
//         const ruanganPromise = new Promise((resolve, reject) => {
//             loader.load('/public/ruangan.glb', function (gltf) {
//                 ruangan = gltf.scene;
//                 ruangan.scale.set(10, 10, 10)

//                 const center = utils.getCenterOBJ(ruangan);
//                 ruangan.position.set(0, center.y, 0);

//                 worldOctree.fromGraphNode(ruangan);
//                 scene.add(ruangan);
//                 resolve();
//             }, undefined, reject);
//         });
//         await ruanganPromise;

//         // load meja tengah
//         const mejaPromise = new Promise((resolve, reject) => {
//             loader.load('/public/antique_wooden_table/scene.gltf', function (gltf) {
//                 meja = gltf.scene;
//                 meja.scale.set(100, 80, 150)

//                 meja.position.set(0,5,50)
//                 meja.rotation.y = -Math.PI / 2;
//                 meja.traverse(function (child) {
//                     if (child.isMesh) {
//                         child.castShadow = true; // Enable shadow casting
//                         child.receiveShadow = true; // Enable shadow receiving
//                     }
//                 });

//                 worldOctree.fromGraphNode(meja);
//                 scene.add(meja);

//                 resolve()
//             }, undefined, reject);
//         });
//         await mejaPromise;

//         await Promise.all([ruanganPromise, mejaPromise]);
//     } catch (error) {
//         console.log("Error loading models : " + error);
//     }
// }

// export default loadModels;