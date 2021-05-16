# 2D Planet generation in PIXI.js

PIXI.js set-up based on [pixijs-typescript-starter](https://github.com/GuillaumeDesforges/pixijs-typescript-starter/) by @GuillaumeDesforges. Beware there is (at the time of writing this) an issue with this starter and the vs code debugger, more info in the [issue](https://github.com/GuillaumeDesforges/pixijs-typescript-starter/issues/8).

## Requirements

- Node JS and NPM
- VS Code
- A browser (tested in Chrome and Firefox)

## Setup

```bash
npm install
```

## Development

Launch the `Complete development` launch configuration by running

```unix
npm run dev
```

## Resources

- [Planet Generator](https://github.com/ZKasica/Planet-Generator/) by @ZKasica
- [2D representation of a rotating sphere](https://gamedev.stackexchange.com/questions/9346/2d-shader-to-draw-representation-of-rotating-sphere)
- [Uniforms in Pixi.js](https://pixijs.io/examples/?v=v5.3.8#/mesh-and-shaders/uniforms.js)
- [Pixel shader basics](http://wiki.winamp.com/wiki/Pixel_Shader_Basics)
- [Textured triangle in Pixi.js](https://pixijs.io/examples/#/mesh-and-shaders/triangle-textured.js)

### Tileable noise mpas

- https://ronvalstar.nl/creating-tileable-noise-maps (did not use this)

- Used https://gamedev.stackexchange.com/questions/23625/how-do-you-generate-tileable-perlin-noise/23639#23639 which uses:
- https://www.gamedev.net/blog/33/entry-2138456-seamless-noise/