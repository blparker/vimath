# Vimath (VIsual MATH)

Vimath is a browser library for creating animatable and interactive visualizations. While it's general and flexible enough for any visualizations
it's been built with math education and math visualizations in mind. Vimath is heavily inspired by the work Grant Sanderson (3Blue1Brown) has been doing with the the manim Python library.

## Documentation
https://bryan.blog/vimath/

## Getting started

### Installing

```npm install vimath --save```

### Example usage

```ts
import { Scene, Square } from 'vimath';

class TestScene extends Scene {
    compose() {
        const s = new Square();
        this.add(s);

        return this;
    }
}

new TestScene().compose().render();
```

#### Output
![alt text](assets/image.png)

## Playground

I created a [little playground](https://vimath-editor.bryan.blog) where you can write/modify Vimath snippets and see the updates in real time. The playground also allows you to save your snippets so they can be embedded into web pages, Notion, Jupyter Notebooks, etc:

> Vimath Playground: https://vimath-editor.bryan.blog

![alt text](assets/vimath_playground.png)