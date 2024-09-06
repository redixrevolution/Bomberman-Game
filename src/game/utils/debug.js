//drawing the cross around the character
//useful for desplaying where your entity's x and y position is on the screen
export function drawCross(context, camera, position, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(
    Math.floor(position.x - camera.position.x) - 4,
    Math.floor(position.y - camera.position.y) - 0.5
  );
  context.lineTo(
    Math.floor(position.x - camera.position.x) + 5,
    Math.floor(position.y - camera.position.y) - 0.5
  );
  context.moveTo(
    Math.floor(position.x - camera.position.x) + 0.5,
    Math.floor(position.y - camera.position.y) - 5
  );
  context.lineTo(
    Math.floor(position.x - camera.position.x) + 0.5,
    Math.floor(position.y - camera.position.y) + 4
  );
  context.stroke();
}

//useful for drawing boxes to the screen such as collision boxes
export function drawBox(context, camera, dimensions, color) {
  if (!Array.isArray(dimensions)) return;

  const [x = 0, y = 0, width = 0, height = 0] = dimensions;

  context.beginPath();
  context.strokeStyle = color + "AA";
  context.fillStyle = color + "44";
  context.fillRect(
    Math.floor(x - camera.position.x) + 0.5, Math.floor(y - camera.position.y) + 0.5,
    width, height
  );
  context.rect(
    Math.floor(x - camera.position.x) + 0.5, Math.floor(y - camera.position.y) + 0.5,
    width, height
  );
  context.stroke();
}

