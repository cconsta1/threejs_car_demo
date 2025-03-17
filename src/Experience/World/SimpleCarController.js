import SimpleCar from './SimpleCar.js'
import * as CANNON from 'cannon-es'

export default class SimpleCarController {
    constructor() {
        this.simpleCar = new SimpleCar() // Get the singleton instance of SimpleCar
        this.maxSteerVal = Math.PI / 8
        this.maxForce = -25

        this.setSteering()
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
                    // Apply an upward impulse at the center of mass
                    this.simpleCar.vehicle.chassisBody.applyImpulse(new CANNON.Vec3(0, 60, 0), new CANNON.Vec3(0, 0, 0))

                    console.log('Jump!')
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