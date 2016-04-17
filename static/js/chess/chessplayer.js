
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


		player.finish = function(winner){
			game.UI_playing = false;
			player.now_move = false;
			player.flag = false;
		}

		return player;
	}
}


/***********************************\
 * 中国象棋AI player
\***********************************/
var AI_Player = {
	createNew: function(player_id){
		var player = Player.createNew(player_id);

		player.prepare = function(game){
			player.ai = AI.createNew();
		};

		player.moveOnce = function(game){
			player.now_move = true;
			player.game = game;
			initStr = game.toString();
			player.ai.findBestNextStep(initStr,player.player_id, game, player.finishStep);
		}

		player.finishStep = function(){
			player.now_move = false;
			document.dispatchEvent(player.game.StartMoveEvent);
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
	

/***********************************\
 * 五子棋 UI player
\***********************************/
var fUI_Player = {
	createNew: function(player_id){

		var player = Player.createNew(player_id);
		
		player.flag = false;

		player.prepare = function(game){
			myControl = function(e){

				if(player.now_move == false) return;
				if(game.UI_playing == false) return;

				var now  = game.getClickPos( {x:e.offsetX, y:e.offsetY}, cell_size/2);
				c = game.getChess(now);
				if(c == null){
					game.step = {};

					game.step.player_id = player_id;
					game.step.to = now;

					game.UI_playing = false;
					player.now_move = false;
					if(game.winner.id==-2)
					document.dispatchEvent(game.StartMoveEvent);
				}
/*
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
*/
			}

			game.sprite.bind('MouseUp', myControl);
		};


		player.moveOnce = function(game){
			game.UI_playing = true;
			player.now_move = true;
			//player.flag = false;
		}


		player.finish = function(winner){
			game.UI_playing = false;
			player.now_move = false;
			if(winner.id == player_id){
				alert( (player_id == 0? "黑棋":"白棋") + "赢了！");
			}
		}

		return player;
	}
}

/***********************************\
 * 五子棋AI player
\***********************************/
var fAI_Player = {
	createNew: function(player_id){
		var player = Player.createNew(player_id);

		player.prepare = function(game){
			player.ai = fAI.createNew();
		};

		player.moveOnce = function(game){
			player.now_move = true;
			player.game = game;
			// 
			initStr = game.toString();
			player.ai.findBestNextStep(initStr,player.player_id, game, player.finishStep);
		}

		player.finishStep = function(){
			player.now_move = false;
			if(player.game.winner.id==-2)
			document.dispatchEvent(player.game.StartMoveEvent);
		}
		

		player.finish = function(winner){
			player.now_move = false;
			if(winner.id == player_id){
				alert( (player_id == 0? "黑棋":"白棋") + "赢了！");
			}
		}

		return player;
	}
}

