var img = new Image();
img.src = './images/SpectreCouleurs.jpg';
img.onload = function() {
  //console.log("onload");
  dessiner(this);
};

function dessiner(img) {
  //console.log("dessiner");
  var canevas = document.getElementById('canvas');
  var btnSeverite = document.getElementById('severite');
  var form = document.getElementById("daltoForm");
  var small = [...document.querySelectorAll('.small')]; //Creation d'un tableau avec toutes les minatures de la classe small
  var ctx = canevas.getContext('2d');
  canevas.width = 600;
  canevas.height = 300;
  ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canevas.width, canevas.height);
  img.style.display = 'none';
  var imageData = ctx.getImageData(0, 0, canevas.width, canevas.height);
  var imageData2 = ctx.getImageData(0, 0, canevas.width, canevas.height);
  var data = imageData.data;
  var data2 = imageData2.data;
  var redMult = 1.0;
  var greenMult = 1.0;
  var blueMult = 1.0;
  var canDraw = false;

  //console.log("fin variables");

  var allowDrawing = function(){
    canDraw = true;
  }

  var disableDrawing = function(){
    canDraw = false;
  }

  var colorBlind = function(separationX) {
    //console.log("colorBlind");
    if(canDraw){
      for (var i = 0; i < data.length; i += 4) {
        if(i%(img.width*4) >= 4*separationX){
          data2[i]     = redMult * data[i];     // rouge
          data2[i + 1] = greenMult * data[i + 1]; // vert
          data2[i + 2] = blueMult * data[i + 2]; // bleu
        }else{
            data2[i]     = data[i];     // rouge
            data2[i + 1] = data[i + 1]; // vert
            data2[i + 2] = data[i + 2]; // bleu
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  }

  var niveaudegris = function(separationX) {
    //console.log("niveaudegris");
    if(canDraw){
      for (var i = 0; i < data.length; i += 4) {
        if(i%(img.width*4) >= 4*separationX){
            var moy = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data2[i]     = moy; // rouge
            data2[i + 1] = moy; // vert
            data2[i + 2] = moy; // bleu
        }else{
            data2[i]     = data[i];     // rouge
            data2[i + 1] = data[i + 1]; // vert
            data2[i + 2] = data[i + 2]; // bleu
        }
      }
      ctx.putImageData(imageData2, 0, 0);
    }
  };

  var changeImage = function(evt){
    var imgSRC = "../images/" + evt.currentTarget.id + ".jpg";
    //var imgSRC = "../images/bonjour" + ".jpg";
    console.log("image source : " + imgSRC);
    img.src = imgSRC;
    switchMode();
  }

  var calculateSeparationX = function(evt = null){
    if(evt != null){
      return evt.clientX-canevas.getBoundingClientRect().left;
    }else{
      return canevas.width/2;
    }
  }

  var switchMode = function(evt){
    //console.log("switchMode");
    var daltoType = 0;
    var separationX = calculateSeparationX(evt);

    for (let i = 0; i < form.daltoType.length; i++) {
        if(form.daltoType[i].checked){
          daltoType = i;
        }
    }

    switch (daltoType) {
      case 0:
        //Protonomal
        redMult = 1.0 - btnSeverite.value/100;
        greenMult = 1.0;
        blueMult = 1.0;
        colorBlind(separationX);
        break;
      case 1:
        //Deuteranomal
        redMult = 1.0;
        greenMult = 1.0 - btnSeverite.value/100;
        blueMult = 1.0;
        colorBlind(separationX);
        break;
      case 2:
        //Tritanomal
        redMult = 1.0;
        greenMult = 1.0;
        blueMult = 1.0 - btnSeverite.value/100;
        colorBlind(separationX);
        break;
      case 3:
        //Protanopie
        redMult = 0;
        greenMult = 1.0;
        blueMult = 1.0;
        colorBlind(separationX);
        break;
      case 4:
        //Deuteranopie
        redMult = 1.0;
        greenMult = 0;
        blueMult = 1.0;
        colorBlind(separationX);
        break;
      case 5:
        //Tritanopie
        redMult = 1.0;
        greenMult = 1.0;
        blueMult = 0;
        colorBlind(separationX);
        break;
      case 6:
        //Achromatopsie
        redMult = 1.0;
        greenMult = 1.0;
        blueMult = 1.0;
        niveaudegris(separationX);
        break;
    
      default:
        //Aucun
        redMult = 1.0;
        greenMult = 1.0;
        blueMult = 1.0;
        colorBlind(separationX);
        break;
    }
  }

  var swtichModeDefault = function(){
    allowDrawing();
    switchMode(null);
    disableDrawing();
  }

  /*
  btnSlider.addEventListener('change', switchMode);
  btnSeverite.addEventListener('change', switchMode);
  form.addEventListener('change', switchMode);
  */
  form.addEventListener('change', swtichModeDefault);
  canevas.addEventListener('mousedown', allowDrawing);
  canevas.addEventListener('touchstart', allowDrawing);
  canevas.addEventListener('mousemove', switchMode);
  canevas.addEventListener('touchmove', switchMode);
  canevas.addEventListener('mouseup', disableDrawing);
  canevas.addEventListener('touchend', disableDrawing);
  
  for(let i = 0; i < small.length; ++i){
    small[i].addEventListener('click', changeImage);
  }
  
  //Initialisation à 50% de l'image
  allowDrawing();
  switchMode(null);
  disableDrawing();
}