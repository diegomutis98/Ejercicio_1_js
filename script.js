const main = document.querySelector('main');
const contenedor = document.createElement('div');
const buttonEvolves = document.createElement("button");

const containerErrorElement = document.querySelector(".containerError");
const containerInfoElement = document.querySelector(".containerInfo");

var nextEvolutio = "";
var contador = 0;

// captura del evento click search
const button1 = document.querySelector(".buttonSearch");
button1.addEventListener("click",()=> capturar());

// captiure cleck event for evolution
const button2 = document.querySelector('.buttonEvolution');
button2.addEventListener("click",()=> evolucionar());

// function for button search
function capturar(){
    const in1 = document.getElementById('in1').value;
    // construcion de la url para el pokemeon dado
    const url = "https://pokeapi.co/api/v2/pokemon/" + in1;
    const responseApi = ConsumirApiWithAxios(url);
    getDatosApi(responseApi);
}

// funtion fot button Evolution
function evolucionar(){
    contador++;
    const url = "https://pokeapi.co/api/v2/pokemon/" + nextEvolutio;
    console.log(url);
    const responseApi = ConsumirApiWithAxios(url);
    getDatosApi(responseApi);
}

// funcion para consultar la Api, nos retorna una promesa
async function ConsumirApiWithAxios(url){
    containerErrorElement.style.display = 'none';
    try{
        const response = await axios.get(url);
        //console.log(`la petición a la Api se completó correctamente: ${response.status}`);
        return await response.data;
    }
    catch(error){
        //console.log(`Falló la peticion con error: ${error.message}`);
        //document.querySelector(".containerError").style.display = "block";
        containerInfoElement.style.display = 'none';
        document.querySelector('.containerEvolution').style.display = 'none';
        containerErrorElement.style.display = 'flex';
    }
}

// Funcion para consumir la Api
async function getDatosApi(resp){
    const resApi = await resp;
    //console.log(resApi);
    const forms = resApi.forms;

    // name of the pokemon
    const pokemonName = forms[0].name;
    document.querySelector('.pokemonName').textContent = `${pokemonName}`;
    //console.log(pokemonName);

    // imagen of the pokemon
    const pokemonSprites = resApi.sprites.other["official-artwork"].front_default;
    document.querySelector('.pokemonImg').src = pokemonSprites;
    //console.log(pokemonSprites);

    // we add the prisipal information
    containerInfoElement.style.display = 'flex';

    const pokemonId = resApi.id;
    //const url = "https://pokeapi.co/api/v2/evolution-chain/" + pokemonId;
    //console.log(pokemonId);
    const pokemonSpeciesUrl = " https://pokeapi.co/api/v2/pokemon-species/"+pokemonId+'/';
    console.log(pokemonSpeciesUrl);
    const responseApiSpecies = ConsumirApiWithAxios(pokemonSpeciesUrl);
    getDatosApiSpecies(responseApiSpecies);

}

async function getDatosApiSpecies(resp){
    const resApi = await resp;
    console.log(resApi);

    var evolutionChainUrl = resApi.evolution_chain.url;
    console.log(evolutionChainUrl);

    const responseApiEvoltionChain = ConsumirApiWithAxios(evolutionChainUrl);
    getDatosApiSEvolutionChain(responseApiEvoltionChain); 
}

async function getDatosApiSEvolutionChain(resp){
    const resApi = await resp;
    console.log(resApi);
    var pokemonEvolvesTo = resApi.chain.evolves_to;
    var i = 0
    while(i<2){
        //const pokemonEvolvesTo = resApi.chain.evolves_to;
        pokemonEvolvesTo = pokemonEvolvesTo[0].species.name;
    //console.log(pokemonEvolvesTo);
    console.log(pokemonEvolvesTo[0].species.name);
    //console.log(pokemonEvolvesTo[0].species.url);
    i=i+1;
    console.log(i);
    }
    

    if(pokemonEvolvesTo.length > 0){
        //console.log("si pase ");
        nextEvolutio = pokemonEvolvesTo[0].species.name;
        //console.log(nextEvolutio);
        document.querySelector('.containerEvolution').style.display = 'flex';
    }
    else{
        //console.log("este pokemon no evoluciona");
        document.querySelector('.containerEvolution').style.display = 'none';
    }
}
