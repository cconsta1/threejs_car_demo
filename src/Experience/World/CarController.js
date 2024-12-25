import CannonDebugger from 'cannon-es-debugger'
import Car from './Car.js'
import * as CANNON from 'cannon-es'


export default class CarController {
    constructor() {
        this.car = new Car() // Get the singleton instance of Car
        this.maxSteerVal = Math.PI / 8
        this.maxForce = 10

        this.setSteering()
    }

    setSteering() {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "w":
                case "ArrowUp":
                    this.car.vehicle.setWheelForce(this.maxForce, 0)
                    this.car.vehicle.setWheelForce(-this.maxForce, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.car.vehicle.setWheelForce(-this.maxForce * 0.5, 0)
                    this.car.vehicle.setWheelForce(this.maxForce * 0.5, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.car.vehicle.setSteeringValue(this.maxSteerVal, 2)
                    this.car.vehicle.setSteeringValue(this.maxSteerVal, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.car.vehicle.setSteeringValue(-this.maxSteerVal, 2)
                    this.car.vehicle.setSteeringValue(-this.maxSteerVal, 3)
                    break

                case ' ':
                    this.car.carPhysics.setCollisionDetection()
                    
                    // Apply an upward impulse at the center of mass
                    this.car.vehicle.chassisBody.applyImpulse(new CANNON.Vec3(0, 60, 0), new CANNON.Vec3(0, 0, 0))

                    console.log('Jump!')
                    break

            }
        })

        // Reset force on keyup
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.car.vehicle.setWheelForce(0, 0)
                    this.car.vehicle.setWheelForce(0, 1)
                    break

                case 's':
                case 'ArrowDown':
                    this.car.vehicle.setWheelForce(0, 0)
                    this.car.vehicle.setWheelForce(0, 1)
                    break

                case 'a':
                case 'ArrowLeft':
                    this.car.vehicle.setSteeringValue(0, 2)
                    this.car.vehicle.setSteeringValue(0, 3)
                    break

                case 'd':
                case 'ArrowRight':
                    this.car.vehicle.setSteeringValue(0, 2)
                    this.car.vehicle.setSteeringValue(0, 3)
                    break
            }
        })
    }
}