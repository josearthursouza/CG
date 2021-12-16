	var canvasOriginal = document.getElementById("imagemOriginal"); //cria o canva e dá cntexto 2d pra ele
	var ctxOriginal = canvasOriginal.getContext("2d");
	
	var canvasOutr = document.getElementById("Rr");
	var ctxOutputr = canvasOutr.getContext("2d");
	var canvasOutg = document.getElementById("Gg");
	var ctxOutputg = canvasOutg.getContext("2d");
	var canvasOutb = document.getElementById("Bb");
	var ctxOutputb = canvasOutb.getContext("2d");

	var canvasLum = document.getElementById("lumin");
	var ctxLum = canvasLum.getContext("2d");

	var canvasLumh = document.getElementById("luminhist");
	var ctxLumh = canvasLumh.getContext("2d");

	var canvasfiltro = document.getElementById("imagemfiltrada");
	var ctxfiltro = canvasfiltro.getContext("2d");
	
	var imgOriginal = new Image();//cria um elemento imagem

	var imghistR = new Image();
	var imghistG = new Image();
	var imghistB = new Image();

	var Lum = new Image();
	var Lumh = new Image();

	var filtro = new Image();
	
	//const imgUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/%D0%A8%D0%BF%D0%B8%D1%86%D1%96_3.jpg/1024px-%D0%A8%D0%BF%D0%B8%D1%86%D1%96_3.jpg";
	const imgUrl="https://pbs.twimg.com/media/EaKX9nMXgAIt9RU?format=jpg&name=360x360" //url da imagem a ser processada, pode mudar se quiser

	imgOriginal.crossOrigin = ''; //sincerament, não sei o que isso faz

	imghistR.crossOriginr = '';
	imghistG.crossOriging = '';
	imghistB.crossOriginb = '';

	Lum.crossOrigin='';
	Lumh.crossOrigin='';

	filtro.crossOrigin='';

    imgOriginal.src = imgUrl; //diz que a url e a fonte do elemento imagem criado
	imgOriginal.onload = function(){ //esse onlead é pra n fazer as coisas antes de ter carregado as coisas da url (tipo uma processa, eu acho)
        
        const H=imgOriginal.height; //ou this.heigth essa é a altura da imagem carregada
        const W=imgOriginal.width; //ou this.width e essa é a largura, claro

        canvasOriginal.height=H; //faço com que esses canvas tenham o tamanho da imagem
        canvasOriginal.width=W;
        canvasLum.height=H;
        canvasLum.width=W;
        canvasfiltro.height=H;
        canvasfiltro.width=W;

		ctxOriginal.drawImage(imgOriginal, 0, 0); //desenho a imagem original no primeiro canva

		const imgaux=ctxOriginal.getImageData(0, 0, W, H); //além disso, salvo as infos sobre a img (vetor com os valores e tal)
		var imgauxx=imgaux;

		var vecR=new Array(255).fill(0); //crio três arrays pra usar depois pra fazer os histogramas dos canais R, G e B
		var vecG=new Array(255).fill(0);
		var vecB=new Array(255).fill(0);
		
		var vecgray=new Array(255).fill(0); //também crio um pro canal cinza
		let auxgray=new Array(imgaux.data.length/4).fill(0); //e um do tamanho da imagem pra preencher cm os tons de cinza

		// passa por cada pixel
		for (let i = 0; i < imgaux.data.length; i += 4) { //para cada pixel da imagem:
			// r
			vecR[imgaux.data[i]]+=1;//add nos histogramas as ocorrencias
			// g
			vecG[imgaux.data[i+1]]+=1;
			// b
			vecB[imgaux.data[i+2]]+=1;

			const g=parseInt((imgaux.data[i+2]+imgaux.data[i+1]+imgaux.data[i])/3); //calculo o cinza do pixel
			imgauxx.data[i]=g;//255-imgaux.data[i]; esses comentário servem pra deixar a img negativa se vc quiser
			imgauxx.data[i+1]=g;//255-imgaux.data[i+1];
			imgauxx.data[i+2]=g;//255-imgaux.data[i+2];

			vecgray[g]+=1; //add no vetor do histograma de cinza a ocorrência
			auxgray[parseInt(i/4)]=g;//e no vetor da img cinza tbm
		}
		ctxLum.putImageData(imgauxx,0,0); //desenho a imagem cinza

		function max(vec){ //função que calcula o máximo de um vetor. vai servir pra sabera altura das linhas dos histogramas
			let max=0;
			for(let i=0; i<255;i++){
				if(max<vec[i]){
					max=vec[i];
				}
			}
			return max
		}

		const maxr=max(vecR);//calcla os maxs de cada hist
		const maxg=max(vecG);
		const maxb=max(vecB);
		const maxgray=max(vecgray);

		function desenhahist(j,ctx,vec, max,color){ //desenha a linha do valor j no histogrma
			ctx.beginPath();
			ctx.moveTo(j, 2000);
			ctx.lineTo(j, 200*(1-vec[j]/max));
			ctx.strokeStyle=color;
			ctx.stroke();
		}

		for (let j=0; j<255; j++){ //desenha os histogramas usando as funções
		desenhahist(j,ctxOutputr,vecR, maxr,'red');
		desenhahist(j,ctxOutputg,vecG, maxg,'green');
		desenhahist(j,ctxOutputb,vecB, maxb,'blue');
		desenhahist(j,ctxLumh,vecgray, maxgray,'gray');
		}
		/* //aposentei essa função pq ela só fazia processamento por convolução com matriz 3x3
		function aplica(filtro,auxgray){
			var imgauxxx=imgauxx;
			var linha=0;
			for(let i=W;i < auxgray.length-W;i++){
				if(i==linha*W){
				}
				else if(i==(linha+1)*(W-1)){
					linha+=1;
				}
				else{
					imgauxxx.data[4*i]=filtro[0]*auxgray[i-1-W]+filtro[1]*auxgray[i-W]+filtro[2]*auxgray[i+1-W];
					imgauxxx.data[4*i]+=filtro[3]*auxgray[i-1]+filtro[4]*auxgray[i]+filtro[5]*auxgray[i+1];
					imgauxxx.data[4*i]+=filtro[6]*auxgray[i-1+W]+filtro[7]*auxgray[i+W]+filtro[8]*auxgray[i+1+W];

					imgauxxx.data[4*i+1]=filtro[0]*auxgray[i-1-W]+filtro[1]*auxgray[i-W]+filtro[2]*auxgray[i+1-W];
					imgauxxx.data[4*i+1]+=filtro[3]*auxgray[i-1]+filtro[4]*auxgray[i]+filtro[5]*auxgray[i+1];
					imgauxxx.data[4*i+1]+=filtro[6]*auxgray[i-1+W]+filtro[7]*auxgray[i+W]+filtro[8]*auxgray[i+1+W];

					imgauxxx.data[4*i+2]=filtro[0]*auxgray[i-1-W]+filtro[1]*auxgray[i-W]+filtro[2]*auxgray[i+1-W];
					imgauxxx.data[4*i+2]+=filtro[3]*auxgray[i-1]+filtro[4]*auxgray[i]+filtro[5]*auxgray[i+1];
					imgauxxx.data[4*i+2]+=filtro[6]*auxgray[i-1+W]+filtro[7]*auxgray[i+W]+filtro[8]*auxgray[i+1+W];
				}
			}
			ctxfiltro.putImageData(imgauxxx,0,0);
		}
		*/
		function aplica2(filtro,dim,img){ //faz a convolução da img
			var imgauxxx=new ImageData(img.data, W,H);

			var data = new Uint8ClampedArray(img.data);
			lista1=[];
			lista2=[];
			for(let i=0;i<dim;i++){
				lista1.push(i);
				lista2.push(W-i-1);
			}
			//minha estratégia pras bordas vai ser simplesmente ignorá-las e começar a aplicar o filtro quando der mesmo. então pode ser que fiquei tipo uma moldurinha cm o que era a img original kkkk
			var linha=dim;
			for(let i=dim*4*W;i < img.data.length-dim*4*W;i+=4){//já começa sem estar na borda superior e termina antes de chegar na interior
				if(lista1.map(x => 4*(linha*W+x)).includes(i)){//confere se tá na borda esquerda
				}
				else if(lista2.map(x => 4*(linha*W+x)).includes(i)){//e aqui se tá na borda direita
					linha+=1;
				}
				else{
					var r=0;//tive que criar essas variáveis porque se não ficava acumulando erro por causa do tipo de objeto que eu tava usando antes que sempre arredondava p'ra inteiro
					var g=0;
					var b=0;
					
					
					for(let j=0;j<2*dim+1;j++){ //aplica o filtro  indo 
						for(let k=0; k<2*dim+1; k++){
							r +=filtro[j][k]  *  img.data[i + 4*(k-dim) + 4*W*(j-dim)];
							g+=filtro[j][k]  *  img.data[i + 4*(k-dim) + 4*W*(j-dim)  +  1];
							b+=filtro[j][k]  *  img.data[i + 4*(k-dim) + 4*W*(j-dim)  +  2];
							//g=r;b=r; //ou g=0, b=0;
						}
					}
					data[i]=r;
					data[i+1]=g;
					data[i+2]=b;
				}
			}
			imgauxxx.data.set(data);
			ctxfiltro.putImageData(imgauxxx,0,0); //desenha a imagem afinal
		}

		const img=ctxOriginal.getImageData(0, 0, W, H);
        /* //aqui caso você queira filtro 2x2
        const matriz=[[ 0, 1,-1],
                      [-1, 1, 1],
                      [ 1,-1, 0]];
        const dim=1;
        */
          //aqui caso queira 3x3
        const matriz=[[ 1,-1, 1,-1, 1],
                      [-1, 1,-1, 1,-1],
                      [ 1,-1, 1,-1, 1],
                      [-1, 1,-1, 1,-1],
                      [ 1,-1, 1,-1, 1]];
        const dim=2;
        
		aplica2(matriz,dim,img);

        var p=document.querySelector('#processinho'); //aui é pra alterar o texto sobre a matriz utilizada q fica no finzinho da página
        var txt='Para processar essa imagem e obter este último resultado apresentado foi usada a matriz de convolução [';
        for(let i=0; i<2*dim+1;i++){
            txt+='['
            for(let j=0; j<2*dim+1;j++){
                txt+=matriz[i][j];
                if(j<2*dim){
                    txt+=' , ';
                }
            }
            txt+='],'
        }
        txt+=' , com dimensão '+(2*dim+1)+'.';
        p.textContent=txt;
	};	    