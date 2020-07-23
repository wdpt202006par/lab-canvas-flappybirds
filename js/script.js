window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
	};
	
	let canvas = document.getElementById('my-canvas');
	canvas.width = 800;
	canvas.height = 450;
	let ctx = canvas.getContext('2d');

	//////////////Board

	function Board(){
		this.x = 0;
		this.y = 0;
		this.width = canvas.width;
		this.height = canvas.height;
		this.img = new Image();
		this.img.src = "images/bg.png";
		this.score = 0;

		this.img.onload = function(){
			this.draw();
		}.bind(this);

		this.move = function(){
			this.x -=15;
			if (this.x < -canvas.width)
				this.x = 0;
		};

		this.draw = function(){
			this.move();
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			ctx.drawImage(this.img, this.x + canvas.width, this.y, this.width, this.height);
		};

		this.drawScore = function(){
			this.score = Math.floor(frames / 30);
			ctx.font = "50px sans-serif";
			ctx.fillStyle = "Black";
			ctx.fillText(this.score, this.width / 2, this.y+50);
		}

	}
	
	///////// Flappy
	function Flappy(){
		this.x = 150;
		this.y = 150;
		this.width = 60;
		this.height = 50;
		this.img = new Image();
		this.img.src = "images/flappy.png";

		this.img.onload = function(){
			this.draw();
		}.bind(this);

		this.draw = function(){
			this.y +=1;
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
			if(this.y < 0 || this.y > canvas.height - this.height) {
				gameOver();
			}
		};

		this.move = function(){
			this.y -= 50;
		};

		this.isTouching = function(pipe){
			return (this.x < pipe.x + pipe.width) && 
			(this.x + this.width > pipe.x) &&
			(this.y < pipe.y + pipe.height) &&
			(this.y + this.height > pipe.y);
		};
	}

	///////// Declarations

	let board = new Board();
	let flappy = new Flappy();
	let pipes = [];

	let interval;
	let frames = 0;

	//////////// Pipes
	function Pipe(y, height) {
		this.x = canvas.width;
		this.y = y;
		this.width = 50;
		this.height = height;
		this.draw = function(){
			this.x--;
			this.img = new Image();
			this.img.src = "images/obstacle_bottom.png";

			this.img.onload = function() {
				this.draw();
			}.bind(this);
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);

			this.img2 = new Image();
			this.img2.src = "images/obstacle_top.png";

			this.img.onload = function(){
				this.draw();
			}.bind(this);
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		};
	}

	function generatePipes(){
		if(!(frames % 100 ===0)) return;
		let gap = 200;
		let randomHeight = Math.floor(Math.random() * 200) + 50;
		let pipe = new Pipe(0, randomHeight);
		let pipe2 = new Pipe(randomHeight + gap, canvas.height - (randomHeight + gap));
		pipes.push(pipe);
		pipes.push(pipe2);
	}

	function drawPipes() {
		pipes.forEach(function(pipe){
			pipe.draw();
		});
	}

	function gameOver(){
		stopGame();
		ctx.font = "100px arial";
		ctx.strokeStyle = "blue";
		ctx.lineWidth = 7;
		ctx.strokeText("Game Over", 115, 185);
		ctx.font = "40px courier";
		ctx.fillStyle = "green";
		ctx.fillText('Click StartGame to Restart', 40, 250);
	}

	function checkCollition(){
		pipes.forEach(function(pipe){
			if(flappy.isTouching(pipe))
				gameOver();
		});
	}

	//////////// Update

	function update(){

		generatePipes();
		frames++;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		board.draw();
		flappy.draw();
		drawPipes();
		board.drawScore();
		checkCollition();
	}

  function startGame() {
		if(interval > 0) return;

		interval = setInterval(function(){
			update();
		}, 1000 / 70);
		flappy.y = 150;
		pipes = [];
		board.score = 0;
		frames = 0;
	}
	
	function stopGame(){
		clearInterval(interval);
		interval = 0;
	}

	addEventListener('keydown', function(e){
		if (e.keyCode === 32){
			flappy.move();
		} 
		if(e.keyCode === 82){
			startGame();
		}
	});
};
