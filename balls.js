var RandomColor = (function () {
	var min = 100, max = 200;

	function generateRandomColor() {
		var randColorValue = min + Math.ceil(Math.random() * (max - min));
		switch (Math.floor(Math.random() * 6)) {
			case 0:
			return {r: randColorValue, g: min, b: max};
			case 1:
			return {r: randColorValue, g: max, b: min};
			case 2:
			return {r: min, g: randColorValue, b: max};
			case 3:
			return {r: min, g: max, b: randColorValue};
			case 4:
			return {r: max, g: min, b: randColorValue};
			case 5:
			return {r: max, g: randColorValue, b: min};
		}
	}

	return {
		next: generateRandomColor
	};
})();

var RandomBalls = (function (RandomColor) {

	var balls = [];

	function changeColor(ele) {
		var rgb = RandomColor.next(),
			r = Math.floor(rgb.r),
			g = Math.floor(rgb.g),
			b = Math.floor(rgb.b);
		ele.css('background-color', 'rgb(' + r + ',' + b + ', ' + g + ')');
	}

	function getWindowSize() {
		var width, height;
		if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else if (document.body && document.body.clientWidth) {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		} else if (window.innerWidth) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		return {
			width: width,
			height: height
		};
	}

	function updateBallPosition(ball, wSize) {
		var pos = ball.position, speed = ball.speed, size = ball.size, $ball = ball.ele;
		if (pos.x + speed.x < size) {
			pos.x = size;
			speed.x = -speed.x;
			changeColor($ball);
		} else if (pos.x + speed.x > wSize.width - size) {
			pos.x = wSize.width - size;
			speed.x = -speed.x;
			changeColor($ball);
		} else {
			pos.x = pos.x + speed.x;
		}
		if (pos.y + speed.y < size) {
			pos.y = size;
			speed.y = -speed.y;
			changeColor($ball);
		} else if (pos.y + speed.y > wSize.height - size) {
			pos.y = wSize.height - size;
			speed.y = -speed.y;
			changeColor($ball);
		} else {
			pos.y = pos.y + speed.y;
		}
		$ball.css({
			left: pos.x,
			top: pos.y
		});
	}

	function randomValue(min, max) {
		return min + Math.floor(Math.random() * (max - min));
	}

	function getRandomBall(maxX, maxY) {
		return {
			position: {
				x: randomValue(0, maxX),
				y: randomValue(0, maxY)
			},
			size: randomValue(10, 100),
			speed: {
				x: (Math.random() > 0.5 ? 1 : -1) * randomValue(1, 6),
				y: (Math.random() > 0.5 ? 1 : -1) * randomValue(1, 6)
			}
		};
	}

	function init() {
		$.each(balls, function (i, ball) {
			ball.ele = $('<div>').addClass('ball').css({
				height: ball.size * 2,
				width: ball.size * 2,
				'border-radius': ball.size,
				'margin-left': -ball.size,
				'margin-top': -ball.size,
				left: ball.position.x,
				top: ball.position.y
			}).appendTo('body');
			changeColor(ball.ele);
		});
		return this;
	}

	var timer;

	function start() {
		if (timer) {
			stop();
		}
		timer = setInterval(function () {
			var wSize = getWindowSize(), i = balls.length - 1, ball;
			while (ball = balls[i--]) {
				updateBallPosition(ball, wSize);
			}
		}, 40);
	}

	function stop() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	}

	function addBalls(num) {
		var wSize = getWindowSize();
		while (num--) {
			balls.push(getRandomBall(wSize.width, wSize.height));
		}
		return this;
	}

	function clearBalls() {
		balls = [];
	}

	return {
		init: init,
		start: start,
		stop: stop,
		add: addBalls,
		clear: clearBalls
	};

})(RandomColor);