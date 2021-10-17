
class Caixa {
  constructor(graficos) {
    this.graficos=graficos;
    this.contador=0; //numero de ptos
    this.ptos=[]; //ptos de pontos
    this.vecs=[]; //vetores pto_1 - pto_1

    this.xmaux=0;
    this.ymaux=1;
    this.vetaux=[0,0];
    this.xm0aux=0;
    this.ym0aux=0;

    this.ponto=this.ponto.bind(this);
    this.desenha=this.desenha.bind(this);

    this.donut=document.createElement('div');
    this.donut.id='donuuut';
    this.graficos.appendChild(this.donut);

    this.apagou=false;

    this.svg=d3.select('#donuuut').append('svg') //cria o svg
               .attr('height','100%')
               .attr('width','100%');

    this.botão=this.svg.append('rect') //cria o botão que apaga
                    .attr('width','25px')
                    .attr('height','25px')
                    .attr('x', '5')
                    .attr('y','5')
                    .attr('fill', 'red')
                    .on('click', (e,d) => {this.apagou=true}); //aqui ele muda a condição que vai fazer apagar os elementos

    this.botão=this.svg.append('rect') //cria o botão que desenha
                    .attr('width','25px')
                    .attr('height','25px')
                    .attr('x', '5')
                    .attr('y','35')
                    .attr('fill', 'gold')
                    .on('click', (e,d) => this.desenha()); //aqui chama a função que desenha
               
    this.svg.on('click', (e,d) => this.ponto(e)); //aquei escuta o evento click pra criar os ptos
  }

  ponto(e){ //essa vai criar os ptos e linhas necessários
    const largurão=this.graficos.clientWidth; //a largura da janela no momento

    this.cir = this.svg.append('circle') //cria o ponto
    .attr('cx', e.x -largurão/4 -3)
    .attr('cy', e.y -10)
    .attr('r','3px');

    this.ptos.push([e.x -largurão/4 -3,e.y -10]); //coloca o pto numa lista de ptos q vai ser usada mais tarde


    if(this.contador > 0){ //caso haja mais de um pto, já podemos criar algumas linhas
      const x1=this.ptos[this.contador -1][0]; //x do pto criado anteriormente
      const x2=this.ptos[this.contador][0]; //y do pto criado anteriormente
      const y1=this.ptos[this.contador -1][1]; //x do ponto recem criado
      const y2=this.ptos[this.contador][1]; //y do pto recem criado

      const vetor= [x2-x1, y2-y1] //vetor q liga um pto ao outro
      const tamanho= ((vetor[0])**2 + (vetor[1])**2 )**(0.5); //tamanho deste

      this.vecs.push([vetor[0]/tamanho,vetor[1]/tamanho]); //coloca o vetor unitário numa lista de vetores

      this.svg.append('line') //cria uma linha q liga os dois ptos
        .attr('x1', x1 ).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke','gray').attr('stroke-width','1px');

      const xm1= (x1+x2)/2;
      const ym1= (y1+y2)/2;

      this.svg.append('line') //cria uma linha perpendicular a linha q liga os dois ptos, partindo o pto médio destes
        .attr('x1', xm1 ).attr('y1', ym1).attr('x2', xm1 - 50*vetor[1]/tamanho).attr('y2', ym1 + 50*vetor[0]/tamanho)
        .attr('stroke','gray').attr('stroke-width','1px');
      this.svg.append('line')
        .attr('x1', xm1 ).attr('y1', ym1).attr('x2', xm1 + 50*vetor[1]/tamanho).attr('y2', ym1 - 50*vetor[0]/tamanho)
        .attr('stroke','gray').attr('stroke-width','1px');

      if(this.contador > 1){ //se tiver mais de dois ptos já dá pra criar umas outras linhas e interseções

        const vetortan=[this.vecs[this.contador -1][0] + this.vecs[this.contador -2][0],this.vecs[this.contador -1][1] + this.vecs[this.contador -2][1]];
        const tamanhotan=((vetortan[0])**2 + (vetortan[1])**2 )**(0.5);

        this.svg.append('line') //cria a linha "tangente" no pto criado anteriormente
        .attr('x1', x1 ).attr('y1', y1)
        .attr('x2', x1+50*(vetortan[0]/tamanhotan))
        .attr('y2', y1+50*(vetortan[1]/tamanhotan))
        .attr('stroke','lightgray').attr('stroke-width','1px');
        this.svg.append('line')
        .attr('x1', x1 ).attr('y1', y1)
        .attr('x2', x1-50*(vetortan[0]/tamanhotan))
        .attr('y2', y1-50*(vetortan[1]/tamanhotan))
        .attr('stroke','lightgray').attr('stroke-width','1px');

        const t = ((y1-ym1)-(vetor[0]/-vetor[1])*(x1-xm1))/((vetortan[0]*vetor[0])/-vetor[1] - vetortan[1]);
        const xm0=x1+t*vetortan[0];
        const ym0=y1+t*vetortan[1];
        this.svg.append('circle') //cria o ponto
          .attr('cx', xm0)
          .attr('cy', ym0)
          .attr('r','2px');

        if(this.contador>2){
          const x0=this.ptos[this.contador -2][0];
          const y0=this.ptos[this.contador -2][1];
          const s = ((this.ymaux-y1)-(vetortan[1]/vetortan[0])*(this.xmaux-x1))/((this.vetaux[0]*vetortan[1])/vetortan[0] - this.vetaux[1]);
          const xm2=this.xmaux+s*this.vetaux[0];
          const ym2=this.ymaux+s*this.vetaux[1];
          this.svg.append('circle') //cria o ponto
            .attr('cx', xm2)
            .attr('cy', ym2)
            .attr('r','2px');

          const caminho='M'+x0+' '+y0+' C '+this.xm0aux+','+this.ym0aux+' '+xm2+','+ym2+' '+x1+','+y1;
          console.log(caminho);
          this.svg.append('path')
            .attr('d', caminho)
            .attr('fill','none')
            .attr('stroke','black');


      
        }
        this.xmaux=xm1;
        this.ymaux=ym1;
        this.vetaux=[-vetor[1],vetor[0]];
        this.xm0aux=xm0;
        this.ym0aux=ym0;
      }

      


    }

    this.contador+=1;

    if(this.apagou){
      this.contador=0;
      this.ptos=[];
      this.vecs=[];
      this.svg.selectAll("circle").remove();
      this.svg.selectAll("line").remove();
      this.svg.selectAll("path").remove();

      this.apagou=false;
    }
    
  }

  desenha(){
    console.log('finge q desenhouh');/*
    this.contador=0;
    this.ptos=[]; //ptos de pontos
    this.vecs=[];
    this.svg='';*/


  } 
  
}