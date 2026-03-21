import Matter from "matter-js";

const { Bodies, Body, Constraint, Vector } = Matter;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const GROUND_Y = 400;
export const SLINGSHOT_X = 150;
export const SLINGSHOT_Y = 350;
export const SLINGSHOT_RADIUS = 70;
export const PROJECTILE_RADIUS = 12;

export function createGround(): Matter.Body {
  return Bodies.rectangle(CANVAS_WIDTH / 2, GROUND_Y + 25, CANVAS_WIDTH, 50, {
    isStatic: true,
    render: { fillStyle: "#5a8e3a" },
    label: "ground",
  });
}

export function createWalls(): Matter.Body[] {
  return [
    Bodies.rectangle(-25, CANVAS_HEIGHT / 2, 50, CANVAS_HEIGHT, {
      isStatic: true,
      label: "wall",
    }),
    Bodies.rectangle(CANVAS_WIDTH + 25, CANVAS_HEIGHT / 2, 50, CANVAS_HEIGHT, {
      isStatic: true,
      label: "wall",
    }),
  ];
}

export function createBlock(x: number, y: number, width: number, height: number): Matter.Body {
  return Bodies.rectangle(x, y, width, height, {
    density: 0.004,
    friction: 0.6,
    restitution: 0.2,
    label: "block",
    render: { fillStyle: "#CC2936" },
  });
}

export function createProjectile(): Matter.Body {
  return Bodies.circle(SLINGSHOT_X, SLINGSHOT_Y, PROJECTILE_RADIUS, {
    density: 0.008,
    friction: 0.5,
    restitution: 0.4,
    label: "projectile",
    render: { fillStyle: "#f0f4e8" },
  });
}

export function createSlingshotConstraint(projectile: Matter.Body): Matter.Constraint {
  return Constraint.create({
    pointA: { x: SLINGSHOT_X, y: SLINGSHOT_Y },
    bodyB: projectile,
    stiffness: 0.05,
    damping: 0.01,
    length: 0,
    label: "slingshot",
  });
}

export function isWithinSlingshotRange(pos: Matter.Vector): boolean {
  const dx = pos.x - SLINGSHOT_X;
  const dy = pos.y - SLINGSHOT_Y;
  return Math.sqrt(dx * dx + dy * dy) <= SLINGSHOT_RADIUS;
}

export function clampToSlingshotRange(pos: Matter.Vector): Matter.Vector {
  const dx = pos.x - SLINGSHOT_X;
  const dy = pos.y - SLINGSHOT_Y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist <= SLINGSHOT_RADIUS) return pos;
  return Vector.create(
    SLINGSHOT_X + (dx / dist) * SLINGSHOT_RADIUS,
    SLINGSHOT_Y + (dy / dist) * SLINGSHOT_RADIUS,
  );
}

export function isBodySleeping(body: Matter.Body): boolean {
  const speed = Body.getSpeed(body);
  return speed < 0.5;
}

export function isOffScreen(body: Matter.Body): boolean {
  return (
    body.position.x < -50 ||
    body.position.x > CANVAS_WIDTH + 50 ||
    body.position.y > CANVAS_HEIGHT + 50
  );
}
