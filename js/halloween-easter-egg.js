import './equery.js';

class Bat {
    constructor(elt, options) {
        this.options = options;

        this.initialize(elt);
    }
    initialize(body) {
        this.bat = EQuery.elemt('div', null, 'halloween-bat');

        this.x = this.randomPosition('horizontal');
        this.y = this.randomPosition('vertical');
        this.tx = this.randomPosition('horizontal');
        this.ty = this.randomPosition('vertical');
        this.dx = -5 + Math.random() * 10;
        this.dy = -5 + Math.random() * 10;
        this.theta = 0;
        this.positionUpdateTimer = this.getPositionUpdateTime();

        this.frame = Math.random() * this.options.frames;
        this.frame = Math.round(this.frame);
        this.bat.css(`position: absolute;left: ${this.x}px;top: ${this.y}px;z-index: $${this.options.zIndex};width: ${this.options.width}px;height: ${this.options.height}px;transistion: all .3s;background-image: url('${this.options.image}');background-repeat: no-repeat`);
        body.append(this.bat);
    }

    /**
     * @returns {number}
     * @private
     */
    getPositionUpdateTime() {
        return 0.5 + Math.random();
    }

    /**
     * @param {string} direction
     * @returns {number}
     */
    randomPosition(direction) {
        let screenLength, imageLength;

        if (direction === 'horizontal') {
            screenLength = innerWidth;
            imageLength = this.options.width;
        }
        else {
            screenLength = innerHeight;
            imageLength = this.options.height;
        }

        return Math.random() * (screenLength - imageLength);
    }

    move(deltaTime) {
        let left, top, length, dLeft, dTop, ddLeft, ddTop;

        left = this.tx - this.x;
        top = this.ty - this.y;

        length = Math.sqrt(left * left + top * top);
        length = Math.max(1, length);

        dLeft = this.options.speed * (left / length);
        dTop = this.options.speed * (top / length);

        ddLeft = (dLeft - this.dx) / this.options.flickering;
        ddTop = (dTop - this.dy) / this.options.flickering;

        this.dx += ddLeft * deltaTime * 25;
        this.dy += ddTop * deltaTime * 25;

        if (this.dx !== 0 || this.dy !== 0) {
            this.theta = Math.atan2(this.dy, this.dx);
        }

        this.x += this.dx * deltaTime * 25;
        this.y += this.dy * deltaTime * 25;

        this.x = Math.max(0, Math.min(this.x, innerWidth - this.options.width));
        this.y = Math.max(0, Math.min(this.y, innerHeight - this.options.height));

        this.applyPosition();

        this.positionUpdateTimer -= deltaTime;
        if (this.positionUpdateTimer < 0) {
            this.tx = this.randomPosition('horizontal');
            this.ty = this.randomPosition('vertical');

            this.positionUpdateTimer = this.getPositionUpdateTime();
        }
    }

    applyPosition() {
        this.bat.css(`left: ${this.x}px;top: ${this.y}px;transform: rotate(${this.theta + 90}rad);`);
    }

    animate(deltaTime) {
        let frame;

        this.frame += 5 * deltaTime;

        if (this.frame >= this.options.frames) {
            this.frame -= this.options.frames;
        }

        frame = Math.floor(this.frame);
        this.bat.css(`background-position: 0  ${(frame * -this.options.height)}px`);
    }
}

const halloweenBats = function (options) {
    let _window = EQuery(window),
        target,
        plugin,
        isRunning = false,
        isActiveWindow = true,
        bats = [],
        defaults = {
            image: './assets/bats.png', // Path to the image.
            zIndex: 10000, // The z-index you need.
            amount: 20, // Bat amount.
            width: 35, // Image width.
            height: 20, // Animation frame height.
            frames: 4, // Amount of animation frames.
            speed: 20, // Higher value = faster.
            flickering: 15, // Higher value = slower.
            target: 'body' // Target element
        };

    options = EQuery.copyObj(options, defaults, true);

    target = EQuery(options.target);

    innerWidth = target.width();
    innerHeight = target.height();

    plugin = {
        isRunning: false,
        start: function () {
            let lastTime = Date.now();
            isRunning = true;
            function animate() {
                const time = Date.now(),
                    deltaTime = (time - lastTime) / 1000;

                lastTime = time;

                if (isActiveWindow) {
                    bats.forEach((bat, index) => {
                        bat.move(deltaTime);
                        bat.animate(deltaTime);
                    });
                }

                if (isRunning) {
                    requestAnimationFrame(animate);
                }
            }

            animate();
        },
        stop: function () {
            isRunning = false;
        }
    };

    while (bats.length < options.amount) {
        bats.push(new Bat(target, options));
    }

    plugin.start();

    _window.resize(function () {
        innerWidth = target.innerWidth();
        innerHeight = target.innerHeight();
    });

    _window.focus(function () {
        isActiveWindow = true;
    });

    _window.blur(function () {
        isActiveWindow = false;
    });

    return plugin;
}

const halloweenFog = function (target) {
    target.css('border-radius: 20% 30% 30% 20%;width: 5000px;height: 100%;margin-left: -70vw;-webkit-animation-name: slide;animation-name: slide;-webkit-animation-duration: 60s;animation-duration: 60s;-webkit-animation-iteration-count: infinite;animation-iteration-count: infinite;-webkit-animation-timing-function: ease-out;animation-timing-function: ease-out;filter: blur(15px);opacity: .6')
    function getRandomBetween(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function getPosOrNeg() {
        if (Math.random() < 0.5) return -1;
        else return 1;
    }

    function init() {
        let a, sx, sy, e1x, e1y, cp1x, cp1y, cp2x, cp2y, e2x, e2y, cp1xb, cp1yb, cp2xb, cp2yb;

        let numberOfLines = 30;
        //canvas is mapped to a grid 1000 x 1000, then stretched in css to fit
        for (let i = 0; i < numberOfLines; i++) {
            sx = getRandomBetween(10, 400);
            sy = getRandomBetween(100, 900);

            e1x = sx + getRandomBetween(200, 400);
            e1y = sy + getRandomBetween(100, 500) * getPosOrNeg();

            e2x = sx + getRandomBetween(500, 800);
            e2y = getRandomBetween(100, 900);

            cp1x = Math.round((e1x - sx) / 3); //+sx
            cp1y = sy - getRandomBetween(100, 700);
            cp2x = Math.round((e1x - sx) * 2 / 3); //+sx
            cp2y = e1y + getRandomBetween(100, 700);

            //s2x = e1x and s2y = e2y;
            cp1xb = Math.round((e2x - e1x) / 3 + e1x);
            cp1yb = e1y - getRandomBetween(100, 700);
            cp2xb = Math.round((e2x - e1x) * 2 / 3 + e1x);
            cp2yb = e2y + getRandomBetween(100, 700);

            // get random alpha value between 0.3 and 0.6
            a = Math.random() * (0.5 - 0.2) + 0.2;

            draw(sx, sy, e1x, e1y, cp1x, cp1y, cp2x, cp2y, e2x, e2y, cp1xb, cp1yb, cp2xb, cp2yb, a);
        }
    }

    function draw(startCurveX, startCurveY, end1CurveX, end1CurveY, ctrlPt1X, ctrlPt1Y, ctrlPt2X, ctrlPt2Y, end2CurveX, end2CurveY, ctrlPt1Xb, ctrlPt1Yb, ctrlPt2Xb, ctrlPt2Yb, alphaVal) {
        let ctx = target.ctx;
        let protoFogLine = new Path2D();

        protoFogLine.moveTo(startCurveX, startCurveY);
        protoFogLine.bezierCurveTo(ctrlPt1X, ctrlPt1Y, ctrlPt2X, ctrlPt2Y, end1CurveX, end1CurveY);
        protoFogLine.bezierCurveTo(ctrlPt1Xb, ctrlPt1Yb, ctrlPt2Xb, ctrlPt2Yb, end2CurveX, end2CurveY);

        ctx.strokeStyle = 'rgba(255, 255, 255, ' + alphaVal + ')';
        ctx.lineWidth = getRandomBetween(8, 80);
        //ctx.lineWidth = 4;
        ctx.stroke(protoFogLine);

    }
    init();
}

export { halloweenBats, halloweenFog }