// // import SimpleCar from './SimpleCar.js'
// // import * as CANNON from 'cannon-es'
// // import * as THREE from 'three'
// // import Experience from '../Experience.js'

// // export default class SimpleCarController {
// //     constructor() {
// //         this.experience = new Experience()
// //         this.simpleCar = new SimpleCar() // Get the singleton instance of SimpleCar
// //         this.maxSteerVal = Math.PI / 8
// //         this.maxForce = -25
        
// //         // Jump counter
// //         this.jumpCount = 0
// //         this.maxJumps = 2
// //         this.isGrounded = true
// //         this.groundCheckInterval = null
        
// //         this.createResetButton()
// //         this.setSteering()
// //         this.setupGroundDetection()
// //     }

// //     createResetButton() {
// //         // Create reset button
// //         const resetButton = document.createElement('button')
// //         resetButton.id = 'reset-button'
// //         resetButton.textContent = 'RESET'
        
// //         // Reset functionality - Properly reload the scene
// //         resetButton.addEventListener('click', () => {
// //             window.location.reload()
// //         })
        
// //         document.body.appendChild(resetButton)
// //     }
    
// //     setupGroundDetection() {
// //         // Check if the car is on the ground every 100ms
// //         this.groundCheckInterval = setInterval(() => {
// //             // Get the chassis position
// //             const position = this.simpleCar.vehicle.chassisBody.position;
            
// //             // Ray starting from slightly above the car's position
// //             const start = new CANNON.Vec3(position.x, position.y - 0.4, position.z);
// //             const end = new CANNON.Vec3(position.x, position.y - 1.5, position.z);
            
// //             // Perform the raycast
// //             const result = new CANNON.RaycastResult();
// //             this.experience.worldPhysics.instance.rayTest(start, end, result);
            
// //             // If the ray hit something, the car is grounded
// //             if (result.hasHit) {
// //                 if (!this.isGrounded) {
// //                     // We've just landed
// //                     this.isGrounded = true;
// //                     this.jumpCount = 0; // Reset jump count when landing
// //                     console.log("Car landed - jumps reset!");
// //                 }
// //             } else {
// //                 this.isGrounded = false;
// //             }
// //         }, 100);
// //     }

// //     jumpCar() {
// //         if (this.jumpCount < this.maxJumps) {
// //             // Apply an upward impulse at the center of mass
// //             this.simpleCar.vehicle.chassisBody.applyImpulse(
// //                 new CANNON.Vec3(0, 60, 0), 
// //                 new CANNON.Vec3(0, 0, 0)
// //             )
// //             this.jumpCount++
// //             this.isGrounded = false;
// //             console.log(`Jump! (${this.jumpCount}/${this.maxJumps})`)
// //         } else {
// //             console.log('No more jumps available until landing!')
// //         }
// //     }
    
// //     changeCarColor() {
// //         // Generate random color
// //         const randomColor = new THREE.Color(
// //             Math.random(), 
// //             Math.random(), 
// //             Math.random()
// //         )
        
// //         // Apply to chassis
// //         if (this.simpleCar.chassisMesh && this.simpleCar.chassisMesh.material) {
// //             this.simpleCar.chassisMesh.material.color = randomColor
// //         }
        
// //         console.log('Color changed!')
// //     }
    
// //     turboBoost() {
// //         // Apply a strong forward impulse
// //         const direction = new CANNON.Vec3()
        
// //         // Get the forward direction of the car
// //         this.simpleCar.vehicle.chassisBody.quaternion.vmult(
// //             new CANNON.Vec3(0, 0, 1), 
// //             direction
// //         )
        
// //         // Scale it up for a boost
// //         direction.scale(200, direction)
        
// //         // Apply the impulse
// //         this.simpleCar.vehicle.chassisBody.applyImpulse(
// //             direction,
// //             new CANNON.Vec3(0, 0, 0)
// //         )
        
// //         console.log('Turbo Boost activated!')
// //     }

// //     setSteering() {
// //         document.addEventListener("keydown", (event) => {
// //             switch (event.key) {
// //                 case "w":
// //                 case "ArrowUp":
// //                     this.simpleCar.vehicle.setWheelForce(this.maxForce, 0)
// //                     this.simpleCar.vehicle.setWheelForce(-this.maxForce, 1)
// //                     break

// //                 case 's':
// //                 case 'ArrowDown':
// //                     this.simpleCar.vehicle.setWheelForce(-this.maxForce * 0.5, 0)
// //                     this.simpleCar.vehicle.setWheelForce(this.maxForce * 0.5, 1)
// //                     break

// //                 case 'a':
// //                 case 'ArrowLeft':
// //                     this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 2)
// //                     this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 3)
// //                     break

// //                 case 'd':
// //                 case 'ArrowRight':
// //                     this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 2)
// //                     this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 3)
// //                     break

// //                 case ' ':
// //                     // Jump with limited uses
// //                     this.jumpCar()
// //                     break
                    
// //                 case 'c':
// //                     // Change car color
// //                     this.changeCarColor()
// //                     break
                    
// //                 case 'b':
// //                     // Turbo boost
// //                     this.turboBoost()
// //                     break
                    
// //                 case 'r':
// //                     // Full reset - just like the button
// //                     window.location.reload()
// //                     break
// //             }
// //         })

// //         // Reset force on keyup
// //         document.addEventListener('keyup', (event) => {
// //             switch (event.key) {
// //                 case 'w':
// //                 case 'ArrowUp':
// //                     this.simpleCar.vehicle.setWheelForce(0, 0)
// //                     this.simpleCar.vehicle.setWheelForce(0, 1)
// //                     break

// //                 case 's':
// //                 case 'ArrowDown':
// //                     this.simpleCar.vehicle.setWheelForce(0, 0)
// //                     this.simpleCar.vehicle.setWheelForce(0, 1)
// //                     break

// //                 case 'a':
// //                 case 'ArrowLeft':
// //                     this.simpleCar.vehicle.setSteeringValue(0, 2)
// //                     this.simpleCar.vehicle.setSteeringValue(0, 3)
// //                     break

// //                 case 'd':
// //                 case 'ArrowRight':
// //                     this.simpleCar.vehicle.setSteeringValue(0, 2)
// //                     this.simpleCar.vehicle.setSteeringValue(0, 3)
// //                     break
// //             }
// //         })
// //     }
// // }

// import SimpleCar from './SimpleCar.js'
// import * as CANNON from 'cannon-es'
// import * as THREE from 'three'
// import Experience from '../Experience.js'

// export default class SimpleCarController {
//     constructor() {
//         this.experience = new Experience()
//         this.simpleCar = new SimpleCar() // Get the singleton instance of SimpleCar
//         this.maxSteerVal = Math.PI / 8
//         this.maxForce = -25
        
//         // Get Nintendo colors from the car model
//         this.nintendoColors = this.simpleCar.simpleCarModel.getNintendoColors();
        
//         // Jump counter
//         this.jumpCount = 0
//         this.maxJumps = 2
//         this.isGrounded = true
//         this.groundCheckInterval = null
        
//         this.createResetButton()
//         this.setSteering()
//         this.setupGroundDetection()
//     }

//     createResetButton() {
//         // Create reset button
//         const resetButton = document.createElement('button')
//         resetButton.id = 'reset-button'
//         resetButton.textContent = 'RESET'
        
//         // Reset functionality - Properly reload the scene
//         resetButton.addEventListener('click', () => {
//             window.location.reload()
//         })
        
//         document.body.appendChild(resetButton)
//     }
    
//     setupGroundDetection() {
//         // Check if the car is on the ground every 100ms
//         this.groundCheckInterval = setInterval(() => {
//             // Get the chassis position
//             const position = this.simpleCar.vehicle.chassisBody.position;
            
//             // Ray starting from slightly above the car's position
//             const start = new CANNON.Vec3(position.x, position.y - 0.4, position.z);
//             const end = new CANNON.Vec3(position.x, position.y - 1.5, position.z);
            
//             // Perform the raycast
//             const result = new CANNON.RaycastResult();
//             this.experience.worldPhysics.instance.rayTest(start, end, result);
            
//             // If the ray hit something, the car is grounded
//             if (result.hasHit) {
//                 if (!this.isGrounded) {
//                     // We've just landed
//                     this.isGrounded = true;
//                     this.jumpCount = 0; // Reset jump count when landing
//                     console.log("Car landed - jumps reset!");
//                 }
//             } else {
//                 this.isGrounded = false;
//             }
//         }, 100);
//     }

//     jumpCar() {
//         if (this.jumpCount < this.maxJumps) {
//             // Apply an upward impulse at the center of mass
//             this.simpleCar.vehicle.chassisBody.applyImpulse(
//                 new CANNON.Vec3(0, 60, 0), 
//                 new CANNON.Vec3(0, 0, 0)
//             )
//             this.jumpCount++
//             this.isGrounded = false;
//             console.log(`Jump! (${this.jumpCount}/${this.maxJumps})`)
//         } else {
//             console.log('No more jumps available until landing!')
//         }
//     }
    
//     changeCarColor() {
//         // Select random Nintendo-style color from our palette
//         const randomColor = this.nintendoColors[Math.floor(Math.random() * this.nintendoColors.length)];
        
//         // Create materials with emissive glow for cartoon effect
//         if (this.simpleCar.chassisMesh && this.simpleCar.chassisMesh.material) {
//             // Update main chassis
//             this.simpleCar.chassisMesh.material.color.setHex(randomColor);
//             this.simpleCar.chassisMesh.material.emissive = new THREE.Color(randomColor).multiplyScalar(0.2);
            
//             // Update roof if it exists
//             if (this.simpleCar.simpleCarModel.roofMesh) {
//                 this.simpleCar.simpleCarModel.roofMesh.material.color.setHex(randomColor);
//                 this.simpleCar.simpleCarModel.roofMesh.material.emissive = new THREE.Color(randomColor).multiplyScalar(0.2);
//             }
//         }
        
//         // Add a little particle effect for fun
//         this.createColorChangeEffect(this.simpleCar.chassisMesh.position);
        
//         console.log('Color changed to Nintendo style!');
//     }
    
//     createColorChangeEffect(position) {
//         // Create a simple particle system for color change effect
//         const particleCount = 15;
//         const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        
//         for (let i = 0; i < particleCount; i++) {
//             // Random Nintendo color for each particle
//             const particleColor = this.nintendoColors[Math.floor(Math.random() * this.nintendoColors.length)];
            
//             const particleMaterial = new THREE.MeshBasicMaterial({
//                 color: particleColor,
//                 transparent: true,
//                 opacity: 1
//             });
            
//             const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
//             // Position particles around the car
//             particle.position.copy(position);
//             particle.position.x += (Math.random() - 0.5) * 3;
//             particle.position.y += (Math.random()) * 3;
//             particle.position.z += (Math.random() - 0.5) * 5;
            
//             this.experience.scene.add(particle);
            
//             // Animate the particle
//             const duration = 0.7 + Math.random() * 0.5;
//             const startTime = this.experience.time.elapsed;
            
//             const animate = () => {
//                 const elapsedTime = (this.experience.time.elapsed - startTime) / 1000;
//                 if (elapsedTime < duration) {
//                     particle.position.y += 0.05;
//                     particle.material.opacity = 1 - (elapsedTime / duration);
//                     requestAnimationFrame(animate);
//                 } else {
//                     this.experience.scene.remove(particle);
//                     particle.geometry.dispose();
//                     particle.material.dispose();
//                 }
//             };
            
//             animate();
//         }
//     }
    
//     turboBoost() {
//         // Apply a strong forward impulse
//         const direction = new CANNON.Vec3()
        
//         // Get the forward direction of the car
//         this.simpleCar.vehicle.chassisBody.quaternion.vmult(
//             new CANNON.Vec3(0, 0, 1), 
//             direction
//         )
        
//         // Scale it up for a boost
//         direction.scale(200, direction)
        
//         // Apply the impulse
//         this.simpleCar.vehicle.chassisBody.applyImpulse(
//             direction,
//             new CANNON.Vec3(0, 0, 0)
//         )
        
//         // Add a boost effect
//         this.createBoostEffect(this.simpleCar.chassisMesh.position);
        
//         console.log('Turbo Boost activated!')
//     }
    
//     createBoostEffect(position) {
//         // Create a boost trail effect
//         const trailCount = 20;
//         const trailGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        
//         for (let i = 0; i < trailCount; i++) {
//             // Use flame colors for boost
//             const trailColors = [0xFF5722, 0xFF9800, 0xFFEB3B];
//             const trailColor = trailColors[Math.floor(Math.random() * trailColors.length)];
            
//             const trailMaterial = new THREE.MeshBasicMaterial({
//                 color: trailColor,
//                 transparent: true,
//                 opacity: 0.8
//             });
            
//             const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            
//             // Get car direction and position behind it
//             const direction = new THREE.Vector3();
//             this.simpleCar.chassisMesh.getWorldDirection(direction);
            
//             // Position behind car
//             trail.position.copy(position);
//             trail.position.x -= direction.x * (3 + Math.random() * 2);
//             trail.position.y += 0.5;
//             trail.position.z -= direction.z * (3 + Math.random() * 2);
            
//             this.experience.scene.add(trail);
            
//             // Animate the trail
//             const duration = 0.5 + Math.random() * 0.3;
//             const startTime = this.experience.time.elapsed;
            
//             const animate = () => {
//                 const elapsedTime = (this.experience.time.elapsed - startTime) / 1000;
//                 if (elapsedTime < duration) {
//                     trail.scale.multiplyScalar(0.95);
//                     trail.material.opacity = 0.8 - (elapsedTime / duration);
//                     requestAnimationFrame(animate);
//                 } else {
//                     this.experience.scene.remove(trail);
//                     trail.geometry.dispose();
//                     trail.material.dispose();
//                 }
//             };
            
//             animate();
//         }
//     }

//     setSteering() {
//         document.addEventListener("keydown", (event) => {
//             switch (event.key) {
//                 case "w":
//                 case "ArrowUp":
//                     this.simpleCar.vehicle.setWheelForce(this.maxForce, 0)
//                     this.simpleCar.vehicle.setWheelForce(-this.maxForce, 1)
//                     break

//                 case 's':
//                 case 'ArrowDown':
//                     this.simpleCar.vehicle.setWheelForce(-this.maxForce * 0.5, 0)
//                     this.simpleCar.vehicle.setWheelForce(this.maxForce * 0.5, 1)
//                     break

//                 case 'a':
//                 case 'ArrowLeft':
//                     this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 2)
//                     this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 3)
//                     break

//                 case 'd':
//                 case 'ArrowRight':
//                     this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 2)
//                     this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 3)
//                     break

//                 case ' ':
//                     // Jump with limited uses
//                     this.jumpCar()
//                     break
                    
//                 case 'c':
//                     // Change car color
//                     this.changeCarColor()
//                     break
                    
//                 case 'b':
//                     // Turbo boost
//                     this.turboBoost()
//                     break
                    
//                 case 'r':
//                     // Full reset - just like the button
//                     window.location.reload()
//                     break
//             }
//         })

//         // Reset force on keyup
//         document.addEventListener('keyup', (event) => {
//             switch (event.key) {
//                 case 'w':
//                 case 'ArrowUp':
//                     this.simpleCar.vehicle.setWheelForce(0, 0)
//                     this.simpleCar.vehicle.setWheelForce(0, 1)
//                     break

//                 case 's':
//                 case 'ArrowDown':
//                     this.simpleCar.vehicle.setWheelForce(0, 0)
//                     this.simpleCar.vehicle.setWheelForce(0, 1)
//                     break

//                 case 'a':
//                 case 'ArrowLeft':
//                     this.simpleCar.vehicle.setSteeringValue(0, 2)
//                     this.simpleCar.vehicle.setSteeringValue(0, 3)
//                     break

//                 case 'd':
//                 case 'ArrowRight':
//                     this.simpleCar.vehicle.setSteeringValue(0, 2)
//                     this.simpleCar.vehicle.setSteeringValue(0, 3)
//                     break
//             }
//         })
//     }
// }

import SimpleCar from './SimpleCar.js'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class SimpleCarController {
    constructor() {
        this.experience = new Experience()
        this.simpleCar = new SimpleCar() // Get the singleton instance of SimpleCar
        this.maxSteerVal = Math.PI / 8
        this.maxForce = -25
        
        // Get Nintendo colors from the car model
        this.nintendoColors = this.simpleCar.simpleCarModel.getNintendoColors();
        
        // Jump counter
        this.jumpCount = 0
        this.maxJumps = 2
        this.isGrounded = true
        this.groundCheckInterval = null
        
        this.createResetButton()
        this.setSteering()
        this.setupGroundDetection()
    }

    createResetButton() {
        // Create reset button
        const resetButton = document.createElement('button')
        resetButton.id = 'reset-button'
        resetButton.textContent = 'RESET'
        
        // Reset functionality - Properly reload the scene
        resetButton.addEventListener('click', () => {
            window.location.reload()
        })
        
        document.body.appendChild(resetButton)
    }
    
    setupGroundDetection() {
        // Check if the car is on the ground every 100ms
        this.groundCheckInterval = setInterval(() => {
            // Get the chassis position
            const position = this.simpleCar.vehicle.chassisBody.position;
            
            // Ray starting from slightly above the car's position
            const start = new CANNON.Vec3(position.x, position.y - 0.4, position.z);
            const end = new CANNON.Vec3(position.x, position.y - 1.5, position.z);
            
            // Perform the raycast
            const result = new CANNON.RaycastResult();
            this.experience.worldPhysics.instance.rayTest(start, end, result);
            
            // If the ray hit something, the car is grounded
            if (result.hasHit) {
                if (!this.isGrounded) {
                    // We've just landed
                    this.isGrounded = true;
                    this.jumpCount = 0; // Reset jump count when landing
                    console.log("Car landed - jumps reset!");
                }
            } else {
                this.isGrounded = false;
            }
        }, 100);
    }

    jumpCar() {
        if (this.jumpCount < this.maxJumps) {
            // Apply an upward impulse at the center of mass
            this.simpleCar.vehicle.chassisBody.applyImpulse(
                new CANNON.Vec3(0, 60, 0), 
                new CANNON.Vec3(0, 0, 0)
            )
            this.jumpCount++
            this.isGrounded = false;
            console.log(`Jump! (${this.jumpCount}/${this.maxJumps})`)
        } else {
            console.log('No more jumps available until landing!')
        }
    }
    
    changeCarColor() {
        // Select random Nintendo-style color from our palette (excluding current color)
        let currentColor;
        if (this.simpleCar.chassisMesh && this.simpleCar.chassisMesh.children[0].material) {
            currentColor = this.simpleCar.chassisMesh.children[0].material.color.getHex();
        }
        
        let randomColor;
        do {
            randomColor = this.nintendoColors[Math.floor(Math.random() * this.nintendoColors.length)];
        } while (randomColor === currentColor && this.nintendoColors.length > 1);
        
        // Apply to main chassis
        if (this.simpleCar.chassisMesh && this.simpleCar.chassisMesh.children[0]) {
            const bodyMesh = this.simpleCar.chassisMesh.children[0];
            
            if (bodyMesh.material) {
                // Update main chassis
                bodyMesh.material.color.setHex(randomColor);
                bodyMesh.material.emissive = new THREE.Color(randomColor).multiplyScalar(0.15);
            }
        }
        
        // Add a little particle effect for fun
        this.createColorChangeEffect(this.simpleCar.chassisMesh.position);
        
        console.log('Color changed to Nintendo style!');
    }
    
    createColorChangeEffect(position) {
        // Create a simple particle system for color change effect
        const particleCount = 15;
        const particleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        
        for (let i = 0; i < particleCount; i++) {
            // Random Nintendo color for each particle
            const particleColor = this.nintendoColors[Math.floor(Math.random() * this.nintendoColors.length)];
            
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: particleColor,
                transparent: true,
                opacity: 1
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            // Position particles around the car
            particle.position.copy(position);
            particle.position.x += (Math.random() - 0.5) * 3;
            particle.position.y += (Math.random()) * 3;
            particle.position.z += (Math.random() - 0.5) * 5;
            
            this.experience.scene.add(particle);
            
            // Animate the particle
            const duration = 0.7 + Math.random() * 0.5;
            const startTime = this.experience.time.elapsed;
            
            const animate = () => {
                const elapsedTime = (this.experience.time.elapsed - startTime) / 1000;
                if (elapsedTime < duration) {
                    particle.position.y += 0.05;
                    particle.material.opacity = 1 - (elapsedTime / duration);
                    requestAnimationFrame(animate);
                } else {
                    this.experience.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            };
            
            animate();
        }
    }
    
    turboBoost() {
        // Apply a strong forward impulse
        const direction = new CANNON.Vec3()
        
        // Get the forward direction of the car
        this.simpleCar.vehicle.chassisBody.quaternion.vmult(
            new CANNON.Vec3(0, 0, 1), 
            direction
        )
        
        // Scale it up for a boost
        direction.scale(200, direction)
        
        // Apply the impulse
        this.simpleCar.vehicle.chassisBody.applyImpulse(
            direction,
            new CANNON.Vec3(0, 0, 0)
        )
        
        // Add a boost effect
        this.createBoostEffect(this.simpleCar.chassisMesh.position);
        
        console.log('Turbo Boost activated!')
    }
    
    createBoostEffect(position) {
        // Create a boost trail effect
        const trailCount = 20;
        const trailGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        
        for (let i = 0; i < trailCount; i++) {
            // Use flame colors for boost
            const trailColors = [0xFF5722, 0xFF9800, 0xFFEB3B];
            const trailColor = trailColors[Math.floor(Math.random() * trailColors.length)];
            
            const trailMaterial = new THREE.MeshBasicMaterial({
                color: trailColor,
                transparent: true,
                opacity: 0.8
            });
            
            const trail = new THREE.Mesh(trailGeometry, trailMaterial);
            
            // Get car direction and position behind it
            const direction = new THREE.Vector3();
            this.simpleCar.chassisMesh.getWorldDirection(direction);
            
            // Position behind car
            trail.position.copy(position);
            trail.position.x -= direction.x * (3 + Math.random() * 2);
            trail.position.y += 0.5;
            trail.position.z -= direction.z * (3 + Math.random() * 2);
            
            this.experience.scene.add(trail);
            
            // Animate the trail
            const duration = 0.5 + Math.random() * 0.3;
            const startTime = this.experience.time.elapsed;
            
            const animate = () => {
                const elapsedTime = (this.experience.time.elapsed - startTime) / 1000;
                if (elapsedTime < duration) {
                    trail.scale.multiplyScalar(0.95);
                    trail.material.opacity = 0.8 - (elapsedTime / duration);
                    requestAnimationFrame(animate);
                } else {
                    this.experience.scene.remove(trail);
                    trail.geometry.dispose();
                    trail.material.dispose();
                }
            };
            
            animate();
        }
    }

    setSteering() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    this.simpleCar.vehicle.setWheelForce(this.maxForce, 0)
                    this.simpleCar.vehicle.setWheelForce(-this.maxForce, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.simpleCar.vehicle.setWheelForce(-this.maxForce * 0.5, 0)
                    this.simpleCar.vehicle.setWheelForce(this.maxForce * 0.5, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 2)
                    this.simpleCar.vehicle.setSteeringValue(this.maxSteerVal, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 2)
                    this.simpleCar.vehicle.setSteeringValue(-this.maxSteerVal, 3)
                    break

                case ' ':
                    // Jump with limited uses
                    this.jumpCar()
                    break
                    
                case 'c':
                    // Change car color
                    this.changeCarColor()
                    break
                    
                case 'b':
                    // Turbo boost
                    this.turboBoost()
                    break
                    
                case 'r':
                    // Full reset - just like the button
                    window.location.reload()
                    break
            }
        })

        // Reset force on keyup
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.simpleCar.vehicle.setWheelForce(0, 0)
                    this.simpleCar.vehicle.setWheelForce(0, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.simpleCar.vehicle.setWheelForce(0, 0)
                    this.simpleCar.vehicle.setWheelForce(0, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.simpleCar.vehicle.setSteeringValue(0, 2)
                    this.simpleCar.vehicle.setSteeringValue(0, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.simpleCar.vehicle.setSteeringValue(0, 2)
                    this.simpleCar.vehicle.setSteeringValue(0, 3)
                    break
            }
        })
    }
}