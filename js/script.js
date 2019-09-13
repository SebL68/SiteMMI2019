function toggle(target, className) {
	document.querySelectorAll(target).forEach(function (e) {
		e.classList.toggle(className);
	});
}
/*  
	Relier par une courbe ou une ligne deux éléments HTML.
	Gère le redimentionnement de pages.
	PathLength à 100.

	HTML : 
		<svg class=svgLines></svg>
	CSS :
		body {
			position: relative;
		}
		.svgLines {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 100;
		}
	JS :
		new CurveSVG(
			{
				from: ".depart", 	// élément de depart de la courbe(le centre)
				to: ".arrivee", 	// élément d'arrivée de la courbe (le centre)
				style: "curve", 	// (option) style (class) à appliquer
				shape: "curveY" 	// (option) type : line (défaut), curveX, curveY
				observe: [		// (option) éléments à observer pour redessiner la courbe
					".arrivee", 
					...
				],
				attributes: {		// (option) Attributs à ajouter au path (permet d'utiliser addClass() par exemple pour des effets comme faire apparaître la courbe)
					"data-class": "growLine" 
				}
			}
		);
*/
window.addEventListener("load", function () {
	class CurveSVG {
		constructor(data) {
			this.from = document.querySelector(data.from);
			this.to = document.querySelector(data.to);
			this.shape = data.shape || "line";

			this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.line.setAttribute("pathLength", 100);
			this.line.setAttribute("class", data.style);

			for (const key in data.attributes) {
				this.line.setAttribute(key, data.attributes[key]);
			};

			this.setPositionLine();

			document.querySelector(".svgLines").appendChild(this.line);
			window.addEventListener("resize", () => { this.setPositionLine() });

			if (data.observe) {
				var observer = new MutationObserver(() => {
					this.setPositionLine();
				});
				data.observe.forEach((e) => {
					observer.observe(document.querySelector(e), { attributes: true });
				});
			}

		}
		setPositionLine() {
			let fromOffset = this.getOffset(this.from);
			let toOffset = this.getOffset(this.to);
			let fromX = fromOffset.left + this.from.offsetWidth / 2;
			let fromY = fromOffset.top + this.from.offsetHeight / 2;
			let toX = toOffset.left + this.to.offsetWidth / 2;
			let toY = toOffset.top + this.to.offsetHeight / 2;

			let deltaX = (toX - fromX) / 1.5;
			let deltaY = (toY - fromY) / 1.5;
			if (this.shape == 'curveX') {
				deltaY = 0;
			} else if (this.shape == 'curveY') {
				deltaX = 0;
			}
			this.line.setAttribute("d", `
				M${fromX} ${fromY} 
				C${fromX + deltaX} ${fromY + deltaY} 
					${toX - deltaX}  ${toY - deltaY}
					${toX} ${toY}
			`);
		}
		getOffset(e) {
			return {
				"left": e.getBoundingClientRect().left + window.scrollX,
				"top": e.getBoundingClientRect().top + window.scrollY
			}
		}
	}

	new CurveSVG(
		{
			from: ".accueil .boule",
			to: "#formation .boule",
			style: "curve growLine",
			shape: "curveY"
		}
	);

	new CurveSVG(
		{
			from: ".depart .barre:nth-child(1)",
			to: ".quinconce>div:nth-child(1)>div",
			style: "line",
			observe: [
				".quinconce>div:nth-child(1)"
			],
			attributes: {
				"data-class": "growLine",
				"data-delay": "0"
			}
		}
	);
	new CurveSVG(
		{
			from: ".depart .barre:nth-child(2)",
			to: ".quinconce>div:nth-child(2)>div",
			style: "line",
			observe: [
				".quinconce>div:nth-child(2)"
			],
			attributes: {
				"data-class": "growLine",
				"data-delay": "200"
			}
		}
	);
	new CurveSVG(
		{
			from: ".depart .barre:nth-child(3)",
			to: ".quinconce>div:nth-child(3)>div",
			style: "line",
			observe: [
				".quinconce>div:nth-child(3)"
			],
			attributes: {
				"data-class": "growLine",
				"data-delay": "400"
			}
		}
	);
	new CurveSVG(
		{
			from: ".depart .barre:nth-child(4)",
			to: ".quinconce>div:nth-child(4)>div",
			style: "line",
			observe: [
				".quinconce>div:nth-child(4)"
			],
			attributes: {
				"data-class": "growLine",
				"data-delay": "600"
			}
		}
	);



	/****************/
	/* Lazy load images */
	/***************/

	function lazy() {
		document.querySelectorAll("[data-lazy-src]").forEach(function (img) {
			if (img.getBoundingClientRect().y < window.innerHeight + 300) {
				img.srcset = img.dataset.lazySrcset || "";
				img.src = img.dataset.lazySrc;
				img.removeAttribute("data-lazy-src");
				img.removeAttribute("data-lazy-srcset");
			}
		});
	}
	window.addEventListener("scroll", lazy, { passive: true });
	lazy();

	/****************/
	/* Add class when in viewport */
	/***************/

	function addClass() {
		document.querySelectorAll("[data-class]").forEach(e => {
			if (e.getBoundingClientRect().y < window.innerHeight - (e.dataset.offset || 0)) {
				setTimeout(() => {
					e.classList.add(e.dataset.class);
					e.removeAttribute("data-class");
				}, e.dataset.delay || 0)
			}
		})
	}
	window.addEventListener("scroll", addClass, { passive: true });
	addClass();

	/****************/
	/* Paralaxe */
	/****************/

	var paraEl = document.querySelectorAll("[data-speed]");
	function parallax() {
		paraEl.forEach(e => {
			var rect = e.getBoundingClientRect();
			var transY = e.dataset.offset || 0;
			var posiOrigin = rect.top - transY + rect.height / 2;
			var offset = (posiOrigin - window.innerHeight / 2) * e.dataset.speed;

			if (rect.top < window.innerHeight ||
				offset < window.innerHeight / 2) {
				e.dataset.offset = offset;
				e.style.transform = `translateY(${offset}px)`;
			}
		})
	}
	window.addEventListener("scroll", parallax, { passive: true });
	parallax();

	/****************/
	/* Style proportionnel */
	/****************/

	class propotialStyle {
		constructor(data) {
			this.target = document.querySelector(data.target);
			this.reference = document.querySelector(data.reference);
			this.styles = data.styles;
			window.addEventListener("scroll", () => { this.applyStyles() }, { passive: true });
		}
		applyStyles() {
			let coef = 1 - (this.reference.getBoundingClientRect().top / window.innerHeight);
			if (coef <= 0) { coef = 0; }
			if (coef >= 1) { coef = 1; }

			for (const key in this.styles) {
				this.target.style.setProperty(
					key,
					eval("`" + this.styles[key] + "`")
				);
			};
		}
	}
	new propotialStyle({
		target: ".curve.growLine",
		reference: "#formation",
		styles: {
			"stroke-dashoffset": "${-coef*100+1}"
		}
	})

});