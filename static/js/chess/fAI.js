

/***********************************\
* 游戏AI
\***********************************/

var fAI = {

    createNew: function() {
		var ai = {};
		var MIN_SCORE = -9999
		var MAX_SCORE = 9999;
		ai.block = new Array(6);

		getAllPossibleStep= function(board, player_id ){
			steps = [];
			for(var r = 0;r<15;r++){
				for(var c = 0; c<15;c++){
					chess = board[r][c];
					if(chess == null && ai.cnt[r][c]>0){
						steps.push( {to:{r:r,c:c}, player_id:player_id } ); // bug: why need player id	
					}
				}
			}
			return steps;
		}
		

		ai.evaluateOneBlock = function(now_char){
			var c_now = ai.chess_cnt[now_char];
			var c_next = ai.chess_cnt[now_char=='b'?'w':'b'];
			var c_empty = 6-c_now-c_next;
		
			if(c_now == 6) return MAX_SCORE;  	
			else if(c_now==5){
				if(ai.block[0]!=now_char || ai.block[5]!=now_char) return MAX_SCORE;
				else if(c_empty>0) return 1000;		// 1 move win
				else return 40;						// no use
			}
			else if(c_now==4){
				if(ai.block[0]=='0' && ai.block[5] =='0') return 1000;	
				return ( c_now - c_next ) * 200;
			}
			else if(c_now==3){
				return ( c_now - c_next ) * 100;
			}
			else if(c_now==2){
				return ( c_now - c_next ) * 50;
			}
			else if(c_now==1){
				return ( c_now - c_next ) * 30;
			}
			else if(c_now==0){
				return ( c_now - c_next ) * 10;
			}
		}

		var r_start = [0,0,0,5];
		var r_end = [15,10,10,15];
		var c_start = [0,0,0,0];
		var c_end = [10,15,10,10];
		var dr = [0,1,1,-1];
		var dc = [1,0,1,1];

		ai.updateScore = function(pos){
			r = pos.r;
			c = pos.c;
			if(r<0 || r>=15 || c<0 || c>=15) return 0;
			var now_c = (ai.root_player_id == 0?'b':'w');
			var score = 0;
			var old_score = ai.score[r][c];

			for(var t = 0;t<4;t++){
					//if(board[r+dr[t]][c+dc[t]] == null) continue;
				if(!(r >= r_start[t] && r<r_end[t] && c >= c_start[t] && c < c_end[t])) continue;
					
				ai.chess_cnt = {w:0,b:0,0:0};
				rr = r;
				cc = c;
				for(var i=0;i<6;i++){
					if(ai.board[rr][cc]) ai.block[i] = ai.board[rr][cc].type;
					else ai.block[i] = '0';
					ai.chess_cnt[ai.block[i]] ++;
					rr = rr + dr[t] ;
					cc = cc + dc[t] ;
				}

				score += ai.evaluateOneBlock(now_c);
				score -= ai.evaluateOneBlock(now_c=='b'?'w':'b');

			}

			if(score > MAX_SCORE) score = MAX_SCORE;
			if(score < MIN_SCORE) score = MIN_SCORE;

			ai.score[r][c] = score;
			return score - old_score;
		}
		
		ai.updateRelatedScore = function(pos, old_chess){
			ai.sum_score += ai.updateScore(pos);
			r = pos.r;
			c = pos.c;
			var now_c = (ai.root_player_id == 0?'b':'w');

			for(var t = 0;t<4;t++){
				for(var i = 1; i< 6;i++){
					r = pos.r - dr[t] * i;
					c = pos.c - dc[t] * i;
					if(!(r >= r_start[t] && r<r_end[t] && c >= c_start[t] && c < c_end[t])) continue;

					ai.chess_cnt = {w:0,b:0,0:0};
					rr = r;
					cc = c;
					for(var j=0;j<6;j++){
						if(ai.board[rr][cc]) ai.block[j] = ai.board[rr][cc].type;
						else ai.block[j] = '0';
						ai.chess_cnt[ai.block[j]] ++;
						rr = rr + dr[t] ;
						cc = cc + dc[t] ;
					}

					var score = ai.evaluateOneBlock(now_c);
					score -= ai.evaluateOneBlock(now_c=='b'?'w':'b');
					
					ai.chess_cnt[ai.block[i]] --;
					ai.block[i] = old_chess;
					ai.chess_cnt[ai.block[i]] ++;

					var old_score = ai.evaluateOneBlock(now_c);
					old_score -= ai.evaluateOneBlock(now_c=='b'?'w':'b');
					
					var old = ai.score[r][c];
					ai.score[r][c] += score-old_score;
					
					var now = ai.score[r][c];
					if(now > MAX_SCORE) now = MAX_SCORE;
					if(now < MIN_SCORE) now = MIN_SCORE;
					ai.score[r][c] = now;

					//ai.sum_score += score-old_score;
					ai.sum_score += now-old;
					//ai.sum_score += ai.updateScore({r:r,c:c});
				}
			}	
		}

		ai.findBestNextStep = function (initStr, player_id, game, call_back){

				ai.toString  = function(){
					var s = "";
					for(var r = 0; r<15; r++){
						for(var c = 0; c<15; c++){
							s = s + "" +  game.getChessLetter(ai.board[r][c]);
						}
					}
					return s;
				}

				setTimeout(function(){
					ai.root_player_id = player_id;
					ai.strToBoard(initStr,game);

					/***********************************\
					* 极大极小搜索入口
					\***********************************/
					ai.deep = 4;	
			
					result = ai.Search(ai.board, player_id, ai.deep, MAX_SCORE+1);

					step = result.step;

					if(step){	
						game.step.to = {};
						game.step.to.r  = step.to.r;
						game.step.to.c  = step.to.c;

						game.step.player_id = step.player_id;
	
						call_back();
					}
				}, 100);

		}

		ai.strToBoard = function(initStr,game){
			ai.board = new Array(15);
			for (var r = 0; r < 15; r++) {
				ai.board[r] = new Array(15);
			}

			ai.cnt = new Array(15);
			for (var r = 0; r < 15; r++) {
				ai.cnt[r] = new Array(15);
				for(var c = 0; c<15; c++) ai.cnt[r][c] = 0;
			}

			ai.score = new Array(15);
			ai.sum_score = 0;
			for (var r = 0; r < 15; r++) {
				ai.score[r] = new Array(15);
				for(var c = 0; c<15; c++){
					ai.score[r][c] = 0;
				}
			}


			ai.d = 1;

			index = 0;
			for(var r = 0; r<15;r++){
				for(var c = 0; c<15;c++){
					ch = initStr[index];
					if(ch!='0'){
						chess = {};
						chess.player_id = (ch=='b'?0:1);
						chess.type = game.getChessType(ch);
						ai.board[r][c] = chess;
						
						ai.cnt[r][c] = -1;
						for(var tr = r-ai.d; tr<=r+ai.d; tr++){
							for(var tc = c-ai.d; tc<=c+ai.d; tc++){
								if(tr >= 0 && tr < 15 && tc >=0 && tc < 15){
									if(ai.cnt[tr][tc]>=0){
										ai.cnt[tr][tc]++;
									}
								}
							}
						}
					}
					index ++;
				}
			}

			
			for (var r = 0; r < 15; r++) {
				for(var c = 0; c<15; c++){
					ai.sum_score += ai.updateScore({r:r,c:c});
				}
			}
			//console.log("initial sum: " + ai.sum_score);
			//var s = ""; for(var a=0;a<15;a++){for(var b=0;b<15;b++){s += ai.score[a][b]+" ";} s+="\n";} console.log(s);
		}


		ai.Search = function(board, player_id, deep, now_best){
			var flag = (player_id != ai.root_player_id?true:false);

			var steps = getAllPossibleStep(board, player_id);
			//console.log("size of steps: " + steps.length);
			
			move = function(board, step){
				chess = {};
				chess.player_id = step.player_id;
				chess.type = (step.player_id==0?'b':'w');
				r = step.to.r;
				c = step.to.c;
				board[r][c] = chess;
				ai.cnt[r][c] = -1;

				for(var tr = r-ai.d; tr<=r+ai.d; tr++){
					for(var tc = c-ai.d; tc<=c+ai.d; tc++){
						if(tr >= 0 && tr < 15 && tc >=0 && tc < 15){
							if(ai.cnt[tr][tc]>=0){
								ai.cnt[tr][tc]++;
							}
						}
					}
				}
				ai.updateRelatedScore(step.to, '0');
			//	console.log("after move "+ deep +": " + ai.sum_score);
			//	console.log(step.to.r + " " + step.to.c);
			//	var s = ""; for(var a=0;a<15;a++){for(var b=0;b<15;b++){s += ai.score[a][b]+" ";} s+="\n";} console.log(s);
			}

			unmove = function(board, step){
				r = step.to.r;
				c = step.to.c;
				old_chess = board[r][c].type;
				board[r][c] = null; 

				for(var tr = r-ai.d; tr<=r+ai.d; tr++){
					for(var tc = c-ai.d; tc<=c+ai.d; tc++){
						if(tr >= 0 && tr < 15 && tc >=0 && tc < 15){
							if(ai.cnt[tr][tc]>=0){
								ai.cnt[tr][tc]--;
							}
						}
					}
				}
				
				ai.cnt[r][c] = 0;

				for(var tr = r-ai.d; tr<=r+ai.d; tr++){
					for(var tc = c-ai.d; tc<=c+ai.d; tc++){
						if(tr >= 0 && tr < 15 && tc >=0 && tc < 15){
							if(ai.cnt[tr][tc]<0){
								ai.cnt[r][c]++;
							}
						}
					}
				}

				ai.updateRelatedScore(step.to, old_chess);

				//console.log("after unmove "+ deep +": " + ai.sum_score);
				//console.log(step.to.r + " " + step.to.c);
				//var s = ""; for(var a=0;a<15;a++){for(var b=0;b<15;b++){s += ai.score[a][b]+" ";} s+="\n";} console.log(s);
			}

			var best_id = 0;

			var best_score = MIN_SCORE;

			if(flag) best_score = MAX_SCORE;

			for(var id = 0; id < steps.length; id++){
	
				//console.log(steps[id].to.r + " " + steps[id].to.c);

				/***********************************\
				* 更新节点值
				\***********************************/
				move(board, steps[id]);
				if(deep==1){
					//score = ai.evaluate(board, player_id);
					score = ai.sum_score;
				}
				else {
					//score = ai.evaluate(board, player_id);
					score = ai.sum_score;
					if(Math.abs(score) < 9000){
						result = ai.Search(ai.board, 1-player_id, deep-1, best_score);
						score = result.score;
					}
				}
				unmove(board, steps[id]);
				
				/***********************************\
				* 更新最优走法
				\***********************************/

				//if( (!flag && score > best_score) || (flag && score < best_score)){
				if( (!flag && score >= best_score) || (flag && score <= best_score)){
					if(!(Math.abs(score - best_score) == 0 && Math.floor((Math.random() * 3)) == 0)){
						best_id = id;
						best_score = score;
					}
				}

				/***********************************\
				* a-b 剪子
				\***********************************/
				if(flag && now_best > best_score) {
					result =  {score: best_score, step: best_id>=0?steps[best_id]:null};	
					return result;
				}

				else if(!flag && now_best < best_score){
					result =  {score: best_score, step: best_id>=0?steps[best_id]:null};	
					return result;
				}
			}
			result =  {score: best_score, step: best_id>=0?steps[best_id]:null};	
			return result;
		}

/*		

		ai.evaluate = function(board, last_player_id){

			var now_c = (ai.root_player_id == 0?'b':'w');
			var score = 0;
			//var now_w = 1;
			//var next_w = 0.95;


			for(var t = 0;t<4;t++){
				for(var r = r_start[t]; r<r_end[t]; r++){
					for(var c = c_start[t]; c < c_end[t]; c++){
						if(board[r+dr[t]][c+dc[t]] == null) continue;

						ai.chess_cnt = {w:0,b:0,0:0};
						rr = r;
						cc = c;

						for(var i=0;i<6;i++){
							if(board[rr][cc]) ai.block[i] = board[rr][cc].type;
							else ai.block[i] = '0';
							ai.chess_cnt[ai.block[i]] ++;
							rr = rr + dr[t] ;
							cc = cc + dc[t] ;
						}

						score += ai.evaluateOneBlock(now_c);
						score -= ai.evaluateOneBlock(now_c=='b'?'w':'b');
					}
				}
			}

			if(score > MAX_SCORE) score = MAX_SCORE;
			if(score < MIN_SCORE) score = MIN_SCORE;
			//console.log("final score: " + score);
			return score;
		}
*/
        return ai;
    }
}

