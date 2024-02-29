<template lang="pug">
.credit-where-credit-is-due 
  h3 The Quake Server Browser 
  p Is a site created, maintained, and paid for by the quake community.
   | We want to encourage online play, competition, and fun. Contact us for suggestions or 
   | if you have a server you want added to the list
  h4 The games here 
  ul
    li 
      GameType(:gameId="0" size="Abbreviated") 
      div
        span.bright Net Quake
        span  - The original game released back in 1996. This represents the ports 
        | which remain true to the original game and do not modify networking or physics. 
        | Mostly popular with singleplayer and the mapping community.
    li 
      GameType(:gameId="1" size="Abbreviated") 
      div
        span.bright QuakeWorld
        span  - The multiplayer specific version of quake which was released with reworked network code to 
        | help high latency players in the days of dial up internet. This version of quake also alters some 
        | physics which result in faster gameplay and much easier "bunnyhopping".  This is the version
        | played by the competitive community.
    li 
      GameType(:gameId="5" size="Abbreviated" serverParams='{"Engine":"fte"}') 
      div
        span.bright Hybrid Server
        span  - A Hybrid Server is a server running FTE which allows players to connect using either NetQuake or QuakeWorld ports.
        | Some servers are also setup to allow Quake Enhanced to connect as well.
    li 
      GameType(:gameId="5" size="Abbreviated") 
      div 
        span.bright Quake Enhanced
        span  - The re-released version of quake by Bethesda, this port uses the modern Kex engine developed by Nightdive Studios which 
        | has modern features such as client prediction and voice chat. 
        | This version allows cross play between PC and Console players.  

  h4 The people who made this happen
  p
    span.bright infiniti 
    span for the ux design inspiration 
  p
    span.bright woods  
    span created all of the map thumbnails
  p
    span.bright efess  
    span site programming and hosting

  h4 Find us on Discord
  p Net Quake Community
    a(href="https://discord.quakeone.com/")  https://discord.quakeone.com/
  p Quake:Enhanced Community
    a(href="https://discord.gg/HWes2p9gXG")  https://discord.gg/HWes2p9gXG
  H4 For site specific questions
  p efess (joe) at 
    a(href="mailto:efessel@gmail.com") efessel@gmail.com
</template>
<script setup lang="ts">
import GameType from '@/components/GameType.vue'

</script>

<style lang="scss" >
.credit-where-credit-is-due {
  margin: 1rem;
  li {
    display: flex;
    gap: 20px;
    margin-top: 20px;
  }
  h4 {
    margin-top: 2rem;
  }
}
</style>