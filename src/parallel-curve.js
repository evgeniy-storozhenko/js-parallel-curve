var ParallelCurve = {
	/**
	 * Finds angle in degrees between AB and BC
	 * 
	 * @param {Point} A point
	 * @param {Point} B point
	 * @param {Point} C point
	 * @returns {Number}
	 */
	findAngle : function(A, B, C) {
		var AB = this.findSegmentLength(A, B);
		var BC = this.findSegmentLength(B, C);
		var AC = this.findSegmentLength(A, C);
		return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB))
				* (180 / Math.PI);
	},

	/**
	 * Finds distance from point A to B
	 * 
	 * @param {Point} A point
	 * @param {Point} B point
	 * @returns {Number}
	 */
	findSegmentLength : function(A, B) {
		return Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
	},

	/**
	 * Returns true if AB intersects CD
	 * 
	 * @param {Point} A point
	 * @param {Point} B point
	 * @param {Point} C point
	 * @param {Point} D point
	 * @returns {boolean}
	 */
	isLinesIntersect : function(A, B, C, D) {
		var v1 = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
		var v2 = (D.x - C.x) * (B.y - C.y) - (D.y - C.y) * (B.x - C.x);
		var v3 = (B.x - A.x) * (C.y - A.y) - (B.y - A.y) * (C.x - A.x);
		var v4 = (B.x - A.x) * (D.y - A.y) - (B.y - A.y) * (D.x - A.x);
		return (v1 * v2 < 0) && (v3 * v4 < 0);
	},

	/**
	 * Returns point of intersection AB and CD
	 * 
	 * @param {Point} A point
	 * @param {Point} B point
	 * @param {Point} C point
	 * @param {Point} D point
	 * @returns {Point}
	 */
	intersectPoint : function(A, B, C, D) {
		var z1 = B.x - A.x;
		var z2 = D.x - C.x;
		var w1 = B.y - A.y;
		var w2 = D.y - C.y;

		var k = (z1 * (C.y - A.y) + w1 * (A.x - C.x)) / (w1 * z2 - z1 * w2);
		var px = C.x + z2 * k;
		var py = C.y + w2 * k;
		return {
			x : px,
			y : py
		};
	},

	/**
	 * Returns the outermost point of the segment AC perpendicular to AB
	 * 
	 * @param {Point} A point
	 * @param {Point} B point
	 * @param {Number} BC length
	 * @param {boolean} is left side with respect to the segment AC, otherwise
	 *            right
	 * @returns {Point}
	 */
	createPerpendicularSegment : function(A, B, AC, isLeftSide) {
		var C = {};
		var angleA = 90 / (180 / Math.PI);

		if (isLeftSide) {
			C.x = A.x + AC
					* Math.cos(Math.atan2(B.y - A.y, B.x - A.x) + angleA);
			C.y = A.y + AC
					* Math.sin(Math.atan2(B.y - A.y, B.x - A.x) + angleA);
		} else {
			C.y = A.y + AC
					* Math.sin(Math.atan2(B.y - A.y, B.x - A.x) - angleA);
			C.x = A.x + AC
					* Math.cos(Math.atan2(B.y - A.y, B.x - A.x) - angleA);
		}
		return C;
	},

	/**
	 * Calculates a curve parallel to the curve from this points with offset to
	 * the right or left side
	 * 
	 * @param {Array<Point>} curve points
	 * @param {Number} offset
	 * @param {boolean} is left side with respect to the curve, otherwise right
	 * @returns {Array<Point>} parallel curve points
	 */
	create : function(points, offset, isLeftSide) {
		var parallelPoints = [];
		if (points.length < 2) {
			return parallelPoints;
		}
		for ( var i = 1; i < points.length; i++) {
			var A = points[i - 1];
			var B = points[i];

			var point1 = this.createPerpendicularSegment(A, B, offset,
					isLeftSide);
			var point2 = this.createPerpendicularSegment(B, A, offset,
					!isLeftSide);
			parallelPoints.push(point1);
			parallelPoints.push(point2);
		}
		var A = points[points.length - 1];
		var B = points[points.length - 2];
		var point = this.createPerpendicularSegment(A, B, offset, !isLeftSide);
		parallelPoints.push(point);

		this.cutOverlappingSegments(parallelPoints);
		return parallelPoints;
	},

	/**
	 * Cuts overlapping segments
	 * 
	 * @param {Array<Point>} curve points
	 * @returns {Array<Point>} curve points without overlapping
	 */
	cutOverlappingSegments : function(points) {
		if (points.length < 4) {
			return points;
		}
		var toRemove = [];
		for ( var i = 3; i < points.length; i++) {
			var a1 = points[i - 3];
			var a2 = points[i - 2];
			var b1 = points[i - 1];
			var b2 = points[i];
			var isIntersect = this.isLinesIntersect(a1, a2, b1, b2);
			if (isIntersect) {
				var point = this.intersectPoint(a1, a2, b1, b2);
				a2.x = point.x;
				a2.y = point.y;
				toRemove.push(i - 1);
			}
		}
		for (var i = toRemove.length - 1; i >= 0; i--) {
			points.splice(toRemove[i], 1);
		}
		return points;
	}
};