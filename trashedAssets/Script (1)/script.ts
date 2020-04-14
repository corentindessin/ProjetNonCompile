namespace Utils {
  export function updateDepth(actor: Sup.Actor, y: number) { actor.setZ(-y / CameraBehavior.maxY); }
}