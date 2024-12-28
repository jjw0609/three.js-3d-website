import { Mesh, BoxGeometry, MeshLambertMaterial } from 'three';
import { Vec3, Box, Body, Quaternion } from 'cannon-es';


export class MeshObject {
    constructor(info) {
        this.name = info.name;
        this.width = info.width || 1;
        this.height = info.height || 1;
        this.depth = info.depth || 1;
        this.color = info.color || 'white';
        this.differenceY = info.differenceY || 0.4;
        this.x = info.x || 0;
        this.y = info.y || this.height / 2 + this.differenceY;
        this.z = info.z || 0;
        this.x *= 1;
        this.y *= 1;
        this.z *= 1;
        this.rotationX = info.rotationX || 0;
        this.rotationY = info.rotationY || 0;
        this.rotationZ = info.rotationZ || 0;

        this.mass = info.mass || 0;
        this.cannonWorld = info.cannonWorld;
        this.cannonMaterial = info.cannonMaterial

        if(info.modelSrc) {
            // GLB
            info.loader.load(
                info.modelSrc,
                glb => {
                    glb.scene.traverse(child => {
                        if(child.isMesh) {
                            child.castShadow = true;
                        }
                    })

                    // console.log('loaded');
                    this.mesh = glb.scene;
                    info.scene.add(this.mesh);
                    this.mesh.position.set(this.x, this.y, this.z);
                    this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

                    this.setCannonBody();
                },
                xhr => {
                    // console.log('loading ... ');
                },
                error => {
                    // console.log('error');
                }
            );

        } else if (info.mapSrc) {
            const geometry = new BoxGeometry(this.width, this.height, this.depth);
            info.loader.load(
              info.mapSrc,
              texture => {
                  const material = new MeshLambertMaterial({
                     map: texture
                  });

                  this.mesh = new Mesh(geometry, material);
                  this.mesh.castShadow = true;
                  this.mesh.receiveShadow = true;
                  this.mesh.position.set(this.x, this.y, this.z);
                  this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

                  info.scene.add(this.mesh);

                  this.setCannonBody();
              }
            );

        } else {
            // Primitives
            const geometry = new BoxGeometry(this.width, this.height, this.depth);
            const material = new MeshLambertMaterial({
                color: this.color
            });

            this.mesh = new Mesh(geometry, material);
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            this.mesh.position.set(this.x, this.y, this.z);
            this.mesh.rotation.set(this.rotationX, this.rotationY, this.rotationZ);

            info.scene.add(this.mesh);

            this.setCannonBody();
        }
    }

    setCannonBody() {
        this.cannonBody = new Body({
            mass: this.mass,
            position: new Vec3(this.x, this.y, this.z),
            shape: new Box(new Vec3(this.width/2, this.height/2, this.depth/2)),
            material: this.cannonMaterial
        });

        this.cannonWorld.addBody(this.cannonBody);
    }
}