import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import SimpleCar from "./SimpleCar.js";
import SimpleCarController from "./SimpleCarController.js";
import RampAndPlatform from "./RampAndPlatform.js"; // Add this import

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // Setup immediately - no need to wait for resources
        this.floor = new Floor()
        this.simpleCar = new SimpleCar()
        this.simpleCarController = new SimpleCarController()
        this.rampAndPlatform = new RampAndPlatform() // Add this line
        this.environment = new Environment()
    }
}