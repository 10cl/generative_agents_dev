class UIButton extends Phaser.GameObjects.Image {
  cacheScene
  private activated: boolean;
  private texture2: any;
  private texture1: any;
  private initialX: any;

  constructor(scene, x, y, texture1, texture2) {
    super(scene, x, y, "anims_ui", texture1);
    this.cacheScene = scene;

    // Add to scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Fix in place when camera moves, and sit on top of the game.
    this.setScrollFactor(0).setDepth(105);

    // When the button is clicked it will toggle between texture1 and texture2
    this.initialX = x;  // Initial x position, will be changed when entering fullscreen
    this.texture1 = texture1;
    this.texture2 = texture2;
    this.activated = false;

    // Texture to display at creation or at scene wake event
    const self = this;
    this.setInitialTexture(self);
    scene.events.on('wake', () => this.setInitialTexture(self))  // IMPLEMENT IN SUBCLASS!!!
    // Binding for the pointerdown event
    this.setInteractive({useHandCursor: true}).on('pointerdown', () => this.clickButton(self, scene))
  }

  clickButton(self, scene) {
    if (!self.activated) {
      self.activateButton(self, scene);  // IMPLEMENT IN SUBCLASS!!!
    } else {
      self.deactivateButton(self, scene);  // IMPLEMENT IN SUBCLASS!!!
    }
  }

  setInitialTexture(self){

  }
}

export class MusicButton extends UIButton {
  setInitialTexture(self) {
    const prevMusic = self.scene.sound.get('music')
    // If the 'music' key exists and it is playing, set the mute button;
    if (prevMusic !== null && prevMusic.isPlaying) {
      self.setTexture("anims_ui", self.texture2);
    } else {
      self.setTexture("anims_ui", self.texture1);  // Otherwise, the play music one
    }
  }

  activateButton(self, scene) {
    // Music will load on click, check that it not loading from prev click in this scene
    if (!scene.load.isLoading()) {
      const music = scene.sound.get('music');  // null if the key does not exist yet (i.e. audio not loaded)
      if (music !== null) {
        // The key exists (audio file was loaded in previous click or scene)
        music.resume();
        self.setTexture("anims_ui", self.texture2);
        self.activated = true;
      } else {
        // The audio is not loaded, load it now
        self.setTexture("anims_ui", "dots");  // put the dots while loading
        scene.load.audio('music', "./assets/audio/music.mp3");
        scene.load.once('complete', function () {
          if (scene.sound.context.state === 'suspended') scene.sound.context.resume();
          scene.sound.play('music', {
            volume: 0.3,
            loop: true,
            delay: 1,
          });
          self.setTexture("anims_ui", self.texture2);
          self.activated = true;
        });
        scene.load.start();
      }
    }
  }

  deactivateButton(self, scene) {
    const music = scene.sound.get('music');
    if (music !== null) music.pause();  // The conditional should always be true here but I leave it just in case
    self.setTexture("anims_ui", self.texture1);
    self.activated = false;
  }
}
