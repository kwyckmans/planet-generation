import * as PIXI from 'pixi.js';


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
    let app = new PIXI.Application()

    // Display application properly
    document.body.style.margin = '0';
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';

    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);
   
    // // Draw a circle
    // const p = new PIXI.Graphics();
    // p.beginFill(0x000000)
    // p.lineStyle(0)
    // p.drawCircle(window.innerWidth / 2 - 60, window.innerHeight /2 - 60,120)
    // p.endFill();
    
    // const t = PIXI.RenderTexture.create({width: p.width, height: p.height})
    // app.renderer.render(p, t);

    // // Make a sprite from texture, no idea why though
    // // const sprite = new PIXI.Sprite(t);
    // // sprite.x = 100;

    // app.stage.addChild(p)

    // Load a shader and apply it through a filter
    // // Why through a filter? How does the filter work?
    // const filter = new PIXI.Filter('', app.loader.resources["assets/test.glsl"].data);
    // p.filters = [filter]

    // I can use Circle to create a mask to show part of the equirectangular picture.
    // Unsure if I can just put the image over a circle and rotate it?
    // let planet = new PIXI.Circle(10, 10, 2)

    // Handle window resizing
    window.addEventListener('resize', (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
        // sprite.x = window.innerWidth / 2 - sprite.width / 2;
        // sprite.y = window.innerHeight / 2 - sprite.height / 2;
    });


    //Show a planet
    // const earth = PIXI.Sprite.from('assets/earth_equirectangular');

    // We need to create a quad first, this can be a square
    const geometry = new PIXI.Geometry()
            .addAttribute("a_position",[ // Specify all the points in the geometry
                -100, -100, // x, y
                100, -100, // x, y
                100, 100,
                -100, 100], 2)
                
            .addAttribute('a_uv', [
                0,0,
                1,0,
                1,1,
                0,1
            ],2)
            // .addAttribute('a_color', [
            //     1, 0, 0,
            //     0, 1, 0,
            //     0, 0, 1,
            //     1, 0, 0,
            // ], 3)
            .addIndex([0, 1, 2, 0, 2, 3]); // Specify triangles with index in position
            

    let shaders = new PIXI.Program( app.loader.resources["assets/planet_vertex.glsl"].data, app.loader.resources["assets/planet.glsl"].data);

    const uniforms = {
        u_sampler2D: PIXI.Texture.from('/assets/earth_equirectangular.png'),
        time: 20,
    };

    let planet_shader = new PIXI.Shader(shaders, uniforms);

    // // I'll need a mesh according to https://api.pixijs.io/@pixi/mesh/PIXI/Mesh.html
    let planet = new PIXI.Mesh(geometry, planet_shader);
    planet.position.set(400, 300)
    planet.scale.set(2)
    // planet.texture = texture;
    app.stage.addChild(planet);

    document.body.appendChild(app.view);

    // let context = {
    //     velocity: { x: 1, y: 1},
    //     // sprite
    // };

    // app.ticker.add(update, context);

    app.ticker.add((delta) => {
        planet.shader.uniforms.time -= 0.001;
    })
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {
    if (this.sprite.x <= 0 || this.sprite.x >= window.innerWidth - this.sprite.width) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.sprite.y <= 0 || this.sprite.y >= window.innerHeight - this.sprite.height) {
        this.velocity.y = -this.velocity.y;
    }
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
};

main();

/**
 * Taken from https://pixijs.io/examples/#/mesh-and-shaders/triangle-textured.js
 */
// const app = new PIXI.Application();
// document.body.appendChild(app.view);

// app.loader
//     .add("assets/planet.glsl")
//     .add("assets/planet_vertex.glsl")
//     .load()

// const geometry = new PIXI.Geometry()
//     .addAttribute('aVertexPosition', // the attribute name
//         [-100, -50, // x, y
//             100, -50, // x, y
//             0.0, 100.0], // x, y
//         2) // the size of the attribute
//     .addAttribute('aTextureCoord',[
//         0, 0,
//         0,0,
//         0,0
//     ], 2
//     )
//     .addAttribute('aColor', // the attribute name
//         [1, 0, 0, // r, g, b
//             0, 1, 0, // r, g, b
//             0, 0, 1], // r, g, b
//         3); // the size of the attribute

// const shader = PIXI.Shader.from( app.loader.resources["assets/planet_vertex.glsl"].data)

// const triangle = new PIXI.Mesh(geometry, shader);
// triangle.position.set(400, 300);
// triangle.scale.set(2);

// app.stage.addChild(triangle);

// app.ticker.add((delta) => {
//     triangle.rotation += 0.01;
// });

/**
 * Taken from https://pixijs.io/examples/?v=v5.3.8#/mesh-and-shaders/interleaving-geometry.js
 */

// const app = new PIXI.Application();
// document.body.appendChild(app.view);

// const geometry = new PIXI.Geometry()
//     .addAttribute('aVertexPosition', // the attribute name
//         [-100, -100, // x, y
//             100, -100, // x, y
//             100, 100,
//             -100, 100], // x, y
//         2) // the size of the attribute
//     .addAttribute('aUvs', // the attribute name
//         [0, 0, // u, v
//             1, 0, // u, v
//             1, 1,
//             0, 1], // u, v
//         2) // the size of the attribute
//     .addIndex([0, 1, 2, 0, 2, 3]);

// const vertexSrc = `

//     precision mediump float;

//     attribute vec2 aVertexPosition;
//     attribute vec2 aUvs;

//     uniform mat3 translationMatrix;
//     uniform mat3 projectionMatrix;

//     varying vec2 vUvs;

//     void main() {

//         vUvs = aUvs;
//         gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);

//     }`;

// const fragmentSrc = `

//     precision mediump float;

//     varying vec2 vUvs;

//     uniform sampler2D uSampler2;
//     uniform float time;

//     void main() {

//         gl_FragColor = texture2D(uSampler2, vUvs + sin( (time + (vUvs.x) * 14.) ) * 0.1 );
//     }`;

// const uniforms = {
//     uSampler2: PIXI.Texture.from('/assets/earth_equirectangular.png'),
//     time: 0,
// };

// const shader = PIXI.Shader.from(vertexSrc, fragmentSrc, uniforms);

// const quad = new PIXI.Mesh(geometry, shader);

// quad.position.set(400, 300);
// quad.scale.set(2);

// app.stage.addChild(quad);

// // start the animation..
// // requestAnimationFrame(animate);

// app.ticker.add((delta) => {
//     quad.rotation += 0.01;
//     quad.shader.uniforms.time += 0.1;
// });