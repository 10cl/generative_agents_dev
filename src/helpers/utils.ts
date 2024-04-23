import {
  getStep,
} from "../helpers/memory-store";
import {BaseScene} from "../scenes/base";

export default class Utils {
  dayjs = require('dayjs')

  START_STEP = 2700
  SUGGESTION_STEP = 6420

  deactivateButton(scene) {
    console.trace('deactivateButton')
    if (scene.isSeminar) {
      scene.isSeminar = false
    }
    scene.endWaitSummary()
  }


  refreshStep(scene: BaseScene) {
    let play_step = getStep()
    const currentTime = this.dayjs();
    const sixAM = this.dayjs((this.dayjs().format('YYYY-MM-DDT') + "06:00:00"))
    const lastTime = this.dayjs((this.dayjs().format('YYYY-MM-DDT') + "18:00:00"))
    const secondsUntilSixAM = sixAM.diff(currentTime, 'second');
    const secondsUntilLastTime = lastTime.diff(currentTime, 'second');

    if (play_step !== 0) {
      if (play_step > this.SUGGESTION_STEP) {
        scene.step = this.SUGGESTION_STEP
      } else {
        scene.step = play_step;
      }
    } else if (secondsUntilSixAM > 0) { // 6 点前
      scene.step = this.START_STEP
    } else if (secondsUntilLastTime < 0) { // 下午6点后
      scene.step = this.SUGGESTION_STEP
    } else {
      scene.step = 2160 + parseInt(String(Math.abs(secondsUntilSixAM) / 10))
    }
  }

}

