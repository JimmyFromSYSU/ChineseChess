/***********************************\
* 正常移动规则
\***********************************/
// 检查位置p是否在左上角为[r,c]，大小为(h, w)的矩形区域中
function inRegion(p, l, s) {
    if (p.r >= l.r && p.r < l.r + s.h && p.c >= l.c && p.c < l.c + s.w) return true;
    else return false;
}

// 检查在棋盘b中，从p1到p2的最短曼哈顿路径上有多少个棋子，包括p1和p2点
// (如果p1=p2，只计算一次)
// 曼哈顿路径定义为先走斜线，再走直线的一条路径。
function countChess(board, p1, p2) {
    var cnt = 0;
    var r = p1.r;
    var c = p1.c;
	
    while (r != p2.r || c != p2.c) {
        if (board[r][c] != null) cnt++;
        if (p2.r > r) r++;
        if (p2.r < r) r--;
        if (p2.c > c) c++;
        if (p2.c < c) c--;
    }

    if (board[r][c] != null) cnt++;

    return cnt;
}


/***********************************\
* 五子棋棋游戏
\***********************************/
var FiveChessGame = {
    createNew: function(
        area,
        cell_size, cell_img_size,
        box_img_size, b_img_w, b_img_h,
        chess_img_size, img_dir
    ) {

        var game = SquareChessGame.createNew(
            area,
            cell_size, cell_img_size,
            box_img_size, b_img_w, b_img_h,
            chess_img_size,
            img_dir,
            bg_color,
            25, 25);


        /***********************************\
		 * 棋盘状态矩阵
		\***********************************/
        // 棋网格盘大小
        var n_row = 15;
        var n_col = 15;

        board = new Array(n_row);
        for (var i = 0; i < n_row; i++) {
            board[i] = new Array(n_col);
        }

        game.getChess = function(pos) {
            return board[pos.r][pos.c];
        }

        /***********************************\
		 * 棋盘的字符表示
		\***********************************/
        game.getChessType = function(c) {
			return c;
        }


		game.getChessLetter = function(chess){
			if(chess) { 
				return chess.type;
			}
			return '0';
		}

		game.toString  = function(){
			var s = "";
			for(var r = 0; r<n_row; r++){
				for(var c = 0; c<n_col; c++){
					s = s + "" +  game.getChessLetter(game.getChess({r:r,c:c}));
				}
			}
			return s;
		}

        /***********************************\
		 * UI显示
		 * 鼠标跟随等效果
		\***********************************/
        game.UI_playing = false;
        // 设置鼠标跟随框 
		old_box_pos = {r:-1,c:-1};

        game.moveBoxToMouse = function(e) {
            if (game.UI_playing == false) return;
            var p = {
                x: e.offsetX,
                y: e.offsetY
            };

            if (p.x >= 0 && p.x < w && p.y >= 0 && p.y < h) {
                var now = game.getClickPos(p, cell_size / 2);
                if (now.r < 0 || now.r >= n_row) return;
                if (now.c < 0 || now.c >= n_col) return;
				if(now.r == old_box_pos.r && now.c == old_box_pos.c) return;
				old_box_pos = now;
                if (game.box2.sprite.z < 0) game.setChessTo(game.box2, now);
                else game.setChessTo(game.box2, now);
				steps = [];
            }
        }

        game.fix = function() {
            game.moveBoxToMouse = null;
            game.hide(game.box1);
            game.hide(game.box2);
        }

        // 移动棋子
        // pre-condition：移动绝对合法，已通过检验
        game.moveOnce = function(step) {
            //game.setChessTo(game.box, step.to);
            //var eat_chess = game.getChess(step.to);
			color =(step.player_id==0?'b':'w');
			img_file = chess_img_dir + color + ".png";
			type = color;
			r = step.to.r;
			c = step.to.c;
            new_chess = FiveChess.createNew(chess_img_size, img_file, chess_size, "棋子", type, step.player_id, 0, 0, 1);
            board[r][c] = new_chess;
            new_chess.loadChess(game);

            game.setChessTo(new_chess, step.to);

			game.setChessTo(game.box, step.to);	
			
			game.updateChess = function(){}

			document.dispatchEvent(game.EndMoveEvent);

        }

        /***********************************\
		 * 设置规则检验函数，外部可改变
		\***********************************/
        game.checkMove = function(step, player_id) {
			if(game.getChess(step.to)) return false;
			return true;
            //return normalCheck(board, step.from, step.to, player_id);
        }

		game.checkWin = function(){
			winner  = {};
			winner.id = -2;
			for(var r = 0; r< n_row; r++){
				for(var c = 0; c< n_col; c++){
					if(board[r][c]){
						cnt  = 1;
						while(cnt < 5){
							if(inRegion({r:r,c:c+cnt}, {r:0,c:0}, {w:15,h:15}) 
									&& board[r][c+cnt] && board[r][c+cnt].player_id == board[r][c].player_id){
										cnt++;
									}
							else break;
						}

						if(cnt < 5){
							cnt = 1;
							while(cnt < 5){
								if(inRegion({r:r+cnt,c:c}, {r:0,c:0}, {w:15,h:15}) 
									&& board[r+cnt][c] && board[r+cnt][c].player_id == board[r][c].player_id){
										cnt++;
									}
								else break;
							}
						}

						if(cnt < 5){
							cnt = 1;
							while(cnt < 5){
								if(inRegion({r:r+cnt,c:c+cnt}, {r:0,c:0}, {w:15,h:15}) 
									&& board[r+cnt][c+cnt] && board[r+cnt][c+cnt].player_id == board[r][c].player_id){
										cnt++;
									}
								else break;
							}
						}

						if(cnt < 5){
							cnt = 1;
							while(cnt < 5){
								if(inRegion({r:r+cnt,c:c-cnt}, {r:0,c:0}, {w:15,h:15}) 
									&& board[r+cnt][c-cnt] && board[r+cnt][c-cnt].player_id == board[r][c].player_id){
										cnt++;
									}
								else break;
							}
						}


						if(cnt == 5){
							winner.id = board[r][c].player_id;
							return winner;
						}
					}
				}
			}
			return winner;
		}


        /***********************************\
		 * 初始化棋子位置，加载棋子和棋盘精灵
		\***********************************/
        // 大写字母 : player_id = 0, 位于上方
        // 小写字母 : player_id = 1, 位于下方
        var chessPos =
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"0000000b0000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000"+
			"000000000000000";

        game.setInitPos = function(newPos) {
            chessPos = newPos;
        }

        game.blackAtTop = true;

        /***********************************\
		 * run 
		\***********************************/
        game.run = function(crafty) {
            Crafty.init(w, h, document.getElementById(area));
            /***********************************\
			 * board 生成 
			\***********************************/
            loadBoard();
            game.sprite.bind('MouseMove', game.moveBoxToMouse);


            /***********************************\
			 * box 生成 
			\***********************************/
            game.box2 = FiveChess.createNew(box_img_size, box2_img_file, chess_size, "选择框", -1, -1, 0, 0, 0);
            game.box2.loadChess(game);
            game.hide(game.box2);

            game.box = FiveChess.createNew(box_img_size, box_img_file, chess_size, "选择框", -1, -1, 0, 0, 0);
            game.box.loadChess(game);
            game.hide(game.box);

            /***********************************\
			 * 棋子 生成 
			\***********************************/

            for (var r = 0; r < n_row; r++) {
                for (var c = 0; c < n_col; c++) {
                    var index = r * n_col + c;
                    ch = chessPos[index];
                    if (ch == 'b') {
                        player_id = 0;
                        if (game.blackAtTop) color = 'b';
                        else color = 'w';
                    } else if (ch == 'w') {
                        player_id = 1;
                        if (game.blackAtTop) color = 'w';
                        else color = 'b';
                    } else continue;

                    //type = game.getChessType(ch);
					type = color;
					img_file = chess_img_dir + color + ".png";
                    //img_file = chess_img_dir + color + "_" + type + ".png";
                    new_chess = FiveChess.createNew(chess_img_size, img_file, chess_size, "棋子", type, player_id, 0, 0, 1);
                    board[r][c] = new_chess;
                    new_chess.loadChess(game);
                    game.setChessTo(new_chess, {
                        r: r,
                        c: c
                    });

                }
            }

            game.start();
        }

        return game;
    }
};


/***********************************\
* 五子棋子类 
\***********************************/
var FiveChess = {
    createNew: function(img_size, img_file, size, color, type, player_id, x, y, z, name) {
        var chess = Chess.createNew(img_size, img_file, size, color, type, player_id, x, y, z, name);
        return chess;
    }
}

