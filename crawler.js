//by Evan
import {updateMask} from "./scene.js";

//setup vars...
var img_posts = [];
var c_image = 1;
var txt_posts = [];
var c_text = [];
//
const subreddit1 = 'reddit.com/r/earthporn';
const subreddit2 = 'reddit.com/r/astralprojection';

//use cors anywhere
//scraper functions
//
var cors_api_url = 'https://limitless-wildwood-84731.herokuapp.com/';
//
//save reddit page to json object
function corsReddit(url, isText, saveto) {
    var x = new XMLHttpRequest();
    x.open('GET', cors_api_url + url);
    if (!isText) x.responseType = 'blob';

    x.onload = x.onerror = function() {
      console.log(x.status);
      if (isText) saveto(x.responseText);
      else saveto(x.response);
    };
    x.send();
  }
//
//
//load SR1 - earth porn images
corsReddit(subreddit1+".json", true, function(r){
  var a = JSON.parse(r);
  console.log(a);
  img_posts = a.data.children;
  console.log(img_posts[1].data.url_overridden_by_dest);
  updateMaskFromPost(img_posts[1]);
});

function updateMaskFromPost(p){
  //check if media attached
  var ll = p.data.url_overridden_by_dest;
  if(ll != null){
      $("#img-label").text("loading...");
    //cors request image and update mask
    corsReddit(ll, false, function(r){
      $("#img-label").text(p.data.title);
      console.log(r);
      updateMask(r);
    });
  }
}

$("body").on("click", function(){
  c_image += 1;
  updateMaskFromPost(img_posts[c_image]);
  $("#about_txt").css("display", "none");
});

//about page
$("#about").on("click", function(e){
  $("#about_txt").css("display", "block");
  e.stopPropagation();
});


//
//
//load SR2 - astral projection
corsReddit(subreddit2+".json", true, function(r){
  var b = JSON.parse(r);
  console.log(b);
  txt_posts = b.data.children;
  getText();
  console.log(txt_posts[2].title);
});

function getText(){
  c_text = [];
  txt_posts.forEach(function(val){

    val.data.selftext.split(/[.|,|\n|?]+/).forEach(
      function(x){
          c_text.push(x);
    });

  });
  setInterval(function (){
    spawnText(c_text[getRandomInt(2, c_text.length-1)]);

  }
  , 1000);
}

var f_div = $("body");
function spawnText(a){
  var div = document.createElement("div");
  div.classList.add('float');
  div.innerText = a;
  var x = (window.innerWidth-150);
  var y = Math.random()*(window.innerHeight-100);
  $(div).css({top: String(y)+"px", left: String(x)+"px", maxWidth:"300px", maxHeight:"100px"});
  f_div.append(div);
  $(div).animate(
    {left:("-="+String(window.innerWidth-150))},
    10000, function(){
      div.remove();
    });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
