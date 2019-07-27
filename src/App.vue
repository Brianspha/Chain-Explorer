<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app>
      <v-list dense>
        <template v-for="item in items">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" :key="item.text" v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']" append-icon="">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ item.text }}
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <v-list-tile v-for="(child, i) in item.children" :key="i">
              <v-list-tile-action v-if="child.render &&child.icon" :to="child.to">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content v-if="child.render">
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile :to="item.to" v-else :key="item.text">
            <v-list-tile-action v-if="item.render">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="item.render">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="$vuetify.breakpoint.lgAndUp" color="#7E57C2" light app fixed>
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-sm-and-down">Chain Explorer</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat block color="white" light @click="dialog=true">Search</v-btn>
      <v-spacer></v-spacer>
      <v-btn icon large>
        <v-avatar size="32px" tile>
          <img src="./images/explore.svg">
        </v-avatar>
      </v-btn>
    </v-toolbar>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="#7E57C2">
            <v-toolbar-title>Search</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="dialog = false; resetIntervals() ">Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-tabs v-model="tabs" centered color="transparent" slider-color="white">
            <v-tab v-for="(tab,index ) in tabItems" :key="index">
              {{ tab.title }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-container>
                <v-layout align-center justify-center row fill-height>
                  <v-flex xs12 sm6 md3>
                    <v-text-field label="Block Number" hint="The Block number for example: 0" v-model="blockNumber">
                    </v-text-field>
                  </v-flex>
                  <v-btn color="#7E57C2" dark :disabled="!valid" @click="getBlockData()">Search</v-btn>
                </v-layout>
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
                </v-card>
              </v-container>
            </v-tab-item>
            <v-tab-item>
              <v-layout align-center justify-center row fill-height>
                <v-flex xs12 sm6 md3>
                  <v-text-field label="Transaction Hash"
                    hint="The transaction hash you are trying to verify starts with e.g.: 0x..."
                    v-model="transactionHash">
                  </v-text-field>
                </v-flex>
                <v-btn color="#7E57C2" dark :disabled="!valid" @click="getTransactionData()">Search</v-btn>
              </v-layout>
              <v-card align-center justify-center row fill-height>
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
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-dialog>
    </v-layout>
    <main>
      <v-content>
        <v-container fluid fill-height>
          <v-layout justify-center align-center>
            <v-flex>
              <router-view></router-view>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
    </main>
  </v-app>
</template>

<script>
  import AOS from 'aos'
  import Web3 from 'web3'
  import Swal from 'sweetalert2'
  import {
    setInterval,
    clearInterval
  } from 'timers';
  export default {
    data: () => ({
      transaction: {},
      transactionHash: "",
      valid: true,
      block: {},
      blockTab: 0,
      transactionTab: 1,
      text: "Hello",
      tabItems: [{
          title: "Verify Block"
        },
        {
          title: "Verify Transaction"
        }
      ],
      blockNumber: null,
      tabs: null,
      dialog: false,
      drawer: null,
      fullPage: true,
      isLoading: false,
      items: [{
          icon: 'compare_arrows',
          text: 'Transactions',
          to: "/Transactions",
          render: true
        },
        {
          icon: 'view_module',
          text: 'Blocks',
          to: "/Blocks",
          render: true
        }
      ],
      Web3: new Web3(new Web3.providers.HttpProvider("http://146.231.123.137:11000")),
    }),
    mounted() {
      AOS.init();
    },
    props: {
      source: String
    },
    methods: {
      resetIntervals() {
        clearInterval(this.updateTime())
      },
      getBlockData() {
        // console.log("!this.blockNumber: ", !this.blockNumber, isNaN(this.blockNumber), ": isNaN(this.blockNumber )")
        if (!this.blockNumber || isNaN(this.blockNumber)) {
          this.snackbar = true;
        } else {
          let This = this
          this.Web3.eth.getBlock('latest').then((latest) => {
            if (latest.number < This.blockNumber) {
              This.error(
                `Block ${This.blockNumber} entered must be less than the latest ${latest.number} mined block `)
            } else {
              This.Web3.eth.getBlock(This.blockNumber).then((block) => {
                block.stringTime = This.countUpFromTime(block.timestamp)
                This.block = block
                console.log("Block: ", This.block)
                console.log("fine")
                This.updateTime()

              })
            }
          })
        }
      },
      getTransactionData() {
        if (!this.transactionHash) {
          this.error("Invalid Transaction hash")
        } else {
          let This = this
          this.Web3.eth.getTransaction(this.transactionHash).then((transaction) => {
            if (transaction == undefined) {
              This.error("Invalid Transaction hash")
            } else {
              This.Web3.eth.getTransactionReceipt(transaction.hash).then((receipt) => {
                This.Web3.eth.getBlock(receipt.blockNumber).then((block) => {
                  transaction.timestamp = block.timestamp
                  transaction.stringTime = This.countUpFromTime(transaction.timestamp)
                  transaction.contractAddress = receipt.contractAddress
                  transaction.status = receipt.status
                  transaction.cumulativeGasUsed = receipt.cumulativeGasUsed
                  transaction.logs = receipt.logs
                  transaction.input = This.Web3.utils.hexToAscii(transaction.input)
                  This.transaction = transaction
                  console.log(transaction)
                  setInterval(function () {
                    This.updateTimeTransaction()
                  }, 1000)

                })
              })
            }
          })
        }
      },
      updateTime() {
        console.log("updating: ", this.block)
        if (!this.block) return
        countFrom = new Date(this.block.timestamp * 1000).getTime();
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
        this.block.stringTime = toreturn
        console.log("stringTime: ", this.block.stringTime)
        //console.log(transaction.stringTime)
      },
      updateTimeTransaction() {
        console.log("updating: ", this.block)
        if (!this.transaction) return
        countFrom = new Date(this.transaction.timestamp * 1000).getTime();
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
        this.transaction.stringTime = toreturn
        console.log("stringTime: ", this.transaction.stringTime)
        //console.log(transaction.stringTime)
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
      success(message) {
        Swal.fire(
          'Success',
          message,
          'success'
        )
      },
      error(message) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: message,
          allowOutsideClick: true
        })
      }
    }
  }
</script>