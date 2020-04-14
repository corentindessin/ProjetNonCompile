class EndMenuBehavior extends Sup.Behavior {
  
  private introStarted = false;
  private introTimeout = null;

  awake() {
    Fade.start(Fade.Direction.In, { duration: 500 });
  }

  update() {
    // DEBUG
    
    if (!this.introStarted && Sup.Input.wasKeyJustPressed("RETURN")) {
      this.introStarted = true;
    
    if (this.introStarted && this.introTimeout == null) {
      this.introTimeout = Sup.setTimeout(500, () => { 
        Fade.start(Fade.Direction.Out, { duration: 1000 }, () => { Sup.loadScene("Menus/Scene") });
      });
    }
    }
}
}
Sup.registerBehavior(EndMenuBehavior);