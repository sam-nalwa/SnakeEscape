var express = require('express');
var router = express.Router();

module.exports.getRouter = function(io){
	var snakes = [];
	var count = 0;
	// We'll change this to whatever grid size is good.
	var xSize = 100;
	var ySize = 100;

	var generateLoc = function(){
		var result = {};
		// Later we'll make it so they are far from other snakes.. for now this is okay.
		result.x = Math.floor(Math.random() * (xSize + 1));
		result.y = Math.floor(Math.random() * (ySize + 1));
		return result;
	};
	
	var foodLoc = generateLoc();

	router.get('/', function(req, res, next) {
		res.render('index.html');
	});

	io.on('connection', function(socket){
		console.log('a user connected');
		var id = count++;
		snakes[snakes.length] = {id:id, locs: [generateLoc()], currDir: generateDir()};

		socket.emit('initSnake', {myid:id, snakes: snakes, foodLoc: foodLoc});

		socket.on('turn', function(newDir){
			currDir = newDir;
		});
	});
	var update = function(){
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
				snakes[i].locs.shift();//Normally we take off the end of the snake as it moves.
			}else{
				foodLoc = generateLoc();
			}
		}
		io.emit('update',{snakes:snakes, foodLoc: foodLoc});
		setTimeout(update,50);
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
	return router;
};
