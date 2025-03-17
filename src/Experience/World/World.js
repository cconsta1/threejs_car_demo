import Experience from "../Experience.js";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
// import Car from "./Car.js";
import SimpleCar from "./SimpleCar.js";
import SimpleCarController from "./SimpleCarController.js";

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor()
            // this.car = new Car()
            this.simpleCar = new SimpleCar()
            this.simpleCarController = new SimpleCarController()
            this.environment = new Environment()
        })
    }
}