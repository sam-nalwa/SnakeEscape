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
    context = canvas.getContext('2d');
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

function drawBoard(snakes){

	context.fillStyle = '#CCC';
		for (var i=0; i<boardWidth; i++)
		{
		    for (var j=0; j<boardHeight; j++)
		    {
		        context.fillRect(i * blockDimention, j * blockDimention, blockDimention - 1, blockDimention - 1);
		    }
		}

}