import * as PIXI from "pixi.js";
import { makeNoise2D, makeNoise4D } from "open-simplex-noise";

// https://github.com/joshforisha/open-simplex-noise-js
const noise2D = makeNoise2D(Math.random()); 
const noise4D = makeNoise4D(getRandomInt(0, 1000));

const load = (app: PIXI.Application) => {
    return new Promise((resolve) => {
        app.loader
            .add("assets/test.glsl")
            .add("assets/planet.glsl")
            .add("assets/planet_vertex.glsl")
            .add("assets/earth_equirectangular.png")
            .load(() => {
                resolve();
            });
    });
};

const main = async () => {
    // Actual app
    let app = new PIXI.Application({backgroundColor: 0x302535});

    // Display application properly
    document.body.style.margin = "0";
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";

    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);

    // Handle window resizing
    window.addEventListener("resize", (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    const width = 250; 
    const height = 125;

    // We need to create a quad first, this can be a square
    const geometry = generateGeometry();

    let planet_texture = generateTexture(width, height);
    let planet_sprite = PIXI.Sprite.from(planet_texture);

    const uniforms = {
        // u_sampler2D: PIXI.Texture.from("/assets/earth_equirectangular.png"),
        u_sampler2D: planet_texture,
        time: 0,
    };

    let shaders = new PIXI.Program(
        app.loader.resources["assets/planet_vertex.glsl"].data,
        app.loader.resources["assets/planet.glsl"].data
    );

    let planet_shader = new PIXI.Shader(shaders, uniforms);

    // I'll need a mesh according to https://api.pixijs.io/@pixi/mesh/PIXI/Mesh.html
    let planet = new PIXI.Mesh(geometry, planet_shader);

    // TODO: replace with constants
    planet.position.set( window.innerWidth / 2, window.innerHeight /2)

    app.stage.addChild(planet);
    // app.stage.addChild(planet_sprite);
    document.body.appendChild(app.view);

    app.ticker.add((delta) => {
        planet.shader.uniforms.time -= 0.005;
    });
};


main();

function generateGeometry(): PIXI.Geometry {
    return new PIXI.Geometry()
    .addAttribute(
        "a_position",
        [
            // Specify all the points in the geometry
            -100,-100, // x, y
            100,-100, // x, y
            100,100,
            -100,100,
        ],
        2
    )
    .addAttribute("a_uv", [0, 0, 1, 0, 1, 1, 0, 1], 2)
    .addIndex([0, 1, 2, 0, 2, 3]); // Specify triangles with index in position
}

function generateTexture(width: number, height: number): PIXI.Texture {
    const size = width * height * 4; // 400
    let buffer = new Uint8Array(size);

    for (let y = 0; y < height; y++){    
        for (let x = 0; x < width; x++) { // buffer needs to be filled line by line.

            // let value = noise2D(x/100, y/100);
            let index = ((x+y) + (y * (width - 1))) * 4 

            let x1=0;
            let x2=5;
            let y1=0;
            let y2=5;
           
            let s: number=x/width
            let t: number=y/height
            let dx=x2-x1
            let dy=y2-y1

            // console.log(s, t, dx, dy);
    
            let nx=x1+Math.cos(s*2*Math.PI)*dx/(2*Math.PI)
            let ny=y1+Math.cos(t*2*Math.PI)*dy/(2*Math.PI)
            let nz=x1+Math.sin(s*2*Math.PI)*dx/(2*Math.PI)
            let nw=y1+Math.sin(t*2*Math.PI)*dy/(2*Math.PI)

            let value = Math.abs(noise4D(nx,ny,nz,nw));

            // Gas giant values: 0.1, 0.3, the rest
            if (value < 0.1){ //water 
                buffer[index] = 47;
                buffer[index + 1] = 86;
                buffer[index + 2] = 118;
                buffer[index + 3] = 255;
            } else if (value < 0.2) {
                buffer[index] = 62;
                buffer[index + 1] = 120;
                buffer[index + 2] = 160;
                buffer[index + 3] = 255;
            
            } else if (value < 0.3) {
                buffer[index] = 166;
                buffer[index + 1] = 229;
                buffer[index + 2] = 155;
                buffer[index + 3] = 255;
            }
            else if (value < 0.50) {
                buffer[index] = 146;
                buffer[index + 1] = 209;
                buffer[index + 2] = 135;
                buffer[index + 3] = 255;
            }
            else {
                buffer[index] = 139;
                buffer[index + 1] = 69;
                buffer[index + 2] = 19;
                buffer[index + 3] = 255;
            }
        }
    }

    let planet_texture = PIXI.Texture.fromBuffer(buffer, width, height);
    return planet_texture;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }