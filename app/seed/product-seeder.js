var Product=require('../models/product');

var mongoose=require('mongoose');

mongoose.connect("mongodb://localhost:27017/shopping",{useNewUrlParser:true});

var products=[new Product({
    imagePath: "https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png",
    title: "Gothics Cover Game",
    description: "Awesome Game Please play it!!!",
    price: 15
  }),
  
  new Product({
      imagePath: "https://upload.wikimedia.org/wikipedia/en/9/91/WoW_Box_Art1.jpg",
      title: "Word of Warcraft Video Game",
      description: "Awesome Game but of course it was better in vanilla",
      price: 35
    }),
    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/4/41/Codbox.jpg",
        title: "Call Of Video Data Game",
        description: "its okay i guess",
        price: 10
      }),
  new Product({
      imagePath: "https://upload.wikimedia.org/wikipedia/en/7/74/Minecraft_city_hall.png",
      title: "Mine Craft Videe Game",
      description: "Hey Hey Awesome game ",
      price: 25
    }),
    new Product({
        imagePath: "https://upload.wikimedia.org/wikipedia/en/b/bb/Dark_souls_3_cover_art.jpg",
        title: "Dark Soul 3 video game",
        description: "Must buy",
        price: 50
    })];

var done=0;
for(var i=0;i<products.length;i++){
  products[i].save(function(err,result){
    // if(err)
    // throw err;
    done++;
    if(done==products.length){
      exit();
    }
  })
}
function exit(){
  mongoose.disconnect();
}
