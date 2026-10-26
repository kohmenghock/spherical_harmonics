function factorial(n){

let result = 1;

for(let i=2;i<=n;i++){

result*=i;

}

return result;

}

function associatedLegendre(l,m,x){

m=Math.abs(m);

let pmm=1.0;

if(m>0){

let somx2=Math.sqrt((1-x)*(1+x));

let fact=1.0;

for(let i=1;i<=m;i++){

pmm*=(-fact)*somx2;

fact+=2.0;

}

}

if(l===m){

return pmm;

}

let pmmp1=x*(2*m+1)*pmm;

if(l===m+1){

return pmmp1;

}

let pll=0;

for(let ll=m+2;ll<=l;ll++){

pll=((2*ll-1)*x*pmmp1-(ll+m-1)*pmm)/(ll-m);

pmm=pmmp1;

pmmp1=pll;

}

return pll;

}

function realSphericalHarmonic(l,m,theta,phi){

const a=Math.abs(m);

const norm=Math.sqrt(

((2*l+1)/(4*Math.PI))

*

factorial(l-a)

/

factorial(l+a)

);

const p=associatedLegendre(

l,
a,
Math.cos(theta)

);

if(m>0){

return Math.sqrt(2)

*norm*p

*Math.cos(a*phi);

}

if(m<0){

return Math.sqrt(2)

*norm*p

*Math.sin(a*phi);

}

return norm*p;

}

function createSurface(l,m){

const NTHETA=80;
const NPHI=80;

let X=[];
let Y=[];
let Z=[];
let COLORS=[];

let maxAmp=0;

for(let i=0;i<NTHETA;i++){

let theta=Math.PI*i/(NTHETA-1);

let rowX=[];
let rowY=[];
let rowZ=[];
let rowC=[];

for(let j=0;j<NPHI;j++){

let phi=2*Math.PI*j/(NPHI-1);

let amp=

realSphericalHarmonic(

l,m,theta,phi

);

let r=Math.abs(amp);

maxAmp=Math.max(
maxAmp,
Math.abs(amp)
);

rowX.push(

r*Math.sin(theta)*Math.cos(phi)

);

rowY.push(

r*Math.sin(theta)*Math.sin(phi)

);

rowZ.push(

r*Math.cos(theta)

);

rowC.push(amp);

}

X.push(rowX);
Y.push(rowY);
Z.push(rowZ);
COLORS.push(rowC);

}

return {

X,Y,Z,COLORS,maxAmp

};

}

function updateInfo(l,m){

let nodes=l-Math.abs(m);

document.getElementById("info").innerHTML=

`
<b>Quantum Numbers</b><br><br>

l = ${l}
<br>

m = ${m}
<br><br>

L² = ${l*(l+1)} ħ²
<br>

Lz = ${m} ħ
<br><br>

Polar Nodes = ${nodes}
<br>

Azimuthal Nodes = ${Math.abs(m)}
<br>

Degeneracy = ${2*l+1}
<br>

Parity = (-1)<sup>${l}</sup>
`;

}

function plotHarmonic(){

let l=parseInt(
document.getElementById("l").value
);

let m=parseInt(
document.getElementById("m").value
);

let surface=createSurface(l,m);

let trace={

type:'surface',

x:surface.X,
y:surface.Y,
z:surface.Z,

surfacecolor:
surface.COLORS,

colorscale:[
[0,'blue'],
[0.5,'white'],
[1,'red']
],

cmin:-surface.maxAmp,
cmax:surface.maxAmp,

showscale:true

};

let layout={

title:`Y(${l},${m})`,

paper_bgcolor:"white",

scene:{

aspectmode:"cube",

camera:{

eye:{
x:1.7,
y:1.7,
z:1.3
}

},

xaxis:{title:'x'},
yaxis:{title:'y'},
zaxis:{title:'z'}

}

};

Plotly.newPlot(

'plot',
[trace],
layout,
{
responsive:true
}

);

updateInfo(l,m);

}

document

.getElementById("l")

.addEventListener(

"input",

function(){

let l=parseInt(this.value);

document.getElementById("lValue").textContent=l;

const mSlider=

document.getElementById("m");

mSlider.min=-l;
mSlider.max=l;

if(parseInt(mSlider.value)>l){

mSlider.value=l;

}

if(parseInt(mSlider.value)<-l){

mSlider.value=-l;

}

document.getElementById("mValue")

.textContent=mSlider.value;

plotHarmonic();

}

);

document

.getElementById("m")

.addEventListener(

"input",

function(){

document.getElementById("mValue")

.textContent=this.value;

plotHarmonic();

}

);

plotHarmonic();
