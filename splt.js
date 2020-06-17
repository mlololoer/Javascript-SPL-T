class Block {
	constructor(height,width) {
		this.height = height;
		this.width = width;
		this.counter = -1;
	}
	splittable(horizontally) {
		if (this.counter < 0) {
			return (horizontally ? (this.height > 1) : (this.width > 1));
		} else return false;
	}
}
/*
->width
00 01 02 03 |
10 11 12 13 v
20 21 22 23 height
30 31 32 33
*/
class SPLT {
	constructor(boardHeight, boardWidth) {
		this.boardHeight = boardHeight;
		this.boardWidth = boardWidth;
		this.board = [];
		for (var i = 0; i < boardHeight; ++i) {
			this.board[i] = [];
			for (var j = 0; j < boardWidth; ++j) this.board[i][j] = {'x' : 0, 'y' : 0};
		}
		this.board[0][0] = new Block(boardHeight,boardWidth);
		this.horizontal = true;
		this.turns = 0;
		this.score = 0;
	}
	handleFiller(xPos,yPos,height,width) {
		for (var i = yPos; i < yPos+height; ++i) {
			for (var j = xPos; j < xPos+width; ++j) {
				if (i == yPos && j == xPos) continue;
				else this.board[i][j] = {'x' : xPos, 'y' : yPos};
			}
		}
	}
	countDown() {
		var someRemoved = false;
		for (var yPos = 0; yPos < this.boardHeight; ++yPos) {
			var minHeight = this.boardHeight;
			for (var xPos = 0; xPos < this.boardWidth; ++xPos) {
				if (this.board[yPos][xPos] instanceof Block) {
					var thisHeight = this.board[yPos][xPos].height;
					var thisWidth  = this.board[yPos][xPos].width;
					if (thisHeight < minHeight) minHeight = thisHeight;
					if (this.board[yPos][xPos].counter > 0) {
						--this.board[yPos][xPos].counter;
						++this.score;
					}
					if (this.board[yPos][xPos].counter == 0) {
						this.score += (thisHeight*thisWidth);
						someRemoved = true;
						for (var i = yPos; i < yPos+thisHeight; ++i) {
							for (var j = xPos; j < xPos+thisWidth; ++j) {
								this.board[i][j] = null;
							}
						}
					}
					xPos += thisWidth-1;
				}
			}
			yPos += minHeight-1;
		}
		return someRemoved;
	}
	checkFours(xPos,yPos) {
		if (xPos >= 0 && xPos < this.boardWidth && yPos >= 0 && yPos < this.boardHeight && this.board[yPos][xPos] instanceof Block && this.board[yPos][xPos].counter < 0) {
			var thisHeight = this.board[yPos][xPos].height;
			var thisWidth = this.board[yPos][xPos].width;
			if (xPos + 2*thisWidth <= this.boardWidth && yPos + 2*thisHeight <= this.boardHeight) {
				var flag = 0;
				if (this.board[yPos][xPos+thisWidth] instanceof Block) {
					if (this.board[yPos][xPos+thisWidth].height == thisHeight && this.board[yPos][xPos+thisWidth].width == thisWidth && this.board[yPos][xPos+thisWidth].counter < 0) ++flag;
				}
				if (this.board[yPos+thisHeight][xPos] instanceof Block) {
					if (this.board[yPos+thisHeight][xPos].height == thisHeight && this.board[yPos+thisHeight][xPos].width == thisWidth && this.board[yPos+thisHeight][xPos].counter < 0) ++flag;
				}
				if (this.board[yPos+thisHeight][xPos+thisWidth] instanceof Block) {
					if (this.board[yPos+thisHeight][xPos+thisWidth].height == thisHeight && this.board[yPos+thisHeight][xPos+thisWidth].width == thisWidth && this.board[yPos+thisHeight][xPos+thisWidth].counter < 0) ++flag;
				}
				return (flag == 3);
			}
		}
		return false;
	}
	markFours(xPos,yPos) {
		var thisHeight = this.board[yPos][xPos].height;
		var thisWidth = this.board[yPos][xPos].width;
		this.board[yPos][xPos].counter = this.turns;
		this.board[yPos][xPos+thisWidth].counter=(this.turns);
		this.board[yPos+thisHeight][xPos].counter=(this.turns);
		this.board[yPos+thisHeight][xPos+thisWidth].counter=(this.turns);
	}
	handleGroups() {
		// xPos and yPos is the upper left block's start position.
		var toMark = [];
		for (var yPos = 0; yPos < this.boardHeight; ++yPos) {
			var minHeight = this.boardHeight;
			for (var xPos = 0; xPos < this.boardWidth; ++xPos) {
				if (this.board[yPos][xPos] instanceof Block) {
					if (this.board[yPos][xPos].height < minHeight) minHeight = this.board[yPos][xPos].height;
					if (this.checkFours(xPos,yPos)) {
						toMark.push({"x":xPos,"y":yPos});
					}
					xPos += this.board[yPos][xPos].width-1;
				}
			}
			yPos += minHeight-1;
		}
		/* var thisHeight = this.board[yPos][xPos].height;
		var thisWidth = this.board[yPos][xPos].width;
		var toMark = [];
		if (this.checkFours(xPos,yPos)) {
			toMark.push({"x":xPos,"y":yPos});
			if (this.checkFours(xPos+thisWidth,yPos))	toMark.push({"x":xPos+thisWidth,"y":yPos});
			if (this.checkFours(xPos,yPos+thisHeight))	toMark.push({"x":xPos,"y":yPos+thisHeight});
			if (this.checkFours(xPos-thisWidth,yPos))	toMark.push({"x":xPos-thisWidth,"y":yPos});
			if (this.checkFours(xPos,yPos-thisHeight))	toMark.push({"x":xPos,"y":yPos-thisHeight});
		}
		if (this.checkFours(xPos-thisWidth,yPos)) {
			toMark.push({"x":xPos-thisWidth,"y":yPos});
			if (this.checkFours(xPos-2*thisWidth,yPos))			toMark.push({"x":xPos-2*thisWidth,"y":yPos});
			if (this.checkFours(xPos-thisWidth,yPos+thisHeight))toMark.push({"x":xPos-thisWidth,"y":yPos+thisHeight});
			if (this.checkFours(xPos-thisWidth,yPos-thisHeight))toMark.push({"x":xPos-thisWidth,"y":yPos-thisHeight});
		}
		if (this.checkFours(xPos,yPos-thisHeight)) {
			toMark.push({"x":xPos,"y":yPos-thisHeight});
			if (this.checkFours(xPos,yPos-2*thisHeight))			toMark.push({"x":xPos,"y":yPos-2*thisHeight});
			if (this.checkFours(xPos-thisWidth,yPos-thisHeight))toMark.push({"x":xPos-thisWidth,"y":yPos-thisHeight});
			if (this.checkFours(xPos+thisWidth,yPos-thisHeight))toMark.push({"x":xPos+thisWidth,"y":yPos-thisHeight});
		}
		if (this.checkFours(xPos-thisWidth,yPos-thisHeight)) {
			toMark.push({"x":xPos-thisWidth,"y":yPos-thisHeight});
			if (this.checkFours(xPos-thisWidth,yPos-2*thisHeight))	toMark.push({"x":xPos-thisWidth,"y":yPos-2*thisHeight});
			if (this.checkFours(xPos-2*thisWidth,yPos-thisHeight))	toMark.push({"x":xPos-2*thisWidth,"y":yPos-thisHeight});
		} */
		for (var i = 0; i < toMark.length; ++i) {
			this.markFours(toMark[i].x,toMark[i].y);
		}
	}
	dropBoxes() { //simulate falling of boxes
		var dropped = false;
		for (var yPos = this.boardHeight-1; yPos >= 0; --yPos) {
			for (var xPos = 0; xPos < this.boardWidth; ++xPos) {
				if (this.board[yPos][xPos] instanceof Block) {
					var thisHeight = this.board[yPos][xPos].height;
					var thisWidth  = this.board[yPos][xPos].width;
					var dropHeight = 0;
					var noMoreDrops = false;
					for (var i = yPos+thisHeight; i < this.boardHeight; ++i) {
						for (var j = xPos; j < xPos+thisWidth; ++j) {
							if (this.board[i][j] !== null) {noMoreDrops = true; break;}
						}
						if (noMoreDrops) break;
						++dropHeight; //number of units this block has to fall
					}
					if (dropHeight > 0) {
						dropped = true;
						var tempBox = this.board[yPos][xPos];
						
						//set space above to null
						for (var i = yPos; i < yPos+dropHeight; ++i) {
							for (var j = xPos; j < xPos+thisWidth; ++j) {
								this.board[i][j] = null;
							}
						}
						this.board[yPos+dropHeight][xPos] = tempBox;
						if (tempBox.counter > 0) tempBox.counter = Math.ceil(tempBox.counter/2);
						this.handleFiller(xPos,yPos+dropHeight,thisHeight,thisWidth); //form the filler box in the new drop area
					}
					xPos += thisWidth-1;
				}
			}
		}
		console.log(dropped);	
		return dropped;
	}
	generateNewBoxes() {
		var emptyDepths = [];
		for (var xPos = 0; xPos < this.boardWidth; ++xPos) {
			for (var yPos = 0; yPos < this.boardHeight; ++yPos) {
				if (this.board[yPos][xPos] !== null) {
					emptyDepths.push(yPos); //size of block to be placed
					break;
				}
			}
		}
		
	}
	turn(xPos,yPos) {
		if (this.board[yPos][xPos] === null) return;
		if (!(this.board[yPos][xPos] instanceof Block)) {
			var newXPos = this.board[yPos][xPos].x;
			yPos= this.board[yPos][xPos].y;
			xPos = newXPos;
		}
		//split blocks
		if (this.board[yPos][xPos].splittable(this.horizontal)) {
			++this.turns;
			++this.score;
			var thisHeight = this.board[yPos][xPos].height;
			var thisWidth = this.board[yPos][xPos].width;
			if (this.horizontal) {
				thisHeight >>= 1;
				this.board[yPos][xPos].height >>= 1;
				this.board[yPos+thisHeight][xPos] = new Block(thisHeight,thisWidth);
				this.handleFiller(xPos,yPos+thisHeight,thisHeight,thisWidth);
				this.handleFiller(xPos,yPos,thisHeight,thisWidth);
			} else {
				thisWidth >>= 1;
				this.board[yPos][xPos].width >>= 1;
				this.board[yPos][xPos+thisWidth] = new Block(thisHeight,thisWidth);
				this.handleFiller(xPos+thisWidth,yPos,thisHeight,thisWidth);
				this.handleFiller(xPos,yPos,thisHeight,thisWidth);
			}
			this.horizontal = !this.horizontal; //toggle split direction
			this.countDown();
			this.handleGroups();
			this.dropBoxes();
			this.handleGroups();
		}
	}
}

function drawBoard(ctx,theGame,canvasHeight,canvasWidth) { //CHECK SPLITTABLE AS WELL
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvasWidth,canvasHeight);
	ctx.strokeStyle = "#888888";
	var xInterval = canvasWidth/theGame.boardWidth;
	var yInterval = canvasHeight/theGame.boardHeight;
	for (var yPos = 0; yPos < theGame.boardHeight; ++yPos) {
		for (var xPos = 0; xPos < theGame.boardWidth; ++xPos) {
			if (theGame.board[yPos][xPos] instanceof Block) {
				var thisHeight = theGame.board[yPos][xPos].height;
				var thisWidth  = theGame.board[yPos][xPos].width;
				if (theGame.board[yPos][xPos].counter > 0) {
					ctx.fillStyle = "#FFFFFF";
					ctx.fillRect(xPos*xInterval,yPos*yInterval,thisWidth*xInterval,thisHeight*yInterval);
					ctx.font = "16px Arial";
					ctx.textAlign = "center";
					ctx.fillStyle = "#000000";
					ctx.fillText(theGame.board[yPos][xPos].counter.toString(),(xPos+(thisWidth/2))*xInterval,(yPos+(thisHeight/2))*yInterval+5);
					
				}
				ctx.strokeRect(xPos*xInterval,yPos*yInterval,thisWidth*xInterval,thisHeight*yInterval);
				xPos += thisWidth-1;
			} else if (theGame.board[yPos][xPos] === null) {
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(xPos*xInterval,yPos*yInterval,xInterval,yInterval);
			}
		}
	}
}

var c = document.getElementById("output"); //get canvas
var ctx = c.getContext("2d",{ alpha: false });
var canvasHeight = c.height;
var canvasWidth = c.width;
var thisGame = new SPLT(16,8);
var xInterval = canvasWidth/thisGame.boardWidth;
var yInterval = canvasHeight/thisGame.boardHeight;
drawBoard(ctx,thisGame,canvasHeight,canvasWidth);
c.addEventListener('click',function() {
	thisGame.turn(Math.floor(event.offsetX/xInterval),Math.floor(event.offsetY/yInterval));
	drawBoard(ctx,thisGame,canvasHeight,canvasWidth);
}, false);
/*
drawBoard(ctx,thisGame,canvasHeight,canvasWidth);
thisGame.turn(1,1);
drawBoard(ctx,thisGame,canvasHeight,canvasWidth);
thisGame.turn(1,1);
drawBoard(ctx,thisGame,canvasHeight,canvasWidth);
thisGame.turn(1,1);
drawBoard(ctx,thisGame,canvasHeight,canvasWidth);*/
