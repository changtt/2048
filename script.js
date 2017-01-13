var GameContent = function() {
	return {
		rowNum : 4,// 行数
		colNum : 4,// 列数，提取行列数方便扩展
		score : 0,// 操作得分
		sum : 0,// 面板数字统计得分
		bestScore : 0,// 得分记录，
		level : 0,// 分数等级
		scoreElem : null,// 显示总分数的element
		gridElem : null,// 游戏网格面板
		touchElem : null,// 点击触发区域
		levelBar : null,// 经验条
		levelText : null,// 等级描述
		bestElem : null,// 最高分记录
		gridValues : [],
		firstInit : true,

		// 初始化
		init : function() {
			this.initConfig();
			this.initEvents();

			// 开局填两个格子
			this.spawnRand();
			this.spawnRand();
			this.updateGrid();
		},

		// 参数初始化
		initConfig : function() {
			this.scoreElem = document.getElementById("score");
			this.gridElem = document.getElementById("grid");
			this.touchElem = document.getElementById("touch");
			this.levelBar = document.getElementById("bar").getElementsByTagName("div")[0];
			var infoText = document.getElementById("text");
			this.levelText = infoText.getElementsByTagName("p")[0];
			this.bestElem = infoText.getElementsByTagName("p")[1];
			// this.gridElem.removeAttribute("class"); //重置后去掉游戏结束样式

			this.level = 0;
			this.score = 0;
			this.updateScore();

			this.gridValues = [];
			for (var i = 0; i < this.colNum; i++) {
				for (var j = 0; j < this.rowNum; j++) {
					if (!this.gridValues[i]) {
						this.gridValues[i] = [];
					}
					this.gridValues[i][j] = -1;
				}
			}
		},

		// 第一次初始化时绑定点击和按键事件
		initEvents : function() {
			var me = this;
			if (!me.firstInit) {
				return;
			}
			document.onkeydown = function(e) {
				me.keyPress(e.keyCode);
			}
			document.getElementsByTagName("header")[0].getElementsByTagName("a")[0].onclick = function() {
				me.init();
			};
			me.touchElem.getElementsByTagName("div")[0].onclick = function() {

				me.moveGrid('up');
			}
			me.touchElem.getElementsByTagName("div")[1].onclick = function() {
				me.moveGrid('left');
			}
			me.touchElem.getElementsByTagName("div")[2].onclick = function() {
				me.moveGrid('right');
			}
			me.touchElem.getElementsByTagName("div")[3].onclick = function() {
				me.moveGrid('down');
			}

			me.firstInit = false;
		},

		// 更新分数
		updateScore : function() {
			this.scoreElem.innerHTML = (this.score + this.sum) + "分";
			this.updateBest();
			this.updateLevel();
		},

		// 随机填充一格
		spawnRand : function() {
			var row, col, possibles = [];

			// 查找空白处
			for (row = 0; row < this.rowNum; row++) {
				for (col = 0; col < this.colNum; col++) {
					if (this.gridValues[row][col] == -1)
						possibles.push([ row, col ]);
				}
			}

			if (possibles.length > 0) {
				// 从空白格子数组中随机选出1个
				var randomBlock = possibles[(Math.floor(Math.random() * possibles.length))];
				// 将初始值填充到选中的格子
				this.gridValues[randomBlock[0]][randomBlock[1]] = 2;
			} else {
				if (!this.checkMovable()) {
					this.gameOver();
				}
			}
		},

		updateBest : function() {
			if (this.bestScore < (this.score + this.sum)) {
				this.bestScore = (this.score + this.sum);
			}
			this.bestElem.innerHTML = this.bestScore + "分";
		},

		getLevelText : function(lvl) {
			if (lvl === 1) // 4+
				return "初学乍练";
			else if (lvl === 2) // 16+
				return "登堂入室";
			else if (lvl === 3) // 64+
				return "圆转纯熟";
			else if (lvl === 4) // 256+
				return "初窥堂奥";
			else if (lvl === 5) // 1024+
				return "略有小成";
			else if (lvl === 6) // 4,096+
				return "渐入佳境";
			else if (lvl === 7) // 16,384+
				return "炉火纯青";
			else if (lvl === 8) // 65,536+
				return "已臻大成";
			else if (lvl === 9) // 262,144+
				return "登峰造极";
			else if (lvl === 10) // 1,048,576+
				return "出神入化";
			else
				return "";
		},

		updateLevel : function() {
			this.level = Math.floor(Math.log(this.score + this.sum) / Math.log(4));

			if (this.level > 10)
				this.level = 10;
			if (this.level < 0)
				this.level = 0;

			var desc = this.getLevelText(this.level);
			this.levelText.innerHTML = "Level " + this.level + (desc === "" ? "" : (" — " + desc));
			this.levelBar.style.width = (this.level * 10) + "%";
		},

		// 结束，播放结束动画等
		gameOver : function() {
			// this.gridElem.setAttribute("class", "over");
			alert('game over');
		},

		// 还能不能动
		checkMovable : function() {
			for (var row = 0; row < this.rowNum - 1; row++) {
				for (var col = 0; col < this.colNum - 1; col++) {
					if (this.gridValues[row + 1][col] === this.gridValues[row][col]
							|| this.gridValues[row][col + 1] === this.gridValues[row][col])
						return true;
				}
			}

			return false;
		},

		// 更新面板，将gridValues数组所存的新的值更新到页面
		updateGrid : function() {
			var el, row, col;
			for (row = 0; row < this.rowNum; row++) {
				for (col = 0; col < this.colNum; col++) {
					e = this.gridElem.getElementsByTagName("div")[(row * 4) + col];
					if (this.gridValues[row][col] !== -1) {
						e.innerHTML = this.gridValues[row][col];
						e.setAttribute("class", "b" + this.gridValues[row][col]);
					} else {
						e.innerHTML = "";
						e.setAttribute("class", "bv");
					}
				}
			}
		},

		// 监听按钮
		keyPress : function(code) {
			if (code === 37 || code === 65) {
				this.moveGrid('left')
			} else if (code === 38 || code === 87) {
				this.moveGrid('up');
			} else if (code === 39 || code === 68) {
				this.moveGrid('right');
			} else if (code === 40 || code === 83) {
				this.moveGrid('down');
			}
		},

		// 开始移动
		moveGrid : function(direction) {
			// 先把有数字的格子全部往点击的方向挪
			this.moveDirection(direction);
			// 合并能合并的格子
			this.mergeGrid(direction);
			// 为了填充合并空出来的格子，继续把有数字的格子再往点击的方向挪一遍
			this.moveDirection(direction);
			// 统计得分
			this.calcSum();
			// 加新数字
			this.spawnRand();
			// 更新界面
			this.updateGrid();
		},

		// 合并并加分
		mergeGrid : function(direction) {
			switch (direction) {
			case 'left':
				for (var row = 0; row < this.rowNum; row++) {
					for (var col = 0; col < this.colNum; col++) {
						if (col + 1 < this.colNum && this.gridValues[row][col] != -1
								&& this.gridValues[row][col] == this.gridValues[row][col + 1]) {
							this.gridValues[row][col] *= 2;
							this.addScore(this.gridValues[row][col]);
							this.gridValues[row][col + 1] = -1;
						}
					}
				}
				break;
			case 'right':
				for (var row = 0; row < this.rowNum; row++) {
					for (var col = this.colNum - 1; col >= 0; col--) {
						if (col > 0 && this.gridValues[row][col - 1] != -1
								&& this.gridValues[row][col] == this.gridValues[row][col - 1]) {
							this.gridValues[row][col] *= 2;
							this.addScore(this.gridValues[row][col]);
							this.gridValues[row][col - 1] = -1;
						}
					}
				}
				break;
			case 'up':
				for (var col = 0; col < this.colNum; col++) {
					for (var row = 0; row < this.rowNum; row++) {
						if (row + 1 < this.rowNum && this.gridValues[row + 1][col] != -1
								&& this.gridValues[row][col] == this.gridValues[row + 1][col]) {
							this.gridValues[row][col] *= 2;
							this.addScore(this.gridValues[row][col]);
							this.gridValues[row + 1][col] = -1;
						}
					}
				}
				break;
			case 'down':
				for (var col = 0; col < this.colNum; col++) {
					for (var row = this.rowNum - 1; row >= 0; row--) {
						if (row != 0 && this.gridValues[row - 1][col] != -1
								&& this.gridValues[row][col] == this.gridValues[row - 1][col]) {
							this.gridValues[row][col] *= 2;
							this.addScore(this.gridValues[row][col]);
							this.gridValues[row - 1][col] = -1;
						}
					}
				}
				break;
			default:
				break;
			}
		},

		// 把格子向一个方向移动，消除该方向数字间空格 (移动的时候有几个合并方案，比如有第一行是2 0 2 2，向左移动之后可以是4 2 0
		// 0、可以是2 4 0 0，甚至有的是2 0 4 0，这里取第一种)
		moveDirection : function(direction) {
			switch (direction) {
			case 'up':
				for (var col = 0; col < this.colNum; col++) {
					var colTemp = [];
					for (var row = 0; row < this.rowNum; row++) {
						if (this.gridValues[row][col] != -1) {
							colTemp.push(this.gridValues[row][col]);
						}
					}

					for (var rowIndex = 0; rowIndex < this.rowNum; rowIndex++) {
						if (rowIndex < colTemp.length) {
							this.gridValues[rowIndex][col] = colTemp[rowIndex];
						} else {
							this.gridValues[rowIndex][col] = -1;
						}
					}
				}
				break;
			case 'left':
				for (var row = 0; row < this.rowNum; row++) {
					var rowTemp = [];
					for (var col = 0; col < this.colNum; col++) {
						if (this.gridValues[row][col] != -1) {
							rowTemp.push(this.gridValues[row][col]);
						}
					}
					for (; rowTemp.length < this.colNum;) {
						rowTemp.push(-1);
					}
					this.gridValues[row] = rowTemp;
				}
				break;
			case 'right':
				for (var row = 0; row < this.rowNum; row++) {
					var rowTemp = [];
					for (var col = 0; col < this.colNum; col++) {
						if (this.gridValues[row][col] != -1) {
							rowTemp.push(this.gridValues[row][col]);
						}
					}
					for (; rowTemp.length < this.colNum;) {
						rowTemp.unshift(-1);
					}
					this.gridValues[row] = rowTemp;
				}
				break;
			case 'down':
				for (var col = 0; col < this.colNum; col++) {
					var colTemp = [];
					for (var row = 0; row < this.rowNum; row++) {
						if (this.gridValues[row][col] != -1) {
							colTemp.push(this.gridValues[row][col]);
						}
					}

					for (var rowIndex = 0; rowIndex < this.rowNum; rowIndex++) {
						var index = rowIndex + colTemp.length - this.rowNum;
						if (index > -1) {
							this.gridValues[rowIndex][col] = colTemp[index];
						} else {
							this.gridValues[rowIndex][col] = -1;
						}
					}
				}
				break;
			default:
				break;
			}
		},

		// 设置得分
		calcScore : function(n) {
			switch (n) {
			case 2:
				return 2;
			case 4:
				return 5;
			case 8:
				return 10;
			case 16:
				return 25;
			case 32:
				return 50;
			case 64:
				return 125;
			case 128:
				return 250;
			case 256:
				return 500;
			case 512:
				return 1000;
			case 1024:
				return 2000;
			case 2048:
				return 4000;
			case 4096:
				return 8000;
			case 8192:
				return 16000;
			case 16384:
				return 32500;
			case 32768:
				return 65000;
			default:
				return 0;
			}
		},

		// 合并得分
		addScore : function(block) {
			this.score += this.calcScore(block);
		},

		// 面板所有数字得分
		calcSum : function() {
			this.sum = 0;
			var row, col;

			for (var row = 0; row < 4; row++) {
				for (var col = 0; col < 4; col++) {
					if (this.gridValues[row][col] !== -1)
						this.sum += this.gridValues[row][col];
				}
			}

			this.updateScore();
		}
	}
}();

window.onload = function() {
	GameContent.init();
}
