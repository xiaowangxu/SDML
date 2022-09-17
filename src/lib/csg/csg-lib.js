class CSG {
	constructor() {
		this.polygons = [];
	}

	clone() {
		let csg = new CSG();
		csg.polygons = this.polygons.map(p => p.clone())
		return csg;
	}

	toPolygons() {
		return this.polygons;
	}

	union(csg) {
		let a = new Node(this.clone().polygons);
		let b = new Node(csg.clone().polygons);
		a.clipTo(b);
		b.clipTo(a);
		b.invert();
		b.clipTo(a);
		b.invert();
		a.build(b.allPolygons());
		return CSG.fromPolygons(a.allPolygons());
	}

	subtract(csg) {
		let a = new Node(this.clone().polygons);
		let b = new Node(csg.clone().polygons);
		a.invert();
		a.clipTo(b);
		b.clipTo(a);
		b.invert();
		b.clipTo(a);
		b.invert();
		a.build(b.allPolygons());
		a.invert();
		return CSG.fromPolygons(a.allPolygons());
	}

	intersect(csg) {
		let a = new Node(this.clone().polygons);
		let b = new Node(csg.clone().polygons);
		a.invert();
		b.clipTo(a);
		b.invert();
		a.clipTo(b);
		b.clipTo(a);
		a.build(b.allPolygons());
		a.invert();
		return CSG.fromPolygons(a.allPolygons());
	}

	inverse() {
		let csg = this.clone();
		csg.polygons.forEach(p => p.flip());
		return csg;
	}
}

CSG.fromPolygons = function (polygons) {
	let csg = new CSG();
	csg.polygons = polygons;
	return csg;
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	copy(v) {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this
	}
	clone() {
		return new Vector(this.x, this.y, this.z)
	}
	negate() {
		this.x *= -1;
		this.y *= -1;
		this.z *= -1;
		return this
	}
	add(a) {
		this.x += a.x
		this.y += a.y
		this.z += a.z
		return this;
	}
	sub(a) {
		this.x -= a.x
		this.y -= a.y
		this.z -= a.z
		return this
	}
	times(a) {
		this.x *= a
		this.y *= a
		this.z *= a
		return this
	}
	dividedBy(a) {
		this.x /= a
		this.y /= a
		this.z /= a
		return this
	}
	lerp(a, t) {
		return this.add(tv0.copy(a).sub(this).times(t))
	}
	unit() {
		return this.dividedBy(this.length())
	}
	length() {
		return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2))
	}
	normalize() {
		return this.unit()
	}
	cross(b) {
		let a = this;
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}
	dot(b) {
		return (this.x * b.x) + (this.y * b.y) + (this.z * b.z)
	}
}

let tv0 = new Vector();
let tv1 = new Vector();

class Vertex {

	constructor(pos, normal, uv, color) {
		this.pos = new Vector().copy(pos);
		this.normal = new Vector().copy(normal);
		uv && (this.uv = new Vector().copy(uv)) && (this.uv.z = 0);
		color && (this.color = new Vector().copy(color));
	}

	clone() {
		return new Vertex(this.pos, this.normal, this.uv, this.color);
	}

	flip() {
		this.normal.negate();
	}

	interpolate(other, t) {
		return new Vertex(this.pos.clone().lerp(other.pos, t), this.normal.clone().lerp(other.normal, t), this.uv && other.uv && this.uv.clone().lerp(other.uv, t), this.color && other.color && this.color.clone().lerp(other.color, t))
	}
}

class Plane {
	constructor(normal, w) {
		this.normal = normal;
		this.w = w;
	}

	clone() {
		return new Plane(this.normal.clone(), this.w);
	}

	flip() {
		this.normal.negate();
		this.w = -this.w;
	}

	splitPolygon(polygon, coplanarFront, coplanarBack, front, back) {
		const COPLANAR = 0;
		const FRONT = 1;
		const BACK = 2;
		const SPANNING = 3;

		let polygonType = 0;
		let types = [];
		for (let i = 0; i < polygon.vertices.length; i++) {
			let t = this.normal.dot(polygon.vertices[i].pos) - this.w;
			let type = (t < -Plane.EPSILON) ? BACK : (t > Plane.EPSILON) ? FRONT : COPLANAR;
			polygonType |= type;
			types.push(type);
		}

		switch (polygonType) {
			case COPLANAR:
				(this.normal.dot(polygon.plane.normal) > 0 ? coplanarFront : coplanarBack).push(polygon);
				break;
			case FRONT:
				front.push(polygon);
				break;
			case BACK:
				back.push(polygon);
				break;
			case SPANNING:
				let f = []
					, b = [];
				for (let i = 0; i < polygon.vertices.length; i++) {
					let j = (i + 1) % polygon.vertices.length;
					let ti = types[i]
						, tj = types[j];
					let vi = polygon.vertices[i]
						, vj = polygon.vertices[j];
					if (ti != BACK)
						f.push(vi);
					if (ti != FRONT)
						b.push(ti != BACK ? vi.clone() : vi);
					if ((ti | tj) == SPANNING) {
						let t = (this.w - this.normal.dot(vi.pos)) / this.normal.dot(tv0.copy(vj.pos).sub(vi.pos));
						let v = vi.interpolate(vj, t);
						f.push(v);
						b.push(v.clone());
					}
				}
				if (f.length >= 3)
					front.push(new Polygon(f, polygon.shared));
				if (b.length >= 3)
					back.push(new Polygon(b, polygon.shared));
				break;
		}
	}

}

Plane.EPSILON = 1e-5;
Plane.fromPoints = function (a, b, c) {
	let n = tv0.copy(b).sub(a).cross(tv1.copy(c).sub(a)).normalize();
	return new Plane(n.clone(), n.dot(a));
}

class Polygon {
	constructor(vertices, shared) {
		this.vertices = vertices;
		this.shared = shared;
		this.plane = Plane.fromPoints(vertices[0].pos, vertices[1].pos, vertices[2].pos);
	}
	clone() {
		return new Polygon(this.vertices.map(v => v.clone()), this.shared);
	}
	flip() {
		this.vertices.reverse().forEach(v => v.flip())
		this.plane.flip();
	}
}

class Node {
	constructor(polygons) {
		this.plane = null;
		this.front = null;
		this.back = null;
		this.polygons = [];
		if (polygons)
			this.build(polygons);
	}
	clone() {
		let node = new Node();
		node.plane = this.plane && this.plane.clone();
		node.front = this.front && this.front.clone();
		node.back = this.back && this.back.clone();
		node.polygons = this.polygons.map(p => p.clone());
		return node;
	}

	invert() {
		for (let i = 0; i < this.polygons.length; i++)
			this.polygons[i].flip();

		this.plane && this.plane.flip();
		this.front && this.front.invert();
		this.back && this.back.invert();
		let temp = this.front;
		this.front = this.back;
		this.back = temp;
	}

	clipPolygons(polygons) {
		if (!this.plane)
			return polygons.slice();
		let front = []
			, back = [];
		for (let i = 0; i < polygons.length; i++) {
			this.plane.splitPolygon(polygons[i], front, back, front, back);
		}
		if (this.front)
			front = this.front.clipPolygons(front);
		if (this.back)
			back = this.back.clipPolygons(back);
		else
			back = [];
		return front.concat(back);
	}

	clipTo(bsp) {
		this.polygons = bsp.clipPolygons(this.polygons);
		if (this.front)
			this.front.clipTo(bsp);
		if (this.back)
			this.back.clipTo(bsp);
	}

	allPolygons() {
		let polygons = this.polygons.slice();
		if (this.front)
			polygons = polygons.concat(this.front.allPolygons());
		if (this.back)
			polygons = polygons.concat(this.back.allPolygons());
		return polygons;
	}

	build(polygons) {
		if (!polygons.length)
			return;
		if (!this.plane)
			this.plane = polygons[0].plane.clone();
		let front = []
			, back = [];
		for (let i = 0; i < polygons.length; i++) {
			this.plane.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
		}
		if (front.length) {
			if (!this.front)
				this.front = new Node();
			this.front.build(front);
		}
		if (back.length) {
			if (!this.back)
				this.back = new Node();
			this.back.build(back);
		}
	}
}

export { CSG, Vertex, Vector, Polygon, Plane };