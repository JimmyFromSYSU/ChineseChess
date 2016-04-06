/***********************************\
* 获取所有移动可能
* board所代表的局面必须合法
\***********************************/
getPossibleStepFrom = function(board, from, steps){
    // 边界越界
    if (!inRegion(from, {
        r: 0,
        c: 0
    }, {
        h: 10,
        w: 9
    })) return;

    var s = board[from.r][from.c];	
    if (s == null) return;

	dir_plus= [{dr:0,dc:1},{dr:0,dc:-1},{dr:1,dc:0},{dr:-1,dc:0}];
	dir_cross = [{dr:1,dc:1},{dr:1,dc:-1},{dr:-1,dc:1},{dr:-1,dc:-1}];
	dir_cross2 = [{dr:2,dc:2},{dr:2,dc:-2},{dr:-2,dc:2},{dr:-2,dc:-2}];
	dir_jump = [{dr:1,dc:2},{dr:1,dc:-2},{dr:2,dc:1},{dr:-2,dc:1},{dr:-1,dc:2},{dr:-1,dc:-2},{dr:2,dc:-1},{dr:-2,dc:-1}];

	checkToPosition = function(to, region, must_eat){
		if (!inRegion(to, region.rc, region.hw)) return false;
		to_chess = board[to.r][to.c];
		if(to_chess){
			if(to_chess.player_id == s.player_id) return false;
		}
		else if(must_eat) return false; 
		return true;
	}
	getBlockDir = function(dir){
		return {dr: dir.dr > 0? dir.dr-1:dir.dr+1,dc: dir.dc > 0? dir.dc-1: dir.dc+1};
	}
    if (s.type == "jiang") {
		dir_plus.forEach(function(dir,index){
			var to = {};
			to.r = from.r + dir.dr;
			to.c = from.c + dir.dc;
			if(s.player_id == 0) region = {rc:{r:0,c:3},hw:{h:3,w:3}};
			else if(s.player_id == 1) region = {rc:{r:7,c:3},hw:{h:3,w:3}};
			if(checkToPosition(to, region,false)){
				steps.push({from:from, to:to});
			}
		});		
    } else if (s.type == "ju") {
		dir_plus.forEach(ju_pos = function(dir,index){
			flag = true;
			var dis = 1;
			while(flag){
				var to = {};
				to.r = from.r + dir.dr * dis;
				to.c = from.c + dir.dc * dis;
				region = {rc:{r:0,c:0},hw:{h:10,w:9}};
				if(checkToPosition(to, region,false)){
					steps.push({from:from, to:to});
					if(board[to.r][to.c]) flag = false;
				}
				else flag = false;
				dis ++;
			}
		});
    } else if (s.type == "pao") {
		dir_plus.forEach(ju_pos = function(dir,index){
			cnt = 0;
			var dis = 1;
			while(cnt<2){
				var to = {};
				to.r = from.r + dir.dr * dis;
				to.c = from.c + dir.dc * dis;
				region = {rc:{r:0,c:0},hw:{h:10,w:9}};
				
				if (inRegion(to, region.rc, region.hw))
				{
					to_chess = board[to.r][to.c];
					if(cnt == 0 && !to_chess) steps.push({from:from, to:to});
					if(cnt == 1 && to_chess && to_chess.player_id != s.player_id) steps.push({from:from, to:to});
					if(to_chess) cnt ++ ;
				}
				else { cnt = 3;}
				dis ++;
			}
		});

    } else if (s.type == "ma") {
		dir_jump.forEach(function(dir,index){
			var to = {};
			to.r = from.r + dir.dr;
			to.c = from.c + dir.dc;
			b_dir = getBlockDir(dir);
			block = {};
			block.r  = from.r + b_dir.dr;
			block.c  = from.c + b_dir.dc;
			region = {rc:{r:0,c:0},hw:{h:10,w:9}};
			if(checkToPosition(to, region,false)){
				if(!board[block.r][block.c])
					steps.push({from:from, to:to});
			}
		});		
    } else if (s.type == "shi") {
		dir_cross.forEach(function(dir,index){
			var to = {};
			to.r = from.r + dir.dr;
			to.c = from.c + dir.dc;
			if(s.player_id == 0) region = {rc:{r:0,c:3},hw:{h:3,w:3}};
			else if(s.player_id == 1) region = {rc:{r:7,c:3},hw:{h:3,w:3}};
			if(checkToPosition(to, region,false)){
				steps.push({from:from, to:to});
			}
		});		
    } else if (s.type == "xiang") {
		dir_cross2.forEach(function(dir,index){
			var to = {};
			to.r = from.r + dir.dr;
			to.c = from.c + dir.dc;
			b_dir = getBlockDir(dir);
			block = {};
			block.r  = from.r + b_dir.dr;
			block.c  = from.c + b_dir.dc;
			if(s.player_id == 0) region = {rc:{r:0,c:0},hw:{h:5,w:9}};
			else if(s.player_id == 1) region = {rc:{r:5,c:0},hw:{h:5,w:9}};
			if(checkToPosition(to, region,false)){
				if(!board[block.r][block.c])
					steps.push({from:from, to:to});
			}
		});		
    } else if (s.type == "zu") {
		dir_plus.forEach(function(dir,index){
			var to = {};
			var flag = true;
			to.r = from.r + dir.dr;
			to.c = from.c + dir.dc;

			if (s.player_id == 0 && dir.dr < 0) flag=false;
			if (s.player_id == 1 && dir.dr > 0) flag=false;

			r = dir.dr>0?dir.dr:-dir.dr;
			c = dir.dc>0?dir.dc:-dir.dc;

			if (s.player_id == 0 && inRegion(from, {r: 0,c: 0}, {h: 5,w: 9})) {
				if (dir.dc != 0) flag=false;
			} else {
				if (!((r == 0 && c == 1) || (r == 1 && c == 0))) flag=false;
			}

			if (s.player_id == 1 && inRegion(from, {r: 5,c: 0}, {h: 5,w: 9})) {
				if (dir.dc != 0) flag=false;
			} else {
			    if (!((r == 0 && c == 1) || (r == 1 && c == 0))) flag=false;
			}

			region = {rc:{r:0,c:0},hw:{h:10,w:9}};
			if(flag  && checkToPosition(to, region,false)){
				steps.push({from:from, to:to});
			}
		});		
    }
}

getAllPossibleStep= function(board, player_id ){
	steps = [];
	for(var r = 0;r<10;r++){
		for(var c = 0; c<9;c++){
			chess = board[r][c];
			if(chess && chess.player_id == player_id){
				getPossibleStepFrom(board, {r:r,c:c}, steps);
			}
		}
	}
	return steps;
}

/***********************************\
* 游戏AI
\***********************************/

var AI = {

    createNew: function() {
		var ai = {};
		var MIN_SCORE = -9999
		var MAX_SCORE = 9999;

		//console.log("create ------------------------");


		ai.findBestNextStep = function (initStr, player_id, game, call_back){

				ai.toString  = function(){
					var s = "";
					for(var r = 0; r<10; r++){
						for(var c = 0; c<9; c++){
							s = s + "" +  game.getChessLetter(ai.board[r][c]);
						}
					}
					return s;
				}

				ai.set = {};
				setTimeout(function(){
					//console.log(initStr);		
					ai.myplayer_id = player_id;
					ai.strToBoard(initStr,game);
					/***********************************\
					* 极大极小搜索入口
					\***********************************/
					ai.deep = 4;	
					ai.eatStack = [];
					result = ai.Search(ai.board, player_id, ai.deep, MAX_SCORE+1);
					step = result.step;
					if(step){	
						//
						console.log(result.score + " from: " + step.from.r + " " + step.from.c +
							" to: " + step.to.r + " " + step.to.c);
						game.step.from = {};
						game.step.to = {};
						game.step.from.r  = step.from.r;
						game.step.from.c  = step.from.c;
						game.step.to.r  = step.to.r;
						game.step.to.c  = step.to.c;
	
						call_back();
					}
				}, 10);

		}

		ai.strToBoard = function(initStr,game){
			ai.board = new Array(10);
			for (var r = 0; r < 10; r++) {
				ai.board[r] = new Array(9);
			}

			index = 0;
			//console.log("------------------------");
			for(var r = 0; r<10;r++){
				for(var c = 0; c<9;c++){
					ch = initStr[index];
					if(ch!='0'){
						chess = {};
						chess.player_id = ((ch>='A' &&ch<='Z')?0:1);
						chess.type = game.getChessType(ch);
						ai.board[r][c] = chess;
					}
					index ++;
				}
			}
		}

		ai.eatStack = [];

		ai.Search = function(board, player_id, deep, now_best){
			//var b_str = ai.toString();
			//result = ai.set[b_str]
			//if(result) return result; 
			
			//
			//console.log("ai belong to: " + ai.myplayer_id+  " player_id: "+ player_id + " deep: " + deep);
			var flag = (player_id != ai.myplayer_id?true:false);

			var steps = getAllPossibleStep(board, player_id);
			
			move = function(board, step){
				ai.eatStack.push(board[step.to.r][step.to.c]);
				board[step.to.r][step.to.c] = board[step.from.r][step.from.c];
				board[step.from.r][step.from.c] = null;
			}

			unmove = function(board, step){
				board[step.from.r][step.from.c] = board[step.to.r][step.to.c];
				board[step.to.r][step.to.c] = ai.eatStack.pop();
			}

			var best_id = 0;
			var best_score = MIN_SCORE;
			if(flag) best_score = MAX_SCORE;

			for(var id = 0; id < steps.length; id++){

				/***********************************\
				* 更新节点值
				\***********************************/
				move(board, steps[id]);
				//
				//console.log("step: " + steps[id].from.r + " "  +steps[id].from.c + " " + steps[id].to.r + " " + steps[id].to.c)
				if(deep==1){
					//console.log("end");
					score = ai.evaluate(board, player_id);
				}
				else {
					score = ai.evaluate(board, player_id);
					if(Math.abs(score) < 9000){
						result = ai.Search(ai.board, 1-player_id, deep-1, best_score);
						score = result.score;
					}
				}
				unmove(board, steps[id]);
				
				/***********************************\
				* 更新最优走法
				\***********************************/
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
					//ai.set[b_str] = result;
					return result;
				}
				else if(!flag && now_best < best_score){
					result =  {score: best_score, step: best_id>=0?steps[best_id]:null};	
					//ai.set[b_str] = result;
					return result;
				}
			}
			result =  {score: best_score, step: best_id>=0?steps[best_id]:null};	
			//ai.set[b_str] = result;
			return result;
		}
	
		ai.evaluate = function(board, last_player_id){

			score_table = {
				jiang: [
					[0   ,0   ,0   ,9980,9999,9980,0   ,0   ,0   ],
					[0   ,0   ,0   ,9970,9970,9970,0   ,0   ,0   ],
					[0   ,0   ,0   ,9950,9950,9950,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					],

				shi: [
					[0   ,0   ,0   ,200 ,0   ,200 ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,240 ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,200 ,0   ,200 ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					],

				xiang: [
					[0   ,0   ,210 ,0   ,0   ,0   ,210 ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[200 ,0   ,0   ,0   ,250 ,0   ,0   ,0   ,200 ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,200 ,0   ,0   ,0   ,200 ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					],

				zu: [
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ,0   ],
					[150 ,0   ,150 ,0   ,230 ,0   ,150 ,0   ,150 ],
					[140 ,0   ,170 ,0   ,200 ,0   ,170 ,0   ,140 ],

					[180 ,190 ,200 ,200 ,210 ,200 ,200 ,190 ,180 ],
					[180 ,190 ,200 ,210 ,210 ,210 ,200 ,190 ,180 ],
					[190 ,190 ,200 ,220 ,220 ,220 ,210 ,190 ,190 ],
					[170 ,180 ,200 ,230 ,230 ,230 ,200 ,180 ,170 ],
					[160 ,160 ,190 ,200 ,200 ,200 ,190 ,160 ,160 ],
					],

				ju: [
					[1190,1240,1200,1200,1200,1200,1200,1240,1190],
					[1200,1220,1200,1210,1200,1210,1200,1220,1200],
					[1190,1220,1200,1200,1200,1200,1200,1220,1190],
					[1210,1220,1200,1200,1200,1200,1200,1220,1210],
					[1220,1250,1220,1260,1200,1260,1220,1250,1220],

					[1230,1240,1230,1240,1230,1240,1230,1240,1230],
					[1230,1230,1240,1230,1230,1230,1240,1230,1230],
					[1230,1230,1230,1230,1240,1230,1230,1230,1230],
					[1230,1240,1230,1230,1240,1230,1230,1240,1230],
					[1250,1250,1230,1250,1240,1250,1230,1250,1250],
					],

				ma: [
					[450 ,500 ,500 ,480 ,470 ,480 ,500 ,500 ,450 ],
					[450 ,510 ,510 ,470 ,480 ,470 ,510 ,510 ,450 ],
					[500 ,500 ,540 ,510 ,500 ,510 ,540 ,500 ,500 ],
					[500 ,520 ,520 ,510 ,500 ,510 ,520 ,520 ,500 ],
					[500 ,530 ,540 ,530 ,520 ,530 ,540 ,530 ,500 ],

					[530 ,540 ,540 ,540 ,540 ,530 ,540 ,540 ,530 ],
					[530 ,530 ,540 ,530 ,530 ,530 ,540 ,530 ,530 ],
					[530 ,530 ,540 ,550 ,530 ,550 ,540 ,530 ,530 ],
					[520 ,530 ,550 ,530 ,530 ,530 ,550 ,530 ,520 ],
					[510 ,530 ,540 ,530 ,530 ,530 ,540 ,530 ,510 ],
					],

				pao: [
					[500 ,500 ,510 ,500 ,500 ,500 ,510 ,500 ,500 ],
					[500 ,500 ,500 ,500 ,500 ,500 ,500 ,500 ,500 ],
					[510 ,500 ,510 ,520 ,540 ,520 ,510 ,500 ,510 ],
					[500 ,500 ,500 ,500 ,550 ,500 ,500 ,500 ,500 ],
					[500 ,500 ,500 ,500 ,550 ,500 ,500 ,500 ,500 ],
					
					[510 ,510 ,510 ,510 ,550 ,510 ,510 ,510 ,510 ],
					[510 ,510 ,510 ,500 ,550 ,500 ,510 ,510 ,510 ],
					[510 ,500 ,510 ,500 ,500 ,500 ,510 ,500 ,510 ],
					[510 ,500 ,510 ,500 ,500 ,500 ,510 ,500 ,510 ],
					[550 ,540 ,500 ,500 ,500 ,500 ,500 ,540 ,550 ],
					]

			};
			
			score = 0;
			Kpos = {r:-1,c:-1};
			kpos = {r:-1,c:-1};
			for(var r = 0; r<10;r++){
				for(var c = 0; c<9;c++){
					chess = board[r][c];
					if(chess){
						if(chess.type == "jiang"){
							if(chess.player_id==0)Kpos = {r:r,c:c};
							if(chess.player_id==1)kpos = {r:r,c:c};
						}

						tr = (chess.player_id==0?r:9-r);
						//console.log(chess.player_id + " " + ai.myplayer_id);
						if(chess.player_id == ai.myplayer_id){
			//				console.log("tr: " + tr + " c: " + c + " score: " + score + " " + score_table[chess.type][tr][c]);
							score += score_table[chess.type][tr][c]*1.1;
						}
						else
							score -= score_table[chess.type][tr][c]*0.9; // 对方的子分值略低，防止AI不断对子
					}
				}
			}

			// 将帅见面，谁刚走谁输
			if(Math.abs(score)>9000) return score;
			if(Kpos.c > 0 && kpos.c > 0 && Kpos.c == kpos.c){
				if(countChess(board, kpos, Kpos)==2 ){
					if(last_player_id == ai.myplayer_id){
						score = MIN_SCORE;
					}
					else score = MAX_SCORE;
				}
			}
			return score;
		}

        return ai;
    }
}

