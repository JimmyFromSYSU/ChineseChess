
/***********************************\
 * player 模板
\***********************************/
var Player = {
	createNew: function(player_id){
		var player = {};
		player.now_move = false;
		player.player_id = player_id;

		player.prepare = function(game){
		}

		player.moveOnce = function(game){
			// save result to game.step.from and game.step.to 
			// document.dispatchEvent(game.StartMoveEvent);
		}

		player.finish = function(winner){
		}

		return player;
	}
}

/***********************************\
 * 中国象棋UI player
\***********************************/
var UI_Player = {
	createNew: function(player_id){

		var player = Player.createNew(player_id);
		
		player.flag = false;

		player.prepare = function(game){
			myControl = function(e){
				if(player.now_move == false) return;
				if(game.UI_playing == false) return;

				var now  = game.getClickPos( {x:e.offsetX, y:e.offsetY}, cell_size/2);
				c = game.getChess(now);
				// 选择第二颗子
				if(player.flag == true){
					if(c && c.player_id == player.player_id){
						game.step.from = now;
						game.setChessTo(game.box, now);
					}
					else{
						game.UI_playing = false;
						player.flag = false;
						game.step.to = now;
						player.now_move = false;
						document.dispatchEvent(game.StartMoveEvent);
					}
				}
				// 选择第一颗子
				else{
					if(c == null || c.player_id != player.player_id){
						game.hide(game.box);	
						player.flag = false;
					}
					else{
						game.step.from = now;
						game.setChessTo(game.box, now);
						player.flag = true;
					}
				}
			}

			game.sprite.bind('MouseUp', myControl);
		};


		player.moveOnce = function(game){
			game.UI_playing = true;
			player.now_move = true;
			player.flag = false;
		}


		player.finish = function(winner){}

		return player;
	}
}


/***********************************\
 * 中国象棋AI player
\***********************************/
var AI_Player = {
	createNew: function(player_id){
		var player = Player.createNew(player_id);
		player.ai = null;

		player.prepare = function(game){
			console.log("create AI");
			player.ai = AI.createNew();
		};


		player.moveOnce = function(game){
			player.now_move = true;
			// save result to game.step.from and game.step.to 
			initStr = game.toString();
			console.log("find best move");
			player.ai.findBestNextStep(initStr,player.player_id, game);
			player.now_move = false;
			console.log("finish move");
			document.dispatchEvent(game.StartMoveEvent);
		}


		player.finish = function(winner){}

		return player;
	}
}



/***********************************\
 * 中国象棋网络 player
\***********************************/


	//var xhttp = new XMLHttpRequest();
	//xhttp.open("GET", "/compute/", false);
	//xhttp.send();
	//document.getElementById("demo").innerHTML = xhttp.responseText;
	//console.log(xhttp.responseText);
	//


/***********************************\
 * 中国象棋网络 player
\***********************************/


	//var xhttp = new XMLHttpRequest();
	//xhttp.open("GET", "/compute/", false);
	//xhttp.send();
	//document.getElementById("demo").innerHTML = xhttp.responseText;
	//console.log(xhttp.responseText);
	//
