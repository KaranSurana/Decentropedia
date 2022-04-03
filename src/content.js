var globalArr = []
App = {
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
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
  
    render: async () => {
      await App.renderTasks()
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const wikiCount = await App.Wikipedia.wikiCount();
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const product = urlParams.get('topic')
      var header=product.replace("_"," ");
      var bool = true;
      for (var i = 1; i <= wikiCount; i++) {
        const task = await App.Wikipedia.wikiMap(i)
        if(header==task[1]){
          bool=false;
          document.getElementsByClassName("heading")[0].innerText = task[1];
          document.getElementsByClassName("content")[0].innerHTML = task[2];
          document.getElementsByClassName("image")[0].src = task[3];
          document.getElementById("suggestions").innerHTML = '';
        }
      }
      if(bool){
        const task = await App.Wikipedia.wikiMap(1)
        document.getElementsByClassName("heading")[0].innerText = task[1];
        document.getElementsByClassName("content")[0].innerHTML = task[2];
        document.getElementsByClassName("image")[0].src = task[3];
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
  function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
function imagepreview() {
    console.log(document.getElementById("imagevalue").value);
    document.getElementById("imagePreview").style.display = "block";
    document.getElementById("imagePreview").src = document.getElementById("imagevalue").value;
}
document.getElementById("contentt").addEventListener('keydown', function (e) {
  if(e.key=="Enter"){
      document.getElementById("contentt").value=document.getElementById("contentt").value+"<br>"
  }
  if(e.key=="Tab"){
      
      if(document.getElementById("contentt").value.slice(-2)=="h1"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h1></h1>"
      }
      if(document.getElementById("contentt").value.slice(-2)=="h2"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h2></h2>"
      }
      if(document.getElementById("contentt").value.slice(-2)=="h3"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h3></h3>"
      }
      if(document.getElementById("contentt").value.slice(-2)=="h4"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h4></h4>"
      }
      if(document.getElementById("contentt").value.slice(-2)=="h5"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h5></h5>"
      }
      if(document.getElementById("contentt").value.slice(-2)=="h6"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-2)+"<h6></h6>"
      }
      if(document.getElementById("contentt").value.slice(-3)=="img"){
          document.getElementById("contentt").value=document.getElementById("contentt").value.slice(0,-3)+'<img src="">';
      }
  }
}, false);

function previewContent(){
  if(document.getElementById("contentt").value==""){
      return;
  }
  var div = document.createElement("DIV");
  div.classList.add("previewContent");
  document.body.appendChild(div) 
  div.innerHTML=document.getElementById("contentt").value;
  var div2 = document.createElement("DIV");
  div2.innerText='Close Preview';
  div2.classList.add("closePreview");
  div.appendChild(div2);
  div2.addEventListener('click',function(){
      $( ".previewContent" ).remove();
  })
}