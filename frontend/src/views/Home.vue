<template>
  <v-data-table-virtual
    :headers="headers"
    :items="virtualBoats"
    height="400"
    item-value="name"
  ></v-data-table-virtual>
</template>

<script>
  export default {
    data () {
      return {
        headers: [
          { title: 'Boat Type', align: 'start', key: 'name' },
          { title: 'Speed (knots)', align: 'end', key: 'speed' },
          { title: 'Length (m)', align: 'end', key: 'length' },
          { title: 'Price ($)', align: 'end', key: 'price' },
          { title: 'Year', align: 'end', key: 'year' },
        ],
        boats: [
          {
            name: 'Speedster',
            speed: 35,
            length: 22,
            price: 300000,
            year: 2021,
          },
          {
            name: 'OceanMaster',
            speed: 25,
            length: 35,
            price: 500000,
            year: 2020,
          },
          {
            name: 'Voyager',
            speed: 20,
            length: 45,
            price: 700000,
            year: 2019,
          },
          {
            name: 'WaveRunner',
            speed: 40,
            length: 19,
            price: 250000,
            year: 2022,
          },
          {
            name: 'SeaBreeze',
            speed: 28,
            length: 31,
            price: 450000,
            year: 2018,
          },
          {
            name: 'HarborGuard',
            speed: 18,
            length: 50,
            price: 800000,
            year: 2017,
          },
          {
            name: 'SlickFin',
            speed: 33,
            length: 24,
            price: 350000,
            year: 2021,
          },
          {
            name: 'StormBreaker',
            speed: 22,
            length: 38,
            price: 600000,
            year: 2020,
          },
          {
            name: 'WindSail',
            speed: 15,
            length: 55,
            price: 900000,
            year: 2019,
          },
          {
            name: 'FastTide',
            speed: 37,
            length: 20,
            price: 280000,
            year: 2022,
          },
        ],
      }
    },

    computed: {
      virtualBoats () {
        return [...Array(10000).keys()].map(i => {
          const boat = { ...this.boats[i % this.boats.length] }
          boat.name = `${boat.name} #${i}`
          return boat
        })
      },
    },
  }
</script>