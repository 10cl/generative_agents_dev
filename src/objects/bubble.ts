import Phaser from "phaser";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin";

export class Bubble{
  private readonly COLOR_PRIMARY = 0x4e342e;
  private readonly COLOR_LIGHT = 0x7b5e57;
  private readonly COLOR_DARK = 0x260e04;
  private readonly START_STEP = 2700;
  private readonly SUGGESTION_STEP = 6420;

  GetValue = Phaser.Utils.Objects.GetValue;
  private readonly rexUI: RexUIPlugin;

  constructor(rexUI: RexUIPlugin) {
    this.rexUI = rexUI;
  }

  // https://codepen.io/rexrainbow/pen/ExZLoWL
  createTextBox(x: number, y: number, config: any) {
    const wrapWidth = this.GetValue(config, 'wrapWidth', 0);
    const fixedWidth = this.GetValue(config, 'fixedWidth', 0);
    const fixedHeight = this.GetValue(config, 'fixedHeight', 0);
    const textBox = this.rexUI.add.textBox({
      x: x,
      y: y,
      background: this.CreateSpeechBubbleShape()
        .setFillStyle(this.COLOR_PRIMARY, 1)
        .setStrokeStyle(2, this.COLOR_LIGHT, 1),
      text: this.getBBcodeText(wrapWidth, fixedWidth, fixedHeight),
      space: {
        left: 10, right: 10, top: 10, bottom: 25,
        icon: 10,
        text: 10,
      }
    }).setOrigin(0, 1).layout();
    // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-textbox/
    textBox.setInteractive().on('pageend', function () {
      if (this.isLastPage) {
        return;
      }
      this.typeNextPage();
    }, textBox)

    return textBox;
  }

  private getBBcodeText(wrapWidth: number, fixedWidth: number, fixedHeight: number) {
    /*if (scene.language.indexOf("zh") !== -1) {
      return scene.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,
        fontFamily: "Roboto,sans-serif",
        fontSize: '16px',
        wrap: {
          mode: 'char',
          width: wrapWidth
        },
        maxLines: 60
      })
    } else {*/
      return this.rexUI.add.BBCodeText(0, 0, '', {
        fixedWidth: fixedWidth,
        fixedHeight: fixedHeight,
        fontFamily: "Roboto,Noto Sans SC,sans-serif",
        fontSize: '16px',
        wrap: {
          mode: 'char',
          width: wrapWidth
        },
        maxLines: 60
      })
    // }
  }

  CreateSpeechBubbleShape() {
    return this.rexUI.add.customShapes({
      create: {lines: 1},
      update: function () {
        const radius = 20;
        const indent = 15;
        const left = 0, right = this.width, top = 0, bottom = this.height, boxBottom = bottom - indent;
        const shape = this.getShapes()[0] as any;
        shape.lineStyle(this.lineWidth, this.strokeColor, this.strokeAlpha)
          .fillStyle(this.fillColor, this.fillAlpha)
          .startAt(left + radius, top).lineTo(right - radius, top).arc(right - radius, top + radius, radius, 270, 360)
          // right line, bottom arc
          .lineTo(right, boxBottom - radius).arc(right - radius, boxBottom - radius, radius, 0, 90)
          // bottom indent
          .lineTo(left + 60, boxBottom).lineTo(left + 50, bottom).lineTo(left + 40, boxBottom)
          // bottom line, left arc
          .lineTo(left + radius, boxBottom).arc(left + radius, boxBottom - radius, radius, 90, 180)
          // left line, top arc
          .lineTo(left, top + radius).arc(left + radius, top + radius, radius, 180, 270)
          .close();
      }
    })
  }


}
