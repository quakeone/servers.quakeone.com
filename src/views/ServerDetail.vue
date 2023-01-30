<template lang="pug">
.server-detail
  BackButton(@back="router.push('/')") 
    | Back to Servers List
  template(v-if="details.status")
    .header
      .summary
        h2 {{details.status.serverName}}
        .details
          GameType.bright(:gameId="details.status.gameId")
          ModType.bright(:mod="details.status.modificationCode")
          Location(:location="details.status.location")
      .connection
        ServerAddress(:address="details.status.dNS" :port="details.status.port")
    .content
      .status
        MatchStatus(:server="details.status")
      .server-rules
        Rules(:rules="details.status.serverSettings")
      .map-image
        template(v-if="'teams' in details.status")
          MapWithTeamsList(
            :map="details.status.map",
            :teams="details.status.teams")
            .map-lower-right
              .map-text {{details.status.map}}
        template(v-else)
          MapWithPlayerList(
            :map="details.status.map",
            :playerList="details.status.players")
            .map-lower-right
              .map-text {{details.status.map}}
      .matches
        h2 Recent Matches
        .match-container(v-for="match in sortedMatches")
          MatchInstance(:match="match")
        .match-pager
          Pager(:currentPage="matchPage" :pageCount="matchPages" @newPage="newMatchPage")
</template>

<script lang="ts" setup>
import {onBeforeUnmount, ref, defineProps, computed} from 'vue'
import type {ServerDetail} from '@/model/ServerDetail'
import ServerAddress from '@/components/ServerAddress.vue'
import Location from '@/components/Location.vue'
import GameType from '@/components/GameType.vue'
import ModType from '@/components/ModType.vue'
import BackButton from '@/components/BackButton.vue'
import MapWithPlayerList from '@/components/MapWithPlayerList.vue'
import MatchStatus from '@/components/server/status/MatchStatus.vue'
import Rules from '@/components/server/Rules.vue'
import {getServerDetails, getServerMatches} from '@/services/serversApi'
import {useRouter} from 'vue-router'
import type {Match as MatchModel} from '@/model/Match'
import MatchInstance from '@/components/server/match/MatchInstance.vue'
import type {PagedResult} from '@/model/PagedResult'
import MapWithTeamsList from '@/components/MapWithTeamList.vue'
import {parseServerStatus} from '@/helpers/match'
import {useRoute} from 'vue-router'
import Pager from '../components/Pager.vue'

const route = useRoute()

const router = useRouter()

const props = defineProps<{
  serverId: number,
  matchPage: number
}>()

const details = ref<ServerDetail>({})
const matches = ref<PagedResult<MatchModel>>({})

const matchPages = computed(() => Math.ceil(matches.value.totalResults / 10))
const sortedMatches = computed(() => [...matches.value.results].sort((b, a) => 
  new Date(a.matchStart).getTime() - new Date(b.matchStart).getTime()))

const newMatchPage = (pageNum: number) => {
  getServerMatches(props.serverId, pageNum).then(_matches=> matches.value = _matches)
  router.push({
    ...route,
    query: {
      ...route.query,
      matchPage: pageNum
    }
  })
}

const update = () => 
  Promise.all([
    getServerDetails(props.serverId)
      .then(({ mapStats, status} )=> ({
        mapStats,
        status: parseServerStatus(status)
      })),
    getServerMatches(props.serverId, props.matchPage)
  ])
  .then(([_details, _matches]: [_details: ServerDetail, _matches: PagedResult<MatchModel>]) => {
    details.value = _details
    matches.value = _matches
  })

var id = setInterval(update, 5000)
onBeforeUnmount(() => clearInterval(id))
update()

</script>

<style lang="scss" scoped>
.server-detail {
  .back-button {
    margin: 1rem 0;
  }
  .header {
    display: grid;
    .summary {
      grid-area: summary;
      .details {
        display: flex;
        justify-content: space-between;
        padding-bottom: 1rem;
      }
      border-bottom: 1px solid $grey-2;
    }
    .connection {
      grid-area: connection;
      padding: 1rem 0;
    }
    .summary, .connection {
      border-bottom: 1px solid $grey-2;
    }
    grid-template-areas:
      "header"
      "summary"
      "connection";
    @media screen and (min-width: $phone-breakpoint) {
      grid-template-columns: 70% 30%;
      grid-template-areas:
        "header header"
        "summary connection";
      .summary {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .details {
          div {
            margin-right: 1rem;
          }
          display: flex;
          justify-content: flex-start;
        }
      }
      .connection {
        border-top: 1px solid $grey-2;
      }
    }
  }
  
  .content {
    display: grid;
    .status {
      grid-area: status;
      padding-top: 1rem;
    }
    .matches{
      grid-area: matches;
    }
    .map-image {
      grid-area: map;
      position: relative;
      padding-top: 1rem;
    }
    .server-rules {
      grid-area: rules;
      padding-top: 1rem;
    }
    .map-lower-right {
      text-align: right;
      padding: 4px;
      color: $grey-3;
      font-weight:  700;
      text-shadow: 2px 2px rgba(0,0,0,.9);
      //background-color: rgba(0,0,0,.4);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    grid-template-areas:
      "header"
      "summary"
      "connection"
      "status"
      "map"
      "rules"
      "matches";
    @media screen and (min-width: $phone-breakpoint) {
      grid-template-columns: 60% 40%;
      grid-template-areas:
        "header header"
        "summary connection"
        "map status"
        "map rules"
        "matches matches";
      .server-rules {
        margin-left: 1rem;
      }
      .status {
        margin-left: 1rem;
      }
    }
    .match-container {
      margin: 1rem 0;
      padding-top: 1rem;
      border-top: 1px solid $grey-2;
    }
  }
}
</style>