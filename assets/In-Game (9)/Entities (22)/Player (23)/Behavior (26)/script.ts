Sup.ArcadePhysics2D.setGravity(0, -0.02);

class PlayerBehavior extends Sup.Behavior {
  
  position = new Sup.Math.Vector2();
  
  speed = 0.3;
  jumpSpeed = 0.45;

  solidBodies: Sup.ArcadePhysics2D.Body[] = [];
  platformBodies: Sup.ArcadePhysics2D.Body[] = [];

  awake() {
    
    Game.playerBehavior = this;
    
    // We get and store all the bodies in two lists
    let solidActors = Sup.getActor("Solids").getChildren();
    for (let solidActor of solidActors) this.solidBodies.push(solidActor.arcadeBody2D);
    // let platformActors = Sup.getActor("Platforms").getChildren();
    // for (let platformActor of platformActors) this.platformBodies.push(platformActor.arcadeBody2D);
  }

  update() {
    
    this.position = Sup.getActor("Player").getLocalPosition().toVector2();
    
    // First, we do the check with solid bodies
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, this.solidBodies);
    let touchSolids = this.actor.arcadeBody2D.getTouches().bottom;
    let velocity = this.actor.arcadeBody2D.getVelocity();
    
    // When falling, we do the check with one-way platforms
    let touchPlatforms = false;
    if (velocity.y < 0) {
      // We must change the size of the player body so only the feet are checked
      // To do so, we reduce the height of the body and adapt the offset
      this.actor.arcadeBody2D.setSize(1.5, 0.4);
      this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.2 });
      
      // Now, we can do check with every platform
      for (let platformBody of this.platformBodies) {
        Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, platformBody);
        if (this.actor.arcadeBody2D.getTouches().bottom) {
          touchPlatforms = true;
          velocity.y = 0;
          break;
        }
      }
  
      // After the check, we have to reset the body to its normal size
      this.actor.arcadeBody2D.setSize(1.5, 1.8);
      this.actor.arcadeBody2D.setOffset({ x: 0, y: 0.9 });
    }

    // We override the `.x` component based on the player's input
    if (Sup.Input.isKeyDown("LEFT")) {
      velocity.x = -this.speed;
      // When going left, we have to flip the sprite
      this.actor.spriteRenderer.setHorizontalFlip(true);
    } else if (Sup.Input.isKeyDown("RIGHT")) {
      velocity.x = this.speed;
      // When going right, we cancel the flip
      this.actor.spriteRenderer.setHorizontalFlip(false);
    } else velocity.x = 0;

    // If the player is on the ground and wants to jump,
    // we update the `.y` component accordingly
    let touchBottom = touchSolids || touchPlatforms;
    if (touchBottom) {
      if (Sup.Input.wasKeyJustPressed("UP")) {
        velocity.y = this.jumpSpeed;
        this.actor.spriteRenderer.setAnimation("Jump");
      } else {
        // There, we should play either 'Idle' or 'Run' depending on the horizontal speed
        if (velocity.x === 0) this.actor.spriteRenderer.setAnimation("Idle");
        else this.actor.spriteRenderer.setAnimation("Run");
      }
    } else {
      // There, we should play either 'Jump' or 'Fall' depending on the vertical speed
      if (velocity.y >= 0) this.actor.spriteRenderer.setAnimation("Jump");
      else this.actor.spriteRenderer.setAnimation("Fall");
    }

    // Finally, we apply the velocity back to the ArcadePhysics body
    this.actor.arcadeBody2D.setVelocity(velocity);
  }
}
Sup.registerBehavior(PlayerBehavior);
