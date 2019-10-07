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
              <span class="headline">Transaction Details</span>
            </v-card-title>
            <v-card-text>Transaction Hash: {{transaction.hash}}</v-card-text>
            <v-card-text>Time Stamp: {{(transaction.stringTime)}}</v-card-text>
            <v-card-text>nonce: {{transaction.nonce}}
            </v-card-text>
            <v-card-text>Block Hash: {{transaction.blockHash}}</v-card-text>
            <v-card-text>BlockNumber: {{transaction.blockNumber}}</v-card-text>
            <v-card-text>From: {{transaction.from}}</v-card-text>
            <v-card-text>To: {{transaction.to?transaction.to:"Contract creation"}}</v-card-text>
            <v-card-text>Value: {{transaction.value}}</v-card-text>
            <v-card-text>Gas: {{transaction.gas}}</v-card-text>
            <v-card-text>Gas Price: {{transaction.gasPrice}}</v-card-text>
            <v-card-text>Contract Address: {{transaction.contractAddress}}</v-card-text>
            <v-card-text>Cummulative Gas Used: {{transaction.gasPrice}}</v-card-text>
            <v-card-text>Transaction Status: {{transaction.status}}</v-card-text>
            <v-card-text>logs: {{(transaction.logs)}}</v-card-text>
            <v-card-text>Input: {{transaction.input}}</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#7E57C2" flat="flat" @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-flex>
          <v-card class="elevation-12">
            <v-toolbar color="#7E57C2" dark>
              <v-toolbar-title>Transactions</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-list two-line v-if="Transactions.length>0">
              <template v-for="(item, index) in Transactions" >
                <v-list-tile :key="index+new Date().getTime()" avatar ripple :ripple="{ center: true }">
                  <v-list-tile-avatar>
                    <img src="../images/Tx.png">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>Hash: <a @click="transaction=getTransactionReceipt(index); dialog=true">
                        {{ (item.hash) }}</a>
                    </v-list-tile-title>
                    <v-list-tile-sub-title>TimeStamp: {{ (item.stringTime) }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title class="text--primary"> To:
                      {{ item.to? item.to:"Contract Creation" }}
                    </v-list-tile-sub-title>
                    <v-list-tile-sub-title class="text--primary"> From:
                      {{ item.from }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider v-if="index + 1 < Transactions.length" :key="index"></v-divider>
              </template>
            </v-list>
            <InfiniteLoading @infinite="loadTransactions" spinner="waveDots"></InfiniteLoading>
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
    setInterval,
    setTimeout
  } from 'timers';
  import sort from 'fast-sort';

  export default {
    name: "Transactions",
    components: {
      InfiniteLoading
    },
    data() {
      return {
        Transactions: [],
        fullPage: true,
        isLoading: false,
        indexLast: 0,
        limit: 30,
        isBusy: false,
        selecetedHash: null,
        dialog: false,
        transaction: {},
        Web3: null,
        nodeAddress: "ws://localhost:12000",
        filterDialog: false,
        accountsWatching: [],
        transactionHashes: []
      }
    },
    watch: {
      Transactions: function () {
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
        this.Web3 = new Web3(new Web3.providers.WebsocketProvider(this.nodeAddress));
        let This = this
        setInterval(async function () {
          await This.updateTime()
        }, 1000)
      },
      getTransactionReceipt(index) {
        //console.log("Index: ", index, "receipt: ", this.Transactions[index])
        return this.Transactions[index]
      },
      loadTransactions: async function ($state) {
        let This = this
        setInterval(function () {
          This.checkTransactionCount()
          if (This.transactionHashes.length > 0) {
            This.transactionHashes.map((hash) => {
              This.Web3.eth.getTransaction(hash).then((transaction) => {
                This.Web3.eth.getTransactionReceipt(transaction.hash).then((receipt) => {
                  This.Web3.eth.getBlock(receipt.blockNumber).then((block) => {
                    if (This.Transactions.some(tx => tx.hash === hash)) {
                      return
                    }
                    transaction.timestamp = block.timestamp
                    transaction.stringTime = This.countUpFromTime(transaction.timestamp)
                    transaction.contractAddress = receipt.contractAddress
                    transaction.status = receipt.status
                    transaction.cumulativeGasUsed = receipt.cumulativeGasUsed
                    transaction.logs = receipt.logs
                    transaction.input = This.Web3.utils.hexToAscii(transaction.input)
                    This.Transactions.push(transaction)
                    $state.complete()
                    if (This.Transactions.length == This.limit) {
                      for (var i = 0; i < This.limit / 2; i++) {
                        This.Transactions.pop()
                      }
                    }
                  })
                })
              })
            })
          }
          //  });
        }, 1000)
      },
      checkTransactionCount() {
        let This = this
        this.Web3.eth.getBlock('latest').then((block) => {
          for (var i = block.number - this.limit; i <= block.number; i++) {
            this.Web3.eth.getBlock('latest').then((block) => {
              if (block != null) {
                if (block.transactions != null && block.transactions.length != 0) {
                  block.transactions.map((hash) => {
                    This.transactionHashes.push(hash)
                  })
                }
              }
            })
          }
        })
      },
      updateTime: async function () {
        this.Transactions.map((transaction) => {
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
        countFrom = new Date(countFrom * 1000).getTime();
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
      }
    }
  }
</script>