var express = require('express');
var router = express.Router();

module.exports.getRouter = function(io){
	var snakes = [];
	var count = 0;
	// We'll change this to whatever grid size is good.
	var xSize = 45;
	var ySize = 25;

	var generateLoc = function(){
		var result = {};
		// Later we'll make it so they are far from other snakes.. for now this is okay.
		result.x = Math.floor(Math.random() * (xSize + 1));
		result.y = Math.floor(Math.random() * (ySize + 1));
		return result;
	};

	var foodLoc = generateLoc();

	// Initializing 2d array for checking collisions
	var board = [];
	for (var i = 0; i<=ySize; i++){
		board[i] = [];
		for (var k = 0; k<=xSize; k++){
			board[i][k] = [];
		}
	}

	router.get('/', function(req, res, next) {
		res.render('index.html');
	});

	io.on('connection', function(socket){
		console.log('a user connected');
		var id = count++;
		var startLoc = generateLoc();
		snakes[snakes.length] = {id:id, locs: [startLoc], currDir: generateDir()};
		board[startLoc.x][startLoc.y][board[startLoc.x][startLoc.y].length] = id;
		socket.emit('initSnake', {myid:id, snakes: snakes, foodLoc: foodLoc});

		socket.on('turn', function(newDir){
			currDir = newDir;
		});
	});
	var update = function(){
		var fRelocNeeded = false;
		for (var i = 0; i < snakes.length; i++){
			var newHead = {};
			var lastHead = snakes[i].locs[snakes[i].locs.length-1];

			switch(snakes[i].currDir) {
				case 'up':
					newHead.x = lastHead.x;
					newHead.y = (lastHead.y + 1) % ySize;
					break;
				case 'down':
					newHead.x = lastHead.x;
					newHead.y = (lastHead.y - 1) % ySize;
					break;
				case 'left':
					newHead.y = lastHead.y;
					newHead.x = (lastHead.x - 1) % xSize;
					break;
				case 'right':
					newHead.y = lastHead.y;
					newHead.x = (lastHead.x + 1) % xSize;
					break;
				default:
					break;
			}
			snakes[i].locs[snakes[i].locs.length] = newHead;
			// If he just ate the food, we just dont truncate his length and then we make a new food
			if (!(newHead.x == foodLoc.x && newHead.y == newHead.y)){
				var ind = board[snakes[i].locs[0].x][snakes[i].locs[0].y].indexOf(snakes[i].id);
				if (ind > -1){
					board[snakes[i].locs[0].x][snakes[i].locs[0].y].splice(ind, 1);//Basically we remove the location from the list of blocks at the board location
				}else{console.log("Tried to remove a non-existant block");}
				snakes[i].locs.shift();//Normally we take off the end of the snake as it moves.
			}else{
				fRelocNeeded = true;
			}
		}
		for (var i = snakes.length - 1; i >= 0; i--) {
			if (board[snakes[i].locs[snakes[i].locs.length].x][snakes[i].locs[snakes[i].locs.length].y].length > 1){
				for (var k = 0; k < snakes[i].locs.length; k++){
					var ind = board[snakes[i].locs[k].x][snakes[i].locs[k].y].indexOf(snakes[i].id);
					if (ind > -1){
						board[snakes[i].locs[k].x][snakes[i].locs[k].y].splice(ind,1);
					}else{console.log("Tried to remove a non-existant block while deleting snake " + snakes[i].id);}
				}
				snakes.splice(i,1);
			}
		}

		if (fRelocNeeded){foodLoc = generateLoc();}
		io.emit('update',{snakes:snakes, foodLoc: foodLoc});
		setTimeout(update,50);
	};
	var checkCollision = function(head){
		for (var i = 0; i < snakes.length; i++) {
			snakes[i]
		};
	};
	var generateDir = function(){
		var n = Math.floor(Math.random() * (3 + 1));
		var selected;

		switch(n) {
			case 0:
				selected = 'up';
				break;
			case 1:
				selected = 'down';
				break;
			case 2:
				selected = 'left';
				break;
			case 3:
				selected = 'right';
				break;
			default:
				break;
		}

		return selected;
	};
	update();

	return router;
};
