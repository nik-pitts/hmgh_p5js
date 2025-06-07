let start, gameUI, startLane, game, player, communication, keyAction, end;
let song;

function preload() {
  song = loadSound("assets/Roa_Escape.mp3");
}

function setup() {
  console.log("setup");
  createCanvas(640, 600);

  start = new GameStartScene();
  gameUI = new GameUI();
  startLane = new StartLaneSelect();
  game = new GameScene();
  player = new Player();
  communication = new Communication();
  keyAction = new KeyAction();
  end = new GameEndScene();

  start.generateGameStartSceneObjects();
  gameUI.generateGameUIObjects();

  // Async JSON loading
  let jsonTool = new JSONTool("assets/result_gen_beats_2.json");
  jsonTool.loadData((patterns) => {
    game.patternsToFall = patterns;
    game.gameSceneFlag = true;
    game.initialLength = patterns.length;
    console.log("JSON loaded, game patterns ready.");
    console.log("Initial patterns length:", game.initialLength);
  });
}

function draw() {
  background(0);

  if (start.startSceneFlag) {
    start.drawGameStartScene();
    return;
  }

  if (!start.startSceneFlag && !startLane.startLaneSelected) {
    startLane.drawStartLaneSelect();
    gameUI.drawGameUIObjects();
    gameUI.drawLaneSelection(startLane.humanInput);
    return;
  }

  if (game.gameSceneFlag) {
    if (!song.isPlaying()) {
      song.play();
      game.musicStartMillis = millis();
    }
    gameUI.drawGameUIObjects();
    gameUI.drawLaneSelection(startLane.humanInput);
    game.drawGameSceneObject(player);
    communication.show();
    communication.talkRender(gameUI.buttons);
    communication.trackTalk(startLane);

    if (game.patternsToFall.length <= game.initialLength*0.8) {
      console.log("Patterns left is less than 80% of initial lenght. Machine will talk from now on.");
      communication.machineTalk(player.playStyleGroup, player.machineHighway, game.gameScore);
    }
    player.play(startLane, game, gameUI.buttons);
    return;
  }

  if (end.gameEndSceneFlag) {
    end.drawGameEndScene(game.gameScore, player);
    return;
  }
}

function keyPressed() {
  if (!startLane.startLaneSelected && !start.startSceneFlag) {
    startLane.receiveHumanInput(game);
  }

  if (game.gameSceneFlag) {
    keyAction.buttonPressAction(gameUI.buttons);

    if (key === '1' || key === '2' || key === '3') {
      if (communication.whoIsTalking === WhoIsTalking.NO_ONE) {
        communication.whoIsTalking = WhoIsTalking.HUMAN;
        communication.humanSays = parseInt(key);
      }
    }
  }
}

function keyReleased() {
  if (game.gameSceneFlag) {
    keyAction.buttonReleaseAction(gameUI.buttons);
    // communication.whoIsTalking = keyAction.talkEnds(communication.humanSays);
  }
}

function mouseClicked() {
  if (start.startSceneFlag) {
    start.startSceneFlag = false;
  }

  if (game.gameSceneFlag) {
    game.gameSceneFlag = false;
    end.gameEndSceneFlag = true;
    if (song.isPlaying()) {
      song.stop();
    }
  }
}