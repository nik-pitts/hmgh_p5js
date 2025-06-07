const MouseAction = {
    mouseClickedAction(thing) {
      if (thing instanceof GameStartScene) {
        // Example action: toggle scene flag
        thing.startSceneFlag = !thing.startSceneFlag;
      }
    }
  };