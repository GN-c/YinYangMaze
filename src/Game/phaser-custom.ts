import type Phaser from "phaser";
require("polyfills");

var CONST = require("const");
var Extend = require("utils/object/Extend");

var phaser = {
  Cameras: {
    Scene2D: require("cameras/2d"),
  },
  Scene: require("scene/Scene"),
  Scenes: require("scene"),
  Events: require("events/index"),
  Animations: require("animations"),
  Game: require("core/Game"),
  GameObjects: {
    DisplayList: require("gameobjects/DisplayList"),
    UpdateList: require("gameobjects/UpdateList"),

    Image: require("gameobjects/image/Image"),
    Arc: require("gameobjects/shape/arc/Arc"),

    BitmapText: require("gameobjects/bitmaptext/static/BitmapText"),

    Factories: {
      Image: require("gameobjects/image/ImageFactory"),
      BitmapText: require("gameobjects/bitmaptext/static/BitmapTextFactory"),
    },
    Creators: {
      Graphics: require("gameobjects/graphics/GraphicsCreator"),
    },
  },

  Sound: require("sound"),
  Input: require("input"),

  Display: {
    Masks: require("display/mask"),
  },

  Utils: {
    Array: require("utils/Array"),
  },
  Tweens: require("tweens"),
  Math: {
    Easing: {
      Bounce: require("math/easing/bounce"),
      Back: require("math/easing/back"),
    },
    Snap: require("math/Snap"),
    Between: require("math/Between"),
    Vector2: require("math/Vector2"),
    Angle: {
      Between: require("math/Angle/Between"),
    },
    Distance: {
      Between: require("math/Distance/DistanceBetween"),
    },
  },
  Scale: require("scale"),
} as unknown as typeof Phaser;
//  Merge in the consts

phaser = Extend(false, phaser, CONST);

global.Phaser = phaser;
//  Export it
export default phaser;
