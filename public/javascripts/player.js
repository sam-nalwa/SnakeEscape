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
    drawBoard(data.snakes);
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

function drawBoard(date){

	context.fillStyle = '#CCC';

	//draw the board
	for (var i=0; i<boardWidth; i++)
	{
	    for (var j=0; j<boardHeight; j++)
	    {
	        context.fillRect(i * blockDimention, j * blockDimention, blockDimention - 1, blockDimention - 1);
	    }
	}

/*
	//drawing the snakes
	for(i in date.snakes)
    {
        var snake = snakes[i],
        snakeLength = snake.elements.length;

        //drawing the snake
        for (var j=0; j<snakeLength; j++)
        {
            var element = snake.elements[j],
                x = element.x * blockDimention,
                y = element.y * blockDimention;

            if(snake.playerID == snakeID)
            {
                context.fillStyle = 'rgba(255, 0, 0)';
            }

            else
            {
                context.fillStyle = 'rgba(0, 0, 0)';
            }
            context.fillRect(x, y, blockDimention - 1, blockDimention -1);
        }
    }
    */
}