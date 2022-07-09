import axios from "axios";


function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  // if (hours   < 10) {hours   = hours;}
  // if (minutes < 10) {minutes = minutes;}
  // if (seconds < 10) {seconds = +seconds;}
  return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}

function timeForToday(value) {
  const today = new Date();
  const timeValue = new Date(value);

  const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
  if (betweenTime < 1) return '방금전';
  if (betweenTime < 60) {
      return `${betweenTime} 분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간 전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
      return `${betweenTimeDay} 일 전`;
  }

  return `${Math.floor(betweenTimeDay / 365)} 년 전`;
}


function betweenTime(value) {
  const today = new Date();
  const timeValue = new Date(value);

  return Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
}

function createIconUrl (iconUrl) {
  
}

function addArray () {
  return this.reduce((acc, cur) => acc + cur)
}

function meanArray (arr) {
  return arr.reduce((acc, cur) => acc + Number(cur)) / arr.length
}

function swapArray10 (arr) {
  const [one, two] = [arr.slice(0, 5), arr.slice(5, 10)]
  return [...two, ...one]
}

function createRandomColor () {
  return "#" + Math.round(Math.random() * 0xffffff).toString(16)
}

function createChampionIconUrl (url, cdn, name) {
  return `${url}/${cdn}/img/champion/${name}.png`
}

function createItemIconUrl (url, cdn, id) {
  return `${url}/${cdn}/img/item/${id}.png`
}

async function createSpellIconUrl (url, cdn, championName) {  
  const reqUrl = `${url}/${cdn}/data/ko_KR/champion/${championName}.json`
  const res = await axios.get(reqUrl)
  const championData = res.data.data

  return championData[championName].spells.map(spell => `${url}/${cdn}/img/spell/${spell.id}.png`)
}

function convertTimestampToMin(timestamp) {
  return (timestamp / 60000).toFixed()
}

export default {
  convertHMS,
  timeForToday,
  betweenTime,
  addArray,
  meanArray,
  swapArray10,
  createRandomColor,

  createChampionIconUrl,
  createItemIconUrl,
  createSpellIconUrl,
  convertTimestampToMin
}