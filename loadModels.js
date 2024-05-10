import utils from './utils';

async function loadModels(loader, scene){
    let ruangan, meja;
    try {

        // load model ruangan
        const ruanganPromise = new Promise((resolve, reject) => {
            loader.load('/public/ruangan.glb', function ( gltf ) {
                ruangan = gltf.scene;
                ruangan.scale.set(10,10,10)
                
                const center = utils.getCenterOBJ(ruangan);
                ruangan.position.set(0,center.y,0);

                scene.add(ruangan);
                resolve();
            }, undefined, reject);
        });
        await ruanganPromise;

        await Promise.all([ruanganPromise]);
    } catch (error) {   
        console.log("Error loading models : " + error);
    }
}

export default loadModels;