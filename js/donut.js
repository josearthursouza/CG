
class Caixa {
  constructor(graficos) {
    this.graficos=graficos;
    this.contador=0; //numero de ptos
    this.ptos=[]; //ptos de pontos
    this.vecs=[]; //vetores pto_1 - pto_1

    this.cor=0;

    this.ptosaux=[];

    this.xmaux=0;
    this.ymaux=1;
    this.vetaux=[0,0];
    this.xm0aux=0;
    this.ym0aux=0;

    this.caminhoQ='';
    this.caminhoC='';

    this.ponto=this.ponto.bind(this);
    this.circulo=this.circulo.bind(this);
    this.linha=this.linha.bind(this);
    this.cubica=this.cubica.bind(this);
    this.quadratica=this.quadratica.bind(this);
    //this.continua=this.continua.bind(this);

    //this.clickaux=[0,0];

    this.donut=document.createElement('div');
    this.donut.id='donuuut';
    this.graficos.appendChild(this.donut);

    this.svg=d3.select('#donuuut').append('svg') //cria o svg
      .attr('height','100%')
      .attr('width','100%');

    this.apagou=false;

    this.svg.append('rect') //cria o botão que apaga
      .attr('width','25px')
      .attr('height','25px')
      .attr('x', '5')
      .attr('y','5')
      .attr('fill', 'red')
      .on('click', (e,d) => {this.apagou=true}); //aqui ele muda a condição que vai fazer apagar os elementos

    this.ainda_n_acabou=true;

    this.svg.append('rect') //cria o botão que desenha
      .attr('width','25px')
      .attr('height','25px')
      .attr('x', '5')
      .attr('y','35')
      .attr('fill', 'gold')
      .on('click', (e,d) => {this.ainda_n_acabou=false});
      
      this.g = this.svg.append('g');
               
    this.svg.on('click', (e,d) => this.ponto(e)); //aquei escuta o evento click pra criar os ptos
  }

  ponto(e){//essa vai criar os ptos e linhas necessários
    if(this.ainda_n_acabou){
      this.ptosaux.push({x: e.x , y: e.y});
      const largurão=this.graficos.clientWidth; //a largura da janela no momento

      this.circulo(e.x -largurão/4 -3,e.y -10,0);

      this.ptos.push([e.x -largurão/4 -3,e.y -10]); //coloca o pto numa lista de ptos q vai ser usada mais tarde

      if(this.contador > 0){ //caso haja mais de um pto, já podemos criar algumas linhas
        const x1=this.ptos[this.contador -1][0]; //x do pto criado anteriormente
        const x2=this.ptos[this.contador][0]; //y do pto criado anteriormente
        const y1=this.ptos[this.contador -1][1]; //x do ponto recem criado
        const y2=this.ptos[this.contador][1]; //y do pto recem criado

        const vetor= [x2-x1, y2-y1] //vetor q liga um pto ao outro
        const tamanho= ((vetor[0])**2 + (vetor[1])**2 )**(0.5); //tamanho deste

        this.vecs.push([vetor[0]/tamanho,vetor[1]/tamanho]); //coloca o vetor unitário numa lista de vetores

        this.linha(x1,y1,x2,y2,0); //cria uma linha q liga os dois ptos

        const xm1= (x1+x2)/2;
        const ym1= (y1+y2)/2;

        //cria uma linha perpendicular a linha q liga os dois ptos, partindo o pto médio destes
        this.linha(xm1, ym1, xm1 - 50*vetor[1]/tamanho, ym1 + 50*vetor[0]/tamanho,1);
        this.linha(xm1, ym1, xm1 + 50*vetor[1]/tamanho, ym1 - 50*vetor[0]/tamanho,1);

        if(this.contador > 1){ //se tiver mais de dois ptos já dá pra criar umas outras linhas e interseções

          const vetortan=[this.vecs[this.contador -1][0] + this.vecs[this.contador -2][0],this.vecs[this.contador -1][1] + this.vecs[this.contador -2][1]];
          const tamanhotan=((vetortan[0])**2 + (vetortan[1])**2 )**(0.5);

          //cria a linha "tangente" no pto criado anteriormente
          this.linha(x1, y1, x1+50*(vetortan[0]/tamanhotan), y1+50*(vetortan[1]/tamanhotan),2);
          this.linha(x1, y1, x1-50*(vetortan[0]/tamanhotan), y1-50*(vetortan[1]/tamanhotan),2);

          const t = ((y1-ym1)-(vetor[0]/-vetor[1])*(x1-xm1))/((vetortan[0]*vetor[0])/-vetor[1] - vetortan[1]);
          const xm0=x1+t*vetortan[0];
          const ym0=y1+t*vetortan[1];
          this.circulo(xm0,ym0,1);
          this.linha(x1, y1, xm0, ym0,1);
          this.linha(xm1, ym1, xm0, ym0,1);

          if(this.contador>2){
            const x0=this.ptos[this.contador -2][0];
            const y0=this.ptos[this.contador -2][1];
            const s = ((this.ymaux-y1)-(vetortan[1]/vetortan[0])*(this.xmaux-x1))/((this.vetaux[0]*vetortan[1])/vetortan[0] - this.vetaux[1]);
            const xm2=this.xmaux+s*this.vetaux[0];
            const ym2=this.ymaux+s*this.vetaux[1];
            this.linha(x1, y1, xm2, ym2,1);
            this.linha(this.xmaux, this.ymaux, xm2, ym2,1);

            this.circulo(xm2,ym2,1);

            this.quadratica(this.xmaux,this.ymaux,x1,y1,xm1,ym1);

            this.cubica(x0,y0,this.xm0aux,this.ym0aux,xm2,ym2,x1,y1);

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
        this.ptosaux=[];

        this.caminhoQ='';
        this.caminhoC='';
        this.g.selectAll("circle").remove();
        this.g.selectAll("line").remove();
        this.g.selectAll("path").remove();

        this.apagou=false;
      }
    }
    else{
      this.ainda_n_acabou=true;
      this.ponto(this.ptosaux[0]);
      this.ponto(this.ptosaux[1]);
      this.ponto(this.ptosaux[2]);

      this.g.append('path').attr('d',this.caminhoC+' Z '+this.caminhoQ+' Z')
      .attr('fill', cores[this.cor]).attr('stroke','black')
      .attr('fill-rule','evenodd')
      .on('click', (e,d)=>this.desenha(e))
      ;

      this.cor=( this.cor>9 ? 0 : this.cor+1);
      this.contador=0;
      this.ptos=[];
      this.vecs=[];
      this.ptosaux=[];

      this.caminhoQ='';
      this.caminhoC='';
      this.g.selectAll("circle.m").remove();
      this.g.selectAll("line").remove();
    }
  }

  circulo(x,y,m){
    this.g.append('circle')
      .attr('cx',x)
      .attr('cy',y)
      .attr('r', raio[m])
      .attr('fill','none')
      .attr('stroke','black')
      .attr('class', m > 0 ? 'm' : '');
  }

  linha(x1,y1,x2,y2,m){
    this.g.append('line')
      .attr('x1', x1 ).attr('y1', y1).attr('x2', x2).attr('y2', y2)
      .attr('stroke',cor[m]).attr('stroke-width','1px');
  }

  quadratica(x0,y0,x1,y1,x2,y2){
    this.g.append('path')
      .attr('d', 'M'+x0+' '+y0+' Q '+x1+','+y1+' '+x2+','+y2)
      .attr('fill','none')
      .attr('stroke','black');
      
      if(this.contador===3){
        this.caminhoQ+='M'+x0+' '+y0+' Q '+x1+','+y1+' '+x2+','+y2;
      }
      else{
        this.caminhoQ+=' Q '+x1+','+y1+' '+x2+','+y2;
      }}

  cubica(x0,y0,x1,y1,x2,y2,x3,y3){
    this.g.append('path')
      .attr('d', 'M'+x0+' '+y0+' C '+x1+','+y1+' '+x2+','+y2+' '+x3+','+y3)
      .attr('fill','none')
      .attr('stroke','black');

      if(this.contador===3){
        this.caminhoC+='M'+x0+' '+y0+' C '+x1+','+y1+' '+x2+','+y2+' '+x3+','+y3;
      }
      else{
        this.caminhoC+=' C '+x1+','+y1+' '+x2+','+y2+' '+x3+','+y3;
      }
  }
/*
  resolvesis(x1,y1,a,b,x2,y2,c,d,m){
    const t=((y1-y2)-(d/c)*(x1-x2))/((a*d)/c - b);
    const x=x1+t*a;
    const y=y1+t*b;
    this.circulo(x,y,2);
  }
*/
  desenha(e){
    e.stopPropagation();
    const largurão=this.graficos.clientWidth;
    /*
    if(this.clickaux!=[(e.x -largurão/4 -3),(e.y -10)]){
      e.target.style.transform+='translate('+(e.x -largurão/4 -3)-this.clickaux[0]+'px,'+(e.y -10)-this.clickaux[1]+'px)';
      this.clickaux!=[(e.x -largurão/4 -3),(e.y -10)];
    }*/
    e.target.style.transformOrigin=(e.x -largurão/4 -3)+'px '+(e.y -10)+'px';
    e.target.style.transform+='rotate(60deg)';
  }
}