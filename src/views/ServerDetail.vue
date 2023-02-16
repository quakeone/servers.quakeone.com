<template lang="pug">
.server-detail
  BackButton(@back="router.push('/')") 
    | Back to Servers List
  template(v-if="details.status")
    .header
      .summary
        h2 {{details.status.hostname}}
        .details
          GameType.bright(
            size="Full"
            :gameId="details.status.gameId"
            )
          .mod
            ModMode(:mod="details.status.mod" :mode="details.status.mode")
          Location(:location="details.status.locality", :country="details.status.country")
      .connection
        ServerAddress(:address="details.status.address" :port="details.status.port")
        ClientDownload(:gameId="details.status.gameId" :params="details.status.parameters")
    .content
      .status
        MatchStatus(:server="details.status")
      .server-rules
        h3 Rules
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
      .map-stats
        h3 Map Popularity
        MapStats(:mapStats="details.mapStats" :height="150" :width="475")
        
      .progress(v-if="details.match")
        ProgressGraph(:match="details.match" :height="150" :width="475")
      .matches
        h2 Previous Matches
        MatchList(:matches="matches" :pageNum="props.matchPage" @newPage="newMatchPage")
</template>

<script lang="ts" setup>
import {onBeforeUnmount, ref, watch, defineProps, computed} from 'vue'
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
import type {TeamMatch as TeamMatchModel} from '@/model/TeamMatch'
import MapWithTeamsList from '@/components/MapWithTeamList.vue'
import {parseApiMatch} from '@/helpers/match'
import {useRoute} from 'vue-router'
import type { ServerStatus } from '@/model/ServerStatus'
import ProgressGraph from '@/components/server/match/ProgressGraph.vue'
import ModMode from '@/components/ModMode.vue'
import MatchList from '@/components/server/match/MatchList.vue'
import type { PagedResult } from '@/model/PagedResult'
import ClientDownload from '@/components/ClientDownload.vue'
import MapStats from '@/components/server/MapStats.vue'

type Props = {
  serverId: number,
  matchPage: number
}
const route = useRoute()

const router = useRouter()

const props = defineProps<Props>()
watch(() => props.matchPage, (val, old) => {
  if (old && old !== val) {
    // dynamic paging
    getServerMatches(props.serverId, val)
      .then(matches => ({
        totalResults: matches.totalResults,
        results: matches.results.map(parseApiMatch)
      }))
      .then(result => {
        matches.value = result
      })
  }
})
const details = ref<ServerDetail>({})
const matches = ref<PagedResult<MatchModel>>({})

const matchPages = computed(() => Math.ceil(matches.value.totalResults / 10))
const sortedMatches = computed(() => [...matches.value.results].sort((b, a) => 
  new Date(a.matchStart).getTime() - new Date(b.matchStart).getTime()))

const newMatchPage = (pageNum: number) => {
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
      .then(({ match, mapStats, status} )=> ({
        match: match ? parseApiMatch(match) : null,
        mapStats,
        status: status as ServerStatus
      })),
    getServerMatches(props.serverId, props.matchPage)
      .then(matches => ({
        totalResults: matches.totalResults,
        results: matches.results.map(parseApiMatch)
      }))
  ])
  .then(([_details, _matches]: [_details: ServerDetail, _matches: PagedResult<MatchMode | TeamMatchModel>]) => {
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
    .progress {
      grid-area: progress;
    }
    .status {
      grid-area: status;
      padding-top: 1rem;
    }
    .matches{
      grid-area: matches;
    }
    .map-stats {
      grid-area:mapstats;
      padding-top: 1rem;
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
      "progress"
      "mapstats"
      "rules"
      "matches";
    @media screen and (min-width: $phone-breakpoint) {
      grid-template-columns: 50% 50%;
      grid-template-areas:
        "header header"
        "summary connection"
        "map status"
        "map progress"
        "map rules"
        "mapstats rules"
        "matches matches";
      .server-rules, .status, .progress {
        margin-left: 1rem;
      }
    }
  }
}
</style>