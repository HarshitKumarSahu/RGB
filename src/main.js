import * as THREE from "three";
import images from "./images.js"

import vertex from "../shaders/vertex.glsl"
import fragment from "../shaders/fragment.glsl"

function lerp(start , end , t) {
  return start * ( 1 - t ) + end * t;
}

//mouse coordinate
let targetX = 0;
let targetY = 0;

const textureOne = new THREE.TextureLoader().load(images.imageOne);
const textureTwo = new THREE.TextureLoader().load(images.imageTwo);
const textureThree = new THREE.TextureLoader().load(images.imageThree);
const textureFour = new THREE.TextureLoader().load(images.imageFour);

class WebGl {
  constructor() {
    this.container = document.querySelector(".main");
    this.links = [...document.querySelectorAll("li")]
    this.scene = new THREE.Scene();
    this.perspective = 1000; // z-axis camera , need later for fov
    this.sizes = new THREE.Vector2(0,0); // mesh size
    this.offset = new THREE.Vector2(0,0); // mesh position
    this.uniform = {
      uTexture : { value : textureOne},
      uAlpha : { value : 0.0 },
      uOffset : { value : new THREE.Vector2(0.0, 0.0) }
    }
    this.links.forEach((link, idx)=>{
      link.addEventListener("mouseenter", () => {
        switch(idx) {
          case 0 :
            this.uniform.uTexture.value = textureOne;
            break;
          case 1 :
            this.uniform.uTexture.value = textureTwo;
            break;
          case 2 :
            this.uniform.uTexture.value = textureThree;
            break; 
          case 3 :
            this.uniform.uTexture.value = textureFour;
            break;  
        }
      })
    })
    this.addEventListeners(document.querySelector("ul"));
    this.setupCamera();
    this.onMouseMove();
    this.createMesh();
    this.render();
  }

  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width/height;

    return {
      width,
      height,
      aspectRatio
    }
  }

  onMouseMove() {
    window.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    })
  }

  addEventListeners(element) {
    element.addEventListener("mouseenter", ()=>{
      this.linksHover = "true"
    })
    element.addEventListener("mouseleave", ()=>{
      this.linksHover = "false"
    })
  }

  setupCamera() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
    //camera setup
    let fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      fov,
      this.viewport.aspectRatio,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, this.perspective);

    // renderer / canvas
    this.renderer = new THREE.WebGLRenderer({
      alpha : true,
      antialias : true,
    })
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2));
    this.container.appendChild(this.renderer.domElement);

  }

  onWindowResize() {
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.fov = (180 * (2 * Math.atan(this.viewport.height / 2 / this.perspective))) / Math.PI;
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio , 2));
    this.camera.updateProjectionMatrix();
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 20, 20);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniform,
      vertexShader : vertex,
      fragmentShader : fragment,
      transparent : true
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.sizes.set(250, 350);
    this.mesh.scale.set(this.sizes.x, this.sizes.y);
    this.mesh.position.set(this.offset.x, this.offset.y, 0);
    this.scene.add(this.mesh)
  }

  render() {
    this.offset.x = lerp(this.offset.x, targetX, 0.1);
    this.offset.y = lerp(this.offset.y, targetY, 0.1);
    this.uniform.uOffset.value.set((targetX - this.offset.x) * 0.0005, -(targetY - this.offset.y) * 0.0005);
    this.mesh.position.set(this.offset.x - (window.innerWidth / 2), -this.offset.y + (window.innerHeight / 2));

    this.linksHover 
    ? this.uniform.uAlpha.value = lerp(this.uniform.uAlpha.value, 1.0, 0.1)
    :  this.uniform.uAlpha.value = lerp(this.uniform.uAlpha.value, 0.0, 0.1)

    for(let i = 0 ; i < this.links.length ; i++) {
      if(this.linksHover) {
        this.links[i].style.opacity = 0.2;
      } else {
        this.links[i].style.opacity = 0.2;
      }
    }

    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

}

new WebGl();