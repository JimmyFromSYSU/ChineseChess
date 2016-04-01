/***********************************\
 * 所有方格棋盘的棋类游戏
 * 棋盘中的元素概念介绍：
 * game： 整个游戏
 * board：棋盘
 * chess：棋子
 * box：也是chess类，但是代表一个选择框，选定一个棋子
 \***********************************/

var SquareChessGame = {
    createNew: function(
        area,
        cell_size, cell_img_size,
        box_img_size,
        b_img_w, b_img_h,
        chess_img_size,
        img_dir,
        bg_color,
        b_offset_x, b_offset_y
    ) {

        var game = {};

        /***********************************\
		* 图片文件配置
		\***********************************/
        box_img_file = img_dir + "/chess/box.png";
        box2_img_file = img_dir + "/chess/box2.png";
        board_img_file = img_dir + "/board/cboard.png";
        chess_img_dir = img_dir + "/chess/";

        /***********************************\
		* 界面元素自适应 
		\***********************************/
        // 自适应游戏界面 
        w = b_img_w * cell_size / cell_img_size;
        h = b_img_h * cell_size / cell_img_size;

        // 棋子的大小
        chess_size = cell_size * 0.95;

        /***********************************\
		* 棋子的隐藏，移动和坐标获取 
		\***********************************/
        // 隐藏元素到棋盘外
        game.hide = function(chess) {
            if (chess != null && chess.sprite != null) {
                chess.sprite.z = -1;
                chess.sprite.x = w + 1;
                chess.sprite.y = h + 1;
                chess.sprite.tx = w + 1;
                chess.sprite.ty = h + 1;
            }
        }

        // 获取点击位置
        game.getClickPos = function(p, bias) {
            x = p.x - bias;
            y = p.y - bias;
            return {
                r: Math.floor(y / cell_size),
                c: Math.floor(x / cell_size)
            }
        }


        // 移动棋子
        game.moveChessTo = function(chess, pos) {
            if (chess == null || chess.sprite == null) return;
            bias_x = (cell_size - chess.sprite.w) / 2 + b_offset_x;
            bias_y = (cell_size - chess.sprite.h) / 2 + b_offset_y;
            //bias_x = b_offset_x;
            //bias_y = b_offset_y;
            var p = {};
            p.y = pos.r * cell_size + bias_y;
            p.x = pos.c * cell_size + bias_x;
            chess.moveTo(p);
        }

        // 设置棋子位置，不产生移动动画
        game.setChessTo = function(chess, pos) {
            if (chess == null || chess.sprite == null) return;
            bias_x = (cell_size - chess.sprite.w) / 2 + b_offset_x;
            bias_y = (cell_size - chess.sprite.h) / 2 + b_offset_y;
            var p = {};
            p.y = pos.r * cell_size + bias_y;
            p.x = pos.c * cell_size + bias_x;
            chess.setTo(p);
        }

        /***********************************\
		* 加载棋盘的接口
		\***********************************/
        loadBoard = function() {
            Crafty.sprite(board_img_file, {
                board: [0, 0, b_img_w, b_img_h]
            });

            game.sprite = Crafty.e("2D, Canvas, board, Mouse").attr({
                x: 0,
                y: 0,
                z: 0,
                w: w,
                h: h
            });

        }

        /***********************************\
		* 游戏流程控制 
		\***********************************/
        // 游戏玩家
        var players = [];
        // 当前下棋的玩家，只代表玩家下子顺序和在数列中的位置，并不等于玩家ID
        var now_player_cnt = 0;
        game.addPlayer = function(player) {
            players.push(player);
        }

        /***********************************\
		* 游戏开始的驱动函数
		* 当启动第一个下子后，进入事件驱动 
		\***********************************/
        game.start = function() {
            // 无玩家
            if (players.length == 0) {
                return;
            }
            // 当前下棋的玩家
            now_player_cnt = 0;

            players.forEach(function(p, index) {
                p.prepare(game);
            });
            players[now_player_cnt].moveOnce(game);
        }

        /***********************************\
		* 游戏结束 
		\***********************************/
        game.over = function() {
            players.forEach(function(player, index) {
                player.finish(game.winner);
            });
            now_player_cnt = -1;
        }

        /***********************************\
		* 移动棋子
		\***********************************/
        game.step = {};
		// [*] 移动棋子的方法需要由子类来定义
        game.moveOnce = function(step) {}

        game.startMove = function() {
            if (game.checkMove(game.step) == true) {
                game.moveOnce(game.step);
            } else {
                players[now_player_cnt].moveOnce(game);
            }
        }

        game.endMove = function() {
            game.updateChess();
            now_player_cnt++;
            if (now_player_cnt >= players.length) now_player_cnt = 0;
            players[now_player_cnt].moveOnce(game);
            game.winner = game.checkWin();
            if (game.winner.id != NOT_GAMEOVER) {
                document.dispatchEvent(game.GameOverEvent);
            }
        }

        /***********************************\
		* 定义游戏事件				
		\***********************************/
        game.GameOverEvent = document.createEvent('Event');
        game.GameOverEvent.initEvent('GameOverEvent', false, false);
        game.StartMoveEvent = document.createEvent('Event');
        game.StartMoveEvent.initEvent('StartMoveEvent', false, false);
        game.EndMoveEvent = document.createEvent('Event');
        game.EndMoveEvent.initEvent('EndMoveEvent', false, false);

        document.addEventListener("GameOverEvent", game.over, false);
        document.addEventListener("StartMoveEvent", game.startMove, false);
        document.addEventListener("EndMoveEvent", game.endMove, false);

        /***********************************\
		* [*] 胜负规则接口 
		\***********************************/
        // 游戏胜者
        game.winner = {};
        NOT_GAMEOVER = -2
            // 检查游戏是否结束，返回一个winner, 
            // winner.id为胜者，
            // =-1：游戏平局
            // =-2：游戏尚未结束
        game.checkWin = function() {
            var winner = {};
            winner.id = -2;
            return winner;
        }

        /***********************************\
		* [*] 移动规则接口 
		\***********************************/
        //检查在game的当前状态下，从step.from位置到step.to位置是否合法
        game.checkMove = function(step) {
            return true;
        }


        return game;
    }
};

/***********************************\
 * 棋子 
 \***********************************/
var Chess = {
    createNew: function(img_size, img_file, size, color, type, player, x, y, z, name) {
        var chess = {};
        chess.player = player;
        chess.type = type;
        chess.color = color;

        function norm(x) {
            var max_v = 10;
            var min_v = 2;
            if (x < 0 && x > -min_v) x = -minv_v;
            if (x < -max_v) x = -max_v;
            if (x > 0 && x < min_v) x = min_v;
            if (x > max_v) x = max_v;
            return x;
        }

        /***********************************\
		 * 棋子移动动画 
		 \***********************************/
        chess.moveAnimation = function() {
            chess.sprite.bind('EnterFrame',
                function() {
                    if (this.x != this.tx || this.y != this.ty) {
                        var speed = 0.3;
                        this.dx = (this.tx - this.x) * speed;
                        this.dy = (this.ty - this.y) * speed;
                        var v = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
                        var nv = norm(v);
                        //	var nv = 5;
                        this.dx = this.dx * nv / v;
                        this.dy = this.dy * nv / v;

                        this.z = 2;
                        if (Math.abs(this.tx - this.x) < Math.abs(this.dx)) {
                            this.x = this.tx;
                            this.dx = 0;
                        } else this.x += this.dx;

                        if (Math.abs(this.ty - this.y) < Math.abs(this.dy)) {
                            this.y = this.ty;
                            this.dy = 0;
                        } else this.y += this.dy;

                        if (this.x == this.tx && this.y == this.ty) {
                            document.dispatchEvent(chess.game.EndMoveEvent);
                        }
                    }
                }
            );
        }

        /***********************************\
		 * 棋子移动和位置变换 
		 \***********************************/
        chess.moveTo = function(p) {
            chess.sprite.tx = p.x;
            chess.sprite.ty = p.y;
            chess.sprite.z = 1;
        }

        chess.setTo = function(p) {
            chess.sprite.x = p.x;
            chess.sprite.y = p.y;
            chess.sprite.tx = p.x;
            chess.sprite.ty = p.y;
            chess.sprite.z = 1;
        }

        /***********************************\
		 * 棋子的加载 
		 \***********************************/
        chess.loadChess = function(game) {

            chess.game = game;

            Crafty.sprite(img_file, {
                tmp: [0, 0, img_size, img_size]
            });

            chess.sprite = Crafty.e("2D, Canvas, tmp").attr({
                x: x,
                y: y,
                z: z,
                w: size,
                h: size,
                tx: x,
                ty: y,
                dx: 0,
                dy: 0
            });

            chess.moveAnimation();
        }

        return chess;
    }
}
