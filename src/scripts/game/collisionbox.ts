import { Vector2 } from "./vector";

export class CollisionBox {
  constructor(
    public width: number,
    public height: number,
    public offset: Vector2
  ) {}
}
