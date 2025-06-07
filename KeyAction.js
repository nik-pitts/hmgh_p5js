class KeyAction {
  buttonPressAction(buttonList) {
    if (key === 'a') {
      buttonList[0].hit = true;
    }
    if (key === 's') {
      buttonList[1].hit = true;
    }
    if (key === 'd') {
      buttonList[2].hit = true;
    }
  }

  buttonReleaseAction(buttonList) {
    if (key === 'a') {
      buttonList[0].hit = false;
    }
    if (key === 's') {
      buttonList[1].hit = false;
    }
    if (key === 'd') {
      buttonList[2].hit = false;
    }
  }

  talkStarts(inputKey) {
    // inputKey should be keyCode of '1', '2', '3' (49, 50, 51)
    let humanSays = inputKey - 48;
    return {
      who: WhoIsTalking.HUMAN,
      humanSays: humanSays
    };
  }
}