import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import EventEmitter from "./EventEmitter.js"

export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length

        // console.log('Resources to load:', this.toLoad)

        this.loaded = 0

        // Create a loading manager
        this.loadingManager = new THREE.LoadingManager(() => {
            const loadingScreen = document.getElementById('loading-screen')
            loadingScreen.classList.add('fade-out')
            loadingScreen.addEventListener('transitionend', this.onTransitionEnd)
        })

        this.setLoaders()
        this.startLoading()
    }

    onTransitionEnd(event) {
        event.target.remove()
    }

    setLoaders() {
        this.loaders = {}
        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('/draco/')
        this.loaders.gltfLoader = new GLTFLoader(this.loadingManager)
        this.loaders.gltfLoader.setDRACOLoader(this.dracoLoader)
        this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager)
    }

    startLoading() {
        // Load each item
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (gltf) => {
                        this.sourceLoaded(source, gltf)
                    }
                )
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (texture) => {
                        this.sourceLoaded(source, texture)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file){
        this.items[source.name] = file

        this.loaded++

        if (this.loaded === this.toLoad) {
            this.trigger('ready')
        }

    }

}