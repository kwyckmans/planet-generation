import * as PIXI from 'pixi.js';


const load = (app: PIXI.Application) => {
    return new Promise((resolve) => {
        app.loader
            .add("assets/test.glsl")
            .add("assets/earth_equirectangular")
            .load(() => {
                resolve();
        });
    });
};

const main = async () => {
    // Actual app
    let app = new PIXI.Application({backgroundColor: 0x222222})

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
    const earth = PIXI.Sprite.from('assets/earth_equirectangular');
    earth.anchor.set(0.5);

    document.body.appendChild(app.view);

    let context = {
        velocity: { x: 1, y: 1},
        // sprite
    };

    // app.ticker.add(update, context);
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
