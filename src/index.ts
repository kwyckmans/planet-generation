import * as PIXI from "pixi.js";

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
    let app = new PIXI.Application();

    // Display application properly
    document.body.style.margin = "0";
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";

    // View size = windows
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // Load assets
    await load(app);

    // I might need a rendertexture when generating my own planet texture
    // const t = PIXI.RenderTexture.create({width: p.width, height: p.height})
    // app.renderer.render(p, t);

    // Handle window resizing
    window.addEventListener("resize", (e) => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    // We need to create a quad first, this can be a square
    const geometry = new PIXI.Geometry()
        .addAttribute(
            "a_position",
            [
                // Specify all the points in the geometry
                -200,-200, // x, y
                200,-200, // x, y
                200,200,
                -200,200,
            ],
            2
        )
        .addAttribute("a_uv", [0, 0, 1, 0, 1, 1, 0, 1], 2)
        .addIndex([0, 1, 2, 0, 2, 3]); // Specify triangles with index in position

    let shaders = new PIXI.Program(
        app.loader.resources["assets/planet_vertex.glsl"].data,
        app.loader.resources["assets/planet.glsl"].data
    );

    const uniforms = {
        u_sampler2D: PIXI.Texture.from("/assets/earth_equirectangular.png"),
        time: 20,
    };

    let planet_shader = new PIXI.Shader(shaders, uniforms);

    // I'll need a mesh according to https://api.pixijs.io/@pixi/mesh/PIXI/Mesh.html
    let planet = new PIXI.Mesh(geometry, planet_shader);

    // TODO: replace with constants
    planet.position.set( window.innerWidth / 2, window.innerHeight /2)

    app.stage.addChild(planet);

    document.body.appendChild(app.view);

    // let context = {
    //     velocity: { x: 1, y: 1},
    //     // sprite
    // };

    // app.ticker.add(update, context);

    app.ticker.add((delta) => {
        planet.shader.uniforms.time -= 0.001;
    });
};

// Cannot be an arrow function. Arrow functions cannot have a 'this' parameter.
function update(this: any, delta: number) {
    if (
        this.sprite.x <= 0 ||
        this.sprite.x >= window.innerWidth - this.sprite.width
    ) {
        this.velocity.x = -this.velocity.x;
    }
    if (
        this.sprite.y <= 0 ||
        this.sprite.y >= window.innerHeight - this.sprite.height
    ) {
        this.velocity.y = -this.velocity.y;
    }
    this.sprite.x += this.velocity.x;
    this.sprite.y += this.velocity.y;
}

main();