var canvas, context, connection, playerID;
var boardWidth=900;
var boardHeight=500;
var blockDimention=20;

var serverAddress='http://localhost:1337'

connection = io.connect(serverAddress);
connection.on('initSnake', function (data)
{
    console.log('Connect Player ID' + data.myid);
    playerID = data.myid;
});

connection.on('update', function (data)
{
    drawBoard(data);
});

connection.on('died'+playerID, function(data)
{
	console.log('dead fish');
});



$(function ()
{
    canvas = $('#board');
    context = canvas.get(0).getContext('2d');
    //playerJoin();
    context.fillStyle = '#CCC';
    playerKeystroke();


});


function playerJoin() {

}

function playerKeystroke()
{
    var direction;

    $(document).keydown(function (a)
    {
        var key = a.keyCode;

        switch (key)
        {
        	// up keyboard key
            case 38: 
                    direction = 'up';
            break;

            //down keyboard key
            case 40: 
                    direction = 'down';
            break;

         	// left keyboard key   
            case 37: 
                    direction = 'left';
            break;

            // right keyboard key
            case 39: 
                    direction = 'right';
             break;

            //default:
            //      direction = 'right';

            break;
        }

        connection.emit('turn', direction);
    });
}

function drawBoard(data){


	context.fillStyle = '#CCC';

	//drawing the board
	for (var i=0; i<boardWidth; i++)
	{
	    for (var j=0; j<boardHeight; j++)
	    {
	        context.fillRect(i * blockDimention, j * blockDimention, blockDimention - 1, blockDimention - 1);
	    }
	}

	//drawing the snakes
	snakes=data.snakes;
	for(i in snakes)
    {
    	console.log("we here");
        var snake = snakes[i],
        snakeLength = snake.locs.length;
        console.log(snake);
        console.log(snakeLength);

        //drawing the snake
        for (var j=0; j<snakeLength; j++)
        {
            var element = snake.locs[j],
                x = element.x * blockDimention,
                y = element.y * blockDimention;
                console.log(x);
                console.log(y);
           
            if(snake.id=1)
            {
                context.fillStyle = 'rgb(255, 0, 0)';
            }

            else
            {
                context.fillStyle = 'rgb(255, 255, 255)';
            }

            context.fillRect(x, y, blockDimention - 1, blockDimention -1);
        }
    }
    
}