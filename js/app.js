$(function(){

	var respostas = [];
	var indexPergunta = 0;
	var dbPerguntas;
	var perguntasRepetidas = []; /*vetor de perguntas que já sairam*/
	var respostasPerguntas = [];
	var countPerg = 0; 
	var perguntasSorteadas = [];
	var numeroPerguntas = 10; /*quantidade de perguntas por rodada*/
	var certas=0; /*contador de certas*/
	var vezes=0; /*numero de vezes jogada sem parar*/
	
	/* colocando json em variavel*/
	$.getJSON("js/perguntas.json", function(json){
		dbPerguntas = json;
	});
	


	function carregarPergunta() {/*carregar as perguntas*/	
		
		var index = randomInt(0, 40);
		perguntasSorteadas.push(index);
		$('#redPerguntas').html(dbPerguntas[index].pergunta);
		$('#alternativa-1').html("a) "+dbPerguntas[index].alternativas[0]);
		$('#alternativa-2').html("b) "+dbPerguntas[index].alternativas[1]);
		$('#alternativa-3').html("c) "+dbPerguntas[index].alternativas[2]);
		$('#imagens').attr('src',dbPerguntas[index].imagem);
		respostasPerguntas[countPerg] = dbPerguntas[index].resposta;
		countPerg++;
	}
	
	function randomInt(min, max){ /*gera o index randomico e confere se já foi usado*/
			var index = -1;
			var saiu = 0;
			do {
				index = Math.floor(Math.random()*(max-min+1))+min;
				console.log(index);
				for (i=0; i < perguntasRepetidas.length; i++) {
					if(perguntasRepetidas[i] == index){
						saiu++;
					}
				}
				if (saiu>0){
					index=-1;
				}
				saiu=0;
			}while(index < 0)
			perguntasRepetidas.push(index);
			console.log(index);
			return index;
	}
	
	function gabarito(){ /* criar o gabarito */
		var gabaritoCompleto="";
		var letra = "";
		for (i = 0; i < perguntasSorteadas.length; i++){
			var questao = perguntasSorteadas[i];
			
			function trocaLetra(resp){ /*troca os números pelas letras das questões*/
				if (resp == 0){
					letra = "a"; 
				}
				if (resp == 1){
					letra = "b"; 
				}
				if (resp == 2){
					letra = "c";
				}
				return letra;
			}
			
			if (dbPerguntas[questao].resposta != respostas[i]){ /* muda cor da fonte caso a resposta do usuário esteja errada*/
				estilo = "style='color:red'";
				suaResposta = "<br><span style='color:black'>Sua resposta foi: <strong>" + trocaLetra(respostas[i])+")</strong> " + dbPerguntas[questao].alternativas[respostas[i]] + "</span>"; /*chama o metodo trocaletra para exibição correta e exibe a resposta na posição do vetor respostas[] na posição da respectiva pergunta.*/
			} else {
				estilo = "";
				suaResposta = "";
				certas++;
			}
			
			gabaritoCompleto = gabaritoCompleto + "<li "+estilo+"><p style='align:justify;'><strong>"+dbPerguntas[questao].pergunta + "</strong></p><p><strong>Resposta:</strong> " /*Concatenação do gabarito*/
													+ trocaLetra(dbPerguntas[questao].resposta)+") " +dbPerguntas[questao].alternativas[dbPerguntas[questao].resposta] + suaResposta + "<hr/><br></p></li>";
		}
		$("#cpGabarito").html(gabaritoCompleto);
	}
	
	$("#btComecar").click(function(){ /* botão Começar chama o metodo para carregar a pergunta e zera todos os vetores*/
		indexPergunta = 0;
		vezes=0;
		certas=0;
		respostas = [];
		perguntasRepetidas = [];
		respostasPerguntas = [];
		perguntasSorteadas = [];		
		carregarPergunta();
	});	
	
	
	$("#btProxima").click(function(){ /* botão Proxima chama o metodo para carregar a pergunta*/
		if (! $("input[name='radio-choice-v-2']").is(':checked')){
			$( "#popupSelecione" ).popup( "open" );
		} else {
			var resposta = $("input[name='radio-choice-v-2']:checked").val();
			respostas[indexPergunta] = resposta;
			console.log("sua resposta: "+respostas[indexPergunta]);
			indexPergunta++;
			if (indexPergunta == numeroPerguntas-1){ /*altera valor do botão*/
				$("#btProxima").html('Concluir');
			}
			if (indexPergunta == numeroPerguntas){ /*mostra resultado*/
				$.mobile.changePage( "#resultado", { transition: "flip"});
				gabarito();
				$("#redResultado").html( "Você " +(certas===0 ? "não ": "")+"acertou " +(certas===0 ? "nenhuma ": certas) + (certas <= 1 ? " questão!" : " questões!") + (certas < 1 ? "</br>:( </br> Tente de Novo!</br>:D" : ""));
				
			} else {
				carregarPergunta();
				$("input[name='radio-choice-v-2']").attr("checked", false);
				$('#formulario').each (function(){ /*apaga a marcação do radio buttom*/
					this.reset();
				});
			}
		}
	});
	
	$("#btParar").click(function(){ /*retorna para página inicial*/
		$.mobile.changePage( "#inicio", { transition: "flip"});
	});
	
	$("#btContinua").click(function(){ /*inicia o processo de geração de perguntas*/
		vezes++;
		certas=0;
		indexPergunta = 0;
		respostas = [];
		respostasPerguntas = [];
		perguntasSorteadas = [];
		if (vezes==3){
			perguntasRepetidas = [];
		}
		carregarPergunta();
		$("#btProxima").html('Próxima');
		$('#formulario').each (function(){ /*apaga a marcação do radio buttom*/
			this.reset();
		});
	});	

});