var TOKEN=""
var client_id="8b1405e54ac0484284dcf9813a6ffb65";
var redirect_uri= window.location.origin;
var scope="user-read-private user-read-email user-top-read";
function authorize(client_id){
    url="https://accounts.spotify.com/authorize"
    url+= "?response_type=token";
    url+="&client_id="+encodeURIComponent(client_id);
    url+="&scope="+encodeURIComponent(scope);
    url+="&redirect_uri="+encodeURIComponent(redirect_uri);
    window.open(url,"_self")
}

function extractTokenFromURI(){
    var hash=window.location.hash;
    if(hash &&hash.includes('access_token')){
        var url=hash.replace("#access_token=","");
        var chunks=url.split('&');
        var token=chunks[0];
        console.log("Complete authorize")
        return token;        
    }
    return null    
}


function generateCard(image,title,subtitle,href){
    return`
        <a class="card" href="${href}" target="_blank">
        <img src="${image}"
        alt="peaceful piano"
        srcset=""
        />
        <span class="mdi mdi-play mdi-36px"></span>
        <div class="title">${title}</div>
        <div class="subtitle">${subtitle}</div>
        </a>
        `
}

function displayUserTopItems(data){
    var section=document.querySelector('#your-top-items')
    var sectionTitle=section.querySelector('.title')
    var sectionSubtitle=section.querySelector('.subtitle')
    var sectionWrapper=section.querySelector(".card-wrapper")
    sectionTitle.textContent="Your Top Items"
    sectionSubtitle.textContent="Based on your recent listening"
    for (let i=0;i<data.items.length;i++){
        var track=data.items[i]
        var image=track.album.images[1].url;
        var title=track.name;
        var subtitle=track.album.artists[0].name
        var href=track.album.external_urls.spotify
        sectionWrapper.innerHTML+=generateCard(image,title,subtitle,href)
    }
   
    
}
function displayNewReleases(data){
    var section=document.querySelector('#new-releases')
    var sectionTitle=section.querySelector('.title')
    var sectionSubtitle=section.querySelector('.subtitle')
    var sectionWrapper=section.querySelector(".card-wrapper")
    sectionTitle.textContent="New Releases"
    sectionSubtitle.textContent="New releases from spotify"
    for (let i=0;i<data.albums.items.length;i++){
        var track=data.albums.items[i]
        var image=track.images[1].url;
        var title=track.name;
        var subtitle=track.artists[0].name
        var href=track.external_urls.spotify
        sectionWrapper.innerHTML+=generateCard(image,title,subtitle,href)
    }
}
function dispplayFeaturedPlaylists(data){
    var section=document.querySelector('#featured-playlists')
    var sectionTitle=section.querySelector('.title')
    var sectionSubtitle=section.querySelector('.subtitle')
    var sectionWrapper=section.querySelector(".card-wrapper")
    sectionTitle.textContent="Featured Playlists"
    sectionSubtitle.textContent="Featured playlist from Spotify"
    for (let i=0;i<data.playlists.items.length;i++){
        var track=data.playlists.items[i]
        var image=track.images[0].url;
        var title=track.name;
        var subtitle=track.description
        var href=track.external_urls.spotify
        sectionWrapper.innerHTML+=generateCard(image,title,subtitle,href)
    }
}

async function fetchUserTopItems(TOKEN){
    TOKEN=extractTokenFromURI()
    try{
        var endpoint="https://api.spotify.com/v1/me/top/tracks";
        var response= await fetch(endpoint + "?limit=6", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + TOKEN,
            },
        });
        var data= await response.json()
        console.log('User top items',data)
        displayUserTopItems(data)
    }
    catch(error){
        alert('Something went wrong.')
        console.log(error)
    }
}


async function fetchNewReleases(TOKEN){
    try{
        var endpoint='https://api.spotify.com/v1/browse/new-releases'
        var response= await fetch(endpoint+"?limit=6",{
            method:'GET',
            headers:{
                Authorization:'Bearer '+TOKEN,
            },
        })
        var data=await response.json()
        console.log('New releases',data)
        displayNewReleases(data)
        
    }
    catch(error){
        alert('Something went wrong.')
        console.log(error)
    }

}

async function fetchFeaturedPlaylists(TOKEN){
    try{
        var endpoint='https://api.spotify.com/v1/browse/featured-playlists'
        var response= await fetch(endpoint+"?limit=6",{
            method:'GET',
            headers:{
                Authorization: 'Bearer '+TOKEN,
            },
        })
        var data= await response.json()
        console.log('Featured playlists',data)        
        dispplayFeaturedPlaylists(data)
    }
    catch(error){
        alert('Something went wrong')
        console.log(error)
    }
}



window.addEventListener('load',function(){
    TOKEN=extractTokenFromURI()
    if (TOKEN){
        console.log('Token',TOKEN)
        //fetch the endpoint
        fetchUserTopItems(TOKEN)
        fetchNewReleases(TOKEN)
        fetchFeaturedPlaylists(TOKEN)
    }
    else{
        console.log(redirect_uri)
        authorize(client_id)
    }
})

