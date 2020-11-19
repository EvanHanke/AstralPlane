import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';

/*
Setup scene+camera

*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.set(0,0,10);

const loader = new GLTFLoader();
export const loader_b = new THREE.TextureLoader();

/*
  Setup meshes and materials
*/

export var material = new THREE.MeshPhongMaterial( {
    shininess: 1
    //map: loader_b.load('syriangrainsilo.jpg'),
} );

//add background sphere
const geo_sph = new THREE.SphereGeometry( 12, 32, 32 );
const mat_sph = new THREE.MeshBasicMaterial(
  {color: 0xffffff,
    wireframe: true
  } );
const sphere = new THREE.Mesh( geo_sph, mat_sph );
scene.add( sphere );
sphere.rotation.x = Math.PI / 2;

const light = new THREE.PointLight( 0xffffff, 1, 0 );
light.position.set( 5, 5, 5 );
scene.add(light);
const lightb = new THREE.PointLight( 0xffffff, 1, 0 );
lightb.position.set( 5, 5, -5 );
scene.add(lightb);


export var mask;

loader.load( '/mask.glb', function ( gltf ) {

	scene.add( gltf.scene );
  mask = gltf.scene;
  mask.traverse((o) => {
  if (o.isMesh) {
    o.material = material;
  }
  });
  mask.position.set(0, -5, -5);
  console.log("loaded");

}, undefined, function ( error ) {

	console.error( error );

} );

const animate = function () {

  requestAnimationFrame( animate );

  if(mask != null)
  mask.rotation.y += 0.01;
  sphere.rotation.y -= 0.001;

  renderer.render( scene, camera );
};

animate();

export var updateMask = function (a){
  //convert binary to image
  var loaded = URL.createObjectURL(a);

  mask.traverse((o) => {
    if (o.isMesh) {
      o.material.map = loader_b.load(loaded);
      o.material.needsUpdate = true;
      scene.background = o.material.map;
    }
  });
}
