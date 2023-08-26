class Camera {
  constructor(cx = 0, cy = 0) {
    this.x = cx;
    this.y = cy;
    this.scale = 1;
    this.active = false;
  }

  set() {
    if (this.active) {
      this.active = false;
      // Assuming you have a graphics equivalent in JavaScript
      // g.pop(); // Commented as we don't have a direct equivalent
    } else {
      // g.push("transform"); // Commented as we don't have a direct equivalent
      // g.translate(this.x, this.y); // Commented as we don't have a direct equivalent
      // g.scale(this.scale); // Commented as we don't have a direct equivalent
      this.active = true;
    }
  }

  getScreenPos(mx, my) {
    return {
      x: (mx - this.x) / this.scale,
      y: (my - this.y) / this.scale
    };
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  zoom(val) {
    let factor = 0.8;
    if (val > 0) {
      factor = 1 / factor;
      // Commented as the conditions are not necessary in the current context
      // if (this.scale === this.maxZoom) return;
    } else {
      // if (this.scale === this.minZoom) return;
    }

    // Commented as we don't have a 'clamp' function in the given Lua code and no maxZoom or minZoom values
    // this.scale = clamp(round(this.scale * factor, 0.001), this.minZoom, this.maxZoom);
    this.scale *= factor;

    const dx = (/* Assuming a mouse equivalent in JavaScript */ mouseX - this.x) * (factor - 1);
    const dy = (/* Assuming a mouse equivalent in JavaScript */ mouseY - this.y) * (factor - 1);

    this.x -= dx;
    this.y -= dy;
  }
}

// Export the Camera class
export default Camera;




// local g = love.graphics
// local lm = love.mouse
// local Camera = {}

// function Camera.new( cx,cy )
// 	local self = {}

// 	local x,y = cx or 0, cy or 0
// 	local scale = 1
// 	local active = false

// 	function self:set()
// 		if active then
// 			active = false
// 			g.pop()
// 		else
// 			g.push("transform")
// 			g.translate(x,y)
// 			g.scale(scale)
// 			active = true
// 		end
// 	end

// 	function self:getScreenPos( mx,my )
// 		return (mx-x)/scale, (my-y)/scale
// 	end

// 	function self:move( dx,dy )
// 		x = x + dx
// 		y = y + dy
// 	end

// 	function self:zoom( val )
// 		local factor = 0.8
// 		if val > 0 then
// 			factor = 1/factor
// 			-- if self.scale == self.maxZoom then return end
// 		else
// 			-- if self.scale == self.minZoom then return end
// 		end
		
// 		-- self.scale = clamp(round(self.scale*factor, 0.001), self.minZoom, self.maxZoom)
// 		scale = scale*factor

// 		local dx = (lm.getX()-x) * (factor-1)
// 		local dy = (lm.getY()-y) * (factor-1)

// 		x = x - dx
// 		y = y - dy
// 	end

// 	return self
// end

// return Camera