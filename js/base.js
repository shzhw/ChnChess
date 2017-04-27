var CC = function(){
  this._init();
}
CC.prototype={
  fakeBoard:[],
  boardWith:521,
  boardHeight:577,
  pieceSize:57,
  boardLeft:0,
  boardTop:0,
  imgSequence:[],
  rootDir:"/images/",
  _init:function(){

    this.fakeBoard = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    this.piece_name = [
      "oo",
      "rk", "ra", "rb", "rn", "rr", "rc", "rp", 
      "bk", "ba", "bb", "bn", "br", "bc", "bp", 
    ];
    this.piece_name_chn = [
      "棋盘", 
      "红帥", "红仕", "红相", "红馬", "红車", "红砲", "红兵",
      "黑将", "黑士", "黑象", "黑馬", "黑車", "黑炮", "黑卒",
    ];

    this.fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR";
    this.squares = [];

    this.chessboard = $("#chessboard");
    this.boardLeft = (this.boardWith - this.pieceSize*9) >> 1;//4
    this.boardTop = (this.boardHeight - this.pieceSize*10) >>1;//3

    //遍历虚拟棋盘
    for(var i=0;i<256;i++){

      if(!this.isOnBoard(i)){
        this.imgSequence.push(null);
        continue;
      }
     
      //棋盘分90个区域 
      var img = $("<img/>");

      img.css({
        "left":this.sqX(i),
        "top":this.sqY(i)
      }) ;

      this.chessboard.append(img);

      this.imgSequence.push(img[0]);

      img[0].onmousedown=function(){
        alert(1);
      }

    }//for end

    this.initPiece(this.fen);//摆棋
    this.drawPiece();
    // console.log(this.squares); 
    
  },
  initPiece:function(fen){
    var c,
        x = 3,//实棋盘左
        y = 3,//实棋盘顶
        i = 0;
    this.clearBoard();
    for (; i < fen.length; i++) {
      c = fen[i]
      if(c == "/"){//换行
        y++;
        x = 2;
        if(y > 12) //实棋盘底
          break;  
      }else if(c >= "a" && c<="z"){//黑
        if(x <= 11){//实棋盘右
          var n = this.pieceCode(c.toLocaleLowerCase());
          if(n >= 0){
            this.addPiece(this.coordXY(x,y),n+8);
          }
        }
      }else if(c >= "A" && c<="Z"){//红
        if(x <= 11){//实棋盘右
          var n = this.pieceCode(c.toLocaleLowerCase());
          if(n >= 0){
            this.addPiece(this.coordXY(x,y),n+1);
          }
        }
      }else if(c >="1" && c<="9"){//空
        x += c.charCodeAt() - 48;//48 == "0".charCodeAt()
        continue;
      }
      x++
    }
  },
  clearBoard:function(){
    for(var i=0;i<256;i++){
      this.squares.push(0);    
    }
  },
  isOnBoard:function(pos){
    return this.fakeBoard[pos] != 0;
  },
  //根据一维矩阵，获取二维矩阵列数
  fileX:function(pos){
    return pos & 15
  },
  //根据一维矩阵，获取二维矩阵行数
  rankY:function(pos){
    return pos >> 4;
  },
  //将二位数组转化成一维数组
  coordXY:function(x,y){
    return x + ( y<<4 );
  },
  sqX:function(pos){
    return this.boardLeft + (this.fileX(pos)-3)*this.pieceSize;
  },
  sqY:function(pos){
    return this.boardTop + (this.rankY(pos)-3)*this.pieceSize;
  },
  pieceCode:function(fenCode){
    switch(fenCode){
      case "k":
        return 0;//将
      case "a":
        return 1;//士
      case "b":
        return 2;//像
      case "n":
        return 3;//马
      case "r":
        return 4;//车
      case "c":
        return 5;//炮
      case "p":
        return 6;//卒
      default:
        return -1;
    }
  },
  addPiece:function(p,v){
    this.squares[p]=v;
  },
  drawPiece:function(){
    for (var i = 0; i < 256; i ++) {
      if (this.isOnBoard(i)) {
        $(this.imgSequence[i]).attr("src" , this.rootDir + this.piece_name[this.squares[i]]+".gif");
      }
    }
  },
  clickPiece:function(index){
    alert(1)
  }
}