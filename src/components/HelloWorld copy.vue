<script setup>
// create a 2d canvas swarm plots of emojis

// import merged_data.json
import { onMounted } from '@vue/runtime-core'
import merged_data from '../../merged_data.json'
import { ref , watch, computed} from 'vue'

// all merged_data Date to yyyy mm dd
const merged_data_date = merged_data.map((d) => {
  const date = new Date(d["Date"])
  return {
    ...d,
    date: `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`,
  }
})








// convert merged_data_date "Precipitation amount (mm)" to corresponding emojis
const merged_data_emoji = merged_data_date.map((d) => {
  const emoji = d['Precipitation amount (mm)'] > 0 ? '🌧️' : '☀️'
  return {
    ...d,
    emoji,
  }
})

console.log(merged_data_emoji[0]);


// create reactive variables from merged_data keys

// ref selected date
const data_index = ref(0)
const selectedData = computed(() => merged_data_date[data_index.value])
const drawInterval = ref(0)

console.log(merged_data_date[0])
const data = merged_data_date[0]
const height_adjust = 200
// create a canvas
const canvas = document.createElement("canvas")
canvas.width = 800
canvas.height = 1000
canvas.style.transform = 'rotateY(-180deg)'

document.body.appendChild(canvas)
const roadsToFollow = [
  { x: 1000, y: height_adjust+300 },
  { x: 1200, y: height_adjust+350 },
  { x: 900, y: height_adjust+500 },
  { x: 1400, y: height_adjust+550 },
  { x: 950, y: height_adjust+790 },
]

const drawCity = (context, data_to_draw) => {
  //draw sky box
  const rains = data_to_draw['Precipitation amount (mm)'] > 0
  context.fillStyle = rains > 0 ? 'lightgrey' : 'lightblue'
  context.fillRect(0, 0, 800, 600)

  //draw water
  const snows = data_to_draw['Snow depth (cm)'] > 0
  context.fillStyle = rains > 0 || snows ? '#b1effe' : '#0AA3CF'
  context.fillRect(0, 200, 800, 70)



  //draw road with gradyally changing color
  context.fillStyle = rains > 0 ? '#555555' : 'grey'
  context.fillRect(0, 100+height_adjust, 800, 1000)
  const gradient = [2, 2, 2, 6, 8, 10 ,10, 10, 7, 5, 4, 2, 2, 2]
  // gradyally fade grass color based on month
  const month = new Date(data_to_draw['Date']).getMonth()
  const Day = new Date(data_to_draw['Date']).getDay()
  let grass_color;
  if(snows){
    grass_color = 'white'
  }
  else {
    // if gradient -1 then grass color is brown
    if(gradient[month] == -1){
      grass_color = '#8c5e2c'
    }
    else{
      grass_color = `rgba(25, ${255*((gradient[month])/10)}, 25, 1)`
    }
    
  }
  context.fillStyle = grass_color
  context.fillRect(0, 50+height_adjust, 800, 120)
  
  
  if (!rains) {
    context.font = "120px Arial"
    context.fillText("☀️", -30 , 50)
    // add few cloud emojis
    context.font = "80px Arial"
    context.fillText("☁️", 450 , 50)
    context.fillText("☁️", 170 , 40)
    context.fillText("☁️", 500 , 20)
    context.fillText("☁️", 550 , 60)
    context.fillText("☁️", 700 , 80)
  } else {

    // add few cloud emojis
    context.font = "80px Arial"
    context.fillText("☁️", 150 , 50)
    context.fillText("☁️", 50 , 40)
    context.fillText("☁️", 500 , 20)
    context.fillText("☁️", 550 , 60)
    context.fillText("☁️", 700 , 80)
  }
 
  context.fillStyle = 'rgba(255, 255, 255, 1)'
  // draw road lines
  context.fillStyle = "white"
  context.fillRect(0, 300+height_adjust, 800, 5)

  const drawCyclingPaht = (context, y, height, color) => {
  

    // draw cycling path
    context.fillStyle = "white"
    context.fillRect(0, y, 800, 2)
    context.fillStyle = "#c25e6c"
    context.fillRect(0, y+2, 800, height)
    context.fillStyle = "white"
    context.fillRect(0, y+1+height, 800,4)


    // draw a white dotted line 
    context.setLineDash([10, 10])
    // white stroke
    context.strokeStyle = "white"
    context.beginPath()
    context.moveTo(0, y + height*2/5)
    context.lineTo(800, y + height*2/5)
    context.stroke()
    context.setLineDash([])
  }
   // if snows, draw transparent white over all ground
   if(snows){
    context.fillStyle = 'rgba(255, 255, 255, 0.6)'
    context.fillRect(0, 300+height_adjust, 800, 1000)
    // add row of snows on the ground
    context.font = "20px Arial"
    context.fillStyle = 'rgba(255, 255, 255, 0.8)'
    // data_to_draw['Snow depth (cm)'] interval 
    for (let i = 0; i < 200; i++) {
      for (let j = 0; j < 200; j++) {
        context.fillText("❄️", i*12 , 320+height_adjust+j*12)
      }
      
    }
    context.fillStyle = 'rgba(255, 255, 255, 0.6)'
    context.fillRect(0, 300+height_adjust, 800, 1000)
  }

  context.fillStyle = 'rgba(255, 255, 255, 1)'



  drawCyclingPaht(context, 400+height_adjust, 200, "#c25e6c")


  //drawCyclingPaht(context, 550+height_adjust, 60, "#c25e6c")
  
  drawHousesAndTrees(context, data_to_draw)

  // // if autumn, draw yellow leaves on ground
  // if(month == 9 || month == 10){
  //   context.font = "10px Arial"
  //   context.fillStyle = 'rgba(255, 255, 0, 0.8)'
  //   // data_to_draw['Snow depth (cm)'] interval 
  //   for (let i = 0; i < 5; i++) {
  //     for (let j = 0; j < 5; j++) {
  //       context.fillText("🍂", i*100 , 320+height_adjust+j*50)
  //     }
      
  //   }
  // }
  

  

  // draw a white dotted line 
  context.setLineDash([10, 10])
  // white stroke
  context.strokeStyle = "white"
  context.beginPath()
  context.moveTo(0, 200+height_adjust)
  context.lineTo(800, 200+height_adjust)
  context.stroke()
  context.beginPath()
  context.moveTo(0, 250+height_adjust)
  context.lineTo(800, 250+height_adjust)
  context.stroke()
  context.setLineDash([])
  



  
 
  
}
const drawHousesAndTrees = (context, data_to_draw) => {
  const month = new Date(data_to_draw['Date']).getMonth()
  for (var i = 0; i < 1; i++) {
    // draw a tree
    context.font = "60px Arial"
    context.fillText("🏠",10 , 15+100+100*i+height_adjust-30)
    context.fillText("🏠", 80 , 100+100*i+height_adjust-40)
    context.fillText("🏠", 40 , 15+100+100*i+height_adjust-50)
    
    context.fillText("🏠",10 , 15+100+100*i+height_adjust)
    context.fillText("🏠", 80 , 100+100*i+height_adjust)
    context.fillText("🏠", 40 , 15+100+100*i+height_adjust)
    context.fillText("🏤", 500 , 100+100*i+height_adjust)
    context.font = "100px Arial"
    context.fillText("🏢", 400 , 100+100*i+height_adjust)
    context.fillText("🏬", 460 , 10+100+100*i+height_adjust)
    context.fillText("🏢", 420 , 20+100+100*i+height_adjust)
    context.fillText("🏦", 600 , 100+100*i+height_adjust)
    context.font = "140px Arial"
    context.fillText("🏛", 650 , 120+height_adjust)
    // flip text element
  }
  context.font = "30px Arial"
  // draw a tree
  const flowers = ["🪨", "🌷", "🌻", "🥀" ]
  // get first element from array with 1-3, 4-6, 7-9, 10-12
  let flower = flowers[Math.floor(month/3)]
  if (data_to_draw['Snow depth (cm)'] > 0){
    flower = "⛄️"
  }
  // if halloween
  if (month == 9){
    flower = "🎃"
  }
  //if christmas
  const day = new Date(data_to_draw['Date']).getDate()
  if (month == 11  && day > 20){
    flower = "🎁"
  }
  context.fillText(flower, 55, 140+height_adjust)
  context.fillText(flower, 35, 145+height_adjust)
  context.fillText(flower, 60, 155+height_adjust)
  
  context.font = "60px Arial"
  // if christmas tree
const tree = month == 11  && day > 15 ? "🎄" : "🌲"
  
  context.fillText(tree, 210, 100+height_adjust)
  context.fillText(tree, 170, 110+height_adjust)
  context.fillText(tree, 140, 110+height_adjust)
  context.fillText(tree, 250, 110+height_adjust)
  context.fillText(tree, 160, 120+height_adjust)
  context.fillText(tree, 110, 120+height_adjust)
  context.fillText(tree, 180, 120+height_adjust)
  context.fillText(tree, 120, 130+height_adjust)
  context.fillText(tree, 130, 140+height_adjust)
  context.fillText(tree, 150, 140+height_adjust)
  context.fillText(tree, 145, 150+height_adjust)
}

const cyclists = ref([])
const top_cars = ref([])
const bottom_cars = ref([])

//add listener for keys to change date
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    data_index.value = parseInt(data_index.value) + 1
    if (data_index.value > merged_data_date.length - 1) {
      data_index.value = 0
    }
  }
  if (e.key === "ArrowLeft") {
    data_index.value = parseInt(data_index.value) - 1
    if (data_index.value < 0) {
      data_index.value = merged_data_date.length - 1
    }
  }
  if (e.key === "ArrowDown"){
    data_index.value = parseInt(data_index.value) - 10
  }
  if (e.key === "ArrowUp"){
    data_index.value = parseInt(data_index.value) + 10
  }


  // if (e.key === "ArrowDown") decrement by 30



})

// place cars on roads
const arrayOfCarEmojis = [
  {emoji: "🚗", size: 40*2},
  {emoji: "🚙", size: 40*2},
  {emoji: "🛵", size: 30 *2},
  {emoji: "🚚", size: 60*2},
  {emoji: "🚕", size: 40*2},
  {emoji: "🚓", size: 40*2},
  {emoji: "🚒", size: 60*2},
  {emoji: "🚐", size: 50*2},
  {emoji: "🚛", size: 60*2},
  {emoji: "🚜", size: 60*2},
]
  for (var i = 0; i < 15; i++) {
    const randomCar = arrayOfCarEmojis[Math.floor(Math.random() * arrayOfCarEmojis.length)]
    top_cars.value.push({
      x: i + Math.random() * 800,
      y: height_adjust+190 + Math.random() * 100,
      dx: 0.1 + (Math.random()*0.2),
      type: randomCar.emoji,
      font: randomCar.size*0.7+"px Arial"
    })
  }

const boats = ref([])

const arrayOfBoatEmojis = [
  {emoji: "🚤", size: 15, speed: 0.2},
  {emoji: "🛥️", size: 20, speed: 0.1},
  {emoji: "🚣🏻‍♀️", size: 15, speed: 0.1},

]

for (let i = 0; i < 3; i++) {
  const randomBoat = arrayOfBoatEmojis[Math.floor(Math.random() * arrayOfBoatEmojis.length)]
  boats.value.push({
    x: Math.random() * 800,
    y: 220+Math.random() * 30,
    dx: randomBoat.speed,
    dy: 0,
    size: randomBoat.size,
    emoji: randomBoat.emoji,
  })
}

const drawCanvas = (data_to_draw) => {
  //ref canvas
  const canvas = document.querySelector("canvas")
  // get the context
  var ctx = canvas.getContext("2d")
  // for i in range 0 to data.["Total Cyclists"]
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawCity(ctx, data_to_draw)
  // create cyclists array of objects with position
  for (let i = 0; i < data_to_draw["Total Cyclists"]/30; i++) {
    const roadToFollow =  Math.floor(Math.random() * 4) + 1
    const cyclistEmojis = ["🚴🏿‍♀️", "🚴🏿‍♂️", "🚴🏻‍♀️", "🚴🏻‍♂️","🚴🏻‍♂️","🚴🏻‍♂️","🚴🏻‍♂️","🚴🏻‍♂️","🚴🏻‍♂️","🚴🏻‍♂️", "🚴🏼‍♀️", "🚴🏻","🚴🏼","🚴🏽","🚴🏽","🚴🏽","🚴🏾","🚴🏼","🚴🏻‍♀️","🚴🏻‍♀️","🚴🏻‍♀️","🚴🏻‍♀️","🚴🏻‍♀️","🚴‍♀️","🚴‍♀️","🚴‍♀️", "🚴🏼‍♂️", "🚴🏽‍♀️", "🚴🏽‍♂️", "🚴🏾‍♀️", "🚴🏾‍♂️"]
    cyclists.value.push({
      emoji: cyclistEmojis[Math.floor(Math.random() * cyclistEmojis.length)],
      // x random from 900 to 2000 + buffer basde on cyclist count
      x: 900 + Math.random() * (1000 + (data_to_draw["Total Cyclists"]/20)),
      //y from 300 to 600
      y: height_adjust+300 + Math.random() * 500,
      // dx dy from left to right
      // follow roads 1,2,3,4
      dx: (Math.random() + 1)+3,
      dy: 0,// Math.random() * 0.1,
      size: Math.random() * 5 + 1,
      date: data_to_draw["Date"],
    })
    cyclists.value = cyclists.value.sort((a, b) => a.y - b.y)
  }

  // draw a tree
  // from 1 to 40
  

  // add rain drops per Precipitation amount (mm) to array
  const rain = ref([])
  const month = new Date(data_to_draw['Date']).getMonth()
  console.log(month);
  if ([8,9].includes(month)){
    console.log("add leaves")
    // for 50
    for (let i = 0; i < 5; i++) {
      // add a rain drop
      rain.value.push({
        x: Math.random(+height_adjust) * 800,
        y: 400+Math.random() * 300+height_adjust,
        // random from -0.3 to 0.3
        dx: -(0.7 + Math.random() * 1 - 0.5),
        dy: 0,
        size: Math.random() * 1 + 2,
        emoji: month === 8 ? "🍂" : Math.random() > 0.5 ? "🍂" : "🍁",
        is_leaf:true
    }) 
    }
    for (let i = 0; i < 15; i++) {
      // add a rain drop
      rain.value.push({
        x: Math.random(+height_adjust) * 800,
        y: 400+Math.random() * 300+height_adjust,
        // random from -0.3 to 0.3
        dx: -(0.7 + Math.random() * 1 - 0.5),
        dy: 0,
        size: Math.random() * 1 + 2,
        emoji: month === 8 ? "🍂" : Math.random() > 0.5 ? "🍂" : "🍁"
    }) 
    }
  }
  const is_below_zero = data_to_draw["Air temperature (degC)"] < 0
  console.log("RAIN", data_to_draw["Precipitation amount (mm)"]);
  for (let i = 0; i < data_to_draw["Precipitation amount (mm)"]*100; i++) {
    // add random x and y
    rain.value.push({
      x: Math.random() * 800,
      y: height_adjust+Math.random() * 600,
      dx: Math.random() * 1 - 0.5,
      dy: is_below_zero ? 1 : 10 ,
      size: Math.random() * 5 + 1,
      emoji:  is_below_zero ? "❄️" : "💧",
      is_snow: is_below_zero
    })
  }




  // move the cyclists in interval
  drawInterval.value = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCity(ctx, data_to_draw)

    // draw boats
    if (data_to_draw['Snow depth (cm)'] == -1){
      boats.value.forEach((boat) => {
        ctx.font = boat.size+"px Arial"
        
        ctx.fillText(boat.emoji, boat.x, boat.y)
  
        boat.x -= boat.dx
        if (boat.x > 800) {
          boat.x = 0
        }
      })

    }
    drawHousesAndTrees(ctx, data_to_draw)

    top_cars.value.sort((a, b) => a.y - b.y).forEach((car) => {
      ctx.font = car.font
      ctx.fillText(car.type, car.x, car.y)
      car.x -= car.dx
      if (car.x < -100) {
        car.x = canvas.width + 100
      }
    })

    rain.value.filter(n => n.is_leaf).forEach((drop) => {
      // add opacity
      ctx.fillStyle = "rgba(0,0,0,0.7)"
      ctx.beginPath()
      ctx.font = drop.is_leaf ? 50/Math.floor(drop.size)+"px Arial" : 20/Math.floor(drop.size)+"px Arial"
      ctx.fillText(drop.emoji, drop.x, drop.y)
      drop.x += drop.dx
      drop.y += drop.dy
      // flip dx on 50% chance
      if (Math.random() > 0.5 && drop.is_leaf) {
        drop.dx = drop.dx*1.1
      } 
      // add rotation on 50% chance
      if (Math.random() > 0.5 && drop.is_leaf) {
        drop.dy = drop.dy*1.1
      }
      
      else {
        drop.dx = drop.dx * 0.9
      }
      // reset bigger drops later
      
      if (!drop.is_leaf && drop.y > (canvas.height/2) && Math.random() > (drop.is_snow ? 0.99 : 0.90)){
        drop.y = 0

      }
      if (!drop.is_leaf && drop.y > canvas.height){
        drop.y = 0
      }
      if (drop.is_leaf && drop.x > canvas.width){
        drop.x = 0
      }
    })
    ctx.fillStyle = "rgba(0,0,0,1)"
    cyclists.value.forEach(cyclist => {
      // draw a circle at a random location
      ctx.beginPath()
      // draw a bike emoji that moves randomly
      // font size = cyclist y position floored to nearest 50
      //ctx.font = cyclist.size+"px Arial";
      // font size from smalle the smalelr y position
      ctx.font = (10 + Math.floor(cyclist.y/50)*7)+"px Arial"
      ctx.fillText(cyclist.emoji, cyclist.x, cyclist.y)
      
      
      // if emoji == 🌧️ draw an umbrella on top of cyclist
      if (data_to_draw["Precipitation amount (mm)"] > 0) {
        ctx.font = "40px Arial"
        //ctx.fillText("☂️", cyclist.x, cyclist.y-50)
      }
      // move the cyclist from left to right
      cyclist.x -= cyclist.dx
      cyclist.y += cyclist.dy
      // check if the cyclist is out of bounds and teleport to opposite side
      
      if (cyclist.y > canvas.height || cyclist.y < 300) {
        cyclist.dy = -cyclist.dy
      }
      if ( cyclist.x < -200) {
        // remove cyclist from array
        cyclists.value = cyclists.value.filter(c => c.x != cyclist.x)
      }
    })

    rain.value.filter(n => !n.is_leaf).forEach(drop => {
      ctx.beginPath()
      ctx.font = drop.is_leaf ? 50/Math.floor(drop.size)+"px Arial" : 20/Math.floor(drop.size)+"px Arial"
      ctx.fillText(drop.emoji, drop.x, drop.y)
      drop.x += drop.dx
      drop.y += drop.dy
      // flip dx on 50% chance
      if (Math.random() > 0.5 && drop.is_leaf) {
        drop.dx = drop.dx*1.1
      } 
      else {
        drop.dx = drop.dx * 0.9
      }
      // reset bigger drops later
      
      if (!drop.is_leaf && drop.y > (canvas.height/2) && Math.random() > (drop.is_snow ? 0.99 : 0.90)){
        drop.y = 0

      }
      if (!drop.is_leaf && drop.y > canvas.height){
        drop.y = 0
      }
      if (drop.is_leaf && drop.x > canvas.width){
        drop.x = 0
      }
      // if leaf, move right to left
      

    })
  }, 1000 / 60)
  
}

onMounted(() => {
  drawCanvas(selectedData.value)
  // increment data_index every 1000ms
  // setInterval(() => {
  //   data_index.value = (data_index.value + 1) % merged_data.length
  // }, 1000)
})

watch(data_index, (newIndex) => {
  console.log("NEW INDEX", newIndex)
  cyclists.value = []
  clearInterval(drawInterval.value)
  drawCanvas(merged_data[newIndex])
})
// if cyclists.value empty increment data
const cyclistLenght = computed(() => cyclists.value.length)
watch(cyclistLenght, (newCyclists) => {
  if (newCyclists == 0) {
    //console.log(data_index.value, (data_index.value + 1))
    data_index.value = (parseInt(data_index.value) + 1)
  }
})





</script>

<template>
  <div class="stats">
    <div class="greetings">
      <b style="font-size: 80px">Helsinki by Bike</b><br/>
    </div>
    🗓: {{ selectedData["date"] }} <br/>
    🚲: {{ selectedData['Total Cyclists'] }}<br/>
    <div>{{ selectedData['Precipitation amount (mm)'] > 0 ? (selectedData['Air temperature (degC)'] >= 0 ?  '🌧️: '+selectedData['Precipitation amount (mm)']+'mm' : '🌨: ' + selectedData['Precipitation amount (mm)']+'cm') : '🌤'}}</div>     
    <div>{{ selectedData['Snow depth (cm)'] < 0 ? '' : '❄️📏: ' +selectedData['Snow depth (cm)']+'cm' }}<br/></div>
    🌡: {{ selectedData['Air temperature (degC)'] }}'C <br/>
  
    <input type="range" v-model="data_index" :min="0" :max="merged_data.length - 1" style="width: 50vw" /> 
  </div>
  
  
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}
.range {
  position: absolute;
  bottom: 0;
  left: 0;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
.stats {
  position: relative;
  font-size: 100px;
  color: darkred;
}
</style>
