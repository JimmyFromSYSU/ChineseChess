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
			if (player_id == 0 && dir.dr < 0) flag=false;
			if (player_id == 1 && dir.dr > 0) flag=false;

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
		
		ai.findBestNextStep = function (initStr, player_id, game){
			console.log(initStr);

			ai.board = strToBoard(initStr,game);

			steps = getAllPossibleStep(board, player_id);

			game.step.from = {};
			game.step.to = {};
			game.step.from.r  = steps[0].from.r;
			game.step.from.c  = steps[0].from.c;
			game.step.to.r  = steps[0].to.r;
			game.step.to.c  = steps[0].to.c;
		}

		strToBoard = function(initStr,game){
			var board = new Array(10);
			for (var r = 0; r < 10; r++) {
				board[r] = new Array(9);
			}

			index = 0;
			for(var r = 0; r<10;r++){
				for(var c = 0; c<9;c++){
					ch = initStr[index];
					if(ch!='0'){
						chess = {};
						chess.player_id = (ch>='A' &&ch<='Z'?0:1);
						chess.type = game.getChessType(ch);
						board[r][c] = chess;
					}
					index ++;
				}
			}
			return board;
		}

		A_Search = function(board, player_id, deep){
		}

		B_Search = function(board, player_id, deep){
		}

		evaluate = function(board, player_id){
		}

        return ai;
    }
}

