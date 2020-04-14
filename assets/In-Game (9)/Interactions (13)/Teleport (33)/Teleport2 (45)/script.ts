class Teleport2Behavior extends Sup.Behavior {
  
  
  enabled = true;

  private triggered = false;
  private position: Sup.Math.Vector2;
  private size = this.actor.getLocalScale();

  awake() {
    this.position = this.actor.getLocalPosition().toVector2();
    this.actor.setVisible(false);
  }

  start() {
    
  }

  update() {
    if (Fade.isFading || this.triggered || !this.enabled) return;
    if (Math.abs(Game.playerBehavior.position.x - this.position.x) <= this.size.x  && Math.abs(Game.playerBehavior.position.y - this.position.y) <= this.size.y) {
      this.triggered = true;
      Fade.start(Fade.Direction.Out, { duration: 100 }, () => { Sup.loadScene("End/Scene") });
    }
  }
}
Sup.registerBehavior(Teleport2Behavior);



