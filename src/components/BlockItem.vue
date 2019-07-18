<template>
    <v-card>
        <v-card-tile avatar ripple>
            <v-card-tile-avatar>
                <img src="../images/BK.png">
            </v-card-tile-avatar>
            <v-card-tile-content>
                <v-card-tile-title>{{ (block.stringTime) }}</v-card-tile-title>
                <v-card-tile-sub-title class="text--primary"> <a
                        @click="block=getBlockData(block);dialog=true">{{ block.miner }}
                    </a>
                </v-card-tile-sub-title>
                <v-card-tile-sub-title>{{ block.number }}</v-card-tile-sub-title>
            </v-card-tile-content>
        </v-card-tile>
    </v-card>
</template>
<script>
    export default {
        props: {
            block: Object
        }
    }
</script>