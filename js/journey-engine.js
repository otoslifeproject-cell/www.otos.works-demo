const svg = document.querySelector("svg")

const roadLayer = document.getElementById("roadLayer")
const pinLayer = document.getElementById("pinLayer")
const footLayer = document.getElementById("footLayer")

const NS = "http://www.w3.org/2000/svg"

/* =====================================================
ROAD PATH (infographic style roadmap)
===================================================== */

const d = `
M 120 420
C 220 300, 360 300, 460 420
S 660 540, 760 420
S 960 300, 1060 420
S 1260 540, 1360 420
S 1560 300, 1660 420
`

/* =====================================================
DRAW ROAD
===================================================== */

const glow = document.createElementNS(NS,"path")
glow.setAttribute("d",d)
glow.setAttribute("class","roadGlow")

const road = document.createElementNS(NS,"path")
road.setAttribute("d",d)
road.setAttribute("class","road")

const centre = document.createElementNS(NS,"path")
centre.setAttribute("d",d)
centre.setAttribute("class","roadCentre")

roadLayer.appendChild(glow)
roadLayer.appendChild(road)
roadLayer.appendChild(centre)

/* =====================================================
STEP POSITIONS
===================================================== */

const roadLength = road.getTotalLength()

const steps = []

for(let i=0;i<35;i++){

steps.push(
road.getPointAtLength((i/35)*roadLength)
)

}

/* =====================================================
DRAW PINS
===================================================== */

steps.forEach((p,i)=>{

const g = document.createElementNS(NS,"g")

const c = document.createElementNS(NS,"circle")
c.setAttribute("cx",p.x)
c.setAttribute("cy",p.y)
c.setAttribute("r",14)
c.setAttribute("class","pin")

const t = document.createElementNS(NS,"text")
t.setAttribute("x",p.x)
t.setAttribute("y",p.y+4)
t.setAttribute("class","pinText")
t.textContent=i+1

g.appendChild(c)
g.appendChild(t)

pinLayer.appendChild(g)

})

/* =====================================================
FOOT WALKERS
===================================================== */

let walkers=[]

function spawnWalker(){

const g = document.createElementNS(NS,"g")

const left = document.createElementNS(NS,"ellipse")
left.setAttribute("rx",4)
left.setAttribute("ry",8)
left.setAttribute("class","foot")

const right = document.createElementNS(NS,"ellipse")
right.setAttribute("cx",10)
right.setAttribute("rx",4)
right.setAttribute("ry",8)
right.setAttribute("class","foot")

g.appendChild(left)
g.appendChild(right)

footLayer.appendChild(g)

walkers.push({
el:g,
pos:Math.random()*roadLength,
speed:.9
})

}

/* =====================================================
ANIMATION
===================================================== */

function animate(){

walkers.forEach(w=>{

w.pos += w.speed

if(w.pos>roadLength) w.pos=0

const p = road.getPointAtLength(w.pos)

w.el.setAttribute(
"transform",
`translate(${p.x},${p.y})`
)

})

requestAnimationFrame(animate)

}

/* =====================================================
TRAFFIC
===================================================== */

function growTraffic(){

spawnWalker()

if(walkers.length<120){

setTimeout(growTraffic,700)

}

}

animate()
growTraffic()
