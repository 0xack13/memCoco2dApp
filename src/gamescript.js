var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
var pickedTiles = [];
var scoreText, totalText;
var moves=0;
var totalMatches=0;

var gameScene = cc.Scene.extend({
  onEnter:function () {
      gameArray = shuffle(gameArray);
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});

var shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i),x = v[--i], v[i] = v[j], v[j] = x);
        return v;
};

var game = cc.Layer.extend({
  init:function () {
    this._super();
    var gradient = cc.LayerGradient.create(cc.color(0,0,0,255),
    cc.color(0x46,0x82,0xB4,255));
    this.addChild(gradient);
    
    scoreText = cc.LabelTTF.create("Moves: 0","Arial","32",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(scoreText);
    scoreText.setPosition(90,50);
      
    
    totalText = cc.LabelTTF.create("Total: 0","Arial","32",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(totalText);
    totalText.setPosition(90,90);
      
    var tileEnd = new endTile();
    this.addChild(tileEnd,0);
    tileEnd.setPosition(200,90);
      
    for(i=0;i<16;i++){
      //var tile = cc.Sprite.create("assets/cover.png");
      var tile = new MemoryTile();
      tile.pictureValue = gameArray[i];
      this.addChild(tile,0);
      tile.setPosition(49+i%4*74,400-Math.floor(i/4)*74);
    }
  }
});

var endTile = cc.Sprite.extend({
  ctor:function() {
    this._super();
    this.initWithFile("assets/start_n.png");
    cc.eventManager.addListener(endListener.clone(), this);
  }
});

var endListener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan: function (touch, event) {
        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
        if (cc.rectContainsPoint(targetRectangle, location)) {
            console.log("Click end!!!");
            cc.log("==game over");
            cc.director.pause();
            cc.director.runScene(new gameScene());
            totalMatches = 0;
            moves = 0;
        }
  }
});

var MemoryTile = cc.Sprite.extend({
  ctor:function() {
    this._super();
    this.initWithFile("assets/cover.png");
    cc.eventManager.addListener(listener.clone(), this);
  }
});

var listener = cc.EventListener.create({
  event: cc.EventListener.TOUCH_ONE_BY_ONE,
  swallowTouches: true,
  onTouchBegan: function (touch, event) {
    if(pickedTiles.length<2) {
    
        var target = event.getCurrentTarget();
        var location = target.convertToNodeSpace(touch.getLocation());
        var targetSize = target.getContentSize();
        var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
        if (cc.rectContainsPoint(targetRectangle, location)) {
              if(pickedTiles.indexOf(target)==-1) {                                                     target.initWithFile("assets/tile_"+target.pictureValue+".png");
              pickedTiles.push(target);
              if(pickedTiles.length==2){
                checkTiles();
              }
        }
      }
    }
  }
})


function checkTiles(){
  moves++;
  scoreText.setString("Moves: "+moves);
  var pause = setTimeout(function(){
    if(pickedTiles[0].pictureValue!=pickedTiles[1].pictureValue){
      pickedTiles[0].initWithFile("assets/cover.png");
      pickedTiles[1].initWithFile("assets/cover.png");
    }
    else{
      gameLayer.removeChild(pickedTiles[0]);
      gameLayer.removeChild(pickedTiles[1]);
      totalMatches++;
      totalText.setString("Total: "+totalMatches);
    }
    pickedTiles = [];
  },500);
}