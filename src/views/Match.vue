<template lang="pug">
.server-detail
  BackButton(@back="router.push('/')") 
    | Back to Servers List
  template(v-if="model.match")
  
    .header
      .summary
        h2 {{model.server.hostname}}
        .details
          ServerTypeIcon(:type="{gameId: model.server.gameId, parameters: model.server.parameters }" logoType="clean")
          GameType.bright(
            size="Full"
            :gameId="model.server.gameId"
            :serverParams="model.server.parameters"
            )
          .mod
            ModMode(:mod="model.server.mod" :mode="model.server.mode")
          Location(:location="model.server.locality", :country="model.server.country")
      .connection
        ServerAddress(:address="model.server.address" :port="model.server.port")
        ClientDownload(:gameId="model.server.gameId" :params="model.server.parameters")
    .content
      
      h2 Match
      .match
        .date
          .date-day {{matchDay}}
          .date-month {{matchMonth}}
          .match-type(v-if="isTeam") {{matchType}}
          .match-size(v-if="isTeam") {{teamSize}}x{{teamSize}}

        .title
          h3 {{title}}
          .subtitle
            span.bright(v-tippy :content="fullMatchDate")  {{matchTime}}  
            span.vert-divide  | 
            span.bright  {{Math.ceil(matchDuration/60)}} 
            span  minutes 
            span.vert-divide  | 
            span map: 
            span.bright  {{model.match.map}}
        .detail
          component(:is="detail" :match="model.match" :expanded="true")

        .graphics
          MapImage(:map="model.match.map")
            .stuff
            .map-text {{model.match.map}}
        .progress
          ProgressGraph(:match="model.match" :height="150" :width="475")
  </template>
  
<script lang="ts" setup>
import {onMounted, ref, reactive, defineProps, computed} from 'vue'
import { differenceInSeconds, format, formatDistanceStrict } from 'date-fns'
import TDM from '@/components/server/match/TDM.vue'
import CTF from '@/components/server/match/CTF.vue'
import FFA from '@/components/server/match/FFA.vue'
import MapImage from '@/components/MapImage.vue'
import ServerAddress from '@/components/ServerAddress.vue'
import Location from '@/components/Location.vue'
import GameType from '@/components/GameType.vue'
import ModType from '@/components/ModType.vue'
import BackButton from '@/components/BackButton.vue'
import MapWithPlayerList from '@/components/MapWithPlayerList.vue'
import MatchStatus from '@/components/server/status/MatchStatus.vue'
import Rules from '@/components/server/Rules.vue'
import { getMatchDetail, getServerDetails } from '@/services/serversApi'
import {useRouter} from 'vue-router'
import type {Match as MatchModel} from '@/model/Match'
import type {TeamMatch as TeamMatchModel} from '@/model/TeamMatch'
import MapWithTeamsList from '@/components/MapWithTeamList.vue'
import {parseApiMatch} from '@/helpers/match'
import {useRoute} from 'vue-router'
import ProgressGraph from '@/components/server/match/ProgressGraph.vue'
import ModMode from '@/components/ModMode.vue'
import type { PagedResult } from '@/model/PagedResult'
import type {Match} from '@/model/Match'
import type { TeamMatch } from '@/model/TeamMatch'
import {getModInfo} from '@/helpers/mod'
import type { ServerStatus } from '@/model/ServerStatus'
import ServerTypeIcon from '@/components/ServerTypeIcon.vue'

const fullDateTime = 'LLL dd, yyyy h:mmbb'
const time = 'h:mmbb'

type LoadingState =  'Loading' | 'Idle' | 'NotFound'
type Props = {
  matchId: number
}
const model = reactive<{
  server: (ServerStatus | null),
  match: (Match | TeamMatch | null),
  state: LoadingState
}>({
  server: null,
  match: null,
  state: 'Loading'
})
const route = useRoute()

const router = useRouter()

const props = defineProps<Props>()

const startDate =  computed(() => new Date(model.match.matchStart))
const fullMatchDate = computed(() => format(startDate.value, fullDateTime))
const matchTimeAgo = computed(() => formatDistanceStrict(startDate.value, new Date(), {
  addSuffix: true
}))
const matchTime = computed(() => format(startDate.value, time))
const matchDuration = computed(() => differenceInSeconds(new Date(model.match.matchEnd), new Date(model.match.matchStart)))
const matchMonth = computed(() => format(startDate.value, "LLL"))
const matchDay = computed(() => format(startDate.value, "d"))
const isTeam = computed(() => 'matchType' in model.match)
const detail = computed(() => {
  if (isTeam.value) {
    return model.match.matchType === 'CTF' ? CTF : TDM
  }
  return FFA
})
const teamSize = computed(() => isTeam.value ? model.match.teams.size : '')
const matchType = computed(() => isTeam.value ? model.match.matchType : '')
const title = computed(() => {
  if(isTeam.value) {
    return model.match.teams.teams.reduce<string>((aggr, team) => {
      if (aggr) {
        aggr += ' vs '
      }
      return aggr += team.name
    },'')
  } else {
    const modInfo = getModInfo(model.match.mod, model.match.mode)
    return modInfo.full
  }
})

onMounted(() =>{
  model.state = 'Loading'
  return getMatchDetail(props.matchId)
    .then(match => {
      model.match = parseApiMatch(match)
      return getServerDetails(match.serverId)
        .then(({ status }) => {
          model.server = status as ServerStatus
          model.state = 'Idle'
        })
    })
    
})
</script>

<style lang="scss" scoped>

.header {
  display: grid;
  .summary {
    grid-area: summary;
    .details {
      display: flex;
      align-items: center;
      gap: .5rem;
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
.stuff {
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  padding-top: 68%;
}
.match-type, .match-size {
  display: none;
}
.date {
  grid-area: big-date;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  grid-area: title;
  padding: 0 .5rem;
}
.detail {
  grid-area: detail;
}
.graphics {
  display: none;
  grid-area: map;
  .map-image {
    position: relative;

    .map-text {
      padding: 4px;
      text-shadow: 2px 2px rgba(0,0,0,.9);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}

.match {
  display: grid;
  align-items: flex-start;
  grid-template-rows: 3rem auto;
  flex-wrap: wrap;
  margin-top: .5rem;
  h3 {
    margin:0;
  }

  .progress {
    grid-area: progress;
    width: 100%;
  }
  grid-template-areas: 
    "big-date title"
    "detail detail"
    "progress progress";
  grid-template-columns: 3rem auto;


  @media only screen and (min-width: $phone-breakpoint)  {
    .match-type {
      margin-top: .5rem;
    }
    .progress {
      width: 475px;
      margin: 0;
    } 
    .detail {
      padding: 0 .5rem;
    }
    .match-type, .match-size {
      display: block;
    }
  
    grid-template-areas: 
      "big-date title"
      "big-date detail"
      "big-date progress";
    grid-template-columns: 3rem auto;
  }
  @media only screen and (min-width: $tablet-breakpoint)  {
    .graphics {
      display: block;
    }

    grid-template-areas: 
      "big-date title map"
      "big-date detail map"
      "big-date detail progress";
    grid-template-columns: 3rem auto 475px;
  }
}
.date { 
  
  font-weight: bold;
  .date-day {
    font-size: 1.5rem;
    @media only screen and (min-width: $phone-breakpoint)  {
      font-size: 2rem;
    }
    line-height: 1;
  }
  padding: 0 .5rem;
  border-right: 1px solid $grey-2;
  .toggle-expand {
    font-size: .7rem;
    font-weight: normal;
  }
}
</style>