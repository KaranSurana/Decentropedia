var globalArr = []
App = {
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      web3.eth.defaultAccount = web3.eth.accounts[0]
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const wikipedia = await $.getJSON('Wikipedia.json')
      App.contracts.Wikipedia = TruffleContract(wikipedia)
      App.contracts.Wikipedia.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.Wikipedia = await App.contracts.Wikipedia.deployed()
      const wikiCount = await App.Wikipedia.wikiCount();
      for (var i = 1; i <= wikiCount; i++) {
        const task = await App.Wikipedia.wikiMap(i)
        
        globalArr.push(task[1]);

      }
      
    },
  

  
  
    createTask: async () => {
      
      const header = $('#header').val()
      const contentt = $('#contentt').val()
      const imageValue = $('#imagevalue').val()
      await App.Wikipedia.createWiki(header,contentt,imageValue)
      window.location.reload()
    },
  
    getValues: async () => {
      document.getElementById("suggestions").innerHTML = '';
      globalArr.forEach(async (element) =>  {
          if (element.toLowerCase().includes(document.getElementById("searchbar").value.toLowerCase())) {
              let p = document.createElement("p");
              var id=element;
              
              p.setAttribute("id", id.replace(" ", "_"));
              p.addEventListener("click",function(){
                window.location.href="content.html?topic="+id.replace(" ", "_");
              })
              p.innerText=element;
              var itag = $('<i class="fas fa-external-link-alt"></i>');
              itag.attr("id", id.replace(" ", "_"));
              $(itag).on('click',function(){
                window.location.href="content.html?topic="+id.replace(" ", "_");
              });
              var div = $('<div></div>');
              $(div).append(p)
              $(div).append(itag)
              
              $("#suggestions").append(div)
              
          }
      });
      if(document.getElementById("searchbar").value==""){
          document.getElementById("suggestions").innerHTML = '';
      }
  }
    
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })

  
  var buttons = document.querySelectorAll('.js-animate');

  for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', toggleButton, false);
  }
  
  function toggleButton (e) {
      var target = e.target;
      var parent = target.parentNode;
  
      if (parent.classList.contains('is-animating')) {
          target.innerHTML = 'Animate!';
          parent.classList.remove('is-animating');
      } else {
          target.innerHTML = 'Reset';
          parent.classList.add('is-animating');
      }
  }

  function elementInViewport2(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;
    top+=height
    while(el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }
  
    return (
      top < (window.pageYOffset + window.innerHeight) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
    );
  }
 var onlyonce = true;
 var onlyonce2 = true;
 var onlyonce3 = true;
 var onlyonce4 = true;
 var onlyonce5 = true;
 var onlyonce6 = true;

document.addEventListener("scroll",function(){
  var element=document.getElementsByClassName("space__comet")[0];
  var element2=document.getElementsByClassName("space__rocket")[0];
  var element3=document.getElementsByClassName("space__planet")[0];
  var element5=document.getElementsByClassName("space__satellite")[0];
  if(elementInViewport2(element) && onlyonce){
    buttons[0].click();
    onlyonce=false;
  }
  if(elementInViewport2(element2) && onlyonce2){
    buttons[1].click();
    onlyonce2=false;
  }
  if(elementInViewport2(element3) && onlyonce3){
    buttons[2].click();
    onlyonce3=false;
  }
  if(elementInViewport2(element5) && onlyonce5){
    console.log("hello");
    buttons[3].click();
    onlyonce5=false;
  }
})
document.getElementById("second-heading").classList.add("typing-demo1");

