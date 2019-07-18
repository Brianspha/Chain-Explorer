<template>
    <v-app id="inspire">
        <v-container align-start justify-start row fill-height>
            <v-layout>
                <v-dialog v-model="filterDialog">
                    <v-card v-if="filterDialog" app-data="true" id="increaseHeight">
                        <v-card-title class="headline">Refine By</v-card-title>
                        <v-container fluid grid-list-xl>
                            <v-layout wrap align-center>
                                <v-flex xs12 sm6 d-flex>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="white" light @click="filterDialog = false">
                                Filter
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="filterDialog">
                    <v-card v-if="filterDialog" app-data="true" id="increaseHeight">
                        <v-card-title class="headline">Refine By</v-card-title>
                        <v-container fluid grid-list-xl>
                            <v-layout wrap align-center>
                                <v-flex xs12 sm6 d-flex>

                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="white" light @click="filterDialog = false">
                                Filter
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="dialog" width="100%" align-start justify-center row fill-height>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Block Description</span>
                        </v-card-title>
                        <v-card-text>Block Height: {{block.number}}</v-card-text>
                        <v-card-text>Time Stamp: {{(block.stringTime)}}</v-card-text>
                        <v-card-text>Transactions: {{block.transactions?block.transactions.length:0}}
                        </v-card-text>
                        <v-card-text>Mined By: {{block.miner}}</v-card-text>
                        <v-card-text>Difficulty: {{block.difficulty}}</v-card-text>
                        <v-card-text>Total Difficulty: {{block.totalDifficulty}}</v-card-text>
                        <v-card-text>Size: {{block.size}}</v-card-text>
                        <v-card-text>Gas Used: {{block.gasUsed}}</v-card-text>
                        <v-card-text>Gas Limit: {{block.gasLimit}}</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="#7E57C2" flat="flat" @click="dialog = false">Close</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-flex>
                    <v-card class="elevation-12">
                        <v-toolbar color="#7E57C2" dark>
                            <v-toolbar-title>Blocks</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-list two-line v-if="Blocks.length>0">
                            <template v-for="(item, index) in Blocks">
                                <v-list-tile :key="index+new Date().getTime()" avatar ripple>
                                    <v-list-tile-avatar>
                                        <img src="../images/BK.png">
                                    </v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>Mined: {{ (item.stringTime) }}
                                        </v-list-tile-title>
                                        <v-list-tile-sub-title>Block Height: {{ item.number }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title class="text--primary"> <a
                                                @click=" block=getBlockData(index);dialog=true">Miner:
                                                {{ item.miner }}
                                            </a>
                                        </v-list-tile-sub-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                                <v-divider v-if="index + 1 < Blocks.length" :key="index"></v-divider>
                            </template>
                        </v-list>
                        <InfiniteLoading @infinite="loadBlocks" spinner="waveDots"></InfiniteLoading>
                    </v-card>
                </v-flex>
            </v-layout>

        </v-container>
    </v-app>
</template>
<script>
    import Swal from 'sweetalert2'
    import {
        async
    } from 'q';
    import Web3 from 'web3'
    import 'vue-loading-overlay/dist/vue-loading.css';
    import InfiniteLoading from 'vue-infinite-loading';
    import {
        setInterval
    } from 'timers';
    import sort from 'fast-sort';

    export default {
        name: "Blocks",
        components: {
            InfiniteLoading
        },
        data() {
            return {
                Blocks: [],
                fullPage: true,
                isLoading: false,
                indexLast: 0,
                limit: 30,
                isBusy: false,
                selecetedMiner: null,
                dialog: false,
                block: {},
                web3: null,
                nodeAddress: "http://146.231.123.137:11000",
                filterDialog: false
            }
        },
        watch: {
            Blocks: function () {
               // this.Blocks = sort(this.Blocks).desc(transaction => transaction.timestamp);
                this.$forceUpdate()
            }
        },
        mounted() {
            this.init()
        },
        computed: {
            countingUpFromTime() {

            }
        },
        methods: {
            init() {
                this.web3 = new Web3(new Web3.providers.HttpProvider(this.nodeAddress));
                let This = this
                setInterval(function () {
                    This.updateTime()
                    This.loadBlocks
                }, 1000)
            },
            getBlockData(blockNumber) {
                return this.Blocks[blockNumber]
            },
            loadBlocks($state) {
                ////////console.log("called")
                this.isBusy = true;
                let This = this
                //////console.log(this.web3);
                this.web3.eth.getBlock('latest').then(function (block) {
                    for (var i = block.number, count = 0; count < This.limit; i--, count++) {
                        This.web3.eth.getBlock(i).then(function (blockInner) {
                            $state.loaded()
                            if (blockInner) {
                                console.log(blockInner)
                                block.timestamp = block.timestamp * 1000
                                blockInner.stringTime = ''
                                This.Blocks.push(blockInner)
                                console.log(blockInner)
                                //////console.log("adding...")
                            }
                        })
                    }
                    This.Blocks = sort(This.Blocks).desc(transaction => transaction.timestamp);
                    $state.complete()
                })
            },
            updateTime() {
                this.Blocks.map((transaction) => {
                    //console.log(transaction.timestamp)
                    countFrom = new Date(transaction.timestamp * 1000).getTime();
                    ////console.log(countFrom)
                    var now = new Date(),
                        countFrom = new Date(countFrom),
                        timeDifference = (now - countFrom);
                    var secondsInADay = 60 * 60 * 1000 * 24,
                        secondsInAHour = 60 * 60 * 1000;
                    var days = Math.floor(timeDifference / (secondsInADay) * 1);
                    var years = Math.floor(days / 365);
                    if (years > 1) {
                        days = days - (years * 365)
                    }
                    var hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
                    var mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 *
                        1000) * 1);
                    var secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 *
                        1000)) / 1000 * 1);
                    var toreturn = ''
                    let This = this
                    if (days == 0 && hours == 0 && mins == 0) {
                        toreturn = secs + " seconds ago"
                    } else if (days == 0 && hours == 0 && mins > 0) {
                        toreturn = mins + " minutes " + secs + " seconds ago"
                    } else if (days == 0 && hours > 0 && mins > 0) {
                        toreturn = hours + ' hours ' + mins + ' minutes ' + secs + " seconds ago"
                    } else {
                        toreturn = days + " days " + hours + " hrs ago"
                    }
                    transaction.stringTime = toreturn
                    //console.log(transaction.stringTime)
                    return transaction
                })
            },
            countUpFromTime(countFrom) {
                countFrom = new Date(countFrom).getTime();
                var now = new Date(),
                    countFrom = new Date(countFrom),
                    timeDifference = (now - countFrom);
                var secondsInADay = 60 * 60 * 1000 * 24,
                    secondsInAHour = 60 * 60 * 1000;
                var days = Math.floor(timeDifference / (secondsInADay) * 1);
                var years = Math.floor(days / 365);
                if (years > 1) {
                    days = days - (years * 365)
                }
                var hours = Math.floor((timeDifference % (secondsInADay)) / (secondsInAHour) * 1);
                var mins = Math.floor(((timeDifference % (secondsInADay)) % (secondsInAHour)) / (60 * 1000) * 1);
                var secs = Math.floor((((timeDifference % (secondsInADay)) % (secondsInAHour)) % (60 * 1000)) / 1000 *
                    1);
                ////console.log("days: ", days, " hours: ", hours, " mins: ", mins, " secs: ", secs, " countFrom: ",countFrom)
                var toreturn = ''
                if (hours == 0 && mins == 0) {
                    toreturn = secs + " seconds ago"
                } else if (days == 0 && hours == 0 && mins > 0) {
                    toreturn = mins + " minutes " + secs + " seconds ago"
                } else {
                    toreturn = days + " days " + hours + " hrs ago"
                }
                return toreturn
            },
            getLatestBlock() {
                let This = this
                this.web3.eth.getBlock('latest').then(function (block) {
                    block.stringTime = ''
                    This.Blocks.push(block)
                    if (This.Blocks.length >= This.limit) {
                        for (var i = 0; i < This.limit / 2; i++) {
                            This.Blocks.pop()
                        }
                    }
                })

            }
        }
    }
</script>