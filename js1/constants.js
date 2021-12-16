const raio=['3px', '2px','1px'];
const cor=['gray','silver','lightgray'];
const cor2=['rgba(247,252,240,0.5)','rgba(224,243,219,0.5)','rgba(204,235,197,0.5)','rgba(168,221,181,0.5)','rgba(123,204,196,0.5)','rgba(78,179,211,0.5)','rgba(43,140,190,0.5)','rgba(8,104,172,0.5)','rgba(8,64,129,0.5)'];
const cor3=['rgb(158,1,66)','rgb(213,62,79)','rgb(244,109,67)','rgb(253,174,97)','rgb(254,224,139)','rgb(255,255,191)','rgb(230,245,152)','rgb(171,221,164)','rgb(102,194,165)','rgb(50,136,189)','rgb(94,79,162)'];
cores=[];
for(let item of cor3){
    cores.push(item.split('b')[0]+'ba'+item.split('b')[1].split(')')[0]+',0.5)')
}