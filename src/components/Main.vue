<template>
    <div class="row">
        <div class="col-md">
            <div class="card" style="padding-bottom: 1%">
                <!-- CARD HEADER-->
                <div class="card-header bg-dark text-white">
                    <h4>Chat</h4>
                </div>

                <!-- CARD BODY-->
                <div id="chat" class="card-body">
                    <div class="card text-start bot p-2">
                        <div class="card-subtitle text-muted">Bot</div>
                        <p class="card-text">
                            ¡Hola!, Soy un agente virtual encargado de dar respuesta a tus dudas, ¿Tienes alguna pregunta? Puedes preguntarme cosas como
                            "¿Pikachu es alto?" o "Dame el peso de pikachu"
                        </p>
                    </div>
                    <div
                        v-for="mensaje in messages"
                        v-bind:key="mensaje.id"
                        v-bind:class="{ 'bot text-start': mensaje.type == 'bot', 'user text-end': mensaje.type == 'user' }"
                    >
                        <div class="card p-2">
                            <div class="card-subtitle text-muted">{{ mensaje.type == "bot" ? "Bot" : "Usuario" }}</div>

                            <p class="card-text">{{ mensaje.mensaje }}</p>
                        </div>
                    </div>
                </div>

                <!-- CARD FOOTER -->
                <div class="input-group">
                    <input @keypress.enter="sendQuestion" v-model="message" placeholder="Escribe tus dudas" class="form-control" />
                    <div class="input-group-append">
                        <button class="btn btn-warning" v-on:click="sendQuestion"><i class="fas fa-location-arrow"></i> Send</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    name: "Main",
    data() {
        return {
            message: "",
            messages: [],
            count: 0,
            sendQuestion: async () => {
                var { data } = await axios.get(
                    `http://beta.soldai.com/bill-cipher/askquestion?key=${process.env.VUE_APP_SOLDAI}&question=${this.message}&session_id=1903135173030124&log=1`
                );
                var soldai = data.current_response;
                if (soldai.parameters.entities) soldai.message = await getPokeAPI(soldai);
                this.messages.push({ type: "user", mensaje: this.message, id: this.count++ });
                this.messages.push({ type: "bot", mensaje: soldai.message, id: this.count++ });
                this.message = "";
            }
        };
    }
};

async function getPokeAPI(soldai) {
    let mensaje = "";
    let apiP = await axios.get(`https://pokeapi.co/api/v2/pokemon/${soldai.parameters.entities[0].name}`);

    if (soldai.intent_info.id == 9982 && apiP.data?.abilities[0]?.ability.name)
        mensaje = soldai.message.toString().replace(/{dato}/gi, apiP.data.abilities[0].ability.name);
    else if (soldai.intent_info.id == 9983 && apiP.data?.weight) mensaje = soldai.message.toString().replace(/{dato}/gi, (apiP.data.weight * 10) / 100 + " Kg");
    else if (soldai.intent_info.id == 9984 && apiP.data?.height) mensaje = soldai.message.toString().replace(/{data}/gi, apiP.data.height * 10 + " cm.");
    else if (soldai.intent_info.id == 9985 && apiP.data?.types[0]?.type.name)
        mensaje = soldai.message.toString().replace(/{dato}/gi, apiP.data.types[0]?.type.name);
    else if (soldai.intent_info.id == 9986 && apiP.data?.moves[0]?.move.name)
        mensaje = soldai.message.toString().replace(/{dato}/gi, apiP.data.moves[0]?.move.name);
    else if (soldai.intent_info.id == 9987 && apiP.data?.stats[0])
        mensaje = soldai.message
            .toString()
            .replace(/{hp}/gi, apiP.data.stats[0]?.base_stat)
            .replace(/{atk}/gi, apiP.data.stats[1]?.base_stat)
            .replace(/{def}/gi, apiP.data.stats[2]?.base_stat)
            .replace(/{sp_ark}/gi, apiP.data.stats[3]?.base_stat)
            .replace(/{sp_def}/gi, apiP.data.stats[4]?.base_stat)
            .replace(/{speed}/gi, apiP.data.stats[5]?.base_stat);
    else mensaje = "No se encontró el pokemon";

    return mensaje;
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chat {
    color: black;
    overflow-y: scroll;
    height: 300px;
    font-size: 10pt;
}
.bot {
    width: 40%;
}
.user {
    align-self: flex-end;
    padding-left: 60%;
}
</style>
