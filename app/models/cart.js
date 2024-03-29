module.exports=function(oldCart){
  this.items=oldCart.items || {}; //At initial item oldcart will be empty java object so for that we using boolean or.
  this.totalQty=oldCart.totalQty || 0;
  this.totalPrice=oldCart.totalPrice||0;

  this.add=function(item,id){
    var storedItem=this.items[id];
    if(!storedItem){
      storedItem=this.items[id]={item: item,qty:0,price:0};
    }
    storedItem.qty++;
    storedItem.price=storedItem.item.price*storedItem.qty;
    this.totalQty++;
    this.totalPrice+=storedItem.item.price;
  }

  // Convert json object to simple array.
  this.generateArray=function(){
    var arr=[];
    for(var id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }
}
